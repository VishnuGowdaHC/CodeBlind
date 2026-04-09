import { activeRooms } from './state.js';

export const handleRooms = (io, socket) => {
    
    // --- PLAYER JOINS ---
    socket.on('join_room', ({ roomCode, name, length }) => {
        const cleanRoomCode = roomCode.trim().toUpperCase();
        console.log(`[JOIN] ${cleanRoomCode} | ${name} | Limit: ${length}`);

        if (activeRooms[cleanRoomCode] && activeRooms[cleanRoomCode].players.length >= activeRooms[cleanRoomCode].maxLength) {
            socket.emit('room_error', { message: `Room is full! Max ${activeRooms[cleanRoomCode].maxLength} players.` });
            return;
        }

        socket.join(cleanRoomCode);
        
        if (!activeRooms[cleanRoomCode]) {
            activeRooms[cleanRoomCode] = {
                players: [],
                phase: 'lobby',
                maxLength: length || 4, 
                problemId: null,
                fullProblem: null
            };
        }
        
        const newPlayer = { 
            id: socket.id, 
            name, 
            score: 0,
            isHost: activeRooms[cleanRoomCode].players.length === 0,
            assignedPiece: null,
            submittedCode: null, // Reset code
            isFinished: false
        };
        
        activeRooms[cleanRoomCode].players.push(newPlayer);

        console.log(`${name} joined room ${cleanRoomCode}`);

        io.to(cleanRoomCode).emit('player_joined', activeRooms[cleanRoomCode].players);
    });

    // --- PLAYER LEAVES ---
    socket.on('leave_room', ({ roomCode }) => {
        if (!roomCode) return;
        const cleanRoomCode = roomCode.trim().toUpperCase();
        
        socket.leave(cleanRoomCode);

        if (activeRooms[cleanRoomCode]) {
            activeRooms[cleanRoomCode].players = activeRooms[cleanRoomCode].players.filter(player => player.id !== socket.id);
            
            if (activeRooms[cleanRoomCode].players.length === 0) {
                delete activeRooms[cleanRoomCode];
                console.log(`Room ${cleanRoomCode} deleted (empty)`);
            } else {
                activeRooms[cleanRoomCode].players[0].isHost = true; // Pass host crown
                io.to(cleanRoomCode).emit('player_joined', activeRooms[cleanRoomCode].players);
            }
        }
        console.log(`${socket.id} left room ${cleanRoomCode}`);
    });
};