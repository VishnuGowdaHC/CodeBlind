import React from 'react';
import NavBar from '../components/NavBar';

const Lobby = ({players, isHost, handleStart, handleLeave, selected, roomCode}) => {
  // Mock data to iterate over for players
 
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white font-sans flex flex-col selection:bg-purple-500/30">
      
      {/* --- TOP NAVIGATION --- */}
      <NavBar/>
        

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex flex-col items-center pt-16 pb-8 px-4 relative">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-900/10 blur-[120px] pointer-events-none rounded-full"></div>

        {/* Header */}
        <div className="text-center mb-12 z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 flex flex-col items-center justify-center gap-3">
            <span className="tracking-wide">LOBBY</span>
            <span className="text-[#a855f7] text-[11px] tracking-wide">Room Code: {roomCode}</span>
          </h1>
          <p className="text-[11px] text-neutral-400 uppercase tracking-[0.2em] font-mono">
            Waiting for players
          </p>
        </div>

        {/* Player Grid */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 z-10">
          {players.map((player) => (
            <div key={player.id} className="flex flex-col items-center">
              
              {/* Avatar Box */}
              <div className={`relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center mb-4 transition-all duration-300
                ${player.id 
                  ? 'border-2 border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.25)] bg-[#1c1c1f]' 
                  : 'border-2 border-dashed border-neutral-700 bg-neutral-800/20'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>

              {/* Player Info */}
              <div className="text-center font-mono">
                <div className={`font-bold tracking-wider text-sm mb-1 ${player.id ? 'text-white' : 'text-neutral-500'}`}>
                  {player.name}
                </div>
                <div className={`text-[9px] tracking-[0.15em] uppercase ${player.id ? 'text-[#22c55e]' : 'text-neutral-600'}`}>
                  {player.isHost ? 'HOST' : 'PLAYER'}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Protocol Status Panel */}
        <div className="w-full max-w-2xl bg-[#141416] border border-neutral-800 rounded-xl p-8 relative shadow-2xl z-10">
          
          {/* Floating Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a1a1e] border border-neutral-700 text-[#a855f7] px-5 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase">
            Protocol Status
          </div>

          {/* Sync Header */}
          <div className="flex justify-between items-start border-b border-neutral-800/80 pb-6 mb-6">
            <div>
              <p className="text-[10px] font-mono text-neutral-500 tracking-widest mb-1 uppercase">Active_Players:</p>
              <h2 className="text-xl font-bold tracking-wide">{players.length}/{selected}</h2>
            </div>
            <div>
               
                <button className="w-full mt-2 bg-[#fa2f4e] hover:bg-[#a14255] text-white  transition-colors rounded-md font-mono text-[11px] font-bold tracking-[0.25em] px-3 py-2 uppercase" onClick={() => handleLeave()}>
                EXIT
                </button>
            </div>
          </div>

          {/* Action Button */}
          <button className={`w-full mt-6 bg-[#1a1a1d] hover:bg-[#1f1f23] text-neutral-500 border border-neutral-800 transition-colors py-4 rounded-md font-mono text-[11px] font-bold tracking-[0.25em] uppercase ${isHost ? 'bg-[#22c55e] hover:bg-[#22c55e]/80 text-white' : 'cursor-not-allowed '} `}
            onClick={handleStart}>
            {isHost ? 'START' : 'WAITING FOR HOST'}
          </button>
        </div>

        {/* Footer Meta Info */}
        <div className="mt-12 flex justify-center gap-8 text-[9px] font-mono text-neutral-500 uppercase tracking-[0.2em] z-10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></div>
            REGION: INDIA
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></div>
            STATUS: ONLINE
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
            SECURITY: ENCRYPTED
          </div>
        </div>

      </main>
    </div>
  );
};

export default Lobby;