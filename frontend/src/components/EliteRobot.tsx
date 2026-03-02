"use client";

import React from "react";
import { motion } from "framer-motion";

const EliteRobot = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto h-[500px] flex items-center justify-center">
      {/* Background glow and particles */}
      <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse-slow" />
      
      {/* Floating particles */}
      {isMounted && [...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary-light rounded-full"
          initial={{
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            opacity: Math.random(),
          }}
          animate={{
            y: [null, Math.random() * -100 - 50],
            opacity: [null, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Main Robot Illustration */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 1, 0, -1, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_30px_rgba(108,43,217,0.3)]"
        >
          {/* Robot Head */}
          <rect
            x="120"
            y="100"
            width="160"
            height="180"
            rx="50"
            fill="white"
            fillOpacity="0.95"
            className="stroke-[3] stroke-primary/10"
          />
          
          {/* Glass Visor */}
          <rect
            x="140"
            y="140"
            width="120"
            height="60"
            rx="30"
            fill="#0F172A"
          />
          
          {/* Glowing Eyes */}
          <motion.circle
            cx="170"
            cy="170"
            r="6"
            fill="#8B5CF6"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="230"
            cy="170"
            r="6"
            fill="#8B5CF6"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          />

          {/* Holographic Panels */}
          <motion.g
            animate={{
              y: [-5, 5, -5],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {/* Left Panel */}
            <rect
              x="40"
              y="180"
              width="60"
              height="80"
              rx="10"
              fill="rgba(108, 43, 217, 0.1)"
              stroke="rgba(108, 43, 217, 0.3)"
              className="backdrop-blur-md"
            />
            <rect x="50" y="195" width="40" height="4" rx="2" fill="rgba(108, 43, 217, 0.5)" />
            <rect x="50" y="205" width="30" height="4" rx="2" fill="rgba(108, 43, 217, 0.3)" />
            <rect x="50" y="215" width="40" height="4" rx="2" fill="rgba(108, 43, 217, 0.2)" />
            
            {/* Right Panel */}
            <rect
              x="300"
              y="150"
              width="70"
              height="100"
              rx="10"
              fill="rgba(108, 43, 217, 0.1)"
              stroke="rgba(108, 43, 217, 0.3)"
              className="backdrop-blur-md"
            />
            <circle cx="335" cy="180" r="15" stroke="rgba(108, 43, 217, 0.5)" strokeWidth="2" strokeDasharray="4 4" />
            <rect x="315" y="210" width="40" height="4" rx="2" fill="rgba(108, 43, 217, 0.4)" />
            <rect x="315" y="220" width="30" height="4" rx="2" fill="rgba(108, 43, 217, 0.2)" />
          </motion.g>

          {/* Robot Body */}
          <path
            d="M140 280 C140 280 100 320 100 380 L300 380 C300 320 260 280 260 280 L140 280"
            fill="white"
            fillOpacity="0.9"
            className="stroke-[3] stroke-primary/10"
          />
          
          {/* Center Light */}
          <circle cx="200" cy="330" r="15" fill="rgba(108, 43, 217, 0.1)" />
          <motion.circle
            cx="200"
            cy="330"
            r="8"
            fill="#8B5CF6"
            animate={{
              boxShadow: ["0 0 10px #8B5CF6", "0 0 25px #8B5CF6", "0 0 10px #8B5CF6"],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
      </motion.div>
      
      {/* Light streaks */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -rotate-12 blur-sm" />
      <div className="absolute top-1/3 right-0 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent rotate-45 blur-sm" />
    </div>
  );
};

export default EliteRobot;
