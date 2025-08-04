import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "What makes KickDSA different from other DSA platforms?",
    answer:
      "KickDSA focuses on a beginner-friendly approach with AI-powered personalized hints, curated problem sets, and visual progress tracking, designed to make learning DSA intuitive and engaging, rather than overwhelming.",
  },
  {
    id: 2,
    question: "How does the AI assistant help me learn?",
    answer:
      "Our AI assistant provides instant, context-aware explanations for any DSA concept or problem you are stuck on. It breaks down complex ideas into simple terms, offering guidance without giving away the direct solution.",
  },
  {
    id: 3,
    question: "Are there problems suitable for absolute beginners?",
    answer:
      "Absolutely! KickDSA has a dedicated section of hand-picked problems specifically designed for beginners, gradually increasing in difficulty as you progress. Our intelligent system recommends problems based on your skill level.",
  },
  {
    id: 4,
    question: "Can I track my progress and performance?",
    answer:
      "Yes, KickDSA offers detailed analytics and visual charts to help you monitor your learning journey. You can see your solved problems, performance metrics, and achievement streaks to stay motivated.",
  },
  {
    id: 5,
    question: "Is there a community to interact with?",
    answer:
      "We foster a supportive community where you can connect with other learners, ask questions, share insights, and even participate in coding challenges together. Learning is always better with peers!",
  },
  {
    id: 6,
    question: "What programming languages does KickDSA support?",
    answer:
      "KickDSA primarily supports popular languages like C++, Java, and Python, with plans to expand to more languages in the future. Our platform is designed to be language-agnostic in terms of core DSA concepts.",
  },
];

const contentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const FAQCard = ({ faq, isOpen, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: faq.id * 0.05 }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-[#141219] border border-[#d220ff]/20 rounded-xl shadow-lg overflow-hidden cursor-pointer"
      whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(210,32,255,0.1)" }}
    >
      <button
        className="flex justify-between items-center w-full p-6 md:p-8 text-left focus:outline-none"
        onClick={() => onToggle(faq.id)}
        aria-expanded={isOpen}
        aria-controls={`faq-content-${faq.id}`}
      >
        <h3 className="text-lg md:text-xl font-semibold gradient-text pr-4">
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-6 w-6 text-[#d220ff]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-content-${faq.id}`}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-6 md:px-8 pb-6 md:pb-8"
          >
            <div className="h-px bg-[#d220ff]/20 w-full mb-4" />
            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-[#0c0a10] text-white py-24 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <style>{` 
        .gradient-text {
          background: linear-gradient(90deg, #7286ff, #fe7587);
          -webkit-background-clip: text;
          background-clip: text;
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

      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#d220ff]/10 blur-3xl -translate-x-20 -translate-y-20 z-0 opacity-70" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#7286ff]/10 blur-3xl translate-x-20 translate-y-20 z-0 opacity-70" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#7286ff] to-[#d220ff] bg-clip-text text-transparent"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-gray-300 max-w-3xl mx-auto mb-16"
        >
          Find answers to common questions about KickDSA and how it can help you
          master DSA.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {faqs.map((faq) => (
            <FAQCard
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={handleToggle}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: faqs.length * 0.05 + 0.3 }}
          viewport={{ once: true }}
          className="mt-20 p-8 bg-[#1a1723] rounded-xl border border-[#d220ff]/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-4 text-left">
            <HelpCircle className="h-10 w-10 text-[#7286ff] shrink-0" />
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-2">
                Still have questions?
              </h3>
              <p className="text-gray-300">
                Can't find the answer you're looking for? Reach out to our
                support team.
              </p>
            </div>
          </div>
          <a
            href="/contact"
            className="neon-btn inline-flex items-center group whitespace-nowrap"
          >
            <span className="flex items-center gap-1">
              Contact Support
              <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 inline-block relative top-[1px]" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
