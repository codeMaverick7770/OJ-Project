import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Add this import

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 py-16 px-6 md:px-12 rounded-xl mx-4 md:mx-20 my-24 shadow-lg relative overflow-hidden">
      {/* Background Icons (Optional Decorative) */}
      <div className="absolute left-6 top-6 opacity-10">
        <img
          src="/assets/cta-icon-left.png"
          alt="Decorative Left"
          className="h-20"
        />
      </div>
      <div className="absolute right-6 bottom-6 opacity-10">
        <img
          src="/assets/cta-icon-right.png"
          alt="Decorative Right"
          className="h-20"
        />
      </div>

      {/* Text + Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="text-center text-white relative z-10"
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Ready to kickstart your DSA journey with AI by your side?
        </h2>

        <Link
          to="/register"
          className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:scale-105 transition-transform flex items-center justify-center w-fit mx-auto shadow-lg"
        >
          Kick Off Now <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}
