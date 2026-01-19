"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Loader2, XCircle, AlertCircle, X } from "lucide-react";
import { JobState, UploadStage, StageStatus } from "@/lib/upload-types";

interface UploadProgressModalProps {
  isOpen: boolean;
  jobState: JobState | null;
  onClose: () => void;
}

const STAGES: UploadStage[] = ["Parsing", "Chunking", "Summarizing", "Embedding", "Storing"];

export default function UploadProgressModal({ isOpen, jobState, onClose }: UploadProgressModalProps) {
  if (!isOpen || !jobState) return null;

  const isFinished = jobState.finalStatus === "Ready" || jobState.finalStatus === "Failed";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Uploading Document
              </h2>
              {isFinished && (
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="relative">
                {jobState.finalStatus === "Ready" ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                ) : jobState.finalStatus === "Failed" ? (
                  <XCircle className="w-10 h-10 text-red-500" />
                ) : (
                  <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {jobState.fileName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {jobState.finalStatus === "Ready" 
                    ? "Processing Complete" 
                    : jobState.finalStatus === "Failed"
                    ? "Processing Failed"
                    : `Current: ${jobState.currentStage}...`}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {STAGES.map((stage) => {
                const status = jobState.stages[stage].status;
                const retryCount = jobState.stages[stage].retryCount;
                
                return (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StageIcon status={status} />
                      <span className={`text-sm ${
                        status === 'completed' ? 'text-slate-900 dark:text-white font-medium' :
                        status === 'in-progress' ? 'text-blue-600 dark:text-blue-400 font-medium' :
                        'text-slate-500 dark:text-slate-400'
                      }`}>
                        {stage}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                       {status === 'retrying' && (
                         <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full animate-pulse">
                           Retry {retryCount}/2
                         </span>
                       )}
                       <StageStatusLabel status={status} />
                    </div>
                  </div>
                );
              })}
            </div>

            {isFinished && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onClose}
                className={`w-full py-3 rounded-xl font-semibold transition-all shadow-lg ${
                  jobState.finalStatus === 'Ready'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                    : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                {jobState.finalStatus === 'Ready' ? 'Done' : 'Close'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function StageIcon({ status }: { status: StageStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case "in-progress":
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    case "retrying":
      return <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" />;
    case "failed":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700" />;
  }
}

function StageStatusLabel({ status }: { status: StageStatus }) {
  const labels: Record<StageStatus, string> = {
    pending: "Waiting",
    "in-progress": "Running",
    completed: "Finished",
    failed: "Failed",
    retrying: "Retrying",
  };

  const colors: Record<StageStatus, string> = {
    pending: "text-slate-400",
    "in-progress": "text-blue-500",
    completed: "text-emerald-500",
    failed: "text-red-500",
    retrying: "text-amber-500",
  };

  return (
    <span className={`text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}
