// src/components/AIHelpModal.jsx
import React, { useState } from "react";

export default function AIHelpModal({ visible, onClose, onRequest, response, loading }) {
  if (!visible) return null;

  const [activeLevel, setActiveLevel] = useState(null);

  const levels = [
    {
      level: 1,
      label: "🔍 Get a Hint",
      description: "Receive a subtle nudge to guide your thought process.",
    },
    {
      level: 2,
      label: "💡 Another Hint",
      description: "Get a more focused hint without revealing the full logic.",
    },
    {
      level: 3,
      label: "📌 Logic / Snippet",
      description: "Get core logic or a partial code snippet.",
    },
    {
      level: 4,
      label: "✅ Full Solution",
      description: "View the complete solution to the problem.",
    },
  ];

  const handleClick = (level) => {
    setActiveLevel(level);
    onRequest(level);
  };

  const formatResponse = (text) => {
    if (!text) return "Choose a level to get help.";
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(.*?)\*/g;
    const codeRegex = /`([^`]+)`/g;

    const html = text
      .replace(boldRegex, '<strong>$1</strong>')
      .replace(italicRegex, '<em>$1</em>')
      .replace(codeRegex, '<code style="color: #22c55e; font-family: monospace; background: rgba(0,0,0,0.05); padding: 2px 4px; border-radius: 4px;">$1</code>');

    return html;
  };

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex justify-center items-center px-4 animate-fadeIn">
      <div className="bg-white text-black p-6 w-full max-w-3xl rounded-xl relative shadow-xl border border-gray-300">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold text-[#6C00FF] mb-6 text-center">AI Assistant</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {levels.map(({ level, label, description }) => (
            <div
              key={level}
              className={`transition-all duration-300 rounded-lg p-4 transform hover:scale-[1.03] bg-white relative group overflow-hidden ${
  activeLevel === level
    ? "border border-[#6C00FF] shadow-[0_0_14px_rgba(108,0,255,0.8)]"
    : "border border-gray-200"
}`}
style={{
  boxShadow:
    "0 0 8px rgba(114,134,255,0.6), 0 0 18px rgba(254,117,135,0.3)",
  borderImage: "linear-gradient(90deg, #7286ff, #fe7587) 1",
}}

            >
              <p className="text-sm text-gray-600 mb-3">{description}</p>
              <button
                onClick={() => handleClick(level)}
                className="gradient-btn text-sm px-4 py-2 w-full rounded-md"
              >
                {label}
              </button>
            </div>
          ))}
        </div>

        <div className="max-h-[300px] overflow-auto text-sm p-4 font-mono rounded border border-gray-300 bg-gray-50 text-gray-900">
          {loading ? (
            <p className="text-gray-500 italic animate-pulse">🧠 Thinking...</p>
          ) : (
            <div
              className="whitespace-pre-wrap leading-relaxed font-medium prose"
              dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
