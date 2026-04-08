import React, { useState, useEffect, useRef, use } from 'react';
import NavBar from '../components/NavBar';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';



const Home = ({handleJoin, joinName, setJoinName, handleCreate, creatName, setCreateName, roomCode, setRoomCode}) => {

    const generateCode = (length = 4) => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = '';
        for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        result += letters[randomIndex];
        }
        setRoomCode(result);
        console.log("Generated code:", result); // <-- logs the code
    }

  return (
    <div className="w-full font-mono bg-[#0d0d0f] text-white  flex flex-col justify-between selection:bg-purple-500/30">
      
      <NavBar />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-[5.5rem] font-bold mb-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5">
            <span className="text-white tracking-tight">Decode</span>
            <span className="text-[#a855f7] tracking-tight">the system</span>
          </h1>
          <p className="text-[#737373] uppercase tracking-[0.25em] text-sm mt-6 font-mono">
            One function at a time.
          </p>
        </div>

        {/* Action Cards Container */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-stretch mt-4">
          
          {/* JOIN GAME CARD */}
          <div className="bg-[#151517] border border-neutral-800/60 rounded-xl p-8 w-full max-w-[420px] shadow-2xl relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-6 bg-[#a855f7]"></div>
              <h2 className="text-2xl font-bold tracking-wide text-white">JOIN GAME</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[11px] text-neutral-500 uppercase tracking-[0.1em] mb-2 font-mono">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="GUEST_USER"
                  required
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  className="w-full bg-[#1c1c1f] border border-neutral-700/50 rounded-md px-4 py-3 text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all font-mono text-sm shadow-inner"
                />
              </div>
              
              <div>
                <label className="block text-[11px] text-neutral-500 uppercase tracking-[0.1em] mb-2 font-mono">
                  Room Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="X8-K92-PJ"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full bg-[#1c1c1f] border border-neutral-700/50 rounded-md px-4 py-3 text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all font-mono text-sm shadow-inner"
                />
              </div>

              <div className="pt-2">
                <button className="w-full bg-gradient-to-r from-[#a855f7] to-[#9333ea] hover:from-[#b066ff] hover:to-[#a855f7] text-white font-bold py-4 rounded-md tracking-[0.15em] text-sm transition-all shadow-[0_0_25px_rgba(168,85,247,0.25)] cursor-pointer"
                onClick={handleJoin}>
                  JOIN ROOM
                </button>
              </div>
            </div>
          </div>

          {/* CREATE GAME CARD */}
          <div className="bg-[#151517] border border-neutral-800/60 rounded-xl p-8 w-full max-w-[420px] shadow-2xl relative flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-6 bg-[#22c55e]"></div>
              <h2 className="text-2xl font-bold tracking-wide text-white">CREATE GAME</h2>
            </div>

            <div className="space-y-6 flex-grow flex flex-col">
              <div>
                <label className="block text-[11px] text-neutral-500 uppercase tracking-[0.1em] mb-2 font-mono">
                  Host Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="ARCH_01"
                  value={creatName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full bg-[#1c1c1f] border border-neutral-700/50 rounded-md px-4 py-3 text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all font-mono text-sm shadow-inner"
                />
              </div>

              <div className="pt-2 mt-auto">
                <button className="w-full bg-transparent border border-[#22c55e]/80 text-[#22c55e] hover:bg-[#22c55e]/10 font-bold py-4 rounded-md tracking-[0.15em] text-sm transition-all cursor-pointer"
                onClick={handleCreate}
                >
                  CREATE NEW ROOM
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="flex flex-col md:flex-row justify-between items-center p-6 md:p-8 text-[10px] font-mono text-neutral-500 gap-4">
        <div className="flex items-center gap-2">
          <span className="tracking-[0.15em] uppercase text-neutral-600">System Status:</span>
          <span className="text-[#22c55e] tracking-[0.15em] font-semibold">OPERATIONAL</span>
        </div>
        <div className="flex gap-8 tracking-[0.15em]">
          <a href="#" className="hover:text-white transition-colors duration-300">DOCUMENTATION</a>
          <a href="#" className="hover:text-white transition-colors duration-300">BUG BOUNTY</a>
        </div>
      </footer>
      
    </div>
  );
};

export default Home;