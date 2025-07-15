import React from "react";

export default function OutputBox({ output, exampleResults = [], runMode }) {
  const handleCopy = (text) => navigator.clipboard.writeText(text);

  if (runMode === "example" && exampleResults.length > 0) {
    return (
      <div className="glass-card mt-4 p-4 text-sm">
        {exampleResults.map((res, i) => (
          <details key={i} open={!res.pass} className="mb-3">
            <summary className={`cursor-pointer font-semibold ${res.pass ? "text-green-300" : "text-red-300"}`}>
              Case {i + 1}: {res.pass ? "✅ Passed" : "❌ Failed"}
            </summary>
            <div className="mt-2 pl-4 space-y-1">
              <pre><strong>Input:</strong> {res.input}</pre>
              <pre><strong>Expected:</strong> {res.expected}</pre>
              <pre className="flex gap-2 items-center">
                <strong>Got:</strong>{" "}
                <span className="flex-1 break-all">{res.actual}</span>
                <button className="text-xs text-white/60 hover:text-white" onClick={() => handleCopy(res.actual)}>
                  Copy
                </button>
              </pre>
            </div>
          </details>
        ))}
      </div>
    );
  }

  if (runMode === "custom" && output !== "") {
    return (
      <div className="glass-card mt-4 p-4 text-sm">
        <pre className="whitespace-pre-wrap break-words">{output}</pre>
        <button className="mt-2 neon-btn text-xs" onClick={() => handleCopy(output)}>
          Copy Output
        </button>
      </div>
    );
  }

  return null;
}
