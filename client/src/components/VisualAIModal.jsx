import React, { useState } from "react";
import API from "../services/api";

export default function VisualAIModal({ visible, onClose, prompt }) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  const fetchSimplification = async () => {
    setLoading(true);
    setError("");
    setExplanation("");
    try {
      const res = await API.post("/visual-ai/simplify", { prompt });
      setExplanation(res.data.explanation);
    } catch (err) {
      setError("Something went wrong while simplifying.");
      console.error(err);
    }
    setLoading(false);
  };

  const formatExplanation = (text) => {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/`([^`]+)`/gim, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative text-black max-h-[90vh] overflow-y-auto custom-scroll">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-[#6C00FF] text-center mb-4">
          🧠 AI Simplification
        </h2>

        <button
          onClick={fetchSimplification}
          className="run-btn mb-4 px-5 py-2 text-sm"
        >
          {loading ? "Thinking..." : "Generate Simplified Explanation"}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {explanation && (
          <div
            className="prose prose-sm max-w-none prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-white prose-headings:text-[#6C00FF] text-gray-800"
            dangerouslySetInnerHTML={{ __html: formatExplanation(explanation) }}
          />
        )}
      </div>

      <style>{`
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

        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
