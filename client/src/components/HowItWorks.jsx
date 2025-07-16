import { motion } from "framer-motion";
import { MessageCircleQuestion, ListTodo, BarChart4 } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Ask AI Doubts",
      desc: "Stuck on a concept? Ask our AI for instant, beginner-friendly explanations.",
      icon: <MessageCircleQuestion className="h-6 w-6 text-purple-300" />,
    },
    {
      title: "Solve DSA Problems",
      desc: "Practice hand-picked problems tailored to your level and learn by doing.",
      icon: <ListTodo className="h-6 w-6 text-purple-300" />,
    },
    {
      title: "Track Progress",
      desc: "See your growth with a live dashboard and earn streaks for consistency.",
      icon: <BarChart4 className="h-6 w-6 text-purple-300" />,
    },
  ];

  return (
    <section className="bg-[#0c0a10] text-white py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 gradient-text">
          How KickDSA Helps You Grow
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-[#1a1625] rounded-2xl p-6 text-left border border-white/5 shadow-md hover:shadow-purple-500/30 transition-shadow"
            >
              <div className="mb-4">
                <div className="bg-purple-800/30 p-4 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold gradient-text">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Neon Gradient Text Style */}
      <style>{`
        .gradient-text {
          background: linear-gradient(to right, #a855f7, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}
