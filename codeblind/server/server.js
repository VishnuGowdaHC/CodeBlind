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
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

setupSockets(io);

connectDB();

app.get("/api/problems", async (req, res) => {
    try {
        const data = await Problem.findOne({id: "food_delivery"})
        console.log(data.pieces);
        res.json(data);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
    
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));