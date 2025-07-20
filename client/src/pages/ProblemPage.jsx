import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [visualData, setVisualData] = useState(null);
  const [loadingVisual, setLoadingVisual] = useState(false);
  const [visualError, setVisualError] = useState("");

  useEffect(() => {
    API.get(`/problem/${id}`)
      .then((res) => setProblem(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || "Failed to load problem")
      );

    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/problem/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Problem deleted successfully.");
      navigate("/problems");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete problem");
    }
  };

  const handleVisualSimplify = async () => {
    setShowModal(true);
    setLoadingVisual(true);
    setVisualError("");
    setVisualData(null);
    try {
      const res = await API.post("/visual-ai/simplify", {
        prompt: problem.description,
      });
      setVisualData(res.data);
    } catch (err) {
      setVisualError("⚠️ Failed to simplify problem visually.");
    }
    setLoadingVisual(false);
  };

  const extractMermaidCode = (diagram) => {
    if (!diagram) return "";
    const match = diagram.match(/```mermaid\s*([\s\S]*?)\s*```/);
    return match ? match[1].trim() : diagram.trim();
  };

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!problem) return <div className="p-6 text-white text-center">Loading…</div>;

  return (
    <div className="min-h-screen relative text-white">
      {/* Background image and blur layer */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url('/assets/background.jpg')` }} />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

      {/* Page content */}
      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4 space-y-10">
        <div className="rounded-xl border border-white/10 p-6 bg-black/40 backdrop-blur-md shadow-md">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">{problem.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
            <span className="text-sm bg-black/40 text-white px-3 py-1 rounded-full border border-white/10">
              Difficulty: {problem.difficulty}
            </span>
            {isAdmin && (
              <div className="flex gap-3">
                <button onClick={() => navigate(`/edit-problem/${id}`)} className="run-btn text-xs px-4 py-2">Edit</button>
                <button onClick={handleDelete} className="run-btn text-xs px-4 py-2">Delete</button>
              </div>
            )}
          </div>
        </div>

        {/* AI tools */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-md">
            <h2 className="text-xl font-semibold mb-2">🧠 Ask AI to Simplify</h2>
            <p className="text-sm text-gray-300 mb-4">
              This feature helps break down the problem into simpler language so you can understand it more easily.
            </p>
            <button onClick={handleVisualSimplify} className="run-btn w-50% text-sm px-4 py-2">Try Simplifying</button>
          </div>

          <div className="p-6 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-md">
            <h2 className="text-xl font-semibold mb-2">🎯 Guess Output</h2>
            <p className="text-sm text-gray-300 mb-4">
              The AI will guess the output for a sample input and help you validate your logic.
            </p>
            <button className="run-btn w-50% text-sm px-4 py-2">Try Guessing</button>
          </div>
        </div>

        {/* Problem details */}
        <div className="p-6 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-md space-y-6 text-sm text-white/90 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold mb-1">Description</h2>
            <pre className="bg-black/40 border border-white/10 rounded p-4 font-mono text-white/80 whitespace-pre-wrap">
              {problem.description}
            </pre>
          </div>

          {problem.inputFormat && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Input Format</h2>
              <div className="bg-black/40 border border-white/10 rounded p-4 font-mono whitespace-pre-wrap">{problem.inputFormat}</div>
            </div>
          )}

          {problem.outputFormat && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Output Format</h2>
              <div className="bg-black/40 border border-white/10 rounded p-4 font-mono whitespace-pre-wrap">{problem.outputFormat}</div>
            </div>
          )}

          {problem.constraints?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Constraints</h2>
              <div className="bg-black/40 border border-white/10 rounded p-4 font-mono whitespace-pre-wrap">
                {problem.constraints.map((c) => `• ${c}`).join("\n")}
              </div>
            </div>
          )}

          {problem.examples?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Examples</h2>
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="bg-black/40 border border-white/10 rounded p-4 font-mono text-sm mb-4">
                  <p><span className="text-white font-semibold">Input:</span> {ex.input}</p>
                  <p><span className="text-white font-semibold">Output:</span> {ex.output}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Solve now */}
        <div className="flex justify-center">
          <button onClick={() => navigate(`/solve/${id}`)} className="run-btn text-sm px-6 py-3 mt-2">Solve Now</button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black p-6 rounded-xl max-w-xl w-full relative max-h-[90vh] overflow-y-auto custom-scroll">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-4 text-xl font-bold">×</button>
            <h3 className="text-xl font-bold mb-4 text-center">🧠 AI Simplified View</h3>
            {loadingVisual && <p>Loading visual explanation...</p>}
            {visualError && <p className="text-red-600">{visualError}</p>}
            {visualData && (
              <div className="space-y-4">
                <div
                  className="prose prose-sm max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: (visualData.explanation || "")
                      .replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
                      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
                      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
                      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
                      .replace(/`([^`]+)`/gim, "<code>$1</code>")
                      .replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

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
          background: rgba(0,0,0,0.3);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
