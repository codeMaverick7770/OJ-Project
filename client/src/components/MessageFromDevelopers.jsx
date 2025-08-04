import React from "react";
import { motion } from "framer-motion";
import { Heart, Quote, Sparkles, Users, Lightbulb, Code } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// ✅ Fixed JSX version (removed TypeScript typing)
const StatCard = ({ icon, value, label }) => (
  <motion.div
    variants={itemVariants}
    className="bg-gradient-to-tr from-[#1A1723] to-[#141218] border border-[#d220ff]/25 rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-default"
  >
    <div className="flex justify-center mb-3 text-[#d220ff]">{icon}</div>
    <div className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-[#7286ff] to-[#d220ff] bg-clip-text text-transparent mb-1">
      {value}
    </div>
    <div className="text-gray-400 text-sm font-semibold select-none">{label}</div>
  </motion.div>
);

export default function MessageFromDevelopers() {
  return (
    <section className="relative py-20 px-6 md:px-10 lg:px-16 bg-[#0c0a10] text-white select-none overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-gradient-to-tr from-[#d220ff]/10 to-transparent blur-3xl -translate-x-24 -translate-y-24 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-tr from-[#7286ff]/10 to-transparent blur-3xl translate-x-24 translate-y-24 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold mb-5 bg-gradient-to-r from-[#7286ff] to-[#d220ff] bg-clip-text text-transparent tracking-wide"
          >
            Our Vision
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium"
          >
            A message from the developers who built KickDSA with passion
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: Static Heart Icon and Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center max-w-md mx-auto lg:mx-0"
          >
            <div className="relative p-8 rounded-3xl shadow-xl border border-[#d220ff]/25 bg-gradient-to-br from-[#1c1729] to-[#140f1f] flex justify-center items-center w-[280px] h-[280px]">
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-[#d220ff]/25 blur-2xl animate-pulse" />
              <div className="absolute -bottom-7 -right-6 w-28 h-28 rounded-full bg-[#7286ff]/25 blur-3xl animate-pulse" />

              {/* Static Heart SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="url(#heartGradient)"
                className="w-40 h-40 drop-shadow-[0_0_10px_rgba(210,32,255,0.6)]"
              >
                <defs>
                  <linearGradient
                    id="heartGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#d220ff" />
                    <stop offset="100%" stopColor="#7286ff" />
                  </linearGradient>
                </defs>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 
                  7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3
                  19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>

              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 right-1/2 translate-x-1/2 p-3 bg-gradient-to-br from-[#d220ff]/60 to-[#7286ff]/60 rounded-full shadow-lg"
              >
                <Heart className="h-7 w-7 text-white drop-shadow-md" />
              </motion.div>
            </div>

            {/* Stats Section */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              <StatCard
                icon={<Users className="h-7 w-7" />}
                value="100+"
                label="Active Users"
              />
              <StatCard
                icon={<Lightbulb className="h-7 w-7" />}
                value="500+"
                label="Problems Solved"
              />
              <StatCard
                icon={<Code className="h-7 w-7" />}
                value="95%"
                label="Satisfaction"
              />
              <StatCard
                icon={<Sparkles className="h-7 w-7" />}
                value="24/7"
                label="AI Support"
              />
            </div>
          </motion.div>

          {/* Right: Message Content */}
          <motion.div
            variants={itemVariants}
            className="space-y-10 max-w-xl mx-auto lg:mx-0"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-[#7286ff] to-[#d220ff] p-1 shadow-lg group hover:shadow-[#d220ff]/40 transition-shadow duration-400 ease-in-out">
              <div className="bg-[#141219] rounded-[inherit] p-10 space-y-8 select-text">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-[#d220ff]/20 rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-[#d220ff]/30">
                    <Quote className="h-7 w-7 text-[#d220ff]" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#7286ff] to-[#d220ff] bg-clip-text text-transparent">
                    Our Journey
                  </h3>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
                  className="space-y-6 text-gray-300 font-medium leading-relaxed"
                >
                  <p>
                    <span className="text-[#d220ff] font-semibold">
                      We built KickDSA
                    </span>{" "}
                    because we were frustrated with how difficult it was to start learning DSA. Traditional resources either overwhelm beginners with too much information or don't provide enough guidance when you're stuck.
                  </p>
                  <p>
                    Our platform combines the best of AI assistance with carefully curated learning paths. We focus on building confidence through small wins and consistent practice, not just throwing problems at you.
                  </p>
                  <div className="flex items-center gap-5 p-5 bg-[#1a1723] rounded-xl border border-[#d220ff]/30">
                    <Sparkles className="h-6 w-6 text-[#d220ff] shrink-0" />
                    <p>
                      Every feature in KickDSA exists to solve a specific pain point we experienced during our own DSA journeys.
                    </p>
                  </div>
                  <p className="font-semibold text-[#d220ff] tracking-wide">
                    Our mission is to make you fall in love with solving problems — not just for interviews, but for the sheer joy of logic, creation, and growth.
                  </p>
                </motion.div>

                <div className="flex items-center justify-between pt-6 border-t border-[#d220ff]/30">
                  <div className="flex items-center gap-3 select-none">
                    <div className="w-3 h-3 rounded-full bg-[#d220ff]" />
                    <span className="text-sm text-gray-400 font-medium">
                      Built with passion
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Heart className="h-5 w-5 text-[#d220ff]" />
                    <span className="text-sm text-[#d220ff] font-semibold tracking-wide">
                      The KickDSA Team
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
