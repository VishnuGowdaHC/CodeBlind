import React, { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import { io } from 'socket.io-client';
import Code from './pages/Code';
import Guess from './pages/Guess';
import Waiting from './pages/Waiting';
import Win from './pages/Win';
import Lose from './pages/Lose';

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
    const [selected, setSelected] = useState(2);
    const [myPiece, setMyPiece] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [discussionData, setDiscussionData] = useState([]);
    const [aiData, setAIData] = useState(null);

    const socketRef = useRef();

    const URL = 'https://codeblind-z8ay.onrender.com' || 'http://localhost:5500';

    useEffect(()=>{
        socketRef.current = io(URL, {transports: ['websocket']});

        socketRef.current.on('player_joined', (updatedPlayers) => {
            setPlayers(updatedPlayers);

            const me = updatedPlayers.find(player => player.id === socketRef.current.id);
            if (me) setIsHost(me.isHost);
            setView('Lobby');
        })

        socketRef.current.on('game_started', async (assignedPiece) => {
            console.log(assignedPiece);
            setMyPiece(assignedPiece);
            setView('Code');
        })
        socketRef.current.on('validate_result', (result) => {
            setIsValidating(false);
            console.log(result);
            setValidationResult(result); // Save the AI's feedback
        });

        socketRef.current.on('discussion_started', (allSubmissions) => {
            setDiscussionData(allSubmissions);
            setView('Guess');
        })

        socketRef.current.on('game_over', ({aiData}) => {
            setAIData(aiData);
            if (aiData.matched === true) {
                setView('Win');
            } else {
                setView('Lose');
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
    },[])

    const handleLength = (selected) => {
        console.log(selected);
        setSelected(selected);
    }
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
        socketRef.current.emit("join_room", {"roomCode": result, "name": createName, "length": selected});
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

    const handleSubmit = (writtenCode) => {
        if (!writtenCode) return;

        socketRef.current.emit("submit_code", {"roomCode": roomCode, "code": writtenCode});
        setView('Waiting');
    }

    const handleValidate = (writtenCode) => {
        if (!writtenCode) return alert("Write some code first!");
        setIsValidating(true);
        setValidationResult(null); // Clear old results
        socketRef.current.emit("validate_code", { "roomCode": roomCode, "code": writtenCode });
    };

    const handleReturnHome = () => {
        setView('Lobby');
        
    }


    const renderView = () => {
        switch (view) {
            case 'Home':
                return <Home 
                    handleJoin={handleJoin} 
                    code={code} 
                    setCode={setCode} 
                    setJoinName={setJoinName} 
                    setCreateName={setCreateName} 
                    joinRoomCode={roomCode} 
                    handleCreate={handleCreate} 
                    setRoomCode={setRoomCode} 
                    handleLength={handleLength} 
                    selected={selected}
                />;
            case 'Lobby':
                return <Lobby 
                    players={players} 
                    isHost={isHost} 
                    handleLeave={handleLeave} 
                    roomCode={roomCode} 
                    selected={selected} 
                    handleStart={handleStart}
                />;
            case 'Code':
                return <Code 
                    myPiece={myPiece} 
                    handleSubmit={handleSubmit}
                    handleValidate={handleValidate}
                    validationResult={validationResult}
                    isValidating={isValidating}
                />;
            case 'Guess':
                return <Guess 
                    discussionData={discussionData}
                    roomCode={roomCode}
                    socketRef={socketRef}
                    myPiece={myPiece}
                />;
            case 'Waiting':
                return <Waiting
                discussionData={discussionData}
                />
            case 'Win':
                return <Win
                handleReturnHome={handleReturnHome}
                aiData={aiData}
                />
            case 'Lose':
                return <Lose
                handleReturnHome={handleReturnHome}
                aiData={aiData}
                />
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