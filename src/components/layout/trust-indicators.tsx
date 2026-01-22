"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock } from "lucide-react";

const trustPoints = [
  {
    title: "High Accuracy",
    description: "Proven precision in clause extraction and document processing",
    icon: ShieldCheck,
  },
  {
    title: "Fast Processing",
    description: "Optimized for complex, multi-page commercial lease agreements",
    icon: Zap,
  },
  {
    title: "Private & Secure",
    description: "Your documents are never used for AI training",
    icon: Lock,
  },
];

export function TrustIndicators() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {point.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
