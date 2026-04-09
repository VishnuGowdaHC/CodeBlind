import React from 'react';

const Win = ({handleReturnHome, aiData}) => {
  return (
    <div className="min-h-screen w-full font-mono bg-[#050505] text-neutral-300 font-sans flex flex-col items-center justify-center p-6 selection:bg-[#22c55e]/30 relative overflow-hidden">
      
      {/* Ambient Green Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22c55e]/5 blur-[120px] pointer-events-none rounded-full z-0"></div>

      <div className="w-full max-w-2xl bg-[#0d0d0f] border border-[#22c55e]/30 border-t-4 border-t-[#22c55e] rounded-xl p-8 md:p-12 shadow-2xl z-10 relative">
        
        {/* Header Section */}
        <div className="text-center mb-10 border-b border-neutral-800/80 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22c55e]/10 text-[#22c55e] mb-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 uppercase text-shadow-sm">
            congratulations
          </h1>
          <p className="text-[11px] font-mono text-[#22c55e] tracking-[0.25em] uppercase">
            System Decoded Successfully
          </p>
        </div>

        {/* Feedback Section */}
        <div className="mb-8 bg-[#141416] p-6 rounded-lg border border-neutral-800">
          <label className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 tracking-widest uppercase mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Post-Mission Feedback
          </label>
          <textarea 
            placeholder="Log your thoughts, encountered bugs, or feedback here..."
            className="w-full bg-[#050505] border border-neutral-700/50 rounded p-4 text-xs font-mono text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/50 transition-all resize-none h-28"
          >{aiData.feedback}</textarea>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-4 rounded text-xs font-mono font-bold tracking-widest uppercase transition-colors text-center"
          onClick={handleReturnHome}>
            Return to Lobby
          </button>
        </div>

      </div>
    </div>
  );
};

export default Win;