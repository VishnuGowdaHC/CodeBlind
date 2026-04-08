// This object holds the live game state for all rooms
const activeRooms = {};

export const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 New connection: ${socket.id}`);

    //PLAYER JOINS A ROOM
    socket.on('join_room', ({ roomCode, name }) => {

      if (activeRooms[roomCode] && activeRooms[roomCode].players.length >= 4) {
          socket.emit('error', { message: 'Room is full! Max 4 players allowed.' });
          console.log('Room is full! Max 4 players allowed.');
        return;
      }
      socket.join(roomCode);
      
      // Initialize the room if it's brand new
      if (!activeRooms[roomCode]) {
          activeRooms[roomCode] = {
              players: [],
              phase: 'lobby',
              problemId: null 
          };
      }
      
      // Create the player object
      const newPlayer = { 
          id: socket.id, 
          name, 
          score: 0,
          isHost: activeRooms[roomCode].players.length === 0 // First player is host
      };
      
      activeRooms[roomCode].players.push(newPlayer);

      console.log(`${name} joined room ${roomCode}`);
      
      // Broadcast the updated player list to EVERYONE in that room
      io.to(roomCode).emit('player_joined', activeRooms[roomCode].players);
    });

    // --- PLAYER LEAVES A ROOM ---
    socket.on('leave_room', ({ roomCode }) => {
      socket.leave(roomCode);

      if (activeRooms[roomCode]) {
        activeRooms[roomCode].players = activeRooms[roomCode].players.filter(player => player.id !== socket.id);
      }

      if (activeRooms[roomCode].players.length === 0) {
        delete activeRooms[roomCode];
      } else {
        activeRooms[roomCode].players[0].isHost = true;
        io.to(roomCode).emit('player_joined', activeRooms[roomCode].players);
      }

      console.log(`${socket.id} left room ${roomCode}`);
    })

    // --- PLAYER DISCONNECTS ---
    socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });
};