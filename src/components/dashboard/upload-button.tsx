"use client";

import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toast-context";
import { DocumentData } from "@/types/common.types";
import { createDocumentObject } from "@/lib/helper/document";
import UploadProgressModal from "./upload-progress-modal";
import { JobState } from "@/lib/upload-types";

interface UploadButtonProps {
  onUploadComplete: (doc: DocumentData) => void;
}

export default function UploadButton({ onUploadComplete }: UploadButtonProps) {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobState, setJobState] = useState<JobState | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startTracking = (jobId: string, file: File) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(`/api/upload?jobId=${jobId}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      setJobState((prev) => {
        if (!prev) return data;
        
        // If it's a full state update (has stages map)
        if (data.stages) return data;

        // If it's a partial progress update
        const newStages = { ...prev.stages };
        if (data.stage) {
          // Log diagnostic payload to console
          if (data.status === 'completed' && data.payload) {
            console.log(`[Diagnostic] Stage ${data.stage} completed:`, data.payload);
          } else if (data.status === 'failed') {
            console.error(`[Diagnostic] Stage ${data.stage} failed:`, data.message);
          }

          newStages[data.stage as keyof typeof prev.stages] = {
            status: data.status,
            retryCount: data.retryCount ?? 0,
            message: data.message
          };
        }

        return {
          ...prev,
          ...data,
          currentStage: data.stage || prev.currentStage,
          stages: newStages,
        };
      });

      if (data.finalStatus === "Ready") {
        eventSource.close();
        const documentObject: DocumentData = createDocumentObject(file);
        onUploadComplete(documentObject);
        addToast("Document processed successfully", "success");
      } else if (data.finalStatus === "Failed") {
        eventSource.close();
        addToast("Document processing failed", "error");
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close();
      
      // Update state to show the upload failed due to connection loss
      setJobState((prev) => {
        if (!prev) return null;
        
        const failedStage = prev.currentStage;
        const newStages = { ...prev.stages };
        newStages[failedStage] = {
          ...newStages[failedStage],
          status: 'failed',
          message: 'Connection to server lost'
        };
        
        return {
          ...prev,
          stages: newStages,
          finalStatus: 'Failed'
        };
      });
      
      addToast("Lost connection to upload server", "error");
    };
  };

  const handleUpload = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        addToast(`Uploading ${file.name}...`, "info");

        const documentObject: DocumentData = createDocumentObject(file);
        onUploadComplete(documentObject);
        setTimeout(()=>addToast("Document processed successfully", "success"),2000)
        
        // const res = await fetch("/api/upload", {
        //   method: "POST",
        //   body: formData,
        // });

        // if (!res.ok) {
        //   addToast(`Upload failed: ${res.statusText}`, "error");
        //   return;
        // }

        // const { jobId } = await res.json();
        
        // Initialize job state locally for immediate feedback
        // setJobState({
        //   jobId,
        //   fileName: file.name,
        //   currentStage: "Parsing",
        //   stages: {
        //     Parsing: { status: "pending", retryCount: 0 },
        //     Chunking: { status: "pending", retryCount: 0 },
        //     Summarizing: { status: "pending", retryCount: 0 },
        //     Embedding: { status: "pending", retryCount: 0 },
        //     Storing: { status: "pending", retryCount: 0 },
        //   },
        // });
        // setIsModalOpen(true);
        // startTracking(jobId, file);
      };
      input.click();
    } catch (error) {
      console.error("Upload failed:", error);
      addToast("Failed to upload document", "error");
    }
  };

  return (
    <>
      <Button
        onClick={handleUpload}
        size="lg"
        className="shadow-lg shadow-blue-500/20 cursor-pointer"
      >
        <UploadCloud className="mr-2 h-5 w-5" />
        Upload Lease Agreement
      </Button>

      <UploadProgressModal
        isOpen={isModalOpen}
        jobState={jobState}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
