import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ add this

export default function Landing() {
  const { user } = useAuth(); // ✅ use auth context

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <style>{`
        @keyframes moveStars {
          from { background-position: 0 0; }
          to { background-position: -10000px 5000px; }
        }
        @keyframes moveTwinkle {
          from { background-position: 0 0; }
          to { background-position: 10000px 10000px; }
        }
        @keyframes float {
          0% { transform: translate(0, 0); }
          25% { transform: translate(80px, -60px); }
          50% { transform: translate(-80px, 80px); }
          75% { transform: translate(-120px, -120px); }
          100% { transform: translate(120px, 120px); }
        }
        .floating {
          animation: float 12s linear infinite;
          animation-delay: calc(var(--delay) * -1s);
        }
        .glow-hover:hover {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
        }
        .glass {
          background: rgba(47, 47, 47, 0.4);
          backdrop-filter: blur(8px);
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: box-shadow 0.3s ease;
        }
        .glass:hover {
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.15);
        }
        .grid-background {
          background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.2;
        }
      `}</style>

      {/* Star & Twinkle Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "url('/assets/stars.png')",
            backgroundSize: "300px 300px",
            backgroundRepeat: "repeat",
            animation: "moveStars 100s linear infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/assets/twinkling.png')",
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
            animation: "moveTwinkle 200s linear infinite",
          }}
        />
        <div className="absolute inset-0 grid-background"></div>
      </div>

      {/* Floating Logos */}
      <div className="absolute inset-0 z-0">
        {[
          { src: "/assets/cpp.png", top: "10%", left: "15%", delay: 0 },
          { src: "/assets/java.png", top: "30%", left: "70%", delay: 1 },
          { src: "/assets/python.png", top: "60%", left: "20%", delay: 2 },
          { src: "/assets/ai-bot.png", top: "80%", left: "85%", delay: 3 },
        ].map((icon, idx) => (
          <div
            key={idx}
            className="absolute w-20 h-20 floating rounded-xl border border-white/10 bg-[#2f2f2f]/40 backdrop-blur-md"
            style={{ top: icon.top, left: icon.left, "--delay": icon.delay }}
          >
            <img src={icon.src} alt="" className="w-full h-full object-contain p-2" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Practice, Compete & Learn <br />
          with{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            JustiCode
          </span>
        </h1>
        <p className="mt-4 text-gray-300 text-lg max-w-2xl">
          JustiCode helps you solve coding problems with intelligent test cases,
          real-time feedback, and AI-powered learning.
        </p>

        <div className="mt-6 flex gap-4 flex-wrap justify-center">
          {!user ? (
            <>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-6 rounded hover:brightness-110 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-white text-white font-semibold py-2 px-6 rounded hover:bg-white hover:text-black transition"
              >
                Log In / Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/problems"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded hover:brightness-110 transition"
              >
                Solve Problems
              </Link>
              <Link
                to="/compiler"
                className="border border-white text-white font-semibold py-2 px-6 rounded hover:bg-white hover:text-black transition"
              >
                Try Our Compiler
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
