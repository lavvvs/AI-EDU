"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart2, 
  FileText, 
  Youtube, 
  Globe, 
  Mic, 
  History, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ChevronUp
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useState } from "react";

const menuItems = [
  { id: 'dashboard', icon: BarChart2, label: 'Dashboard' },
  { id: 'pdf', icon: FileText, label: 'PDF Intelligence' },
  { id: 'youtube', icon: Youtube, label: 'YouTube Summarizer' },
  { id: 'website', icon: Globe, label: 'Website Analyzer' },
  { id: 'voice', icon: Mic, label: 'Voice Notes' },
  { id: 'history', icon: History, label: 'History' },
];

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, activeModule, setActiveModule, logout } = useAppStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <motion.div 
      initial={false}
      animate={{ width: isSidebarOpen ? 280 : 80 }}
      className="h-screen glass-panel rounded-none border-y-0 border-l-0 border-r border-white/10 flex flex-col relative z-50 overflow-hidden"
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-purple-glow flex-shrink-0">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        {isSidebarOpen && (
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent truncate"
          >
            EduAI Pro
          </motion.h1>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as any)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${
                isActive 
                ? "bg-primary text-white shadow-purple-glow" 
                : "text-text-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? "text-white" : "group-hover:text-primary-light"}`} />
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-1">
        {/* Settings Toggle */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
            isSettingsOpen
              ? "bg-white/10 text-white"
              : "text-white/40 hover:bg-white/5 hover:text-white"
          } text-xs uppercase tracking-widest font-bold`}
        >
          <Settings className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isSettingsOpen ? "rotate-90 text-primary-light" : ""}`} />
          {isSidebarOpen && (
            <span className="truncate flex-1 text-left">Settings</span>
          )}
          {isSidebarOpen && (
            <motion.div
              animate={{ rotate: isSettingsOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronUp className="w-4 h-4" />
            </motion.div>
          )}
        </button>

        {/* Logout Button - Appears on Settings Click */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <button 
                onClick={logout}
                className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/15 transition-all duration-300 text-xs uppercase tracking-widest font-bold group mt-1"
              >
                <LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate"
                  >
                    Log Out
                  </motion.span>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-purple-glow z-[60] border-4 border-background-end hover:scale-110 transition-transform"
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
      </button>
    </motion.div>
  );
}
