"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, Sparkles, Github, Twitter, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import api from "@/lib/api";

export default function AuthPage({ mode = "login" }: { mode?: "login" | "register" }) {
  const { checkAuth } = useAppStore();
  const [currentMode, setCurrentMode] = useState(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (currentMode === "login") {
        const params = new URLSearchParams();
        params.append("username", email);
        params.append("password", password);

        const { data } = await api.post("/auth/login", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        localStorage.setItem("token", data.access_token);
      } else {
        await api.post("/auth/register", {
          email,
          password,
          full_name: fullName,
        });
        
        // Auto-login after registration
        const params = new URLSearchParams();
        params.append("username", email);
        params.append("password", password);
        const { data } = await api.post("/auth/login", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        localStorage.setItem("token", data.access_token);
      }
      
      await checkAuth();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-end p-6">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md glass-panel p-8 md:p-12 shadow-2xl relative z-10 border-white/5"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-purple-glow mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2 font-heading">{currentMode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-sm text-white/50">Start your journey into AI-powered learning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          {currentMode === "register" && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary-light ml-1">Full Name</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Johnson"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary/50 transition-all text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary-light ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary-light transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary-light ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary-light transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full btn-glow flex items-center justify-center gap-2 py-4 shadow-neon-glow disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {currentMode === "login" ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                <span className="font-bold">{currentMode === "login" ? "Sign In to Dashboard" : "Create Your Account"}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-6">
          <p className="text-xs text-white/40">
            {currentMode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button"
              onClick={() => setCurrentMode(currentMode === "login" ? "register" : "login")}
              className="ml-2 font-bold text-primary-light hover:underline"
            >
              {currentMode === "login" ? "Sign Up Free" : "Log In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
