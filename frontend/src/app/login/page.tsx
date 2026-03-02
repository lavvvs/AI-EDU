"use client";
import React from "react";
import { useAppStore } from "@/lib/store";
import AuthPage from "@/components/AuthPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Simple wrapper to allow direct login access for demo
export default function LoginPage() {
  const { isAuthenticated } = useAppStore();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return <AuthPage mode="login" />;
}
