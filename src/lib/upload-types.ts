export type UploadStage = 
  | 'Parsing' 
  | 'Chunking' 
  | 'Summarizing' 
  | 'Embedding' 
  | 'Storing';

export type StageStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'retrying';

export interface ProgressUpdate {
  jobId: string;
  stage: UploadStage;
  status: StageStatus;
  message?: string;
  retryCount?: number;
  finalStatus?: 'Ready' | 'Failed';
  payload?: any;
}

export interface JobState {
  jobId: string;
  fileName: string;
  currentStage: UploadStage;
  stages: Record<UploadStage, {
    status: StageStatus;
    retryCount: number;
    message?: string;
  }>;
  finalStatus?: 'Ready' | 'Failed';
}
