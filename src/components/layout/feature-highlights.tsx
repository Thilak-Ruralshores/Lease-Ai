"use client";

import { motion } from "framer-motion";
import { Search, FileText, Sparkles, Tag, MapPin } from "lucide-react";

const features = [
  {
    title: "AI-Generated Summaries",
    description: "Automatic extraction of key lease terms and provisions with intelligent summarization",
    icon: Sparkles,
  },
  {
    title: "Clause-Level Search",
    description: "Find specific provisions instantly with semantic and keyword-based search capabilities",
    icon: Search,
  },
  {
    title: "RAG-Powered Retrieval",
    description: "Context-aware document search using embeddings and retrieval augmented generation",
    icon: FileText,
  },
  {
    title: "Keyword Management",
    description: "Organize and track critical terms with customizable categories and tags",
    icon: Tag,
  },
  {
    title: "Page-Level Traceability",
    description: "Direct source references with exact page numbers for every extracted clause",
    icon: MapPin,
  },
];

export function FeatureHighlights() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enterprise-Grade Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for legal teams, real estate professionals, and analysts who need precision and reliability
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-md transition-all">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
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
