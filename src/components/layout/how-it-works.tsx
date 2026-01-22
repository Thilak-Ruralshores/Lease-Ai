"use client";

import { motion } from "framer-motion";
import { Upload, FileText, Sparkles, Search } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload lease PDFs",
    description: "Securely upload your commercial lease agreements for processing",
    icon: Upload,
  },
  {
    number: "02",
    title: "Parse & chunk the document",
    description: "Advanced text extraction and intelligent document segmentation",
    icon: FileText,
  },
  {
    number: "03",
    title: "Extract & embed clauses",
    description: "AI-powered clause identification with vector embeddings for semantic understanding",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Search & analyze using AI",
    description: "Query your documents with natural language and get source-backed answers",
    icon: Search,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered pipeline transforms complex lease documents into searchable, structured data
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -z-10" />
                )}

                <div className="bg-card border border-border rounded-xl p-6 h-full hover:shadow-lg transition-shadow group">
                  {/* Step number */}
                  <div className="text-5xl font-bold text-primary/20 mb-4 group-hover:text-primary/30 transition-colors">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
