"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, CheckCircle, XCircle, MoreVertical, Calendar, HardDrive, Trash2, Eye, Settings2, Check, ArrowRight, Lock } from "lucide-react";
import { DocumentData, DocumentStatus } from "@/types/common.types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useKeywords } from "@/context/keyword-context";

interface DocumentCardProps {
  document: DocumentData;
  index: number;
  onDelete?: (id: string) => void;
}

export default function DocumentCard({ document, index, onDelete }: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { confirmedDocIds } = useKeywords();
  const isConfirmed = confirmedDocIds.includes(document.id);

  const statusIcons: Record<DocumentStatus, React.ReactNode> = {
    processing: <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />,
    ready: <CheckCircle className="w-5 h-5 text-green-500" />,
    failed: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const statusColors: Record<DocumentStatus, string> = {
    processing: "bg-amber-500/10 border-amber-500/20",
    ready: "bg-green-500/10 border-green-500/20",
    failed: "bg-red-500/10 border-red-500/20",
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete?.(document.id);
      setShowMenu(false);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  const handleMenuClose = () => {
    setShowMenu(false);
    setConfirmDelete(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-colors duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-lg", statusColors[document.status])}>
          <FileText className={cn("w-6 h-6", 
            document.status === "processing" ? "text-amber-600" :
            document.status === "ready" ? "text-green-600" : "text-red-600"
          )} />
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {statusIcons[document.status]}
            <span className="capitalize">{document.status}</span>
          </div>
          
          {/* Dropdown Menu */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-slate-400 hover:text-slate-900"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            <AnimatePresence>
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={handleMenuClose}
                  />
                  
                  {/* Menu */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 z-20 w-44 bg-popover rounded-lg shadow-lg border border-border py-1 overflow-hidden"
                  >
                    {document.status === "ready" && (
                      <Link
                        href={`/extraction/${document.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={handleMenuClose}
                      >
                        <Eye className="w-4 h-4" />
                        View Extraction
                      </Link>
                    )}
                    {/* <button
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full"
                      onClick={handleMenuClose}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button> */}
                    <div className="border-t border-border my-1" />
                    <button
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm w-full transition-colors",
                        confirmDelete 
                          ? "bg-red-500 text-white hover:bg-red-600" 
                          : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                      )}
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                      {confirmDelete ? "Click to Confirm" : "Delete"}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-card-foreground truncate mb-1" title={document.name}>
          {document.name}
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {document.uploadedAt}
            </div>
            <div className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5" />
                {document.size}
            </div>
        </div>

        <div className="flex items-center justify-between">
           <Link 
              href={`/keywords?docId=${document.id}`}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
           >
              <Settings2 className="w-3.5 h-3.5" />
              Choose Keywords
           </Link>

           {isConfirmed && (
             <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-tight">
               <Check className="w-2.5 h-2.5" />
               Confirmed
             </div>
           )}
        </div>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
         {document.status === "ready" && isConfirmed ? (
             <Link 
                href={`/extraction/${document.id}`}
                className="text-sm font-semibold text-primary hover:text-blue-700 transition-all flex items-center gap-1 group/btn"
             >
                View Extraction
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
             </Link>
         ): (
            <div className="flex flex-col gap-1">
               <span className="text-sm text-muted-foreground opacity-50 cursor-not-allowed flex items-center gap-1">
                 View Extraction
                 <Lock className="w-3.5 h-3.5" />
               </span>
               {!isConfirmed && document.status === "ready" && (
                 <span className="text-[10px] text-amber-600 dark:text-amber-500 font-medium animate-pulse">
                   Please confirm keywords first
                 </span>
               )}
            </div>
         )}
      </div>
    </motion.div>
  );
}

