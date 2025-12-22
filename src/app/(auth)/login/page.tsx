"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email.endsWith("@ruralshores.com")) {
      setError("Please use your @ruralshores.com email address.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
    }

    login(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-800"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground mt-2">
          Sign in to access your document dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
          <Input
            type="email"
            placeholder="john.doe@ruralshores.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/50 dark:bg-slate-950/50"
          />
        </div>
        <div className="space-y-2">
             <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/50 dark:bg-slate-950/50"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        <Button type="submit" className="w-full h-11 text-base cursor-pointer" loading={isLoading}>
          Sign In
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
