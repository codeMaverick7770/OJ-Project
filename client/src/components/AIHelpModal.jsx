import React, { useState } from "react";
import { Lightbulb, Code2, FileText, X } from "lucide-react";

export default function AIHelpModal({
  visible,
  onClose,
  onRequest,
  response,
  loading,
}) {
  if (!visible) return null;

  const [activeLevel, setActiveLevel] = useState(null);

  const levels = [
    {
      level: 1,
      icon: <Lightbulb className="w-4 h-4 text-[#7286ff]" />,
      label: "Get a Hint",
      description: "Receive a subtle nudge to guide your thought process.",
    },
    {
      level: 2,
      icon: <Lightbulb className="w-4 h-4 text-[#fe7587]" />,
      label: "Another Hint",
      description: "Get a more focused hint without revealing full logic.",
    },
    {
      level: 3,
      icon: <Code2 className="w-4 h-4 text-[#7286ff]" />,
      label: "Logic / Snippet",
      description: "Get core logic or a partial code snippet.",
    },
    {
      level: 4,
      icon: <FileText className="w-4 h-4 text-[#fe7587]" />,
      label: "Full Solution",
      description: "View the complete solution to the problem.",
    },
  ];

  const handleClick = (level) => {
    setActiveLevel(level);
    onRequest(level);
  };

  const formatResponse = (text) => {
    if (!text) return "Choose a level to get help.";

    // Escape HTML
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const lines = escaped.split("\n");

    let inCodeBlock = false;
    let formattedLines = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          formattedLines.push("<pre><code>");
        } else {
          formattedLines.push("</code></pre>");
        }
      } else if (inCodeBlock) {
        formattedLines.push(trimmed);
      } else if (/^\s*[-*]\s+/.test(trimmed)) {
        formattedLines.push(`<li>${trimmed.replace(/^[-*]\s+/, "")}</li>`);
      } else if (/^\s*\d+\.\s+/.test(trimmed)) {
        formattedLines.push(`<li>${trimmed.replace(/^\d+\.\s+/, "")}</li>`);
      } else {
        // Basic markdown
        let lineFormatted = trimmed
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        formattedLines.push(`<p>${lineFormatted}</p>`);
      }
    });

    // Wrap <li> items in <ul>
    let html = formattedLines.join("\n");
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");

    return html;
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center px-4 animate-fadeIn font-inter">
      <div className="bg-white text-black w-full max-w-3xl rounded-xl shadow-2xl border border-gray-200 p-6 relative transition-all">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-center text-[#6C00FF] mb-6">
          AI Assistant
        </h2>

        {/* Levels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {levels.map(({ level, label, description, icon }) => (
            <div
              key={level}
              className={`transition-all duration-300 rounded-md p-4 border text-black shadow-sm ${
                activeLevel === level
                  ? "border-[#7286ff] shadow-[0_0_12px_rgba(114,134,255,0.5)]"
                  : "border-gray-200 hover:shadow"
              }`}
            >
              <p className="text-sm text-gray-700 mb-2">{description}</p>
              <button
                onClick={() => handleClick(level)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeLevel === level
                    ? "bg-gradient-to-r from-[#7286ff] to-[#fe7587] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-black"
                } neon-hover`}
              >
                {icon}
                {label}
              </button>
            </div>
          ))}
        </div>

        {/* Response Output */}
        <div className="max-h-[300px] overflow-auto rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed font-mono text-gray-900 custom-scroll">
          {loading ? (
            <p className="text-gray-500 italic animate-pulse">Thinking...</p>
          ) : (
            <div
              className="prose prose-p:mb-3 prose-code:text-green-600 prose-code:bg-gray-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-ul:list-disc prose-ul:pl-5 max-w-none"
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

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        .prose code.inline-code {
          background: #e5e7eb;
          color: #10b981;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #7286ff;
          border-radius: 8px;
        }

        .neon-hover:hover {
          box-shadow: 0 0 8px #7286ff, 0 0 16px #fe7587;
        }
          .neon-select {
  background-color: #1c1c2a;
  color: #fff;
  border: 1px solid #6C00FF;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  outline: none;
  appearance: none;
  position: relative;
  transition: box-shadow 0.3s ease;
  box-shadow: 0 0 6px rgba(114, 134, 255, 0.5);
}

.neon-select:hover,
.neon-select:focus {
  box-shadow: 0 0 10px #7286ff, 0 0 20px #fe7587;
  border-color: #fe7587;
}

      `}</style>

      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
