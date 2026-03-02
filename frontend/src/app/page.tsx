"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import SafetySection from "@/components/SafetySection";
import { CTASection, Footer } from "@/components/CTASection";
import AppLayout from "@/components/AppLayout";
import DashboardHome from "@/components/DashboardHome";
import PDFModule from "@/components/PDFModule";
import YouTubeModule from "@/components/YouTubeModule";
import WebsiteModule from "@/components/WebsiteModule";
import VoiceModule from "@/components/VoiceModule";
import HistoryModule from "@/components/HistoryModule";

export default function Home() {
  const { isAuthenticated, activeModule } = useAppStore();

  if (isAuthenticated) {
    return (
      <AppLayout>
        {activeModule === 'dashboard' && <DashboardHome />}
        {activeModule === 'pdf' && <PDFModule />}
        {activeModule === 'youtube' && <YouTubeModule />}
        {activeModule === 'website' && <WebsiteModule />}
        {activeModule === 'voice' && <VoiceModule />}
        {activeModule === 'history' && <HistoryModule />}
      </AppLayout>
    );
  }

  return (
    <main className="min-h-screen bg-background-end text-white selection:bg-primary/30 selection:text-primary-light overflow-x-hidden">
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full" />
      </div>

      <Navbar />
      
      <div className="relative">
        <Hero />
        
        <div className="space-y-32 pb-32">
          <Features />
          <HowItWorks />
          <SafetySection />
          <CTASection />
        </div>
        
        <Footer />
      </div>
    </main>
  );
}
