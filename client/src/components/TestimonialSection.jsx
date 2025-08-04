import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

// Dummy data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Aisha Sharma",
    college: "IIT Bombay",
    quote: "KickDSA helped me finally understand recursion and DP. The hints felt like having a personal mentor.",
    avatar: "https://tse1.mm.bing.net/th/id/OIP.WnpdEenWRqVEwlZig9K_gAHaHa?r=0&w=474&h=474&c=7", // female
    rating: 5,
  },
  {
    id: 2,
    name: "Rohan Kumar",
    college: "NIT Warangal",
    quote: "I used to skip practice, but the streak tracker kept me consistent. Solving daily has become a habit.",
    avatar: "https://tse3.mm.bing.net/th/id/OIP.NBtNewMtUI86TwtlsJbK0wHaE7?r=0&w=315&h=315&c=7", // male
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Singh",
    college: "IIIT Bangalore",
    quote: "The UI is super clean and beginner-friendly. Loved how each concept builds on the previous one.",
    avatar: "https://tse3.mm.bing.net/th/id/OIP.2GNqC7O3Y3F74oM2vbTHlgHaHa?r=0&w=474&h=474&c=7", // female
    rating: 4,
  },
  {
    id: 4,
    name: "Amit Patel",
    college: "Delhi Technological University",
    quote: "The AI compiler actually explains my mistakes. That alone made debugging 10x easier.",
    avatar: "https://tse2.mm.bing.net/th/id/OIP.OUsayBc4Az9o8DTjR9BR2gHaHa?r=0&w=474&h=474&c=7", // male
    rating: 5,
  },
  {
    id: 5,
    name: "Neha Gupta",
    college: "BITS Pilani",
    quote: "KickDSA didn’t overwhelm me like other sites. It felt like a roadmap, not a jungle.",
    avatar: "https://tse2.mm.bing.net/th/id/OIP.xXRo_NNJ3Mvw2lMbqTgDVgHaE8?r=0&w=316&h=316&c=7", // female
    rating: 4,
  },
  {
    id: 6,
    name: "Vijay Shankar",
    college: "VIT Vellore",
    quote: "The leaderboard and contests kept things exciting. It’s not just learning — it’s fun.",
    avatar: "https://tse3.mm.bing.net/th/id/OIP.g2pWqg2-xc6-MlW7sY9rcQHaLH?r=0&w=474&h=474&c=7", // male
    rating: 5,
  },
];





// Framer Motion animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Testimonial Card component
const TestimonialCard = ({ testimonial, index }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }`}
      />
    ));
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#141219] border border-[#d220ff]/20 rounded-xl p-6 md:p-8 shadow-lg hover:shadow-xl hover:shadow-[#d220ff]/10 transition-all duration-300 ease-in-out h-full flex flex-col justify-between"
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div>
        <div className="flex items-center mb-6">
          {/* Avatar Placeholder */}
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#d220ff]/40 shadow-inner mr-4"
          />

          <div>
            <h4 className="text-lg font-bold gradient-text">
              {testimonial.name}
            </h4>
            <p className="text-sm text-gray-400">{testimonial.college}</p>
          </div>
        </div>
        <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
        <Quote className="h-6 w-6 text-[#d220ff] mb-4 opacity-70" />
        <p className="text-gray-300 leading-relaxed italic mb-4">
          "{testimonial.quote}"
        </p>
      </div>
    </motion.div>
  );
};

// Main Testimonials Section component
const TestimonialsSection = () => {
  return (
    <section className="bg-[#0c0a10] text-white py-24 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      {/* Essential CSS for consistency with the existing design */}
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

      {/* Animated background elements - similar to other sections */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#7286ff]/10 blur-3xl translate-x-32 -translate-y-32 z-0 opacity-70" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#d220ff]/10 blur-3xl -translate-x-24 translate-y-24 z-0 opacity-70" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#7286ff] to-[#d220ff] bg-clip-text text-transparent"
        >
          Hear From Our Learners
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-gray-300 max-w-3xl mx-auto mb-16"
        >
          Real experiences and success stories from students who mastered Data
          Structures and Algorithms with KickDSA.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="show"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </motion.div>

        {/* Call to action at the bottom of the section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: testimonials.length * 0.1 + 0.3 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <p className="text-lg text-gray-300 mb-6">
            Ready to start your own success story?
          </p>
          <a
            href="/register" // Assuming a registration route exists
            className="neon-btn inline-flex items-center group"
          >
            Join KickDSA Today
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
