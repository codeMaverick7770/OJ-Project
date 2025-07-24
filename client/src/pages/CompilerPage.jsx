import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import CompilerEditor from "../components/CompilerEditor";
import OutputBox from "../components/OutputBox";
import API from "../services/api";
import AIHelpModal from "../components/AIHelpModal";
import { Player } from "@lottiefiles/react-lottie-player";
import { Wand2, Check } from "lucide-react";
import Split from "react-split";

const defaultHelloWorld = {
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << \"Hello, World!\";\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}`,
  python: `print(\"Hello, World!\")`,
  javascript: `console.log(\"Hello World!\")`,
};

function parseErrorToMarkers(errorMessage = "", language = "cpp") {
  if (!errorMessage || typeof errorMessage !== "string") return [];
  
  const lines = errorMessage.split("\n");
  const markers = [];

  const regexMap = {
    cpp: [
      /(?:.*\.cpp|.*\.cc|.*\.c\+\+|.*):([0-9]+):([0-9]+):\s*error:\s*(.*)/i,
      /^([0-9]+):([0-9]+):\s*error:\s*(.*)/i,
      /error.*line\s*([0-9]+)/i
    ],
    java: [
      /(?:.*\.java):([0-9]+):\s*error:\s*(.*)/i,
      /^([0-9]+):\s*error:\s*(.*)/i
    ],
    python: [
      /File\s*".*",\s*line\s*([0-9]+).*?\n?(.*)$/i,
      /line\s*([0-9]+).*?\n?(.*)$/i
    ],
    javascript: [
      /(?:.*\.js):([0-9]+):([0-9]+)\)?\s*(.*)/i,
      /^([0-9]+):([0-9]+)\s*(.*)/i
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
        const message = match[3]?.trim() || match[2]?.trim() || "Compilation error";
        
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

async function pollJobStatus(jobId, onResult, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_COMPILER_URL}/status/${jobId}`,
        { withCredentials: true }
      );
      if (data.status === "completed" || data.status === "error") {
        onResult(data);
        return;
      }
    } catch {}
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

  const runExampleTestCases = async () => {
    if (!problem || isCompilerOnly) return;
    setRunMode("example");
    setIsRunning(true);
    setExampleResults([]);
    setMarkers([]);
    const results = [];
    for (const ex of problem.examples) {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_COMPILER_URL,
          { language, code: code[language], input: ex.input },
          { withCredentials: true }
        );
        const { jobId } = data;
        await pollJobStatus(jobId, (status) => {
          const actual = (status?.output || "").toString().trim();
          const expected = ex.output.trim();
          results.push({
            input: ex.input,
            expected,
            actual,
            pass: actual === expected,
          });
          if (status.status === "error" && status.error) {
            const errorMarkers = parseErrorToMarkers(status.error, language);
            setMarkers(errorMarkers);
          }
        });
      } catch {
        results.push({
          input: ex.input,
          expected: ex.output.trim(),
          actual: "Error",
          pass: false,
        });
      }
    }
    setExampleResults(results);
    setIsRunning(false);
  };

  const handleRun = async () => {
    setRunMode("custom");
    setIsRunning(true);
    setOutput("");
    setMarkers([]);
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_COMPILER_URL,
        { language, code: code[language], input },
        { withCredentials: true }
      );
      const { jobId } = data;
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
        const { data } = await axios.post(
          import.meta.env.VITE_COMPILER_URL,
          { language, code: code[language], input: tc.input },
          { withCredentials: true }
        );
        const { jobId } = data;
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
        setOutput("🎉 All test cases passed! Your solution has been submitted.");
        setShowPopup(true);
        setMarkers([]);
      } catch {
        setOutput("✅ Passed all tests, but submission error occurred.");
      }
    }
    setIsSubmitting(false);
  };

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
      const response = await axios.post(
        `${import.meta.env.VITE_COMPILER_URL}/format`,
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

  return (
    <div className="min-h-screen text-white relative font-sans">
      <div className="absolute inset-0 bg-[url('/assets/background.jpg')] bg-cover bg-center z-0" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0" />

      <AIHelpModal
        visible={showAiModal}
        onClose={() => setShowAiModal(false)}
        onRequest={handleAiRequest}
        response={aiHelpResponse}
        loading={isLoadingAi}
      />

      {showPopup && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl text-center text-black shadow-xl">
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
              className="mt-4 neon-btn px-6 py-2 text-sm"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 pt-20 px-4">
        {!isCompilerOnly ? (
          <Split
            className="flex h-[80vh]"
            sizes={[40, 60]}
            minSize={300}
            gutterSize={6}
            gutterAlign="center"
            cursor="col-resize"
            gutter={() => {
              const gutter = document.createElement("div");
              gutter.className = "split-gutter";
              return gutter;
            }}
          >
            <div className="glass-dark p-6 overflow-auto rounded-xl text-white/90 text-base custom-scroll border border-[#7286ff]/20 shadow-[0_0_10px_#7286ff33]">
              {problem && (
                <>
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#7286ff] to-[#fe7587] bg-clip-text text-transparent drop-shadow-md">
                    {problem.title}
                  </h2>
                  <section className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-white/70">Description</h3>
                      <pre className="whitespace-pre-wrap">{problem.description}</pre>
                    </div>
                    {problem.inputFormat && (
                      <div>
                        <h3 className="font-semibold text-white/70">Input Format</h3>
                        <pre className="whitespace-pre-wrap">{problem.inputFormat}</pre>
                      </div>
                    )}
                    {problem.outputFormat && (
                      <div>
                        <h3 className="font-semibold text-white/70">Output Format</h3>
                        <pre className="whitespace-pre-wrap">{problem.outputFormat}</pre>
                      </div>
                    )}
                    {problem.constraints?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-white/70">Constraints</h3>
                        <ul className="list-disc list-inside">
                          {problem.constraints.map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {problem.examples?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-white/70">Examples</h3>
                        {problem.examples.map((ex, idx) => (
                          <div key={idx} className="mb-2">
                            <p><strong>Input:</strong></p>
                            <pre>{ex.input}</pre>
                            <p><strong>Output:</strong></p>
                            <pre>{ex.output}</pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>

            <div className="glass-dark rounded-xl flex flex-col">
              <div className="flex justify-between items-center px-4 pt-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="neon-select"
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
                  >
                    {isFormatted ? <Check className="icon-tick" size={20} /> : <Wand2 size={20} />}
                  </button>

                  <button
                    onClick={() => setShowAiModal(true)}
                    className="ai-review-glow px-4 py-1.5 text-xs font-bold rounded-md tracking-wide"
                  >
                    AI Code Review
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-2">
                <button
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                    runMode === "example"
                      ? "bg-gradient-to-r from-[#7286ff] to-[#fe7587] text-white"
                      : "bg-transparent border border-white text-white hover:bg-white hover:text-black"
                  }`}
                  onClick={() => setRunMode("example")}
                >
                  Example Test Cases
                </button>
                <button
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                    runMode === "custom"
                      ? "bg-gradient-to-r from-[#7286ff] to-[#fe7587] text-white"
                      : "bg-transparent border border-white text-white hover:bg-white hover:text-black"
                  }`}
                  onClick={() => setRunMode("custom")}
                >
                  Custom Input
                </button>
              </div>

              <div className="flex-1 overflow-auto p-2">
                <CompilerEditor
                  code={code[language]}
                  setCode={(newCode) => setCode((prev) => ({ ...prev, [language]: newCode }))}
                  language={language}
                  markers={markers}
                />
                {runMode === "custom" && (
                  <textarea
                    className="mt-4 bg-[#282846] w-full rounded p-2 text-sm border border-[#6C00FF] text-white placeholder:text-white/50"
                    rows={4}
                    placeholder="Standard Input..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                )}
                <OutputBox
                  output={output}
                  runMode={runMode}
                  exampleResults={exampleResults}
                />
              </div>
            </div>
          </Split>
        ) : (
          <div className="glass-dark rounded-xl flex flex-col h-[80vh]">
            <div className="flex justify-between items-center px-4 pt-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="neon-select"
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
                >
                  {isFormatted ? <Check className="icon-tick" size={20} /> : <Wand2 size={20} />}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <CompilerEditor
                code={code[language]}
                setCode={(newCode) => setCode((prev) => ({ ...prev, [language]: newCode }))}
                language={language}
                markers={markers}
              />
              <textarea
                className="mt-4 bg-[#282846] w-full rounded p-2 text-sm border border-[#6C00FF] text-white placeholder:text-white/50"
                rows={4}
                placeholder="Standard Input..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <OutputBox
                output={output}
                runMode={runMode}
                exampleResults={exampleResults}
              />
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={
              isCompilerOnly
                ? handleRun
                : runMode === "example"
                ? runExampleTestCases
                : handleRun
            }
            disabled={isRunning}
            className="run-btn flex items-center gap-2 px-6 py-2 text-sm"
          >
            {isRunning ? <span className="spinner-white" /> : "Run"}
          </button>

          {!isCompilerOnly && problem && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="submit-btn flex items-center gap-2 px-6 py-2 text-sm"
            >
              {isSubmitting ? <span className="spinner-white" /> : "Submit"}
            </button>
          )}
        </div>

        {!isCompilerOnly && feedback && (
          <div className="mt-6 p-4 rounded bg-red-900/30 border border-red-500">
            <p className="font-semibold text-sm">❌ Failing Test Case</p>
            <p><strong>Input:</strong> {feedback.input}</p>
            <p><strong>Expected:</strong> {feedback.expected}</p>
            <p><strong>Got:</strong> {feedback.actual}</p>
          </div>
        )}
      </div>

      <style>{`
        .split-gutter {
          background: #999;
          width: 4px;
          transition: all 0.2s ease;
        }
        .split-gutter:hover {
          width: 8px;
          background: linear-gradient(180deg, #7286ff, #fe7587);
        }

        .glass-light {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-dark {
          background: rgba(20, 20, 30, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .run-btn {
          background: linear-gradient(90deg, #7286ff, #fe7587);
          border: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          border-radius: 6px;
        }

        .run-btn:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }

        .submit-btn {
          background: transparent;
          color: white;
          border: 2px solid white;
          font-weight: 600;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: white;
          color: black;
          transform: translateY(-1px);
        }

        .spinner-white {
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: #fff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.6s linear infinite;
        }

        .ai-review-glow {
          position: relative;
          background: linear-gradient(to right, #7286ff, #fe7587);
          color: white;
          border: none;
          border-radius: 8px;
          box-shadow: 0 0 8px rgba(114, 134, 255, 0.6),
                      0 0 16px rgba(254, 117, 135, 0.5),
                      0 0 24px rgba(254, 117, 135, 0.3);
          transition: transform 0.3s ease, box-shadow 0.4s ease;
        }

        .ai-review-glow:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 0 12px rgba(114, 134, 255, 0.9),
                      0 0 24px rgba(254, 117, 135, 0.6),
                      0 0 36px rgba(254, 117, 135, 0.4);
        }

        .ai-review-glow::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, #7286ff, #fe7587);
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: -1;
          filter: blur(4px);
        }

        .neon-select {
          background-color: #1c1c2a;
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1.5px solid transparent;
          outline: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23fff' d='M10,50 L70,110 L130,50'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.6rem center;
          background-size: 0.65rem;
          width: auto;
          max-width: 12rem;
          min-width: 6rem;
          transition: all 0.3s ease;
          box-shadow: 0 0 8px rgba(114, 134, 255, 0.5), 0 0 14px rgba(254, 117, 135, 0.3);
        }

        .neon-select:hover,
        .neon-select:focus {
          border-color: #7286ff;
          box-shadow: 0 0 10px #7286ff, 0 0 20px #fe7587;
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
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  border-radius: 6px;
}

.icon-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.25),
              0 0 20px rgba(114, 134, 255, 0.25),
              0 0 30px rgba(254, 117, 135, 0.15);
}

.icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Optional tick animation */
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

      `}</style>
    </div>
  );
}
