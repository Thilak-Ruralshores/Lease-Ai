"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Key, Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "How it Works", href: "#how-it-works" },
        { name: "Dashboard", href: "/dashboard" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Contact", href: "mailto:support@leaseai.com" },
        { name: "Careers", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Security", href: "/security" },
      ],
    },
  ];

  return (
    <footer className="relative bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand and Description */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Key className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  LeaseAI
                </span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                Intelligent commercial lease analysis and refined data extraction.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { icon: Github, href: "#", label: "GitHub" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Mail, href: "mailto:support@leaseai.com", label: "Email" }
                ].map((item) => (
                  <Link 
                    key={item.label}
                    href={item.href} 
                    className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    aria-label={item.label}
                  >
                    <item.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Compact Internal Join */}
            <form className="flex max-w-[280px] gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Subscribe to updates" 
                className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
              />
              <button className="bg-slate-900 dark:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shrink-0 cursor-pointer">
                Join
              </button>
            </form>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-6">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          <p>© {currentYear} LeaseAI. Optimized for RS.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
