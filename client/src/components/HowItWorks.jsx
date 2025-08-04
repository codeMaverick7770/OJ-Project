import React from "react";
import { motion } from "framer-motion";
import { MessageCircleQuestion, ListTodo, BarChart4, ChevronRight, Sparkles } from "lucide-react";

const FeatureCard = ({ title, description, icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative bg-[#141219] rounded-xl p-8 border border-[#d220ff]/20 shadow-lg overflow-hidden h-full"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d220ff]/10 to-[#7286ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-[#d220ff]/20 to-[#7286ff]/20 group-hover:from-[#d220ff]/30 group-hover:to-[#7286ff]/30 transition-colors duration-300">
            {React.cloneElement(icon, {
              className: "h-6 w-6 text-[#d220ff] group-hover:text-[#7286ff] transition-colors duration-300"
            })}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-2 rounded-full bg-[#d220ff]/20 group-hover:bg-[#7286ff]/20 transition-colors duration-300"
          >
            <ChevronRight className="h-5 w-5 text-[#d220ff] group-hover:text-[#7286ff] transition-colors duration-300" />
          </motion.div>
        </div>

        <h3 className="text-xl font-bold gradient-text mb-3 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
          {description}
        </p>

        {/* Hover effect - additional info */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          whileHover={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 overflow-hidden border-t border-[#d220ff]/20"
        >
          <p className="text-sm text-[#d220ff] flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{
              index === 0 ? "Ask unlimited questions" :
              index === 1 ? "500+ curated problems" :
              "Real-time progress tracking"
            }</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Learning",
      description: "Get instant, beginner-friendly explanations for any DSA concept from our advanced AI mentor.",
      icon: <MessageCircleQuestion />,
    },
    {
      title: "Curated Problem Sets",
      description: "Solve hand-picked problems tailored to your skill level with our intelligent problem recommendation system.",
      icon: <ListTodo />,
    },
    {
      title: "Progress Analytics",
      description: "Track your growth with detailed analytics, visual charts, and achievement streaks to keep you motivated.",
      icon: <BarChart4 />,
    },
  ];

  return (
    <section className="bg-[#0c0a10] text-white py-24 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#d220ff]/10 blur-3xl -translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#7286ff]/10 blur-3xl translate-x-20 translate-y-20" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-[#7286ff] to-[#d220ff] bg-clip-text text-transparent">
            Supercharge Your Learning
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-gray-300 max-w-3xl mx-auto mb-16"
        >
          KickDSA provides everything you need to master Data Structures and Algorithms with confidence and clarity.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>

        {/* Decorative divider */}
        <div className="mt-20 flex justify-center">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="h-px bg-gradient-to-r from-transparent via-[#d220ff] to-transparent w-full max-w-2xl"
          />
        </div>
      </div>
    </section>
  );
}
