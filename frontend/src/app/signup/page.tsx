"use client";
import React from "react";
import { useAppStore } from "@/lib/store";
import AuthPage from "@/components/AuthPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const { isAuthenticated } = useAppStore();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return <AuthPage mode="register" />;
}
