"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth } = useAppStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <html lang="en">
      <body className="antialiased selection:bg-primary/30 selection:text-primary-light">
        {children}
      </body>
    </html>
  );
}
