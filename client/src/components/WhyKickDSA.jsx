import { motion } from "framer-motion";
import { Lightbulb, Brain, LineChart, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

// Animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const BenefitCard = ({ title, desc, icon, index, isExpanded, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className={`bg-[#141219] border border-[#d220ff]/20 rounded-xl p-6 transition-all duration-300 overflow-hidden ${
        isExpanded ? "shadow-xl shadow-[#d220ff]/20" : "shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start gap-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="shrink-0 p-4 rounded-full"
          style={{
            background: isHovered
              ? "linear-gradient(135deg, rgba(210,32,255,0.2) 0%, rgba(114,134,255,0.2) 100%)"
              : "rgba(210,32,255,0.1)",
            boxShadow: isHovered
              ? "0 0 15px rgba(210,32,255,0.3)"
              : "none"
          }}
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold gradient-text">
              {title}
            </h3>
            <button
              onClick={() => onToggle(index)}
              className={`p-1 rounded-full transition-colors ${
                isExpanded ? "bg-[#d220ff]/20" : "bg-transparent hover:bg-[#d220ff]/10"
              }`}
              aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
            >
              <ChevronRight
                className={`h-4 w-4 text-[#d220ff] transition-transform ${
                  isExpanded ? "transform rotate-90" : ""
                }`}
              />
            </button>
          </div>
          <p className="text-gray-300 mt-2">{desc}</p>
        </div>
      </div>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-[#d220ff]/20"
        >
          <p className="text-[#d220ff] text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{
              index === 0
                ? "This feature helps you learn 2.5x faster"
                : index === 1
                ? "Students report 40% better understanding"
                : "Track your growth with detailed metrics"
            }</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function WhyKickDSA() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const benefits = [
    {
      title: "Built for Beginners",
      desc: "KickDSA is specifically designed for absolute beginners with a focus on clarity and gradual progression.",
      icon: <Lightbulb className="h-7 w-7 text-[#d220ff]" />,      
    },
    {
      title: "AI That Feels Human",
      desc: "Our advanced AI provides explanations that feel like they're coming from a real mentor, not a robot.",
      icon: <Brain className="h-7 w-7 text-[#d220ff]" />,      
    },
    {
      title: "Visual Progress Tracking",
      desc: "We help you visualize your progress with comprehensive analytics and rewarding streaks.",
      icon: <LineChart className="h-7 w-7 text-[#d220ff]" />,      
    },
  ];

  return (
    <section className="bg-[#0c0a10] text-white py-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            <span className="gradient-text">Why Choose KickDSA?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            KickDSA isn't just another coding platform - it's a complete learning ecosystem designed to help beginners master DSA with confidence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2"
            initial="hidden"
            whileInView="show"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {benefits.map((item, idx) => (
              <div key={idx} className="mb-6">
                <BenefitCard
                  title={item.title}
                  desc={item.desc}
                  icon={item.icon}
                  index={idx}
                  isExpanded={expandedIndex === idx}
                  onToggle={(index) => setExpandedIndex(expandedIndex === index ? null : index)}
                />
              </div>
            ))}
          </motion.div>

          <div className="lg:col-span-1 lg:pl-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-[#1a1723] to-[#0c0a10] border border-[#d220ff]/20 rounded-xl p-8 shadow-xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#d220ff]/10 blur-2xl -mr-8 -mt-8" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#7286ff]/10 blur-3xl -ml-16 -mb-16" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-[#d220ff]/20 rounded-full">
                    <Sparkles className="h-6 w-6 text-[#d220ff]" />
                  </div>
                  <h3 className="text-2xl font-bold gradient-text">Our Impact</h3>
                </div>

                <div className="space-y-6">
                  {[
                    { value: "2.5x", label: "Faster Learning" },
                    { value: "40%", label: "Better Understanding" },
                    { value: "92%", label: "Student Satisfaction" },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                      viewport={{ once: true }}
                      className="p-4 bg-[#141219] rounded-lg border border-[#d220ff]/20"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                          <p className="text-gray-400">{stat.label}</p>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="p-2 bg-[#d220ff]/20 rounded-full"
                        >
                          <ArrowRight className="h-5 w-5 text-[#d220ff]" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
