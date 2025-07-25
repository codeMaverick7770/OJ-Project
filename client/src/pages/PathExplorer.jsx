import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GlobalLoader from "../components/GlobalLoader";

const learningPaths = [
  {
    name: "Striver’s A2Z Sheet",
    creator: "takeUforward",
    language: "C++",
    link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
    highlights: [
      "Structured A-Z roadmap for beginners",
      "Covers all major DSA topics",
      "Follows C++ implementation",
      "English-only explanation videos",
    ],
    image: "/assets/paths/striver.jpeg",
  },
  {
    name: "NeetCode 150",
    creator: "NeetCode",
    language: "Multiple (Python, Java, C++)",
    link: "https://neetcode.io/",
    highlights: [
      "Great for Leetcode-style problems",
      "Categorized by topic & difficulty",
      "Beginner-friendly videos",
      "Strong community discussion",
    ],
    image: "/assets/paths/neetcode.jpg",
  },
  {
    name: "Love Babbar Sheet",
    creator: "Love Babbar",
    language: "C++",
    link: "https://drive.google.com/file/d/1rDJ7jYF3LkqYoNK9WZufk3kriJ0q4o45/view",
    highlights: [
      "High-quality handpicked questions",
      "Well-balanced for 90-day prep",
      "Video explanations in Hindi",
    ],
    image: "/assets/paths/lovebabbar.jpeg",
  },
  {
    name: "Apna College Playlist",
    creator: "Apna College",
    language: "Java",
    link: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ",
    highlights: [
      "Beginner-friendly DSA course",
      "Taught in Hindi",
      "Good pacing for absolute beginners",
    ],
    image: "/assets/paths/apnacollege.webp",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function PathExplorer() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (e.g., data fetch or transition)
    const timer = setTimeout(() => setLoading(false), 1000); // simulate 1s delay
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <GlobalLoader />;
  return (
    <div
      className="pt-24 px-6 md:px-16 pb-16 min-h-screen text-white bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/background.jpg')",
        backgroundColor: "#141219",
      }}
    >
      <div className="backdrop-blur-md bg-black/60 border border-white/20 rounded-xl px-4 md:px-8 py-12 shadow-lg">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-6"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          Explore DSA Paths
        </motion.h2>

        <motion.p
          className="text-center text-gray-300 max-w-2xl mx-auto mb-12"
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={1}
        >
          We’ve curated the best DSA roadmaps from the internet. Pick your
          favorite creator, and follow their structured playlist. We’ll soon add
          personalized tracking, AI hints, and progress analytics to help you
          stay on track.
        </motion.p>

        <div className="grid gap-8 md:grid-cols-2">
          {learningPaths.map((path, i) => (
            <motion.div
              key={path.name}
              className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/20 transition"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={i + 2}
            >
              <img
                src={path.image}
                alt={path.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold gradient-text mb-2">
                  {path.name}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  by{" "}
                  <span className="text-white font-medium">{path.creator}</span>
                </p>
                <ul className="list-disc ml-5 text-gray-300 text-sm space-y-1 mb-4">
                  {path.highlights.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>

                <div className="flex justify-between items-center">
                  <a
                    href={path.link}
                    target="_blank"
                    rel="noreferrer"
                    className="neon-btn text-sm"
                  >
                    View Playlist
                  </a>
                  <span className="text-pink-500 text-xs font-semibold">
                    🔒 Progress tracking — Coming Soon
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
