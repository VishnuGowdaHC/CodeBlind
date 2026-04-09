import React from 'react';

const Lose = ({handleReturnHome, aiData}) => {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-neutral-300 font-sans flex flex-col items-center justify-center p-6 selection:bg-[#ef4444]/30 relative overflow-hidden">
      
      {/* Ambient Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ef4444]/5 blur-[120px] pointer-events-none rounded-full z-0"></div>

      <div className="w-full max-w-2xl bg-[#0d0d0f] border border-[#ef4444]/30 border-t-4 border-t-[#ef4444] rounded-xl p-8 md:p-12 shadow-2xl z-10 relative">
        
        {/* Header Section */}
        <div className="text-center mb-10 border-b border-neutral-800/80 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ef4444]/10 text-[#ef4444] mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 uppercase">
            System Lockout
          </h1>
          <p className="text-[11px] font-mono text-[#ef4444] tracking-[0.25em] uppercase">
            Failed
          </p>
          <p className="mt-4 text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
            {}
          </p>
        </div>

        {/* Feedback Section */}
        <div className="mb-8 bg-[#141416] p-6 rounded-lg border border-neutral-800 relative overflow-hidden">
          {/* Subtle warning stripes background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 20px)' }}></div>
          
          <label className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 tracking-widest uppercase mb-4 relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Error Report
          </label>
          <textarea 
            placeholder="Where did the logic break? Let us know what part was confusing..."
            className="w-full bg-[#050505] border border-neutral-700/50 rounded p-4 text-xs font-mono text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-[#ef4444]/50 focus:ring-1 focus:ring-[#ef4444]/50 transition-all resize-none h-28 relative z-10"
          >{aiData.feedback}</textarea>
          
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-[#1c1c1f] hover:bg-neutral-800 border border-neutral-800 text-white px-6 py-4 rounded text-xs font-mono font-bold tracking-widest uppercase transition-colors text-center"
            onClick={handleReturnHome}>
            Return to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default Lose;