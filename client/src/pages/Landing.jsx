import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-[#141219] text-white overflow-hidden flex items-center justify-center px-4">
      <style>{`
        .gradient-flare {
          background: radial-gradient(
            circle,
            rgba(114,134,255,0.25) 0%,
            rgba(254,117,135,0.1) 50%,
            transparent 80%
          );
        }

        .gradient-text {
          background: linear-gradient(90deg, #7286ff, #fe7587);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .neon-btn {
          border-radius: 9999px;
          border: 1.5px solid transparent;
          background:
            linear-gradient(#141219, #141219) padding-box,
            linear-gradient(90deg, #7286ff, #fe7587) border-box;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          color: white;
          position: relative;
          transition: all 0.3s ease;
        }

        .neon-btn:hover {
          background:
            linear-gradient(#2d1d34, #2d1d34) padding-box,
            linear-gradient(90deg, #7286ff, #fe7587) border-box;
          filter: drop-shadow(0 0 8px rgba(114,134,255,0.4));
        }
      `}</style>

      {/* Flare Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[800px] h-[800px] rounded-full blur-3xl gradient-flare" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Kickstart your DSA journey <br />
          <span className="gradient-text">with AI-powered guidance</span><br />
          Solve. Learn. Grow.
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-8">
          Smart feedback, structured learning, and your personal AI tutor — so you never feel stuck again.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {!user ? (
            <>
              <Link to="/register" className="neon-btn">
                Get Started
              </Link>
              <Link
                to="/login"
                className="neon-btn"
              >
                Log In / Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/problems" className="neon-btn">
                Solve Problems
              </Link>
              <Link to="/compiler" className="neon-btn">
                Try Our Compiler
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
