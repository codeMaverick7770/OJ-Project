import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CompilerEditor from "../components/CompilerEditor";
import OutputBox from "../components/OutputBox";
import API from "../services/api";

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
  const [feedback, setFeedback] = useState([]);
  const [aiReview, setAiReview] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          setCode((prev) => {
            const currentCode = prev[availableLang]?.trim();
            const defaultCode = defaultHelloWorld[availableLang]?.trim();
            const isUnmodified = currentCode === defaultCode;
            return isUnmodified
              ? {
                  ...prev,
                  [availableLang]:
                    prob.starterCode[availableLang] || defaultCode,
                }
              : prev;
          });
          setFeedback([]);
          setAiReview("");
        })
        .catch(console.error);
    }
  }, [id]);

  const handleRun = async () => {
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
    const results = [];
    setAiReview(""); 

    for (const tc of problem.testCases) {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_COMPILER_URL,
          {
            language,
            code: code[language],
            input: tc.input,
          },
          { withCredentials: true }
        );

        results.push({
          input: tc.input,
          expected: tc.expectedOutput.trim(),
          actual: data.output.trim(),
          pass: data.output.trim() === tc.expectedOutput.trim(),
        });
      } catch {
        results.push({
          input: tc.input,
          expected: tc.expectedOutput.trim(),
          actual: "Error",
          pass: false,
        });
      }
    }

    setFeedback(results);
    setIsSubmitting(false);
  };

  const handleAiReview = async () => {
    setIsLoadingAi(true);
    setAiReview("");

    try {
      const baseURL = import.meta.env.VITE_COMPILER_BASE_URL;

      const { data } = await axios.post(
        `${baseURL}/ai-review`,
        {
          code: code[language],
          problemId: problem?._id,
          description: problem?.description,
        },
        { withCredentials: true }
      );

      setAiReview(data.aiResponse || "No feedback received from AI service.");
    } catch (err) {
      console.error("AI review error:", err);

      let errorMessage = "Sorry, couldn't generate AI feedback at this time.";
      if (err.response) {
        errorMessage += ` (Status: ${err.response.status})`;
        if (err.response.data && err.response.data.error) {
          errorMessage += ` - ${err.response.data.error}`;
        }
      } else if (err.request) {
        errorMessage += " - No response received from server.";
      } else {
        errorMessage += ` - ${err.message}`;
      }

      setAiReview(errorMessage);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const hasFailedTests = feedback.some((result) => !result.pass);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0c0c2d] to-black text-white px-4 pt-16 pb-10 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          {problem ? `Problem – ${problem.title}` : "Online Code Compiler"}
        </h2>

        {problem && (
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg text-sm border border-white/10 shadow-inner">
            <pre className="whitespace-pre-wrap">{problem.description}</pre>
          </div>
        )}

        <div className="flex justify-end">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-black/60 text-white border border-white/20 px-4 py-2 rounded"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl border border-white/10 shadow-lg p-4 backdrop-blur-md">
            <CompilerEditor
              code={code[language]}
              setCode={(newCode) =>
                setCode((prev) => ({ ...prev, [language]: newCode }))
              }
            />
          </div>

          <div className="space-y-4">
            <textarea
              className="bg-white/5 backdrop-blur-md w-full rounded-xl p-4 border border-white/10 text-white text-sm outline-none min-h-[150px] placeholder:text-white/50"
              placeholder="Standard Input..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <OutputBox output={output} />
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110 text-white font-semibold px-6 py-2 rounded-full shadow-md flex items-center gap-2 disabled:opacity-70"
          >
            {isRunning ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Running...</span>
              </>
            ) : (
              <span>Run</span>
            )}
          </button>

          {problem && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-black/80 hover:bg-black/90 border border-white/20 text-white font-semibold px-6 py-2 rounded-full shadow-md flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit to Test Cases</span>
              )}
            </button>
          )}
        </div>

        {feedback.length > 0 && (
          <div className="mt-6 space-y-4">
            {feedback.map((r, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  r.pass
                    ? "bg-green-900/40 border border-green-500"
                    : "bg-red-900/40 border border-red-500"
                }`}
              >
                <p className="font-semibold text-sm">Test Case {i + 1}</p>
                <p>
                  <strong>Input:</strong> {r.input}
                </p>
                <p>
                  <strong>Expected:</strong> {r.expected}
                </p>
                <p>
                  <strong>Got:</strong> {r.actual}
                </p>
                <p>{r.pass ? "✅ Passed" : "❌ Failed"}</p>
              </div>
            ))}

            {hasFailedTests && (
              <div className="flex flex-col items-center mt-6">
                <button
                  onClick={handleAiReview}
                  disabled={isLoadingAi}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-semibold px-6 py-2 rounded-full shadow-md flex items-center gap-2 disabled:opacity-70"
                >
                  {isLoadingAi ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Generating AI Review...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Get AI Code Review</span>
                    </>
                  )}
                </button>

                {aiReview && (
                  <div className="mt-6 p-4 bg-indigo-900/30 border border-indigo-500 rounded-lg w-full">
                    <h3 className="text-lg font-semibold mb-2 text-indigo-300">
                      AI Code Review
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-sm">
                        {aiReview}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
