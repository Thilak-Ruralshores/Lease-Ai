import { EventEmitter } from 'events';
import { JobState, ProgressUpdate, UploadStage } from './upload-types';

class UploadManager extends EventEmitter {
  private jobs: Map<string, JobState> = new Map();

  constructor() {
    super();
    this.setMaxListeners(100);
  }

  createJob(jobId: string, fileName: string): JobState {
    const job: JobState = {
      jobId,
      fileName,
      currentStage: 'Parsing',
      stages: {
        Parsing: { status: 'pending', retryCount: 0 },
        Chunking: { status: 'pending', retryCount: 0 },
        Summarizing: { status: 'pending', retryCount: 0 },
        Embedding: { status: 'pending', retryCount: 0 },
        Storing: { status: 'pending', retryCount: 0 },
      },
    };
    this.jobs.set(jobId, job);
    return job;
  }

  getJob(jobId: string): JobState | undefined {
    return this.jobs.get(jobId);
  }

  updateStage(
    jobId: string, 
    stage: UploadStage, 
    status: JobState['stages'][UploadStage]['status'], 
    message?: string,
    retryCount?: number,
    payload?: any
  ) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.currentStage = stage;
    job.stages[stage].status = status;
    if (message) job.stages[stage].message = message;
    if (retryCount !== undefined) job.stages[stage].retryCount = retryCount;

    const update: ProgressUpdate = {
      jobId,
      stage,
      status,
      message,
      retryCount: job.stages[stage].retryCount,
      payload,
    };

    if (stage === 'Storing' && status === 'completed') {
      job.finalStatus = 'Ready';
      update.finalStatus = 'Ready';
    } else if (status === 'failed' && job.stages[stage].retryCount >= 2) {
      job.finalStatus = 'Failed';
      update.finalStatus = 'Failed';
    }

    this.emit(`update:${jobId}`, update);
  }

  cleanupJob(jobId: string, delayMs = 60000) {
    // Keep job state for a bit for any late-arriving SSE connections
    setTimeout(() => {
      this.jobs.delete(jobId);
    }, delayMs);
  }
}

// Global instance to persist across HMR in dev
const globalForUpload = global as unknown as { uploadManager: UploadManager };
export const uploadManager = globalForUpload.uploadManager || new UploadManager();
if (process.env.NODE_ENV !== 'production') globalForUpload.uploadManager = uploadManager;
