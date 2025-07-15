import { motion } from "framer-motion";
import { Lightbulb, Brain, LineChart } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function WhyKickDSA() {
  const benefits = [
    {
      title: "Built for Beginners",
      desc: "KickDSA is tailored to absolute beginners. We focus on clarity, not complexity.",
      icon: <Lightbulb className="h-7 w-7 text-[#d220ff] drop-shadow" />,
    },
    {
      title: "AI That Feels Like a Mentor",
      desc: "No more robotic replies — our AI explains concepts like a real tutor would.",
      icon: <Brain className="h-7 w-7 text-[#d220ff] drop-shadow" />,
    },
    {
      title: "Track Your Growth",
      desc: "We visualize your progress and reward consistency with streaks and levels.",
      icon: <LineChart className="h-7 w-7 text-[#d220ff] drop-shadow" />,
    },
  ];

  return (
    <section className="bg-[#0c0a10] text-white py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Left: Infographic */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-20 text-center lg:text-left">
            <span className="gradient-text">Why KickDSA?</span>
          </h2>

          <motion.div
            className="space-y-16"
            initial="hidden"
            whileInView="show"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            {benefits.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex items-start gap-6 md:gap-10"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="shrink-0 bg-[#d220ff]/15 p-4 rounded-full shadow-md transition-transform"
                >
                  {item.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 gradient-text">
                    {item.title}
                  </h3>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: AI Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex-1"
        >
          <img
            src="/assets/howItWorks.png"
            alt="AI Illustration"
            className="w-full max-w-md mx-auto lg:mx-0 rounded-xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
