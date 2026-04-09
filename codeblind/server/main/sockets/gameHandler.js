import { activeRooms } from './state.js';
import Problem from '../models/problem.js'; 
import { gradePlayerCode, verify } from '../services/llm.js';

export const handleGameLogic = (io, socket) => {
    
    // --- HOST STARTS GAME (THE DEALER) ---
    socket.on('start_game', async ({ roomCode }) => {
        const cleanRoomCode = roomCode.trim().toUpperCase();
        const room = activeRooms[cleanRoomCode];
        const playersCount = room.players.length;
        console.log(`[START] ${cleanRoomCode} | Players: ${typeof playersCount}`);
        if (!room) return;

        try {
            // 1. Fetch puzzle
            const problem = await Problem.findOne({ length: playersCount });
            if (!problem) return socket.emit('room_error', { message: 'Problem not found!' });
            console.log(`🎉 ${problem.id} fetched!`);
            room.phase = 'code';
            room.problemId = problem.id;
            room.fullProblem = problem; 

            const pieces = problem.pieces;
            room.players.forEach((player, index) => {
                const assignedPiece = pieces[index % pieces.length];
                player.assignedPiece = assignedPiece;
                player.submittedCode = null; // Reset code
                player.isFinished = false;   // Reset status

                // PRIVATE MESSAGE
                io.to(player.id).emit('game_started', assignedPiece);
            });
            console.log(`Game started in room ${cleanRoomCode}!`);
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('validate_code', async ({ roomCode, code }) => {
        const cleanRoomCode = roomCode.trim().toUpperCase();
        const room = activeRooms[cleanRoomCode];
        console.log(`[VALIDATE] ${cleanRoomCode} | ${code}`);
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);

        if (!player) return;

        const assignedPiece = player.assignedPiece;
        const problem = room.fullProblem;

        const llmResponse = await gradePlayerCode(code, assignedPiece, problem);
        io.to(player.id).emit('validate_result', llmResponse);
    })

    // --- PLAYER SUBMITS CODE ---
    socket.on('submit_code', ({ roomCode, code }) => {
        const cleanRoomCode = roomCode.trim().toUpperCase();
        const room = activeRooms[cleanRoomCode];
        if (!room) return;

        // 1. Save their code
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            player.submittedCode = code;
            player.isFinished = true;
            console.log(`✅ ${player.name} submitted code.`);
        }

        // 2. Tell everyone someone finished (Good for a "1/4 players ready" UI)
        io.to(cleanRoomCode).emit('player_status_update', room.players);

        // 3. Are we all done? Move to discussion!
        const allFinished = room.players.every(p => p.isFinished);
        if (allFinished) {
            console.log(`🔥 Everyone finished! Room ${cleanRoomCode} moving to Discussion.`);
            room.phase = 'discuss';
            
            // Package everyone's code to show on the big screen
            const discussionData = room.players.map(p => ({
                id: p.id,
                name: p.name,
                functionName: p.assignedPiece.functionName,
                code: p.submittedCode,
                expectedBehavior: p.assignedPiece.expectedBehavior
            }));

            io.to(cleanRoomCode).emit('discussion_started', discussionData);
        }
    });

    socket.on('edit_guess', ({ roomCode, guess }) => {
        const cleanRoomCode = roomCode.trim().toUpperCase();
        const room = activeRooms[cleanRoomCode];
        if (!room) return;

        room.teamGuess = guess;

        socket.to(cleanRoomCode).emit('sync_guess', guess);
    });

    socket.on('submit_team_guess', async ({ roomCode, guess }) => {
        const cleanRoomCode = roomCode.trim().toUpperCase();
        const room = activeRooms[cleanRoomCode];
        if (!room) return;

        room.phase = 'results'
        const finalGuessString = guess || room.teamGuess || "No guess entered";
        const actualAnswerString = room.fullProblem?.hiddenGoal || "Unknown System";
        const finalResults = {
            actualSystem: actualAnswerString,
            teamGuess: finalGuessString,
            players: room.players.map(p => ({
                name: p.name,
                score: p.score
            }))
        };

        const aiVerification = await verify({finalData: finalResults});


        io.to(cleanRoomCode).emit('game_over', {aiData : aiVerification});
    })

    // --- TEAM CHAT ---
    socket.on('send_message', ({ roomCode, text }) => {
        const cleanRoomCode = roomCode.trim().toUpperCase();
        const room = activeRooms[cleanRoomCode];
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);
        if (!player) return;

        const messageData = {
            id: Date.now(), // Unique ID for React keys
            sender: player.name,
            text: text,
            isSystem: false
        };

        // Broadcast to EVERYONE (including the person who sent it)
        io.to(cleanRoomCode).emit('receive_message', messageData);
    });
};