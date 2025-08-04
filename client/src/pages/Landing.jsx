import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HowItWorks from "@/components/HowItWorks";
import WhyKickDSA from "@/components/WhyKickDSA";
import CTASection from "../components/CTASection";
import MessageFromDevelopers from "../components/MessageFromDevelopers";
import AiAssistant from "@/components/AiAssistant";
import TestimonialSection from "@/components/TestimonialSection";
import FaqSection from "@/components/FaqSection";
import { useAuth } from "../context/AuthContext";
import { Code, Brain, BarChart2, Braces, Binary, Bot, Zap, Trophy, Users, Database, Cpu, Network } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ParticleBackground = () => {
  const ref = useRef(null);
  const [particles, setParticles] = useState();

  useEffect(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    setParticles(positions);
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <Points ref={ref} positions={particles} frustumCulled={false}>
      <PointMaterial transparent color="#7286ff" size={0.03} sizeAttenuation depthWrite={false} />
    </Points>
  );
};

const FloatingCode = ({ icon, delay }) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute text-[#d220ff]/30"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      animate={{ 
        rotate: [0, 10, -10, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [0.8, 1.1, 0.8]
      }}
      transition={{ 
        duration: 4 + Math.random() * 3, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut",
      }}
    >
      {icon}
    </motion.div>
  );
};

const SparkParticle = ({ delay, position }) => (
  <motion.div
    className={`absolute w-1 h-1 bg-gradient-to-br from-[#7286ff] to-[#d220ff] rounded-full shadow-[0_0_6px_rgba(210,32,255,0.7)] ${position}`}
    animate={{ y: [0, -30], x: [0, (Math.random() - 0.5) * 20], opacity: [0, 1, 0] }}
    transition={{ duration: 3, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

const StatItem = ({ value, label, icon }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => (prev < value ? prev + Math.ceil((value - prev) / 10) : value));
    }, 50);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div className="flex flex-col items-center p-4 bg-[#1a1723]/90 rounded-xl border border-white/10 backdrop-blur-md" whileHover={{ scale: 1.05 }}>
      {icon}
      <h3 className="text-3xl font-bold text-[#7286ff]">{count}+</h3>
      <p className="text-sm text-gray-300">{label}</p>
    </motion.div>
  );
};

export default function Landing() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.8, ease: 'easeOut' },
    }),
  };

  const icons = [Braces, Binary, Bot, Code, Brain, BarChart2, Zap, Trophy, Users, Database, Cpu, Network];

  return (
    <div className="relative text-white bg-[#0f0d14] overflow-x-hidden min-h-screen">
      <style>{`
        .text-gradient-animation {
          background: linear-gradient(270deg, #7286ff 0%, #d220ff 50%, #7286ff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-gradient-animation 8s ease-in-out infinite;
        }
        @keyframes text-gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .flare-bg-purple, .flare-bg-blue {
          width: 800px;
          height: 800px;
          filter: blur(100px);
          position: absolute;
          z-index: 0;
        }
        .flare-bg-purple {
          background: radial-gradient(50% 50% at 50% 50%, rgba(210,32,255,0.4) 0%, rgba(210,32,255,0.1) 60%, transparent 100%);
        }
        .flare-bg-blue {
          background: radial-gradient(50% 50% at 50% 50%, rgba(114,134,255,0.4) 0%, rgba(114,134,255,0.1) 60%, transparent 100%);
          opacity: 0.8;
        }
        .hero-glow {
          position: absolute;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 80%; height: 80%;
          background: radial-gradient(circle at center, rgba(114,134,255,0.15) 0%, rgba(210,32,255,0.1) 40%, transparent 70%);
          filter: blur(40px); z-index: 0;
        }
        .neon-btn {
          border-radius: 9999px;
          border: 1.5px solid transparent;
          background: linear-gradient(#141219, #141219) padding-box, linear-gradient(90deg, #7286ff, #d220ff) border-box;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
        }
        .neon-btn:hover {
          background: linear-gradient(#2d1d34, #2d1d34) padding-box, linear-gradient(90deg, #7286ff, #d220ff) border-box;
          filter: drop-shadow(0 0 8px rgba(114,134,255,0.4));
        }
        .section-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #d220ff, transparent);
          margin: 2rem 0;
        }
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ParticleBackground />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Sphere args={[1, 64, 64]} position={[-2, 0, 0]}>
            <MeshDistortMaterial color="#7286ff" distort={0.4} speed={2} />
          </Sphere>
          <Sphere args={[0.8, 64, 64]} position={[2, 1, 0]}>
            <MeshDistortMaterial color="#d220ff" distort={0.6} speed={3} />
          </Sphere>
          <OrbitControls enableZoom={false} autoRotate />
        </Canvas>
      </div>

      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url("/assets/background.jpg")' }}
      />

      <section className="relative min-h-screen flex items-center justify-center px-4 z-10 pt-28 pb-24">
        <motion.div
          className="flare-bg-purple top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="flare-bg-blue bottom-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.1, 1], x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="hero-glow" />

        {[...Array(16)].map((_, i) => (
          <SparkParticle key={i} delay={i * 0.2} position={`left-[${5 + i * 5}%] top-[${10 + Math.random() * 80}%]`} />
        ))}

        {icons.map((Icon, i) => (
          <FloatingCode key={i} icon={<Icon size={64} />} delay={i * 0.4} />
        ))}

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#7286ff]/10 font-mono text-3xl z-0 pointer-events-none select-none"
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          function solveDSA(problem) {'{'} return AI.assist(); {'}'}
        </motion.div>

        <motion.div className="relative z-10 text-center max-w-4xl" initial="hidden" animate={isMounted ? "show" : "hidden"}>
          <motion.h1 
            className="text-[3.5rem] md:text-[5rem] font-black leading-[1.05] tracking-tighter mb-8" 
            variants={fadeUp} 
            custom={0}
          >
            <span className="block mb-2">Master DSA with</span>
            <span className="text-gradient-animation block mb-2">AI-Powered Guidance</span>
            <span className="block">Learn. Solve. Grow.</span>
          </motion.h1>

          <motion.p className="text-gray-300 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light" variants={fadeUp} custom={1}>
            Smart AI hints, progress tracking, real problems,<br />
            and community support for beginners.
          </motion.p>

          <motion.div className="flex flex-wrap gap-6 justify-center" variants={fadeUp} custom={2}>
            {!user ? (
              <>
                <Link to="/register" className="neon-btn text-lg px-8 py-3">Start Solving</Link>
                <Link to="/login" className="neon-btn text-lg px-8 py-3">Join Us</Link>
              </>
            ) : (
              <>
                <Link to="/problems" className="neon-btn text-lg px-8 py-3">Solve Problems</Link>
                <Link to="/compiler" className="neon-btn text-lg px-8 py-3">Try AI Compiler</Link>
              </>
            )}
          </motion.div>

          {/* Better Visual: Animated Stats */}
          <motion.div className="mt-16 flex flex-wrap justify-center gap-8 max-w-3xl mx-auto" variants={fadeUp} custom={3}>
            <StatItem value={150} label="Active Users" icon={<Users className="text-[#d220ff] mb-2" size={32} />} />
            <StatItem value={1000} label="Problems Solved" icon={<Trophy className="text-[#7286ff] mb-2" size={32} />} />
            <StatItem value={500} label="AI Hints Given" icon={<Bot className="text-[#d220ff] mb-2" size={32} />} />
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 right-8 z-20">

        </div>
      </section>
      <AiAssistant />

      <div className="relative z-10 bg-gradient-to-b from-transparent to-[#0f0d14] pt-16 pb-8">
        <HowItWorks />
        <div className="section-divider max-w-6xl mx-auto" />
        <WhyKickDSA />
        <div className="section-divider max-w-6xl mx-auto" />
        <MessageFromDevelopers />
        <div className="section-divider max-w-6xl mx-auto" />
        <TestimonialSection />
        <div className="section-divider max-w-6xl mx-auto" />
        <FaqSection />
        <div className="section-divider max-w-6xl mx-auto" />
        <CTASection />
      </div>
    </div>
  );
}
