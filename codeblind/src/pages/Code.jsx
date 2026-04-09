import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import NavBar from '../components/NavBar';

const Code = ({myPiece, handleSubmit, handleValidate, validationResult, isValidating}) => {
    console.log(myPiece);
    const [code, setCode] = useState('code');

    useEffect(() => {
        if (myPiece) {
            const defaultCode = `${myPiece.functionName}(${myPiece.parameters.map((param) => `${param}`).join(', ')}) {
// Your pseudocode goes here
}`;
            setCode(defaultCode);
        }
    }, [myPiece]);

    if (!myPiece) {
        return (
        <div className="h-screen w-full bg-[#050505] text-[#a855f7] flex items-center justify-center font-mono text-xl tracking-widest">
            INITIALIZING SECURE ENVIRONMENT...
        </div>
        );
    }

    
    const handleEditorWillMount = (monaco) => {
    monaco.editor.setTheme('vs-dark');

  };

  return (
    <div className="h-screen w-full bg-[#050505] text-neutral-300 font-sans flex flex-col overflow-hidden selection:bg-purple-500/30">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <NavBar/>

      {/* --- MAIN LAYOUT (SPLIT PANES) --- */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT PANE: PROBLEM SPEC */}
        <aside className="w-[450px] min-w-[300px] bg-[#161618] border-r border-neutral-800 flex flex-col max-h-[50vh] md:max-h-full">
          
          <div className="flex-1 overflow-y-auto p-8 relative">
            

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-4 bg-[#a855f7]"></div>
                <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-white ">{myPiece.functionName}</h2>
              </div>
              <p className="text-[#838387] text-[16px] leading-relaxed">
                {myPiece.expectedBehavior}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-4 bg-[#a855f7]"></div>
                <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-white ">Constraints</h2>
              </div>
              <pre className="text-[#a1a1aa] text-[13px] font-mono bg-[#1c1c1f] border border-neutral-800 p-3 rounded-md whitespace-pre-wrap">
                {JSON.stringify(myPiece.sampleInput, null, 2)}
            </pre>
            </div>
            {/* --- AI FEEDBACK BOX --- */}
            {validationResult && (
            <div className={`p-4 rounded-md border text-xs font-mono mb-4 ${
                validationResult.passed 
                ? 'bg-green-900/20 border-green-500/50 text-green-400' 
                : 'bg-red-900/20 border-red-500/50 text-red-400'
            }`}>
                <strong className="block mb-1">
                {validationResult.passed ? 'TEST PASSED' : 'TEST FAILED'}
                </strong>
                {validationResult.feedback}
            </div>
            )}
            <div className="mt-12 space-y-4">
              <button className="w-full flex items-center justify-center gap-3 border border-neutral-700 hover:bg-neutral-800 transition-colors py-3.5 rounded-md text-[10px] font-mono font-bold tracking-[0.15em] text-neutral-300 uppercase"
                onClick={()=>handleValidate(code)}>
                Validate 
              </button>
              <button className="w-full flex items-center justify-center gap-3 bg-[#2b174b] hover:bg-[#3b2066] border border-[#a855f7]/50 transition-colors py-3.5 rounded-md text-[10px] font-mono font-bold tracking-[0.15em] text-white uppercase shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                onClick={()=>handleSubmit(code)}>
                Submit Solution
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT PANE: REAL CODE EDITOR */}
        <section className="flex-1 flex flex-col bg-[#050505] min-h-[50vh] md:min-h-0">
          
          <div className="flex justify-between items-center bg-[#0d0d0f] border-b border-neutral-800 pl-2 pr-6">
            <div className="flex">
              <div className="bg-[#1c1c1f] px-4 py-2 border-t-2 border-[#a855f7] flex items-center gap-2 text-[11px] font-mono text-neutral-300 rounded-t-sm mt-1">
                Function
              </div>
            </div>
          </div>

          {/* MONACO EDITOR CONTAINER */}
          <div className="flex-1 w-full h-full relative">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              theme="vs-dark"
              beforeMount={handleEditorWillMount}
              defaultValue={code}
              value={code}
              onChange={(value) => setCode(value)}
              loading={
                <div className="flex h-full w-full items-center justify-center text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
                  Initializing Compiler Environment...
                </div>
              }
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                lineHeight: 28,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                renderLineHighlight: "all",
                hideCursorInOverviewRuler: true,
                overviewRulerBorder: false,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                }
              }}
            />
          </div>

          <div className="h-8 bg-[#0d0d0f] border-t border-neutral-800 flex justify-between items-center px-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
            <div className="flex gap-6">
              <span>SPACES: 4</span>
              <span>UTF-8</span>
            </div>
            <div className="text-[#a855f7]">
              NODE.JS
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Code;