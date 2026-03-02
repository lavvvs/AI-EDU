"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, GraduationCap, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";

const SUBJECT_CHIPS = ["Physics", "Chemistry", "Biology", "Maths", "English"];

export default function AIRobot() {
  const { isRobotOpen, toggleRobot, messages, addMessage, user } = useAppStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    addMessage({ role: "user", content: userMessage });
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await api.post("/teacher/chat", { message: userMessage });
      addMessage({ role: "assistant", content: data.response });
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.detail ||
        "Sorry, I couldn't process that right now. Please try again!";
      addMessage({ role: "assistant", content: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (subject: string) => {
    setInput(`Explain a key concept in ${subject}`);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Messaging Panel */}
      <AnimatePresence>
        {isRobotOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-96 max-h-[calc(100vh-120px)] h-[580px] glass-panel overflow-hidden flex flex-col shadow-2xl border-primary/20"
          >
            {/* Header */}
            <div className="flex-shrink-0 p-4 bg-gradient-to-r from-primary/30 to-secondary/20 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-purple-glow">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Teacher</h3>
                  <p className="text-[10px] text-primary-light flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
                    Physics • Chemistry • Biology • Maths • English
                  </p>
                </div>
              </div>
              <button onClick={toggleRobot} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* Subject Chips */}
            <div className="flex gap-2 px-4 py-2.5 border-b border-white/5 overflow-x-auto scrollbar-hide">
              {SUBJECT_CHIPS.map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleChipClick(subject)}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-primary-light hover:bg-primary/20 hover:border-primary/30 transition-all whitespace-nowrap"
                >
                  {subject}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-white/5 border-l-2 border-primary-light text-text-main rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border-l-2 border-primary-light rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary-light animate-spin" />
                    <span className="text-xs text-text-muted">Thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask me about Physics, Chemistry, Biology..."
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-12 focus:outline-none focus:border-primary/50 text-sm placeholder:text-white/20 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-lg hover:shadow-purple-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Robot Trigger */}
      <motion.button
        onClick={toggleRobot}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-primary shadow-purple-glow">
          {/* Robot Head Visualization */}
          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full relative">
            <div className="flex justify-center gap-3 mt-3">
              <motion.div 
                animate={{ scaleY: [1, 0.1, 1] }} 
                transition={{ repeat: Infinity, duration: 3, times: [0, 0.1, 1] }}
                className="w-2 h-3 bg-primary rounded-full shadow-[0_0_5px_var(--color-primary)]"
              ></motion.div>
              <motion.div 
                animate={{ scaleY: [1, 0.1, 1] }} 
                transition={{ repeat: Infinity, duration: 3, times: [0, 0.1, 1] }}
                className="w-2 h-3 bg-primary rounded-full shadow-[0_0_5px_var(--color-primary)]"
              ></motion.div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary/20 rounded-full"></div>
          </div>
          {/* Halo Effect */}
          <div className="absolute inset-0 bg-primary/10 animate-pulse-slow"></div>
        </div>
      </motion.button>
    </div>
  );
}
