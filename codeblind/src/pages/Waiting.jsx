import React from 'react';

const Waiting = ({discussionData}) => {
  return (
    <div className="h-screen w-full bg-[#0a0a0c] text-neutral-300 font-sans flex flex-col relative overflow-hidden selection:bg-[#a855f7]/30">
    

      {/* --- MAIN CONTENT CENTERED --- */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        
        {/* Ambient background glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-900/10 blur-[100px] pointer-events-none rounded-full"></div>

        {/* Subtitle */}
        <div className="text-[10px] font-mono text-[#8b5cf6] tracking-[0.35em] uppercase mb-4 opacity-80">
          Session ID: {discussionData.id}
        </div>

        {/* Glowing Title */}
        <h1 
          className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-10 text-center uppercase"
          style={{
            textShadow: '0 0 15px rgba(255,255,255,0.4), 0 0 35px rgba(168,85,247,0.3)'
          }}
        >
          Waiting for Others to submit
        </h1>

        {/* Status Badge Box */}
        <div className="bg-[#0b0b0d] border border-neutral-800 px-6 py-3.5 flex items-center gap-4 rounded shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-12 relative overflow-hidden group cursor-default">
          {/* Subtle top border highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-600 to-transparent opacity-20"></div>
          
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_10px_#22c55e] animate-pulse"></div>
          <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-300 uppercase">
            loading
          </span>
          {/* Blinking Cursor */}
          <div className="w-1.5 h-3.5 bg-[#a855f7] animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
        </div>

      </main>
      
    </div>
  );
};

export default Waiting;