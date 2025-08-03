import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ClipboardIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

function parseOutput(output) {
  if (typeof output === "string") {
    try {
      return JSON.parse(output);
    } catch {
      return output;
    }
  }
  return output;
}

export default function OutputBox({ output, exampleResults = [], runMode }) {
  const [copied, setCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text || "");
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 800);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // 🧪 EXAMPLE TEST CASE MODE
  if (runMode === "example" && Array.isArray(exampleResults) && exampleResults.length > 0) {
    return (
      <div className="space-y-2">
        {exampleResults.map((res, i) => (
          <div 
            key={i} 
            className={`rounded-lg border ${res.pass ? 'border-green-500/30' : 'border-red-500/30'} overflow-hidden transition-all duration-200`}
          >
            <div 
              className={`flex items-center justify-between p-3 cursor-pointer ${res.pass ? 'bg-green-900/10' : 'bg-red-900/10'}`}
              onClick={() => toggleExpand(i)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${res.pass ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {res.pass ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="font-medium">
                  <span className="text-white/80">Test Case {i + 1}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${res.pass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {res.pass ? 'Passed' : 'Failed'}
                  </span>
                </div>
              </div>
              <div className="text-white/60">
                {expandedIndex === i ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </div>
            </div>
            
            {expandedIndex === i && (
              <div className="p-4 bg-[#1c1c2a]/50 border-t border-[#7286ff]/10">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-white/60 mb-1">Input</div>
                    <div className="text-sm bg-[#2a2a3d]/50 p-3 rounded font-mono text-white/90">
                      {res.input || "N/A"}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-white/60 mb-1">Expected Output</div>
                      <div className="text-sm bg-[#2a2a3d]/50 p-3 rounded font-mono text-white/90">
                        {res.expected || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">Your Output</div>
                      <div className="text-sm bg-[#2a2a3d]/50 p-3 rounded font-mono text-white/90">
                        {res.actual || "N/A"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCopy(res.actual)}
                      className="flex items-center text-xs text-white/60 hover:text-white transition-colors"
                    >
                      <ClipboardIcon className="w-4 h-4 mr-1" />
                      Copy Output
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // 💻 CUSTOM INPUT MODE
  if (runMode === "custom" && output) {
    const parsed = parseOutput(output);

    let error = null;
    let finalOutput = null;
    let execTime = null;
    let errorType = null;
    let status = null;

    if (typeof parsed === "object" && parsed !== null) {
      error = parsed.error || parsed.stderr || null;
      finalOutput = parsed.output || parsed.stdout || null;
      execTime = parsed.execTime || null;
      errorType = parsed.errorType || null;
      status = parsed.status || null;
    } else {
      finalOutput = parsed;
    }

    const prettyMessages = {
      TLE: "⏱️ Time Limit Exceeded: Your program took too long to finish.",
      "Memory Limit Exceeded": "💾 Memory Limit Exceeded: Your program used too much memory.",
      "Compilation Error": "🛠️ Compilation Error: There was an issue compiling your code.",
      "Runtime Error": "💥 Runtime Error: Your code crashed during execution.",
      "Infinite Loop Detected": "🔁 Infinite Loop Detected: Your code ran too long and was terminated.",
    };

    const renderErrorMessage = () => {
      if (!errorType) return error;
      return prettyMessages[errorType] || `${errorType}: ${error}`;
    };

    return (
      <div className="rounded-lg border border-[#7286ff]/20 overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-[#2a2a3d]/50 border-b border-[#7286ff]/10">
          <div className="text-sm font-medium text-white/80">
            {status === "error" ? "Error" : "Output"}
          </div>
          <div className="flex items-center space-x-2">
            {execTime && (
              <div className="text-xs text-white/60">
                ⏱️ {execTime}
              </div>
            )}
            {(finalOutput || error) && (
              <button
                onClick={() => handleCopy(finalOutput || error)}
                className="flex items-center text-xs text-white/60 hover:text-white transition-colors"
              >
                <ClipboardIcon className="w-4 h-4 mr-1" />
                Copy
              </button>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-[#1c1c2a]/50">
          {status === "error" ? (
            <div className="text-red-400 whitespace-pre-wrap break-words">
              <div className="mb-2">{renderErrorMessage()}</div>
              {error && !errorType && (
                <div className="text-sm text-white/60 mt-2">{error}</div>
              )}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap break-words text-white/90">
              {finalOutput || "No output"}
            </pre>
          )}
        </div>
      </div>
    );
  }

  // 🔕 DEFAULT
  return null;
}
