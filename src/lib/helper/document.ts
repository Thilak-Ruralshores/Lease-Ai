import { DocumentData } from "@/types/common.types";

export function formatBytes(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function createDocumentObject(file: File): DocumentData {
  return {
    id: `doc_${crypto.randomUUID()}`,
    name: file.name,
    uploadedAt: new Date().toISOString().split("T")[0],
    status: "ready",
    size: formatBytes(file.size),
  };
}
