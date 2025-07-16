import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import HowItWorks from "@/components/HowItWorks";
import WhyKickDSA from "@/components/WhyKickDSA";
import CTASection from "../components/CTASection";
import MessageFromDevelopers from "../components/MessageFromDevelopers";

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
      className="text-white bg-[#141219] overflow-x-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/assets/background.jpg")' }}
    >
      <style>{`
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="flare-bg rounded-full" />
        </div>

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
            <span className="gradient-text">AI-powered guidance</span> <br />
            on the most <br />
            <span className="gradient-text">beginner-friendly</span> <br /> Online Judge
          </motion.h1>

          <motion.p
            className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
            custom={1}
          >
            Get smart AI hints, track your learning, and solve real problems<br />
            with support from a growing student community.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            variants={fadeUp}
            custom={2}
          >
            {!user ? (
              <>
                <Link to="/register" className="neon-btn">Start Solving</Link>
                <Link to="/login" className="neon-btn">Join Us</Link>
              </>
            ) : (
              <>
                <Link to="/problems" className="neon-btn">Solve Problems</Link>
                <Link to="/compiler" className="neon-btn">Try the AI Compiler</Link>
              </>
            )}
          </motion.div>

          {/* Avatar Trust Block */}
          {/* Avatar Trust Block with Neon Border */}
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
      <span className="text-[#7286ff] font-bold">100+ coders</span> from{" "}
      <span className="text-pink-400 font-bold">IITs, NITs, IIITs</span> and other top colleges already use KickDSA to accelerate their learning.
    </p>
  </div>
</motion.div>

        </motion.div>
      </section>

      {/* Sections */}
      <HowItWorks />
      <WhyKickDSA />
      <MessageFromDevelopers />
      <CTASection />
    </div>
  );
}
