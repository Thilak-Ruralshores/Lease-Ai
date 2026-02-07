"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentData } from "@/types/common.types";
import { DUMMY_DOCUMENTS, INITIAL_KEYWORDS } from "@/lib/dummy-data";
import DocumentCard from "@/components/dashboard/document-card";
import UploadButton from "@/components/dashboard/upload-button";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Search, Settings2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/context/toast-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Keyword } from "@/context/keyword-context";
import { useKeywords } from "@/context/keyword-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/use-auth-guard";

const PAGE_SIZE = 6;

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadMoreRef, isIntersecting] = useIntersectionObserver();
   const { activeKeywords, activeCount } = useKeywords();
   const { addToast } = useToast();
   useAuthGuard();

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/upload");
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      addToast("Failed to load documents", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Fetch on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDeleteDocument = useCallback((id: string) => {
    const docToDelete = documents.find(d => d.id === id);
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    addToast(`"${docToDelete?.name}" has been deleted`, "success");
  }, [documents, addToast]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  const handleNewDocument = (document: DocumentData) => {
    setDocuments(prev => [...prev, document]);
    // addToast(`"${document.name}" has been uploaded`, "success");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <section className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Documents
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and analyze your lease agreements
          </p>
        </div>
        <UploadButton onUploadComplete={handleNewDocument} />
      </section>

      <div className="space-y-6">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input 
                placeholder="Search documents..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence mode="popLayout">
              {filteredDocuments.map((doc, index) => (
                <DocumentCard 
                  key={doc.id} 
                  document={doc} 
                  index={index} 
                  onDelete={handleDeleteDocument}
                />
              ))}
             </AnimatePresence>
          </div>

          {filteredDocuments.length === 0 && !isLoading && (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-muted-foreground">No documents found matching your search.</p>
              </div>
          )}

          {/* Loading / Infinite Scroll Sentinel */}
           <div ref={loadMoreRef} className="py-8 flex justify-center">
             {isLoading && (
               <div className="flex flex-col items-center gap-2 text-slate-400">
                 <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                 <span className="text-xs">Loading more...</span>
               </div>
             )}
           </div>
      </div>
    </div>
  );
}

