import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  ClipboardIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  MinusIcon, 
  XMarkIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronUpIcon as ExpandIcon
} from "@heroicons/react/24/outline";

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

export default function OutputBox({ output, exampleResults = [], runMode, isRunning, isSubmitting, markers = [] }) {
  const [copied, setCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTestCase, setActiveTestCase] = useState(0);

  // Auto-expand console when fresh output arrives, when running, or when there are errors
  useEffect(() => {
    if (
      (runMode === "custom" && output) ||
      (runMode === "example" && Array.isArray(exampleResults) && exampleResults.length > 0) ||
      isRunning ||
      isSubmitting ||
      markers.length > 0
    ) {
      setIsExpanded(true);
    }
  }, [output, exampleResults, runMode, isRunning, isSubmitting, markers]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text || "");
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 800);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const minimizeConsole = () => {
    setIsExpanded(false);
  };

  const expandConsole = () => {
    setIsExpanded(true);
  };

  // If there is no content and not running, show nothing
  const hasContent =
    (runMode === "custom" && output) ||
    (runMode === "example" && Array.isArray(exampleResults) && exampleResults.length > 0) ||
    markers.length > 0;

  // Calculate overall verdict
  const getOverallVerdict = () => {
    if (markers.length > 0) return { status: "Compile Error", color: "red", icon: XCircleIcon };
    if (isRunning || isSubmitting) return { status: "Running...", color: "yellow", icon: ClockIcon };
    
    if (runMode === "example" && Array.isArray(exampleResults) && exampleResults.length > 0) {
      const passed = exampleResults.filter(r => r.pass === true).length;
      const failed = exampleResults.filter(r => r.pass === false).length;
      const total = exampleResults.length;
      
      // Check if all test cases have been processed
      const processedCount = exampleResults.filter(r => r.pass !== undefined).length;
      
      if (processedCount === 0) {
        return { status: "Ready to Run", color: "gray", icon: ClockIcon };
      }
      
      if (failed === 0 && passed === total) {
        return { status: "All Tests Passed", color: "green", icon: CheckCircleIcon };
      }
      
      if (passed > 0 && failed > 0) {
        return { status: `Partial: ${passed}/${total}`, color: "yellow", icon: ClockIcon };
      }
      
      if (failed > 0) {
        return { status: `Failed: ${failed}/${total}`, color: "red", icon: XCircleIcon };
      }
      
      return { status: "Processing...", color: "yellow", icon: ClockIcon };
    }
    
    if (runMode === "custom" && output) {
      const parsed = parseOutput(output);
      if (parsed.status === "error") {
        // Check if it's a time limit or other specific error
        if (parsed.errorType === "TLE" || parsed.errorType === "Time Limit Exceeded") {
          return { status: "Time Limit Exceeded", color: "red", icon: XCircleIcon };
        }
        return { status: "Runtime Error", color: "red", icon: XCircleIcon };
      }
      return { status: "Output Generated", color: "green", icon: CheckCircleIcon };
    }
    
    return { status: "Ready", color: "gray", icon: ClockIcon };
  };

  const verdict = getOverallVerdict();
  const VerdictIcon = verdict.icon;

  // MINIMIZED STATE - Show compact info like LeetCode
  if (!isExpanded) {
    return (
      <div className="h-full flex flex-col">
        {/* Compact Header - Always Visible */}
        <div className="bg-gradient-to-r from-[#2a2a3d] to-[#1c1c2a] rounded-t-lg">
          {/* Compact Status Bar */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${verdict.color === 'red' ? 'bg-red-400' : verdict.color === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'} ${isRunning || isSubmitting ? 'animate-pulse' : ''}`}></div>
              <span className="text-sm font-semibold text-white/90">
                {verdict.status}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={expandConsole}
                className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                title="Expand"
              >
                <ExpandIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Compact Tab Navigation */}
          <div className="flex items-center">
            <button 
              onClick={() => {}} // Will be handled by parent
              className={`
                flex-1 py-2 px-3 text-sm font-semibold transition-all duration-200
                ${runMode === 'example' ? 'bg-[#7286ff]/20 text-white' : 'text-white/60 hover:bg-white/5'}
              `}
            >
              Test Cases
            </button>
            <button 
              onClick={() => {}} // Will be handled by parent
              className={`
                flex-1 py-2 px-3 text-sm font-semibold transition-all duration-200
                ${runMode === 'custom' ? 'bg-[#7286ff]/20 text-white' : 'text-white/60 hover:bg-white/5'}
              `}
            >
              Custom Input
            </button>
          </div>
        </div>

        {/* Compact Content Area - Minimal Height */}
        <div className="flex-1 overflow-hidden min-h-[80px] max-h-[120px]">
          <div className="h-full overflow-auto p-3 custom-scroll">
            {/* COMPACT VERDICT - Show minimal info when minimized */}
            {!isRunning && !isSubmitting && hasContent && (
              <div className="text-center">
                {/* Compact Verdict Icon and Status */}
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <VerdictIcon className={`w-6 h-6 ${
                    verdict.color === 'red' ? 'text-red-400' : 
                    verdict.color === 'yellow' ? 'text-yellow-400' : 
                    'text-green-400'
                  }`} />
                  <span className={`text-lg font-bold ${
                    verdict.color === 'red' ? 'text-red-400' : 
                    verdict.color === 'yellow' ? 'text-yellow-400' : 
                    'text-green-400'
                  }`}>
                    {verdict.status}
                  </span>
                </div>

                {/* Compact Test Case Summary */}
                {runMode === "example" && exampleResults.length > 0 && (
                  <div className="text-sm text-white/60 mb-2">
                    <div className="flex items-center justify-center space-x-4">
                      <span className="text-green-400">
                        ✓ {exampleResults.filter(r => r.pass === true).length}
                      </span>
                      <span className="text-red-400">
                        ✗ {exampleResults.filter(r => r.pass === false).length}
                      </span>
                      <span className="text-yellow-400">
                        ⏳ {exampleResults.filter(r => r.pass === undefined).length}
                      </span>
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      of {exampleResults.length} test cases
                    </div>
                  </div>
                )}

                {/* Compact Runtime for Accepted */}
                {verdict.status === "All Tests Passed" && (
                  <div className="text-xs text-white/40 mt-1">All test cases passed successfully</div>
                )}

                {/* Expand Hint */}
                <div className="text-xs text-white/40 mt-2 flex items-center justify-center">
                  <ExpandIcon className="w-3 h-3 mr-1" />
                  Click to expand for details
                </div>
              </div>
            )}

            {/* COMPACT LOADING STATE */}
            {(isRunning || isSubmitting) && (
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#7286ff] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white/80 text-sm">
                    {isSubmitting ? "Submitting..." : "Running..."}
                  </span>
                </div>
              </div>
            )}

            {/* COMPACT ERROR STATE */}
            {markers.length > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-red-400 font-medium">
                    {markers.length} compilation error{markers.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-xs text-white/60">
                  Expand to see details
                </div>
              </div>
            )}

            {/* COMPACT DEFAULT STATE */}
            {!isRunning && !isSubmitting && !hasContent && (
              <div className="text-center text-white/60 text-sm">
                <div className="mb-2">
                  <div className="w-8 h-8 mx-auto bg-[#7286ff]/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#7286ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/80 text-xs font-medium">Ready to Run</p>
                <p className="text-white/40 text-xs">Click "Run" to execute code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // EXPANDED STATE - Show full details like LeetCode
  return (
    <div className="h-full flex flex-col">
      {/* Header with Tabs - Always Visible */}
      <div className="bg-gradient-to-r from-[#2a2a3d] to-[#1c1c2a] rounded-t-lg">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${verdict.color === 'red' ? 'bg-red-400' : verdict.color === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'} ${isRunning || isSubmitting ? 'animate-pulse' : ''}`}></div>
            <span className="text-sm font-semibold text-white/90">
              {verdict.status}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={minimizeConsole}
              className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              title="Minimize"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation - Always Visible */}
        <div className="flex items-center">
          <button 
            onClick={() => {}} // Will be handled by parent
            className={`
              flex-1 py-2 px-3 text-sm font-semibold transition-all duration-200
              ${runMode === 'example' ? 'bg-[#7286ff]/20 text-white' : 'text-white/60 hover:bg-white/5'}
            `}
          >
            Test Cases
          </button>
          <button 
            onClick={() => {}} // Will be handled by parent
            className={`
              flex-1 py-2 px-3 text-sm font-semibold transition-all duration-200
              ${runMode === 'custom' ? 'bg-[#7286ff]/20 text-white' : 'text-white/60 hover:bg-white/5'}
            `}
          >
            Custom Input
          </button>
        </div>
      </div>

      {/* Content Area - Full Height */}
      <div className="flex-1 overflow-hidden min-h-[300px]">
        <div className="h-full overflow-auto p-3 custom-scroll">
          {/* COMPILATION ERRORS - Show first if markers exist */}
          {markers.length > 0 && (
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold text-red-400">Compilation Errors</h3>
              </div>
              
              {markers.map((marker, index) => (
                <div key={index} className="bg-red-900/20 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-red-400 font-bold">{marker.startLineNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-red-300 font-medium mb-1">
                        Line {marker.startLineNumber}
                        {marker.startColumn > 1 && `, Column ${marker.startColumn}`}
                      </div>
                      <div className="text-xs text-red-200/80 whitespace-pre-wrap">
                        {marker.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-xs text-white/60 bg-white/5 p-2 rounded">
                💡 Fix these errors before running test cases. The errors are also highlighted in your code editor.
              </div>
            </div>
          )}

          {/* Loading State */}
          {(isRunning || isSubmitting) && (
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-[#7286ff] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white/80 text-sm">
                  {isSubmitting ? "Submitting solution..." : "Running test cases..."}
                </span>
              </div>
            </div>
          )}

          {/* VERDICT DISPLAY - Like LeetCode */}
          {!isRunning && !isSubmitting && hasContent && (
            <div className="mb-4">
              {/* Main Verdict */}
              <div className="flex items-center space-x-3 mb-4">
                <VerdictIcon className={`w-8 h-8 ${
                  verdict.color === 'red' ? 'text-red-400' : 
                  verdict.color === 'yellow' ? 'text-yellow-400' : 
                  'text-green-400'
                }`} />
                <div>
                  <h2 className={`text-xl font-bold ${
                    verdict.color === 'red' ? 'text-red-400' : 
                    verdict.color === 'yellow' ? 'text-yellow-400' : 
                    'text-green-400'
                  }`}>
                    {verdict.status}
                  </h2>
                  {verdict.status === "Accepted" && (
                    <p className="text-sm text-white/60">Runtime: 0 ms</p>
                  )}
                </div>
              </div>

              {/* Test Case Navigation */}
              {runMode === "example" && exampleResults.length > 0 && (
                <div className="flex space-x-2 mb-4">
                  {exampleResults.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestCase(index)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        activeTestCase === index
                          ? 'bg-[#7286ff] text-white'
                          : 'bg-[#2a2a3d] text-white/60 hover:bg-[#3a3a4d]'
                      }`}
                    >
                      Case {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EXAMPLE TEST CASE MODE */}
          {!isRunning && !isSubmitting && runMode === "example" && Array.isArray(exampleResults) && exampleResults.length > 0 && (
            <div className="space-y-3">
              {/* Test Results Summary */}
              <div className="bg-[#1c1c2a]/20 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white/90">Test Results Summary</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white/60">Total: {exampleResults.length}</span>
                    <span className="text-xs text-green-400">Passed: {exampleResults.filter(r => r.pass === true).length}</span>
                    <span className="text-xs text-red-400">Failed: {exampleResults.filter(r => r.pass === false).length}</span>
                    <span className="text-xs text-yellow-400">Processing: {exampleResults.filter(r => r.pass === undefined).length}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-[#2a2a3d] rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(exampleResults.filter(r => r.pass === true).length / exampleResults.length) * 100}%` 
                    }}
                  />
                </div>
                
                {/* Overall Status */}
                <div className="flex items-center justify-center">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    exampleResults.every(r => r.pass === true) 
                      ? 'bg-green-500/20 text-green-400' 
                      : exampleResults.some(r => r.pass === true) 
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : exampleResults.some(r => r.pass === false)
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {exampleResults.every(r => r.pass === true) 
                      ? '🎉 All Tests Passed!' 
                      : exampleResults.some(r => r.pass === true) 
                      ? '⚠️ Partial Success'
                      : exampleResults.some(r => r.pass === false)
                      ? '❌ Tests Failed'
                      : '⏳ Running Tests...'}
                  </span>
                </div>
              </div>

              {/* Active Test Case Details */}
              {exampleResults[activeTestCase] && (
                <div className="bg-[#1c1c2a]/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white/90">
                      Test Case {activeTestCase + 1}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      exampleResults[activeTestCase].pass === true
                        ? 'bg-green-500/20 text-green-400' 
                        : exampleResults[activeTestCase].pass === false
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {exampleResults[activeTestCase].pass === true 
                        ? 'Passed' 
                        : exampleResults[activeTestCase].pass === false 
                        ? 'Failed' 
                        : 'Processing...'}
                    </span>
                  </div>

                  {/* Input Section */}
                  <div className="mb-3">
                    <div className="text-xs text-white/60 mb-1">Input</div>
                    <div className="bg-[#2a2a3d]/50 p-2 rounded font-mono text-white/90 text-xs">
                      {exampleResults[activeTestCase].input || "N/A"}
                    </div>
                  </div>

                  {/* Expected vs Actual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-white/60 mb-1">Expected</div>
                      <div className="bg-[#2a2a3d]/50 p-2 rounded font-mono text-white/90 text-xs">
                        {exampleResults[activeTestCase].expected || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">Actual</div>
                      <div className="bg-[#2a2a3d]/50 p-2 rounded font-mono text-white/90 text-xs">
                        {exampleResults[activeTestCase].actual || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Error Details if Failed */}
                  {exampleResults[activeTestCase].pass === false && exampleResults[activeTestCase].error && (
                    <div className="mt-3 p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                      <div className="text-xs text-red-400 mb-1">Error Details:</div>
                      <div className="text-xs text-red-300 font-mono">
                        {exampleResults[activeTestCase].error}
                      </div>
                    </div>
                  )}

                  {/* Copy Button */}
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => handleCopy(exampleResults[activeTestCase].actual || exampleResults[activeTestCase].error || "No output")}
                      className="flex items-center text-xs text-white/60 hover:text-white transition-colors"
                    >
                      <ClipboardIcon className="w-4 h-4 mr-1" />
                      Copy {exampleResults[activeTestCase].pass === false ? "Error" : "Output"}
                    </button>
                  </div>
                </div>
              )}

              {/* All Test Cases Summary */}
              <div className="space-y-2">
                {exampleResults.map((res, i) => (
                  <div
                    key={i}
                    className={`rounded-lg transition-all duration-200 overflow-hidden cursor-pointer ${
                      res.pass === true ? "bg-green-900/5" : 
                      res.pass === false ? "bg-red-900/5" : 
                      "bg-yellow-900/5"
                    } ${activeTestCase === i ? 'bg-[#7286ff]/10' : ''}`}
                    onClick={() => setActiveTestCase(i)}
                  >
                    <div
                      className={`flex items-center justify-between p-3 ${
                        res.pass === true ? "bg-green-900/10" : 
                        res.pass === false ? "bg-red-900/10" : 
                        "bg-yellow-900/10"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 flex items-center justify-center rounded-full mr-3 ${
                            res.pass === true ? "bg-green-500/20" : 
                            res.pass === false ? "bg-red-500/20" : 
                            "bg-yellow-500/20"
                          }`}
                        >
                          {res.pass === true ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : res.pass === false ? (
                            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="font-medium text-sm">
                          <span className="text-white/80">Test Case {i + 1}</span>
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              res.pass === true ? "bg-green-500/20 text-green-400" : 
                              res.pass === false ? "bg-red-500/20 text-red-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {res.pass === true ? "Passed" : 
                             res.pass === false ? "Failed" : 
                             "Processing..."}
                          </span>
                        </div>
                      </div>
                      <div className="text-white/60">
                        {activeTestCase === i ? (
                          <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOM INPUT MODE */}
          {!isRunning && !isSubmitting && runMode === "custom" && output && (
            (() => {
              const parsed = parseOutput(output);
              let error = null,
                finalOutput = null,
                execTime = null,
                errorType = null,
                status = null;

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
                "Memory Limit Exceeded": "💾 Memory Limit Exceeded: Your program used too much memory.",
                "Compilation Error": "🛠️ Compilation Error: There was an issue compiling your code.",
                "Runtime Error": "💥 Runtime Error: Your code crashed during execution.",
                "Infinite Loop Detected": "🔁 Infinite Loop Detected: Your code ran too long and was terminated.",
              };

              const renderErrorMessage = () => {
                if (!errorType) {
                  // Filter out any time limit related messages from raw error text
                  if (error && typeof error === 'string') {
                    const timeLimitPatterns = [
                      /time limit exceeded/i,
                      /TLE/i,
                      /timeout/i,
                      /execution time limit/i
                    ];
                    
                    for (const pattern of timeLimitPatterns) {
                      if (pattern.test(error)) {
                        return "⏱️ Execution terminated due to time constraints.";
                      }
                    }
                  }
                  return error;
                }
                return prettyMessages[errorType] || `${errorType}: ${error}`;
              };

              return (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white/90 mb-3">Custom Input Output</h3>
                  
                  {execTime && (
                    <div className="text-white/60 text-xs">⏱️ Execution Time: {execTime}</div>
                  )}

                  {status === "error" ? (
                    <div className="text-red-400 whitespace-pre-wrap break-words text-sm">
                      {renderErrorMessage()}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap break-words text-white/90 text-sm bg-[#2a2a3d]/50 p-3 rounded">
                      {finalOutput || "No output"}
                    </pre>
                  )}

                  {(finalOutput || error) && (
                    <button
                      onClick={() => handleCopy(finalOutput || error)}
                      className="flex items-center text-xs text-white/60 hover:text-white transition-colors"
                    >
                      <ClipboardIcon className="w-4 h-4 mr-1" />
                      Copy {status === "error" ? "Error" : "Output"}
                    </button>
                  )}
                </div>
              );
            })()
          )}

          {/* Default State - Show when no content and not running */}
          {!isRunning && !isSubmitting && !hasContent && (
            <div className="text-center text-white/60 text-sm py-6">
              <div className="mb-3">
                <div className="w-12 h-12 mx-auto bg-[#7286ff]/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#7286ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-white/80 font-medium mb-1">Ready to Run Code</p>
              <p className="text-white/60 text-xs">Click "Run" to execute your code and see results here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
