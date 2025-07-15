// src/pages/CompilerPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CompilerEditor from "../components/CompilerEditor";
import OutputBox from "../components/OutputBox";
import API from "../services/api";
import AIHelpModal from "../components/AIHelpModal";
import { Player } from "@lottiefiles/react-lottie-player";
import { Wand2 } from "lucide-react";

const defaultHelloWorld = {
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  python: `print("Hello, World!")`,
};

export default function CompilerPage() {
  const { id } = useParams();
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
  const [runMode, setRunMode] = useState("example");

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiHelpResponse, setAiHelpResponse] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    if (id) {
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
  }, [id]);

  const runExampleTestCases = async () => {
    if (!problem) return;
    setRunMode("example");
    setIsRunning(true);
    const results = [];

    for (const ex of problem.examples) {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_COMPILER_URL,
          { language, code: code[language], input: ex.input },
          { withCredentials: true }
        );
        const actual = data.output.trim();
        const expected = ex.output.trim();
        results.push({
          input: ex.input,
          expected,
          actual,
          pass: actual === expected,
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
    try {
      const res = await axios.post(
        import.meta.env.VITE_COMPILER_URL,
        { language, code: code[language], input },
        { withCredentials: true }
      );
      setOutput(res.data.output);
    } catch (err) {
      setOutput(err.response?.data?.error?.stderr || "Compilation error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setRunMode("example");
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
        const actual = data.output.trim();
        const expected = tc.expectedOutput.trim();
        const pass = actual === expected;
        const result = { input: tc.input, expected, actual, pass };
        results.push(result);
        if (!pass && !firstFailed) firstFailed = result;
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
        setOutput(
          "🎉 All test cases passed! Your solution has been submitted."
        );
        setShowPopup(true);
      } catch {
        setOutput("✅ Passed all tests, but submission error occurred.");
      }
    }

    setIsSubmitting(false);
  };

  const handleAiRequest = async (level) => {
    if (!problem) return;
    setIsLoadingAi(true);
    setAiHelpResponse("");
    try {
      const baseURL = import.meta.env.VITE_COMPILER_BASE_URL;
      const { data } = await axios.post(
        `${baseURL}/api/ai-review`,
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

  const beautifyCode = () => {
    try {
      const formatted = code[language]
        .split("\n")
        .map((line) => line.trimStart())
        .join("\n");
      setCode((prev) => ({ ...prev, [language]: formatted }));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#141219] text-white pt-16 px-2">
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

      <AIHelpModal
        visible={showAiModal}
        onClose={() => setShowAiModal(false)}
        onRequest={handleAiRequest}
        response={aiHelpResponse}
        loading={isLoadingAi}
      />

      <div className="flex h-[80vh] rounded overflow-hidden">
        <div className="w-[40%] p-4 overflow-auto glass-card rounded-l-xl text-sm text-white/80">
          {problem && (
            <div>
              <h2 className="text-xl font-bold mb-2 text-[#6C00FF]">
                {problem.title}
              </h2>
              <section className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white/60">Description</h3>
                  <pre className="whitespace-pre-wrap">
                    {problem.description}
                  </pre>
                </div>
                {problem.inputFormat && (
                  <div>
                    <h3 className="font-semibold text-white/60">
                      Input Format
                    </h3>
                    <pre className="whitespace-pre-wrap">
                      {problem.inputFormat}
                    </pre>
                  </div>
                )}
                {problem.outputFormat && (
                  <div>
                    <h3 className="font-semibold text-white/60">
                      Output Format
                    </h3>
                    <pre className="whitespace-pre-wrap">
                      {problem.outputFormat}
                    </pre>
                  </div>
                )}
                {problem.constraints?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white/60">Constraints</h3>
                    <ul className="list-disc list-inside">
                      {problem.constraints.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {problem.examples?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white/60">Examples</h3>
                    {problem.examples.map((ex, idx) => (
                      <div key={idx} className="mb-2">
                        <p>
                          <strong>Input:</strong>
                        </p>
                        <pre>{ex.input}</pre>
                        <p>
                          <strong>Output:</strong>
                        </p>
                        <pre>{ex.output}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        <div className="w-[60%] flex flex-col glass-card rounded-r-xl">
          <div className="flex justify-between items-center px-4 pt-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#282846] text-white border border-[#6C00FF] px-3 py-1 rounded text-sm"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>

            <div className="flex gap-2">
              <button
                className="icon-btn"
                onClick={beautifyCode}
                title="Auto Format"
              >
                <Wand2 size={20} />
              </button>

              <button
                className="neon-btn ai-review-btn text-xs py-1 px-3"
                onClick={() => setShowAiModal(true)}
              >
                AI Code Review
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-2">
            <button
              className={`px-6 py-2 text-sm font-semibold transition-all duration-300 ${
                runMode === "example"
                  ? "bg-gradient-to-r from-[#7286ff] to-[#fe7587] text-white"
                  : "bg-transparent border border-white text-white hover:bg-white hover:text-black"
              }`}
              onClick={() => setRunMode("example")}
            >
              Example Test Cases
            </button>
            <button
              className={`px-6 py-2 text-sm font-semibold transition-all duration-300 ${
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
              setCode={(newCode) =>
                setCode((prev) => ({ ...prev, [language]: newCode }))
              }
              language={language}
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
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() =>
            runMode === "example" ? runExampleTestCases() : handleRun()
          }
          disabled={isRunning}
          className="run-btn px-6 py-2 text-sm"
        >
          {isRunning ? "Running..." : "Run"}
        </button>

        {problem && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="submit-btn px-6 py-2 text-sm"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>

      {feedback && (
        <div className="mt-6 p-4 rounded bg-red-900/30 border border-red-500">
          <p className="font-semibold text-sm">❌ Failing Test Case</p>
          <p>
            <strong>Input:</strong> {feedback.input}
          </p>
          <p>
            <strong>Expected:</strong> {feedback.expected}
          </p>
          <p>
            <strong>Got:</strong> {feedback.actual}
          </p>
        </div>
      )}

      <style>{`
  .neon-run-btn {
    background: linear-gradient(90deg, #7286ff, #fe7587);
    border: none;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
    border-radius: 6px;
    box-shadow: 0 4px 10px rgba(255, 117, 135, 0.4);
  }

  .neon-run-btn:hover {
    filter: brightness(1.15);
    transform: translateY(-1px);
  }

  .white-outline-btn {
    background-color: transparent;
    color: white;
    border: 2px solid white;
    font-weight: 600;
    border-radius: 0px;
    transition: all 0.3s ease;
  }

  .white-outline-btn:hover {
    background-color: white;
    color: black;
  }

  .toggle-btn {
    font-size: 0.875rem;
    padding: 0.4rem 1rem;
    background: #282846;
    color: white;
    transition: all 0.2s ease;
    border: none;
    font-weight: 500;
  }

  .toggle-btn.active {
    background: #6C00FF;
    font-weight: 600;
  }

  .glass-card {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
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
  background-color: transparent;
  color: white;
  border: 2px solid white;
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background-color: white;
  color: black;
}
.ai-review-btn {
  position: relative;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  transform: translate(-20px, 4px);
  box-shadow:
    0 0 6px #7286ff,
    0 0 12px #7286ff,
    0 0 20px #ff00f2,
    0 0 30px #ff00f2;
  animation: glow-pulse 2s infinite ease-in-out;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.ai-review-btn:hover {
  transform: translate(-15px, 6px) scale(1.03);
  box-shadow:
    0 0 8px #7286ff,
    0 0 16px #7286ff,
    0 0 24px #ff33ff,
    0 0 36px #ff33ff;
}

@keyframes glow-pulse {
  0% {
    box-shadow:
      0 0 6px #7286ff,
      0 0 12px #7286ff,
      0 0 20px #ff00f2,
      0 0 30px #ff00f2;
  }
  50% {
    box-shadow:
      0 0 10px #33aaff,
      0 0 18px #33aaff,
      0 0 30px #ff33ff,
      0 0 40px #ff33ff;
  }
  100% {
    box-shadow:
      0 0 6px #7286ff,
      0 0 12px #7286ff,
      0 0 20px #ff00f2,
      0 0 30px #ff00f2;
  }
}
  .icon-btn {
  background-color: transparent;
  border: none;
  padding: 0.4rem;
  border-radius: 6px;
  color: white;
  transition: background 0.2s ease, transform 0.2s ease;
  transform: translate(-50px, 10px); /* shift left (-X), down (+Y) */
}

.icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transform: translate(-45px, 10px) scale(1.1); /* maintain shift on hover */
  cursor: pointer;
}

.gradient-btn {
  background: linear-gradient(90deg, #7286ff, #fe7587);
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 6px;
}



`}</style>
    </div>
  );
}
