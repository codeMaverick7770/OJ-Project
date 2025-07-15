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
    <div className="text-white bg-[#141219] overflow-x-hidden">
      <style>{`
        .flare-bg {
          background: radial-gradient(
            40% 40% at 50% 55%,
            rgba(210,32,255,0.55) 0%,
            rgba(210,32,255,0.2) 40%,
            transparent 80%
          );
          width: 650px;
          height: 650px;
          filter: blur(70px);
        }

        .gradient-text {
          background: linear-gradient(90deg, #7286ff 11%, #fe7587);
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
        {/* Flare BG */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="flare-bg rounded-full" />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center max-w-3xl"
          initial="hidden"
          animate="show"
        >
          <motion.h1
            className="text-[2.75rem] md:text-[3.5rem] font-extrabold leading-[1.2] mb-5"
            variants={fadeUp}
            custom={0}
          >
            Kickstart your DSA journey<br />
            <span className="gradient-text">with AI-powered guidance</span><br />
            Solve. Learn. Grow.
          </motion.h1>

          <motion.p
            className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
            custom={1}
          >
            Smart feedback, structured learning, and your personal AI tutor — so you never feel stuck again.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            variants={fadeUp}
            custom={2}
          >
            {!user ? (
              <>
                <Link to="/register" className="neon-btn">Get Started</Link>
                <Link to="/login" className="neon-btn">Log In / Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/problems" className="neon-btn">Solve Problems</Link>
                <Link to="/compiler" className="neon-btn">Try Our Compiler</Link>
              </>
            )}
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
