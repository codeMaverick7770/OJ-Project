import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import HowItWorks from "@/components/HowItWorks";
import WhyKickDSA from "@/components/WhyKickDSA";
import CTASection from "../components/CTASection";
import MessageFromDevelopers from "../components/MessageFromDevelopers";
import AIAssistant from "@/components/AiAssistant";

export default function Landing() {
  const { user } = useAuth();

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div
      className="relative text-white bg-[#141219] overflow-x-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/assets/background.jpg")' }}
    >
      {/* 🎯 Grid Background Only in Hero with Vertical Fade */}
      <style>{`
        @keyframes text-gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .text-gradient-animation {
          background: linear-gradient(270deg, #12C2E9 0%, #c471ed 50%, #f64f59 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-gradient-animation 8s ease-in-out infinite;
        }

        .flare-bg {
          background: radial-gradient(
            40% 40% at 50% 55%,
            rgba(210,32,255,0.45) 0%,
            rgba(210,32,255,0.1) 40%,
            transparent 80%
          );
          width: 650px;
          height: 650px;
          filter: blur(70px);
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
          transition: all 0.3s ease;
        }

        .neon-btn:hover {
          background:
            linear-gradient(#2d1d34, #2d1d34) padding-box,
            linear-gradient(90deg, #7286ff, #fe7587) border-box;
          filter: drop-shadow(0 0 8px rgba(114,134,255,0.4));
        }
      `}</style>

      {/* 🟪 Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 z-10">
        {/* Grid Background with fade effect */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="w-full h-full relative"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(220, 220, 240, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(220, 220, 240, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: "70px 70px", // 🆙 Slightly bigger grid
              mixBlendMode: "overlay",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(20,18,25,0) 40%, rgba(20,18,25,1) 100%)",
              }}
            />
            {/* Extra fade around center text */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(20,18,25,0) 20%, rgba(20,18,25,0.3) 50%, rgba(20,18,25,0.8) 80%)",
              }}
            />
          </div>
        </div>


        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center max-w-3xl"
          initial="hidden"
          animate="show"
        >
          <motion.h1
            className="text-[2.75rem] md:text-[3.5rem] font-extrabold leading-[1] mb-5"
            variants={fadeUp}
            custom={0}
          >
            Master DSA with <br />
            <span className="text-gradient-animation">AI-powered guidance</span> <br />
            on the most <br />
            <span className="text-gradient-animation">beginner-friendly</span> <br />
            Online Judge
          </motion.h1>

          <motion.p
            className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
            custom={1}
          >
            Get smart AI hints, track your learning, and solve real problems
            <br />
            with support from a growing student community.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            variants={fadeUp}
            custom={2}
          >
            {!user ? (
              <>
                <Link to="/register" className="neon-btn">
                  Start Solving
                </Link>
                <Link to="/login" className="neon-btn">
                  Join Us
                </Link>
              </>
            ) : (
              <>
                <Link to="/problems" className="neon-btn">
                  Solve Problems
                </Link>
                <Link to="/compiler" className="neon-btn">
                  Try the AI Compiler
                </Link>
              </>
            )}
          </motion.div>

          <motion.div
            className="mt-10 mx-auto w-full max-w-xl px-[2px] py-[2px] bg-gradient-to-r from-[#7286ff] to-[#fe7587] rounded-2xl shadow-2xl"
            variants={fadeUp}
            custom={3}
          >
            <div className="w-full bg-[#1a1723]/90 backdrop-blur-lg rounded-xl border border-white/10 px-6 py-4 flex flex-col items-center gap-4">
              <div className="flex -space-x-4 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`/assets/users/user${i}.jpg`}
                    alt={`User ${i}`}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md"
                  />
                ))}
              </div>
              <p className="text-sm text-white/80 font-medium text-center">
                <span className="text-[#7286ff] font-bold">100+ coders</span>{" "}
                from{" "}
                <span className="text-pink-400 font-bold">
                  IITs, NITs, IIITs
                </span>{" "}
                and other top colleges already use KickDSA to accelerate their
                learning.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* AI Assistant Animation Only for Landing */}
        <div className="absolute bottom-6 right-6 z-20">
          <AIAssistant />
        </div>
      </section>

      {/* 🔗 Other Sections */}
      <HowItWorks />
      <WhyKickDSA />
      <MessageFromDevelopers />
      <CTASection />
    </div>
  );
}
