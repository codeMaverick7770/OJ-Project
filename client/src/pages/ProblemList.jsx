import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext"; // <-- global loading context
import { Link } from "react-router-dom";
import { Search, Filter, ListFilter } from "lucide-react";

const sampleTags = ["Array", "String", "Math", "Greedy", "DP", "Tree", "Graph"];

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    showLoader("Loading problems...");
    API.get("/problem")
      .then((res) => {
        setProblems(res.data.problems);
      })
      .catch(() => {
        setError("Failed to fetch problems");
      })
      .finally(() => {
        hideLoader();
      });
  }, []);

  const handleTagToggle = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/problem/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProblems((prev) => prev.filter((p) => p._id !== id));
      alert("✅ Problem deleted successfully");
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data || err.message);
      alert("Failed to delete problem");
    }
  };

  const difficultyColor = (level) => {
    if (level === "Easy") return "text-green-400";
    if (level === "Medium") return "text-yellow-400";
    if (level === "Hard") return "text-red-500";
    return "text-gray-300";
  };

  const filtered = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTag =
      activeTags.length === 0 ||
      activeTags.some((tag) => problem.tags?.includes(tag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen relative text-white">
      {/* Background Image with Stronger Blur and Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url('/assets/background.jpg')` }}
      />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto pt-28 px-4 pb-20 space-y-12">
        <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text text-white drop-shadow-lg">
          Practice Problems
        </h2>

        {/* Top Buttons */}
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <button className="px-4 py-2 rounded-full bg-black/10 border border-white/20 text-sm font-medium hover:bg-white/20 transition">
            🎯 Beginner Curated
          </button>
          <button className="px-4 py-2 rounded-full bg-black/10 border border-white/20 text-sm font-medium hover:bg-white/20 transition">
            🔥 150 Must Solve
          </button>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {sampleTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                activeTags.includes(tag)
                  ? "bg-purple-600 border-purple-400 text-white"
                  : "bg-white/10 border-black/10 text-gray-300 hover:bg-purple-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search + Tools */}
        <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
          <div className="flex items-center w-full md:w-[60%] relative">
            <Search className="absolute left-3 text-white" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-black/10 border border-white/20 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="flex gap-3">
            <button className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition">
              <ListFilter size={18} />
            </button>
            <button className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Problem List */}
        <div className="space-y-3 mt-4">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-12">
              No problems found.
            </p>
          ) : (
            filtered.map((problem, idx) => (
              <div
                key={problem._id}
                className="flex items-center justify-between bg-black/10 border border-white/15 rounded-lg px-5 py-4 hover:bg-white/5 transition shadow-md backdrop-blur-md"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                  <span className="text-sm text-gray-400 font-mono">
                    #{idx + 1}
                  </span>
                  <Link
                    to={`/problem/${problem._id}`}
                    className="text-lg font-extrabold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent hover:underline drop-shadow-md"
                  >
                    {problem.title}
                  </Link>
                  <div className="flex gap-2 flex-wrap">
                    {problem.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`font-bold text-sm ${difficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                  {user?.role === "admin" && (
                    <>
                      <Link
                        to={`/edit-problem/${problem._id}`}
                        className="text-sm text-yellow-400 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(problem._id)}
                        className="text-sm text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
