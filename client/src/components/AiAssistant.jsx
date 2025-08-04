import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, MessageSquare, Lightbulb, BarChart3, Brain } from 'lucide-react';

const AiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  
  const features = [
    { 
      id: 'problems', 
      title: 'Problem Finder', 
      description: 'Find next best problems based on your skill level and progress',
      icon: <Brain className="w-5 h-5 text-purple-400" />
    },
    { 
      id: 'chat', 
      title: 'DSA Guru', 
      description: 'Chat with our AI assistant for instant help on any DSA topic',
      icon: <MessageSquare className="w-5 h-5 text-blue-400" />
    },
    { 
      id: 'analytics', 
      title: 'Rating Evaluator', 
      description: 'Evaluate your current DSA skills and track improvement over time',
      icon: <BarChart3 className="w-5 h-5 text-pink-400" />
    },
    { 
      id: 'feedback', 
      title: 'Feedback', 
      description: 'Get personalized feedback on your solutions and approaches',
      icon: <Lightbulb className="w-5 h-5 text-yellow-400" />
    },
  ];

  const chatMessages = [
    { 
      id: 1, 
      text: "I'm struggling with understanding time complexity for sorting algorithms.", 
      sender: 'user' 
    },
    { 
      id: 2, 
      text: "Sure! Time complexity measures how the runtime grows with input size. For sorting: QuickSort is O(n log n) average case, BubbleSort is O(n²). Would you like me to explain one in detail?", 
      sender: 'ai', 
      timestamp: '2 mins ago'
    },
    { 
      id: 3, 
      text: "Yes, please explain QuickSort step by step.", 
      sender: 'user' 
    },
    { 
      id: 4, 
      text: "QuickSort uses divide-and-conquer: 1) Pick a pivot element, 2) Partition the array so elements smaller than pivot come first, 3) Recursively sort the partitions. The key is the partitioning step.", 
      sender: 'ai', 
      timestamp: '1 min ago'
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* AI Assistant Button */}
      <motion.div 
        onClick={() => setOpen(!open)}
        className="cursor-pointer w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={open ? "pulse" : "idle"}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-75" />
          <div className="relative w-16 h-16 bg-[#0f0d14] rounded-full flex items-center justify-center border border-purple-500/30">
            <motion.div 
              animate={{ 
                rotate: open ? [0, 5, -5, 0] : [0, 0],
                scale: open ? 1.1 : 1
              }}
              transition={{ 
                duration: 2, 
                repeat: open ? Infinity : 0,
                repeatType: "reverse" 
              }}
            >
              <Bot className="w-8 h-8 text-purple-400" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80 bg-black/60 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-bold text-white">AI Assistant</h3>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button 
                onClick={() => setActiveTab('features')}
                className={`flex-1 py-3 text-center ${activeTab === 'features' ? 'text-purple-400 font-medium' : 'text-gray-400'}`}
              >
                Features
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-center ${activeTab === 'chat' ? 'text-purple-400 font-medium' : 'text-gray-400'}`}
              >
                Chat
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {activeTab === 'features' && (
                <div className="space-y-3">
                  {features.map((feature) => (
                    <motion.div 
                      key={feature.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                      }}
                      className="p-3 rounded-xl border border-white/10 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{feature.title}</h4>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="mt-4 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/30">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-medium">Premium Features</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Unlock advanced analytics, personalized paths, and unlimited AI queries with KickDSA Pro.</p>
                    <button className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-medium">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'chat' && (
                <div className="space-y-4">
                  <div className="h-72 overflow-y-auto space-y-4 pr-2">
                    {chatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl p-3 ${message.sender === 'user' ? 'bg-gradient-to-r from-purple-600/40 to-blue-600/40 rounded-br-none' : 'bg-[#1a1723] rounded-bl-none'}`}>
                          {message.sender === 'ai' && (
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 text-purple-400">
                                <Bot className="w-4 h-4" />
                              </div>
                              <p className="text-gray-300">{message.text}</p>
                              <span className="text-xs text-gray-500 ml-auto">{message.timestamp}</span>
                            </div>
                          )}
                          {message.sender === 'user' && (
                            <p className="text-white">{message.text}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask me anything about DSA..."
                      className="flex-1 bg-[#1a1723] border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Status */}
            <div className="p-3 bg-[#1a1723] border-t border-white/10 flex items-center gap-2 text-sm text-gray-400">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span>AI Assistant Active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiAssistant;