import React from "react";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import burnHeart from "../assets/burnHeart.json";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function MessageFromDevelopers() {
  return (
    <section className="relative min-h-screen px-6 md:px-20 py-20 bg-[#0c0a10] text-white overflow-hidden">
      {/* Side fades */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0c0a10] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0c0a10] to-transparent z-10" />

      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.25 } } }}
      >
        {/* Left: Lottie */}
        <motion.div
          className="w-full flex items-center justify-center"
          variants={fadeUp}
        >
          <Player
            autoplay
            loop
            src={burnHeart}
            style={{ height: "280px", width: "280px" }}
            speed={1}
          />
        </motion.div>

        {/* Right: Text */}
        <div className="space-y-6">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-center md:text-left text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-md"
            variants={fadeUp}
          >
            From the Developers
          </motion.h2>

          <motion.div variants={fadeUp}>
            <div className="group relative rounded-2xl p-[2px] bg-gradient-to-br from-[#f64f59] via-[#c471ed] to-[#12c2e9] shadow-[0_0_24px_#9333ea66] hover:scale-[1.01] transition duration-300">
              <div className="bg-[#0c0a10] rounded-[inherit] p-6 h-full">
                <p className="text-white/80 leading-relaxed mb-4">
                  You’ve probably heard it all before – “start with arrays,” “consistency is key,”
                  “just follow XYZ roadmap.” But the truth is, for beginners, starting DSA feels overwhelming.
                  We’ve seen friends give up not because they lacked talent, but because they lacked guidance.
                </p>
                <p className="text-white/70 leading-relaxed mb-4">
                  KickDSA was born from our own frustrations. We wanted to build something we wish we had — a
                  platform that simplifies your journey, gives you just the right resources at the right time,
                  and helps you stay consistent without burning out.
                </p>
                <p className="text-white/70 font-semibold mb-4">
                  Our mission? Make you fall in love with solving problems. Not just for interviews — but for
                  the sheer joy of logic, creation, and growth.
                </p>
                <p className="text-pink-400 font-bold italic text-sm pt-4">
                  — The kickDSA Team
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
