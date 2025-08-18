import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import CompilerEditor from '../components/CompilerEditor';
import OutputBox from '../components/OutputBox';
import API from '../services/api';
import AIHelpModal from '../components/AIHelpModal';
import { Player } from '@lottiefiles/react-lottie-player';
import { Wand2, Check, Play, Send, Sparkles, Loader2, ChevronDown, ChevronUp, FileText, Code, Terminal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedRenderer from '../utils/enhancedRenderer.jsx';
import Navbar from '../components/Navbar';

const defaultHelloWorld = {
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  python: `print("Hello, World!")`,
  javascript: `console.log("Hello World!")`,
};

// Default layout configuration
const defaultLayout = {
  problem: { size: 35, isCollapsed: false, minSize: 20, maxSize: 60 },
  editor: { size: 65, isCollapsed: false, minSize: 30, maxSize: 80 },
  output: { size: 40, isCollapsed: false, minSize: 20, maxSize: 70 }
};

function parseErrorToMarkers(errorMessage = "", language = "cpp") {
  if (!errorMessage || typeof errorMessage !== "string") return [];

  const lines = errorMessage.split("\n");
  const markers = [];

  const regexMap = {
    cpp: [
      /(?:.*\.cpp|.*\.cc|.*\.c\+\+|.*):([0-9]+):([0-9]+):\s*error:\s*(.*)/i,
      /^([0-9]+):([0-9]+):\s*error:\s*(.*)/i,
      /error.*line\s*([0-9]+)/i,
    ],
    java: [
      /(?:.*\.java):([0-9]+):\s*error:\s*(.*)/i,
      /^([0-9]+):\s*error:\s*(.*)/i,
    ],
    python: [
      /File\s*\".*\",\s*line\s*([0-9]+).*?\n?(.*)$/i,
      /line\s*([0-9]+).*?\n?(.*)$/i,
    ],
    javascript: [
      /(?:.*\.js):([0-9]+):([0-9]+)\)?\s*(.*)/i,
      /^([0-9]+):([0-9]+)\s*(.*)/i,
    ],
  };

  const regexes = regexMap[language.toLowerCase()] || regexMap.cpp;

  for (const line of lines) {
    if (!line.trim()) continue;

    for (const regex of regexes) {
      const match = line.match(regex);
      if (match) {
        const lineNumber = parseInt(match[1], 10);
        const column = match[2] ? parseInt(match[2], 10) : 1;
        const message =
          match[3]?.trim() || match[2]?.trim() || "Compilation error";

        if (lineNumber > 0) {
          markers.push({
            startLineNumber: lineNumber,
            endLineNumber: lineNumber,
            startColumn: column,
            endColumn: column + 10,
            message: message,
            severity: 8,
          });
          break;
        }
      }
    }
  }

  return markers;
}

function stripLeadingHeading(text = "") {
  if (typeof text !== 'string') return text;
  let out = text.replace(/^\s*<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>\s*/i, '');
  out = out.replace(/^\s*#{1,3}\s.*?(\r?\n|$)/, '');
  return out;
}

async function pollJobStatus(jobId, onResult, timeout = 15000) {
  if (!jobId) {
    onResult({ status: "error", error: "Invalid job ID" });
    return;
  }

  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const compilerBase =
        import.meta.env.VITE_COMPILER_URL || "http://localhost:8001";
      const { data } = await axios.get(`${compilerBase}/status/${jobId}`, {
        withCredentials: true,
      });

      if (!data) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      if (data.status === "completed" || data.status === "error") {
        onResult(data);
        return;
      }
    } catch (error) {
      console.error("Status polling error:", error);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  onResult({ status: "timeout", error: "Polling timeout" });
}

export default function CompilerPage() {
  const location = useLocation();
  const { id } = useParams();
  const isCompilerOnly = location.pathname === "/compiler";
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(defaultHelloWorld);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [exampleResults, setExampleResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [runMode, setRunMode] = useState(isCompilerOnly ? "custom" : "example");
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiHelpResponse, setAiHelpResponse] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isFormatted, setIsFormatted] = useState(false);
  const [markers, setMarkers] = useState([]);

  // Panel layout state with localStorage persistence
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem('compiler-layout');
    return saved ? JSON.parse(saved) : defaultLayout;
  });

  // Save layout to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('compiler-layout', JSON.stringify(layout));
  }, [layout]);

  // Panel collapse/expand handlers
  const togglePanel = (panelName) => {
    setLayout(prev => ({
      ...prev,
      [panelName]: {
        ...prev[panelName],
        isCollapsed: !prev[panelName].isCollapsed
      }
    }));
  };

  // Panel resize handlers
  const handlePanelResize = (panelName, size) => {
    setLayout(prev => ({
      ...prev,
      [panelName]: {
        ...prev[panelName],
        size
      }
    }));
  };

  // Reset layout to defaults
  const resetLayout = () => {
    setLayout(defaultLayout);
    setShouldExpandOutput(false);
  };

  // Reset output expansion after viewing results
  const resetOutputExpansion = () => {
    setShouldExpandOutput(false);
  };

  // Auto-expand output panel when code is run
  const [shouldExpandOutput, setShouldExpandOutput] = useState(false);

  // Check if we're on solve or compiler route for navbar adjustment
  const isSolveRoute = location.pathname.includes('/solve/');
  const isCompilerRoute = location.pathname === "/compiler";
  const isCompactNavbar = isSolveRoute || isCompilerRoute;

  // Auto-reset output expansion after results are shown
  useEffect(() => {
    if (shouldExpandOutput && (output || exampleResults.length > 0) && !isRunning && !isSubmitting) {
      const timer = setTimeout(() => {
        setShouldExpandOutput(false);
      }, 5000); // Reset after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [shouldExpandOutput, output, exampleResults, isRunning, isSubmitting]);

  useEffect(() => {
    if (id && !isCompilerOnly) {
      API.get(`/problem/${id}`)
        .then((res) => {
          const prob = res.data;
          setProblem(prob);
          const availableLang =
            Object.keys(prob.starterCode).find(
              (lang) => prob.starterCode[lang]
            ) || "cpp";
          setLanguage(availableLang);
          setCode((prev) => ({
            ...prev,
            [availableLang]:
              prob.starterCode[availableLang] ||
              defaultHelloWorld[availableLang],
          }));
        })
        .catch(console.error);
    }
  }, [id, isCompilerOnly]);

  // Run example test cases logic (unchanged)
  const runExampleTestCases = async () => {
    if (!problem || isCompilerOnly) return;
    setRunMode("example");
    setIsRunning(true);
    setExampleResults([]);
    setMarkers([]);
    
    // Auto-expand output panel for better visibility
    setShouldExpandOutput(true);
    if (layout.output.isCollapsed) {
      togglePanel('output');
    }
    
    try {
      const compilerBase = import.meta.env.VITE_COMPILER_URL || "http://localhost:8001";
      const { data } = await axios.post(
        `${compilerBase}`,
        { language, code: code[language], input: "" },
        { withCredentials: true }
      );

      const { jobId } = data;
      if (!jobId) {
        setExampleResults([{ input: "Compilation check", expected: "Success", actual: "No Job ID", pass: false }]);
        setIsRunning(false);
        return;
      }

      await pollJobStatus(jobId, async (status) => {
        if (status.status === "error") {
          const errorMarkers = parseErrorToMarkers(status.error, language);
          setMarkers(errorMarkers);
          setExampleResults([{ input: "Compilation check", expected: "Success", actual: status.error || "Compilation failed", pass: false }]);
          setIsRunning(false);
          return;
        }

        const results = [];
        for (const ex of problem.examples) {
          try {
            const { data: testData } = await axios.post(
              `${compilerBase}`,
              { language, code: code[language], input: ex.input },
              { withCredentials: true }
            );

            const { jobId: testJobId } = testData;
            if (!testJobId) {
              results.push({ input: ex.input, expected: ex.output.trim(), actual: "No Job ID", pass: false });
              continue;
            }

            await pollJobStatus(testJobId, (testStatus) => {
              const actual = (testStatus?.output || "").toString().trim();
              const expected = ex.output.trim();
              results.push({ input: ex.input, expected, actual, pass: actual === expected });
              if (testStatus.status === "error" && testStatus.error) {
                const errorMarkers = parseErrorToMarkers(testStatus.error, language);
                setMarkers(errorMarkers);
              }
            });
          } catch {
            results.push({ input: ex.input, expected: ex.output.trim(), actual: "Error", pass: false });
          }
        }
        setExampleResults(results);
        setIsRunning(false);
      });
    } catch (err) {
      setExampleResults([{ input: "Compilation check", expected: "Success", actual: "Failed to connect to compiler", pass: false }]);
      setIsRunning(false);
    }
  };

  // Handle run logic (unchanged)
  const handleRun = async () => {
    setRunMode("custom");
    setIsRunning(true);
    setOutput("");
    setMarkers([]);
    
    // Auto-expand output panel for better visibility
    setShouldExpandOutput(true);
    if (layout.output.isCollapsed) {
      togglePanel('output');
    }
    
    try {
      const compilerBase =
        import.meta.env.VITE_COMPILER_URL || "http://localhost:8001";
      const { data } = await axios.post(
        `${compilerBase}`,
        { language, code: code[language], input },
        { withCredentials: true }
      );

      const { jobId } = data;
      if (!jobId) {
        setOutput("Failed to get job ID from server.");
        setIsRunning(false);
        return;
      }

      await pollJobStatus(jobId, (status) => {
        if (status.status === "completed") {
          setOutput(status.output || "");
          setMarkers([]);
        } else {
          setOutput(status.error || "Compilation error");
          if (status.error) {
            const errorMarkers = parseErrorToMarkers(status.error, language);
            setMarkers(errorMarkers);
          }
        }
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Compilation error";
      setOutput(errorMsg);
      const errorMarkers = parseErrorToMarkers(errorMsg, language);
      setMarkers(errorMarkers);
    } finally {
      setIsRunning(false);
    }
  };

  // Handle submit logic (unchanged)
  const handleSubmit = async () => {
    if (!problem || isCompilerOnly) return;
    setIsSubmitting(true);
    setRunMode("example");
    setMarkers([]);
    const userId = localStorage.getItem("userId");
    let firstFailed = null;
    const results = [];
    for (const tc of problem.testCases) {
      try {
        const compilerBase =
          import.meta.env.VITE_COMPILER_URL || "http://localhost:8001";
        const { data } = await axios.post(
          `${compilerBase}`,
          { language, code: code[language], input: tc.input },
          { withCredentials: true }
        );

        const { jobId } = data;
        if (!jobId) {
          const result = {
            input: tc.input,
            expected: tc.expectedOutput.trim(),
            actual: "No Job ID",
            pass: false,
          };
          results.push(result);
          if (!firstFailed) firstFailed = result;
          continue;
        }

        await pollJobStatus(jobId, (status) => {
          const actual = (status?.output || "").toString().trim();
          const expected = tc.expectedOutput.trim();
          const pass = actual === expected;
          const result = { input: tc.input, expected, actual, pass };
          results.push(result);
          if (!pass && !firstFailed) firstFailed = result;
          if (status.status === "error" && status.error) {
            const errorMarkers = parseErrorToMarkers(status.error, language);
            setMarkers(errorMarkers);
          }
        });
      } catch {
        const result = {
          input: tc.input,
          expected: tc.expectedOutput.trim(),
          actual: "Error",
          pass: false,
        };
        results.push(result);
        if (!firstFailed) firstFailed = result;
      }
    }
    setExampleResults(results);
    if (firstFailed) {
      setFeedback(firstFailed);
      setOutput("❌ Failed on a hidden test case. You can request AI help.");
    } else {
      try {
        await API.post("/submissions", {
          userId,
          problemId: problem._id,
          language,
          code: code[language],
        });
        await API.post("/leaderboard/update", {
          userId,
          problemId: problem._id,
        });
        setOutput(
          "🎉 All test cases passed! Your solution has been submitted."
        );
        setShowPopup(true);
        setMarkers([]);
      } catch {
        setOutput("✅ Passed all tests, but submission error occurred.");
      }
    }
    setIsSubmitting(false);
  };

  // Handle AI request (unchanged)
  const handleAiRequest = async (level) => {
    if (!problem || isCompilerOnly) return;
    setIsLoadingAi(true);
    setAiHelpResponse("");
    try {
      const baseURL = import.meta.env.VITE_COMPILER_BASE_URL;
      const { data } = await axios.post(
        `${baseURL}/ai-review`,
        {
          code: code[language],
          problemId: problem._id,
          level,
        },
        { withCredentials: true }
      );
      setAiHelpResponse(data.aiResponse || "No feedback received.");
    } catch {
      setAiHelpResponse("AI review failed.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Beautify code (unchanged)
  const beautifyCode = async () => {
    if (isFormatting) return;
    setIsFormatting(true);
    setIsFormatted(false);

    const currentCode = code?.[language];

    if (!currentCode) {
      alert("No code found for selected language.");
      setIsFormatting(false);
      return;
    }

    try {
      const compilerBase =
        import.meta.env.VITE_COMPILER_URL || "http://localhost:8001";
      const response = await axios.post(
        `${compilerBase}/format`,
        {
          language,
          code: currentCode,
        },
        { withCredentials: true }
      );

      const formattedCode = response.data.formattedCode;

      if (formattedCode) {
        setCode((prev) => ({ ...prev, [language]: formattedCode }));
        setIsFormatted(true);
        setTimeout(() => setIsFormatted(false), 1500);
      } else {
        alert("Unable to format code.");
      }
    } catch (error) {
      alert("Failed to format code. Please try again.");
    } finally {
      setIsFormatting(false);
    }
  };

  // Render problem description or minimal bar
  const renderProblemDescription = () => {
    if (!problem) return null;
    const cleanedDescription = stripLeadingHeading(problem.description || "");
    return (
      <div className="text-white font-sans">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#7286ff] to-[#fe7587] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(114,134,255,0.45)]">
            {problem.title}
          </h1>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${problem.difficulty === 'Hard' ? 'bg-red-800/50 text-red-300 border-red-500/50' : problem.difficulty === 'Medium' ? 'bg-yellow-800/50 text-yellow-300 border-yellow-500/50' : 'bg-green-800/50 text-green-300 border-green-500/50'}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="mb-6 prose prose-invert prose-sm max-w-none text-white/90">
          <EnhancedRenderer content={cleanedDescription} />
        </div>

        {problem.inputFormat && (
          <div className="mb-6">
            <h3 className="section-title">Input Format</h3>
            <div className="bg-[#1c1c2a]/50 p-3 rounded-lg font-mono text-sm text-white/80 whitespace-pre-wrap">
              {problem.inputFormat}
            </div>
          </div>
        )}
        {problem.outputFormat && (
          <div className="mb-6">
            <h3 className="section-title">Output Format</h3>
            <div className="bg-[#1c1c2a]/50 p-3 rounded-lg font-mono text-sm text-white/80 whitespace-pre-wrap">
              {problem.outputFormat}
            </div>
          </div>
        )}

        {problem.examples?.length > 0 && (
          <div className="space-y-4">
            <h3 className="section-title">Examples</h3>
            {problem.examples.map((ex, idx) => (
              <div key={idx} className="bg-[#1c1c2a]/50 p-4 rounded-lg font-mono text-sm">
                <p className="mb-1">
                  <span className="text-white/70 font-normal select-none">Input: </span>
                  <span className="text-white/90">{ex.input}</span>
                </p>
                <p>
                  <span className="text-white/70 font-normal select-none">Output: </span>
                  <span className="text-white/90">{ex.output}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {(problem.constraints?.length > 0) && <hr className="my-6 border-white/20" />}

        {problem.constraints?.length > 0 && (
          <div>
            <h3 className="section-title">Constraints</h3>
            <ul className="list-disc list-inside space-y-1 text-white/80 pl-2">
              {problem.constraints.map((c, i) => (
                <li key={i}>
                  <code className="text-sm bg-black/20 px-1.5 py-0.5 rounded-md border border-white/10">{c}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white relative font-sans">
      <div className="absolute inset-0 bg-[url('/assets/background.jpg')] bg-cover bg-center z-0" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0" />

      {/* Enhanced Navbar with Run/Submit buttons for solve route */}
      {isSolveRoute && (
        <Navbar
          onRun={runExampleTestCases}
          onSubmit={handleSubmit}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          showSubmit={true}
          runMode={runMode}
        />
      )}
      {isSolveRoute && (
        <Navbar
          onRun={runExampleTestCases}
          onSubmit={handleSubmit}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          showSubmit={true}
          runMode={runMode}
        />
      )}

      <AIHelpModal
        visible={showAiModal}
        onClose={() => setShowAiModal(false)}
        onRequest={handleAiRequest}
        response={aiHelpResponse}
        loading={isLoadingAi}
      />

      {showPopup && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl text-center text-black shadow-xl max-w-sm w-full">
            <Player
              autoplay
              loop={false}
              src="/assets/celebration.json"
              style={{ height: "200px", width: "200px" }}
              onEvent={(e) => {
                if (e === "complete") setShowPopup(false);
              }}
            />
            <h2 className="text-2xl font-bold mt-2">🎉 Congratulations!</h2>
            <p>Your solution has been submitted and leaderboard updated.</p>
            <button
              className="mt-4 neon-btn px-6 py-2 text-sm rounded-md bg-gradient-to-r from-[#7286ff] to-[#fe7587] hover:brightness-110 transition"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className={`relative z-10 ${isSolveRoute ? 'pt-20' : 'pt-20'} px-4 max-w-none mx-auto`}>
        {!isCompilerOnly ? (
          <>
            {/* Desktop layout with resizable panels */}
            <div className="hidden md:block h-[90vh]">
              <PanelGroup
                direction="horizontal"
                className="h-full rounded-xl overflow-hidden shadow-lg"
              >
                {/* Problem Panel */}
                <Panel
                  className="relative"
                  defaultSize={layout.problem.size}
                  minSize={layout.problem.minSize}
                  maxSize={layout.problem.maxSize}
                  collapsible={true}
                  onCollapse={() => togglePanel('problem')}
                  onResize={(size) => handlePanelResize('problem', size)}
                >
                  <div className="glass-dark h-full flex flex-col">
                    {/* Panel Header */}
                    <div className="panel-header flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#2a2a3d] to-[#1c1c2a]">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-[#7286ff]" />
                        <span className="text-sm font-semibold text-white">Description</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={resetLayout}
                          className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                          title="Reset Layout"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => togglePanel('problem')}
                          className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                          title={layout.problem.isCollapsed ? 'Expand' : 'Collapse'}
                        >
                          <motion.div
                            animate={{ rotate: layout.problem.isCollapsed ? 0 : 180 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </button>
                      </div>
                    </div>

                    {/* Panel Content */}
                    <AnimatePresence>
                      {!layout.problem.isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex-1 overflow-auto p-6 custom-scroll"
                        >
                          {renderProblemDescription()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Panel>

                {/* Resize Handle */}
                <PanelResizeHandle className="w-2 bg-gradient-to-b from-[#7286ff]/30 to-[#fe7587]/30 hover:from-[#7286ff]/50 hover:to-[#fe7587]/50 transition-all duration-200 cursor-col-resize group">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#7286ff] to-[#fe7587] rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </PanelResizeHandle>

                {/* Right side vertical split: Editor and Output */}
                <Panel
                  className="relative"
                  defaultSize={100 - layout.problem.size}
                  minSize={40}
                >
                  <PanelGroup
                    direction="vertical"
                    className="h-full"
                  >
                    {/* Editor Panel */}
                    <Panel
                      className="relative"
                      defaultSize={layout.editor.size}
                      minSize={layout.editor.minSize}
                      maxSize={layout.editor.maxSize}
                      collapsible={true}
                      onCollapse={() => togglePanel('editor')}
                      onResize={(size) => handlePanelResize('editor', size)}
                    >
                      <div className="glass-dark h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="panel-header flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#2a2a3d] to-[#1c1c2a]">
                          <div className="flex items-center space-x-2">
                            <Code className="w-4 h-4 text-[#7286ff]" />
                            <span className="text-sm font-semibold text-white">Code</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <select
                              value={language}
                              onChange={(e) => setLanguage(e.target.value)}
                              className="neon-select text-sm"
                              aria-label="Select programming language"
                            >
                              <option value="cpp">C++</option>
                              <option value="java">Java</option>
                              <option value="python">Python</option>
                              <option value="javascript">Javascript</option>
                            </select>
                            <button
                              className="icon-btn"
                              onClick={beautifyCode}
                              title="Auto Format"
                              disabled={isFormatting}
                              aria-label="Auto format code"
                            >
                              {isFormatted ? (
                                <Check className="icon-tick" size={18} />
                              ) : (
                                <Wand2 size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => setShowAiModal(true)}
                              className="ai-review-glow px-4 py-1 text-xs font-semibold rounded tracking-wide select-none"
                              aria-label="Open AI code review modal"
                            >
                              <Sparkles className="inline-block mr-1 -mt-0.5" size={16} /> AI
                            </button>
                            <button
                              onClick={() => togglePanel('editor')}
                              className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                              title={layout.editor.isCollapsed ? 'Expand' : 'Collapse'}
                            >
                              <motion.div
                                animate={{ rotate: layout.editor.isCollapsed ? 0 : 180 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </motion.div>
                            </button>
                          </div>
                        </div>

                        {/* Panel Content */}
                        <AnimatePresence>
                          {!layout.editor.isCollapsed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="flex-1 flex flex-col p-4"
                            >
                              <div className="flex-1 overflow-hidden rounded-lg border border-[#6C00FF] shadow-[0_0_15px_#6C00FF] min-h-0">
                                <CompilerEditor
                                  code={code[language]}
                                  setCode={(newCode) => setCode((prev) => ({ ...prev, [language]: newCode }))}
                                  language={language}
                                  markers={markers}
                                />
                              </div>

                              {runMode === "custom" && (
                                <div className="mt-4">
                                  <textarea
                                    className="bg-[#282846] w-full rounded-lg p-3 text-xs border border-[#6C00FF] text-white placeholder:text-white/50 resize-none shadow-inner"
                                    rows={4}
                                    placeholder="Standard Input..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    aria-label="Standard input"
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Panel>

                    {/* Resize Handle */}
                    <PanelResizeHandle className="h-2 bg-gradient-to-r from-[#7286ff]/30 to-[#fe7587]/30 hover:from-[#7286ff]/50 hover:to-[#fe7587]/50 transition-all duration-200 cursor-row-resize group">
                      <div className="h-1 w-8 bg-gradient-to-r from-[#7286ff] to-[#fe7587] rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </PanelResizeHandle>

                    {/* Output Panel */}
                    <Panel
                      className="relative"
                      defaultSize={shouldExpandOutput ? 60 : layout.output.size}
                      minSize={layout.output.minSize}
                      maxSize={layout.output.maxSize}
                      collapsible={true}
                      onCollapse={() => togglePanel('output')}
                      onResize={(size) => handlePanelResize('output', size)}
                    >
                      <div className="glass-dark h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="panel-header flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#2a2a3d] to-[#1c1c2a]">
                          <div className="flex items-center space-x-2">
                            <Terminal className="w-4 h-4 text-[#7286ff]" />
                            <span className="text-sm font-semibold text-white">Output</span>
                            {shouldExpandOutput && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, type: "spring" }}
                                className="w-2 h-2 bg-green-400 rounded-full"
                              />
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {shouldExpandOutput && (
                              <button
                                onClick={resetOutputExpansion}
                                className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                                title="Reset Output Size"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => togglePanel('output')}
                              className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                              title={layout.output.isCollapsed ? 'Expand' : 'Collapse'}
                            >
                              <motion.div
                                animate={{ rotate: layout.output.isCollapsed ? 0 : 180 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </motion.div>
                            </button>
                          </div>
                        </div>

                        {/* Panel Content */}
                        <AnimatePresence>
                          {!layout.output.isCollapsed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="flex-1 p-4"
                            >
                              <OutputBox
                                output={output}
                                runMode={runMode}
                                exampleResults={exampleResults}
                                isRunning={isRunning}
                                isSubmitting={isSubmitting}
                                markers={markers}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </div>

            {/* Mobile layout */}
            <div className="md:hidden flex flex-col h-[90vh] gap-4">
              <div className="glass-dark p-4 rounded-xl overflow-auto text-white/90 text-sm border border-[#7286ff]/30 shadow-[0_0_20px_#7286ffaa] h-1/3">
                {renderProblemDescription()}
              </div>

              <div className="glass-dark rounded-xl flex flex-col p-4 h-1/2">
                <div className="flex justify-between items-center mb-3">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="neon-select text-sm"
                    aria-label="Select programming language"
                  >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="javascript">Javascript</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      className="icon-btn"
                      onClick={beautifyCode}
                      title="Auto Format"
                      disabled={isFormatting}
                      aria-label="Auto format code"
                    >
                      {isFormatted ? (
                        <Check className="icon-tick" size={18} />
                      ) : (
                        <Wand2 size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => setShowAiModal(true)}
                      className="ai-review-glow px-4 py-1 text-xs font-semibold rounded tracking-wide select-none"
                      aria-label="Open AI code review modal"
                    >
                      AI
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden rounded-lg border border-[#6C00FF] shadow-[0_0_15px_#6C00FF]">
                  <CompilerEditor
                    code={code[language]}
                    setCode={(newCode) => setCode((prev) => ({ ...prev, [language]: newCode }))}
                    language={language}
                    markers={markers}
                  />
                </div>

                {runMode === "custom" && (
                  <div className="mt-4">
                    <textarea
                      className="bg-[#282846] w-full rounded-lg p-3 text-xs border border-[#6C00FF] text-white placeholder:text-white/50 resize-none shadow-inner"
                      rows={4}
                      placeholder="Standard Input..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      aria-label="Standard input"
                    />
                  </div>
                )}
              </div>

              <div className="glass-dark rounded-xl p-4 h-1/6 flex flex-col">
                <div className="h-full overflow-auto custom-scroll">
                  <OutputBox
                    output={output}
                    runMode={runMode}
                    exampleResults={exampleResults}
                    isRunning={isRunning}
                    isSubmitting={isSubmitting}
                    markers={markers}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-dark rounded-xl flex flex-col h-[90vh]">
            <div className="flex justify-between items-center px-6 pt-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="neon-select"
                aria-label="Select programming language"
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">Javascript</option>
              </select>
              <div className="flex gap-3">
                <button
                  className="icon-btn"
                  onClick={beautifyCode}
                  title="Auto Format"
                  disabled={isFormatting}
                  aria-label="Auto format code"
                >
                  {isFormatted ? (
                    <Check className="icon-tick" size={20} />
                  ) : (
                    <Wand2 size={20} />
                  )}
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 flex flex-col mt-4 px-6">
              <div className="flex-1 overflow-hidden rounded-lg border border-[#6C00FF] shadow-[0_0_15px_#6C00FF]">
                <CompilerEditor
                  code={code[language]}
                  setCode={(newCode) => setCode((prev) => ({ ...prev, [language]: newCode }))}
                  language={language}
                  markers={markers}
                />
              </div>

              <div className="mt-4">
                <textarea
                  className="bg-[#282846] w-full rounded-lg p-3 text-sm border border-[#6C00FF] text-white placeholder:text-white/50 shadow-inner"
                  rows={4}
                  placeholder="Standard Input..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  aria-label="Standard input"
                />
              </div>

              <div className="glass-dark rounded-xl p-4 flex flex-col mt-4">
                <div className="h-full overflow-auto custom-scroll">
                  <OutputBox
                    output={output}
                    runMode={runMode}
                    exampleResults={exampleResults}
                    isRunning={isRunning}
                    isSubmitting={isSubmitting}
                    markers={markers}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Run/Submit buttons - Only show for compiler-only mode or when not on solve route */}
        {!isSolveRoute && (
          <div className="flex justify-center mt-8 gap-6">
            <button
              onClick={
                isCompilerOnly
                  ? handleRun
                  : runMode === "example"
                  ? runExampleTestCases
                  : handleRun
              }
              disabled={isRunning}
              className="run-btn flex items-center gap-3 px-8 py-3 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#7286ff] to-[#fe7587] hover:brightness-110 transition-shadow shadow-lg"
              aria-label="Run code"
            >
              {isRunning ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
              Run
            </button>

            {!isCompilerOnly && problem && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="submit-btn flex items-center gap-3 px-8 py-3 text-sm font-semibold rounded-lg border-2 border-white bg-transparent hover:bg-white hover:text-black transition-shadow shadow-lg"
                aria-label="Submit solution"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Submit
              </button>
            )}
          </div>
        )}

        {!isCompilerOnly && feedback && (
          <div className="mt-8 p-5 rounded-lg bg-red-900/40 border border-red-600 shadow-lg">
            <p className="font-semibold text-sm mb-2">❌ Failing Test Case</p>
            <p className="mb-1">
              <strong>Input:</strong> {feedback.input}
            </p>
            <p className="mb-1">
              <strong>Expected:</strong> {feedback.expected}
            </p>
            <p>
              <strong>Got:</strong> {feedback.actual}
            </p>
          </div>
        )}
      </div>

      <AIHelpModal
        visible={showAiModal}
        onClose={() => setShowAiModal(false)}
        onRequest={handleAiRequest}
        response={aiHelpResponse}
        loading={isLoadingAi}
      />

      <style>{`
        .glass-dark {
          background: rgba(20, 20, 30, 0.85);
          backdrop-filter: saturate(180%) blur(20px);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          min-width: 0;
          min-height: 0;
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .glass-dark:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          color: #e0e7ff;
          margin-bottom: 12px;
          font-size: 1.125rem;
          border-left: 4px solid transparent;
          padding-left: 12px;
          transition: border-color 0.3s ease;
        }
        .section-title::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 24px;
          border-radius: 5px;
          background: linear-gradient(180deg, #7286ff, #fe7587);
          margin-left: -20px;
          transition: background 0.3s ease;
        }

        .run-btn {
          background: linear-gradient(90deg, #7286ff, #fe7587);
          border: none;
          color: white;
          font-weight: 700;
          transition: all 0.3s ease;
          border-radius: 10px;
          box-shadow: 0 6px 15px rgba(114, 134, 255, 0.6);
          padding-left: 24px;
          padding-right: 24px;
        }

        .run-btn:hover {
          filter: brightness(1.2);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(114, 134, 255, 0.8);
        }

        .submit-btn {
          background: transparent;
          color: white;
          border: 2px solid white;
          font-weight: 700;
          border-radius: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 6px 15px rgba(255, 255, 255, 0.3);
          padding-left: 24px;
          padding-right: 24px;
        }

        .submit-btn:hover {
          background: white;
          color: black;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.9);
        }

        .spinner-white {
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: #fff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 0.7s linear infinite;
        }

        .ai-review-glow {
          position: relative;
          background: linear-gradient(to right, #7286ff, #fe7587);
          color: white;
          border: none;
          border-radius: 12px;
          box-shadow: 0 0 12px rgba(114, 134, 255, 0.7),
                      0 0 24px rgba(254, 117, 135, 0.6),
                      0 0 36px rgba(254, 117, 135, 0.4);
          transition: transform 0.3s ease, box-shadow 0.4s ease;
          font-weight: 700;
          padding-left: 20px;
          padding-right: 20px;
          user-select: none;
        }

        .ai-review-glow:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 0 16px rgba(114, 134, 255, 1),
                      0 0 32px rgba(254, 117, 135, 0.8),
                      0 0 48px rgba(254, 117, 135, 0.6);
        }

        .ai-review-glow::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 3px;
          background: linear-gradient(135deg, #7286ff, #fe7587);
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: -1;
          filter: blur(5px);
        }

        .neon-select {
          background-color: #1c1c2a;
          color: white;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          border: 2px solid transparent;
          outline: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' width='12' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23fff' d='M10,50 L70,110 L130,50'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1rem;
          max-width: 14rem;
          min-width: 8rem;
          transition: all 0.3s ease;
          box-shadow: 0 0 12px rgba(114, 134, 255, 0.6), 0 0 20px rgba(254, 117, 135, 0.4);
          cursor: pointer;
        }

        .neon-select:hover,
        .neon-select:focus {
          border-color: #7286ff;
          box-shadow: 0 0 16px #7286ff, 0 0 28px #fe7587;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.3s ease;
          border-radius: 8px;
        }

        .icon-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 0 14px rgba(255, 255, 255, 0.3),
                      0 0 28px rgba(114, 134, 255, 0.3),
                      0 0 42px rgba(254, 117, 135, 0.2);
        }

        .icon-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .icon-tick {
          animation: tickFade 0.3s ease;
          color: white;
        }

        @keyframes tickFade {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(30, 30, 40, 0.5);
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(114, 134, 255, 0.7);
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(114, 134, 255, 0.9);
        }

        /* Basic split gutter styling */
        .gutter {
          background: rgba(114, 134, 255, 0.3);
          transition: all 0.3s ease;
        }
        .gutter:hover {
          background: rgba(114, 134, 255, 0.5);
        }
        .gutter.gutter-horizontal {
          background: rgba(254, 117, 135, 0.3);
        }
        .gutter.gutter-horizontal:hover {
          background: rgba(254, 117, 135, 0.5);
        }

        /* Enhanced Panel Styling */
        [data-panel-id] {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Panel Header Enhancements */
        .panel-header {
          background: linear-gradient(135deg, #2a2a3d 0%, #1c1c2a 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .panel-header button {
          transition: all 0.2s ease;
        }

        .panel-header button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }

        /* Resize Handle Enhancements */
        [data-resize-handle-id] {
          background: linear-gradient(135deg, rgba(114, 134, 255, 0.3) 0%, rgba(254, 117, 135, 0.3) 100%);
          transition: all 0.3s ease;
          position: relative;
        }

        [data-resize-handle-id]:hover {
          background: linear-gradient(135deg, rgba(114, 134, 255, 0.5) 0%, rgba(254, 117, 135, 0.5) 100%);
          transform: scale(1.1);
        }

        [data-resize-handle-id]::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        [data-resize-handle-id]:hover::before {
          opacity: 1;
        }

        /* Collapsed Panel States */
        .panel-collapsed {
          min-width: 60px !important;
          max-width: 60px !important;
        }

        .panel-collapsed .panel-content {
          display: none;
        }

        .panel-collapsed .panel-header {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Animation Enhancements */
        .panel-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .panel-expand {
          animation: panelExpand 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .panel-collapse {
          animation: panelCollapse 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes panelExpand {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes panelCollapse {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        /* Responsive Panel Adjustments */
        @media (max-width: 768px) {
          [data-panel-id] {
            min-width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
