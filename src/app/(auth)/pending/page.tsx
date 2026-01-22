"use client";

import { motion } from "framer-motion";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PendingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-800 text-center max-w-md mx-auto"
    >
      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock className="w-8 h-8 text-amber-600 dark:text-amber-500 animate-pulse" />
      </div>

      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
        Account Pending Approval
      </h1>
      
      <p className="text-muted-foreground mb-8">
        Your account has been created successfully! However, an administrator needs to approve your access before you can sign in to the dashboard.
      </p>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          You will be able to log in once your organization's administrator approves your request.
        </div>

        <Link href="/login" className="block">
          <Button variant="outline" className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
