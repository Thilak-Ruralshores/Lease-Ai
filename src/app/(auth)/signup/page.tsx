"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const { refreshUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      // Redirect to login with a success indicator or just message
      router.push("/login?message=Account created successfully. Please sign in.");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-800"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-muted-foreground mt-2">
          Join the document intelligence platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Full Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white/50 dark:bg-slate-950/50"
          />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email</label>
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
             <label className="text-sm font-medium leading-none">Password</label>
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
          Create Account
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
