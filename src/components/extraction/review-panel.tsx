"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { ExtractionData } from "@/lib/dummy-data";

interface ReviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExtractionData | null;
  onSave: (newData: ExtractionData) => void;
}

export default function ReviewPanel({ isOpen, onClose, data, onSave }: ReviewPanelProps) {
  const [editedValue, setEditedValue] = useState("");

  useEffect(() => {
    if (data) {
      setEditedValue(data.value);
    }
  }, [data]);

  const handleSave = () => {
    if (data) {
      onSave({ ...data, value: editedValue });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 p-6 border-l border-slate-200 dark:border-slate-800 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Review Field</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {data && (
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Field Name</label>
                  <div className="text-lg font-semibold">{data.field}</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Extracted Value</label>
                  <Input
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="font-medium"
                    autoFocus
                  />
                </div>

                <div className="space-y-2 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <label className="text-sm font-medium text-muted-foreground block mb-2">Original Context</label>
                  <p className="text-sm italic text-slate-700 dark:text-slate-300">"{data.evidence}"</p>
                  <div className="mt-2 text-xs text-primary font-medium">Source: Clause {data.clause}</div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button className="flex-1 gap-2" onClick={handleSave}>
                <Check className="w-4 h-4" />
                Confirm & Save
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
