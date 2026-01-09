export type DocumentStatus = "processing" | "ready" | "failed";

export interface DocumentData {
  id: string;
  name: string;
  uploadedAt: string;
  status: DocumentStatus;
  size: string;
}

