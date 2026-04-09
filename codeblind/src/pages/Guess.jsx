import React from 'react';
import { useState, useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Guess = ({discussionData, roomCode, socketRef, myPiece}) => {
    const [guess, setGuess] = useState('');
    const [hasGuessed, setHasGuessed] = useState(false);

    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const messageRef = useRef(null);

    
    
    useEffect(() => {
        const handleReceiveMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        }

        socketRef.current.on('receive_message', handleReceiveMessage);

        return () => {
            socketRef.current.off('receive_message', handleReceiveMessage);
        }
    }, [socketRef]);

    const handleSendMessage = (e) => {
        e.preventDefault(); // STOP THE PAGE FROM REFRESHING!
        
        // Don't let them spam empty spaces
        if (!chatInput.trim()) return; 

        // Fire the message to the backend relay we just built!
        socketRef.current.emit("send_message", { 
            roomCode, 
            text: chatInput 
        });

        // Clear the input box instantly so it feels snappy
        setChatInput(""); 
    };

    const handleGuess = () =>{
        if (!guess) return alert('Please enter a guess!');
        socketRef.current.emit('submit_team_guess', {roomCode, guess, myPiece});
        setHasGuessed(true);
    }
    return (
        <div className="h-screen w-full bg-[#0d0d0f] text-neutral-300 font-sans flex flex-col overflow-hidden selection:bg-[#a855f7]/30">
            
            {/* --- HEADER --- */}
            <NavBar/>

            {/* --- MAIN LAYOUT --- */}
            <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT PANE: CONTENT AREA */}
            <main className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto">
                
                {/* Header */}
                <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">PLAYERS CODE</h1>
                </div>

                {/* Grid of Code Snippets */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                
            {/* Grid of Code Snippets */}
            
            {discussionData.map((player, index) => {
                const colors = ['border-l-[#a855f7]', 'border-l-[#38bdf8]', 'border-l-[#22c55e]', 'border-l-neutral-400'];
                const nameColors = ['text-[#a855f7]', 'text-[#38bdf8]', 'text-[#22c55e]', 'text-neutral-400'];
                
                return (
                <div key={player.id} className={`bg-[#141416] border border-neutral-800/80 border-l-4 ${colors[index]} rounded-r-xl p-5 flex flex-col shadow-lg`}>
                    <div className="flex justify-between items-center mb-4 border-b border-neutral-800/50 pb-3">
                    <div className={`flex items-center gap-2 font-mono text-sm font-bold tracking-widest ${nameColors[index]}`}>
                        <UserIcon /> {player.name}
                    </div>
                    <div className="text-[9px] font-mono text-neutral-500 tracking-[0.15em] uppercase">
                        {player.id || 'Pending'}
                    </div>
                    </div>
                    <div className="bg-[#050505] rounded-md p-5 flex-1 font-mono text-[13px] leading-6 overflow-x-auto border border-neutral-900">
                    <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0, margin: 0 }}>
                        {player.code || '// No submission yet'}
                    </SyntaxHighlighter>
                    </div>
                </div>
                );
            })}
            
                
                </div>

                {/* Submission Area */}
                <div className="bg-[#141416] border border-neutral-800 rounded-xl p-8 mt-auto shadow-2xl relative">
                <div className="text-[10px] font-mono tracking-widest text-neutral-400 mb-6 uppercase">Final Submission</div>
                
                <div className="flex flex-col md:flex-row gap-6 md:items-end">
                    <input 
                    type="text" 
                    placeholder="Guess the problem you are solving..."
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    className="flex-1 bg-transparent border-b border-neutral-600 pb-3 text-lg focus:outline-none focus:border-[#a855f7] transition-colors placeholder-neutral-700 text-white"
                    />
                    <button className="bg-gradient-to-r from-[#a855f7] to-[#9333ea] hover:from-[#b066ff] hover:to-[#a855f7] px-8 py-4 rounded text-sm font-bold tracking-widest text-white shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all whitespace-nowrap uppercase"
                    disabled={hasGuessed}
                    onClick={handleGuess}
                    >
                    {hasGuessed ? 'Guess Submitted' : 'Submit'}
                    </button>
                </div>
                </div>

            </main>

            {/* RIGHT PANE: SIDEBAR / CHAT */}
            <aside className="w-80 lg:w-96 border-l border-neutral-800 bg-[#111114] flex flex-col flex-shrink-0 relative">
                
                {/* Status Header */}
                

                {/* Tabs */}
                <div className="flex border-b border-neutral-800 text-[11px] font-mono tracking-widest bg-[#0d0d0f] uppercase">
                <button className="flex-1 py-4 text-center border-b-2 border-[#a855f7] text-[#a855f7] flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Chat
                </button>
                </div>

                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
                
                {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                    <span className="text-[10px] font-mono text-[#a855f7] mb-1">{msg.sender}</span>
                    <div className="bg-[#1c1c1f] text-neutral-300 text-sm p-3 rounded-md rounded-tl-none border border-neutral-800 w-fit max-w-[90%]">
                        {msg.text}
                    </div>
                </div>
                ))}
              <div ref={messageRef} />
                
                
            </div>

                {/* Chat Input & Footer */}
                <div className="p-5 border-t border-neutral-800 bg-[#0d0d0f] mt-auto">
                <form className="relative" onSubmit={handleSendMessage}>
                    <input 
                    type="text" 
                    placeholder="TYPE_MESSAGE..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full bg-[#111114] border border-neutral-800 rounded p-3.5 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50 pr-10 transition-all"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a855f7] hover:text-white transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
                </div>

            </aside>

            </div>
        </div>
    );
    };

// Reusable mini icon for headers
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default Guess;