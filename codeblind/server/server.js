import 'dotenv/config'
import express from "express";
import connectDB from "./main/config/db.js";
import cors from "cors";
import Problem from './main/models/problem.js';
import http from 'http';
import { Server } from 'socket.io';
import { setupSockets } from './main/sockets/socketManager.js';


const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'https://your-react-frontend.onrender.com',
        methods: ["GET", "POST"]
    }
});

setupSockets(io);

connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));