"use client";

import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { ToastProvider } from "@/context/toast-context";
import { KeywordProvider } from "@/context/keyword-context";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ThemeProvider>
          <KeywordProvider>
            {children}
          </KeywordProvider>
        </ThemeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
