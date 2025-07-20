import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  PuzzlePieceIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const features = [
  { icon: PuzzlePieceIcon, label: 'Find Next Best Problem' },
  { icon: ChatBubbleBottomCenterTextIcon, label: 'Chat with our DSA Guru' },
  { icon: ChartBarIcon, label: 'Evaluate Your Rating' },
  { icon: LightBulbIcon, label: 'Personalized Feedback' },
];

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg"
        variants={buttonVariants}
        initial="pulse"
        animate="pulse"
        whileHover="hover"
        whileTap="tap"
        aria-label="Toggle AI Assistant Panel"
        aria-expanded={open}
      >
        <SparklesIcon className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-16 right-0 w-72 bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-purple-300">AI Assistant</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-lg px-2"
              >
                ×
              </button>
            </div>
            <ul className="space-y-2">
              {features.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-purple-400" />
                      <span className="text-sm text-white">{item.label}</span>
                    </div>
                    <span className="text-xs text-pink-400 bg-pink-400/10 px-2 py-1 rounded-full text-center">
                      Coming Soon
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
