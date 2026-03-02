"use client";

import React from "react";
import { motion } from "framer-motion";
import EliteRobot from "./EliteRobot";
import { Play, Rocket } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-semibold text-primary-light uppercase tracking-wider">
                  Next-Gen AI Learning
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading text-white leading-[1.1] mb-6">
                Master Anything with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-white to-secondary animate-pulse-slow">
                  AI-Powered Intelligence
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                Upload PDFs, YouTube videos, websites, or voice notes — and get intelligent summaries and accurate answers instantly. No hallucinations, just pure verified intelligence.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link href="/signup" className="w-full sm:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-glow flex items-center gap-2 group w-full px-8 py-4 active:brightness-90"
                  >
                    <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Get Started Free
                  </motion.button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card flex items-center gap-2 px-8 py-4 w-full transition-colors"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Watch Demo
                  </motion.button>
                </a>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 flex flex-wrap items-center gap-6 justify-center md:justify-start opacity-40 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <span className="text-sm font-semibold tracking-widest text-white uppercase italic">Trusted by Fast Learners</span>
              <div className="h-4 w-px bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-4 overflow-hidden whitespace-nowrap">
                {/* Simulated Partner Logos */}
                <span className="text-xl font-bold font-heading">ELITE</span>
                <span className="text-xl font-bold font-heading">FUTURE</span>
                <span className="text-xl font-bold font-heading">NEXUS</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Robot */}
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <EliteRobot />
          </motion.div>
        </div>
      </div>

      {/* Hero bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background-end to-transparent -z-10" />
    </section>
  );
};

export default Hero;
