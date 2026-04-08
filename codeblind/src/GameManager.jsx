import React, { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import { io } from 'socket.io-client';

export default function GameManager() {
    //Core Variables
    const [view, setView] = useState('Home');
    const [players, setPlayers] = useState([]);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [isHost, setIsHost] = useState(false)
    const [roomCode, setRoomCode] = useState('');
    const [joinName, setJoinName] = useState('');
    const [createName, setCreateName] = useState('');

    const socketRef = useRef();

    useEffect(()=>{
        socketRef.current = io("http://localhost:5500");

        socketRef.current.on('player_joined', (updatedPlayers) => {
            setPlayers(updatedPlayers);

            const me = updatedPlayers.find(player => player.id === socketRef.current.id);
            if (me) setIsHost(me.isHost);
            setView('Lobby');
        })


        return () => {
            socketRef.current.disconnect();
        };
    },[])


    const handleJoin = (e) => {
        e.preventDefault()
        console.log(roomCode, joinName);
        socketRef.current.emit("join_room", {"roomCode": roomCode, "name": joinName});
    }

    const handleCreate = (e) => {
        e.preventDefault()
        console.log(roomCode, createName);
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = 4;
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            result += letters[randomIndex];
        }
        console.log(result);
        setRoomCode(result);
        socketRef.current.emit("join_room", {"roomCode": result, "name": createName});
    }

    const handleLeave = () => {
        socketRef.current.emit("leave_room", {"roomCode": roomCode});

        setView('Home');
        setPlayers([]);
        setIsHost(false);
        setRoomCode('');
    }

    const handleStart = () => {
        socketRef.current.emit("start_game", {"roomCode": roomCode});
    }


    const renderView = () => {
        switch (view) {
            case 'Home':
                return <Home handleJoin={handleJoin} code={code} setCode={setCode} setJoinName={setJoinName} setCreateName={setCreateName} joinRoomCode={roomCode} handleCreate={handleCreate} setRoomCode={setRoomCode}/>;
            case 'Lobby':
                return <Lobby players={players} isHost={isHost} handleLeave={handleLeave} handleStart={handleStart} roomCode={roomCode}/>;
            default:
                return null;
        }
    }

    return (
        <>
            {renderView()}
        </>
    )
}