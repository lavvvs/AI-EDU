"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import AIRobot from "@/components/AIRobot";
import { useAppStore } from "@/lib/store";
import { Bell, Search, User } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAppStore();

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background-end">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between bg-white/5 backdrop-blur-sm z-40">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-96">
            <Search className="w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search documents or sessions..." 
              className="bg-transparent border-none outline-none text-sm text-text-main w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-text-muted hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-background-end shadow-neon-glow"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-bold text-text-main">{user?.name}</p>
                <p className="text-[10px] text-primary-light font-medium uppercase tracking-wider">Premium User</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px] shadow-purple-glow">
                <div className="w-full h-full rounded-full bg-background-start flex items-center justify-center overflow-hidden border border-white/10">
                  <User className="w-6 h-6 text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8 pb-32">
            {children}
          </div>
          
          {/* Decorative Background Elements */}
          <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          <div className="fixed bottom-0 left-1/4 w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
        </main>

        <AIRobot />
      </div>
    </div>
  );
}
