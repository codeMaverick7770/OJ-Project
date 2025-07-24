import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ClipboardIcon } from "@heroicons/react/24/outline";

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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text || "");
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 800);
  };

  // 🧪 EXAMPLE TEST CASE MODE
  if (runMode === "example" && Array.isArray(exampleResults) && exampleResults.length > 0) {
    return (
      <div className="glass-card mt-4 p-4 text-sm">
        {exampleResults.map((res, i) => (
          <details key={i} open={!res.pass} className="mb-3">
            <summary
              className={`cursor-pointer font-semibold ${
                res.pass ? "text-green-300" : "text-red-300"
              }`}
            >
              Case {i + 1}: {res.pass ? "✅ Passed" : "❌ Failed"}
            </summary>
            <div className="mt-2 pl-4 space-y-1">
              <pre>
                <strong>Input:</strong> {res.input || "N/A"}
              </pre>
              <pre>
                <strong>Expected:</strong> {res.expected || "N/A"}
              </pre>
              <pre className="flex gap-2 items-center">
                <strong>Got:</strong>{" "}
                <span className="flex-1 break-all">{res.actual || "N/A"}</span>
                <div className="relative group">
                  <ClipboardIcon
                    onClick={() => handleCopy(res.actual)}
                    className={`w-4 h-4 cursor-pointer text-white/60 hover:text-white transition-transform ${
                      copied ? "scale-110" : ""
                    }`}
                  />
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                    Copy
                  </span>
                </div>
              </pre>
            </div>
          </details>
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
      <div className="glass-card mt-4 p-4 text-sm">
        {status === "error" ? (
          <div className="text-red-400 whitespace-pre-wrap break-words">
            <strong className="block mb-1">❌ Error:</strong>
            <div className="mb-1">{renderErrorMessage()}</div>
            {error && !errorType && <div className="text-white/60">{error}</div>}
          </div>
        ) : (
          <pre className="whitespace-pre-wrap break-words">{finalOutput || "No output"}</pre>
        )}

        {/* Execution Time */}
        {execTime && (
          <div className="mt-1 text-right text-xs text-white/50">
            ⏱️ Exec Time: {execTime}
          </div>
        )}

        {/* Copy Icon */}
        {(finalOutput || error) && (
          <div className="mt-2 flex justify-end">
            <div className="relative group">
              <ClipboardIcon
                onClick={() => handleCopy(finalOutput || error)}
                className={`w-5 h-5 text-white/60 cursor-pointer hover:text-white transition-transform ${
                  copied ? "scale-110" : ""
                }`}
              />
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                Copy
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 🔕 DEFAULT
  return null;
}
