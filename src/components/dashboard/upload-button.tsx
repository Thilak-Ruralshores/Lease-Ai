"use client";

import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toast-context";

export default function UploadButton() {
  const { addToast } = useToast();

  const handleUpload = () => {
    // Simulate upload trigger
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            addToast(`Uploading ${file.name}...`, "info");
            // Here you would normally upload the file
            setTimeout(() => {
                addToast("Document uploaded successfully", "success");
            }, 2000);
        }
    };
    input.click();
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
