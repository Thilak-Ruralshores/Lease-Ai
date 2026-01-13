"use client";

import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toast-context";
import { DocumentData } from "@/types/common.types";
import { createDocumentObject } from "@/lib/helper/document";

function formatBytes(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
interface UploadButtonProps {
  onUploadComplete: (doc: DocumentData) => void;
}

export default function UploadButton({ onUploadComplete }: UploadButtonProps) {
  const { addToast } = useToast();

  const handleUpload = async() => {
    try{
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData=new FormData();
      formData.append('file',file);
      addToast(`Uploading ${file.name}...`, "info");
      const res=await fetch('/api/upload',{
             method:'POST',
             body: formData,
           })
      if(!res.ok){
        addToast(`Upload failed: ${res.statusText}`, "error");
        return;
      }
      const {embeddedChunks}=await res.json();
      console.log(embeddedChunks,"Embedded chunks from upload button");
      // // Simulate upload
      setTimeout(() => {
        const documentObject: DocumentData = createDocumentObject(file);
        // console.log(documentObject,"documentObject");
       onUploadComplete(documentObject);
        addToast("Document uploaded successfully", "success");
      }, 0);
    }
    input.click();
  }catch (error) {
      console.error("Upload failed:", error);
      addToast("Failed to upload document", "error");
    };

    
  };

  return (
    <Button
      onClick={handleUpload}
      size="lg"
      className="shadow-lg shadow-blue-500/20 cursor-pointer"
    >
      <UploadCloud className="mr-2 h-5 w-5" />
      Upload Lease Agreement
    </Button>
  );
}
