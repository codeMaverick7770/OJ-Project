import { motion } from "framer-motion";
import { MessageCircleQuestion, ListTodo, BarChart4 } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Ask AI Doubts",
      desc: "Stuck on a concept? Ask our AI for instant, beginner-friendly explanations.",
      icon: <MessageCircleQuestion className="h-6 w-6 text-white" />,
    },
    {
      title: "Solve DSA Problems",
      desc: "Practice hand-picked problems tailored to your level and learn by doing.",
      icon: <ListTodo className="h-6 w-6 text-white" />,
    },
    {
      title: "Track Progress",
      desc: "See your growth with a live dashboard and earn streaks for consistency.",
      icon: <BarChart4 className="h-6 w-6 text-white" />,
    },
  ];

  return (
    <section className="bg-[#0c0a10] text-white py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-16">
          How <span className="gradient-text">KickDSA</span> Helps You Grow
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group relative rounded-2xl p-[2px] bg-gradient-to-br from-[#f64f59] via-[#c471ed] to-[#12c2e9] shadow-[0_0_24px_#9333ea66] hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Glowing left vertical line */}
              <div className="absolute top-4 bottom-4 left-0 w-[4px] bg-gradient-to-b from-[#f64f59] via-[#c471ed] to-[#12c2e9] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="bg-[#0c0a10] rounded-[inherit] p-6 h-full flex flex-col items-start relative z-10">
                <div className="bg-white/10 p-4 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold gradient-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gradient text styling */}
      <style>{`
        .gradient-text {
          background: linear-gradient(270deg, #12C2E9 0%, #c471ed 50%, #f64f59 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}
