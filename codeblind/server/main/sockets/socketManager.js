import { handleRooms } from './roomHandler.js';
import { handleGameLogic } from './gameHandler.js';

export const setupSockets = (io) => {
    io.on('connection', (socket) => {
        console.log(`Connected: ${socket.id}`);

        handleRooms(io, socket);
        handleGameLogic(io, socket);

        socket.on('disconnect', () => {
            console.log(`Disconnected: ${socket.id}`);
        });
    });
};