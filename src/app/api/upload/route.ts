import { buildContextChunks } from "@/lib/chunking/chunkFile";
import { NextRequest, NextResponse } from "next/server";
import { summarizeChunks } from "@/lib/embeddings/summarizeChunk";
import { embedChunks } from "@/lib/embeddings/embedChunks";
import { randomUUID } from "crypto";
import { storeChunks } from "@/lib/storing/storeChunks";
import { uploadManager } from "@/lib/upload-manager";
import { UploadStage } from "@/lib/upload-types";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper for retry logic
async function withRetry<T>(
  fn: () => Promise<T>,
  onRetry: (count: number, error: any) => void,
  maxRetries = 2
): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        onRetry(i + 1, error);
      }
    }
  }
  throw lastError;
}

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");

  if (jobId) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const onUpdate = (update: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
          if (update.finalStatus) {
            uploadManager.off(`update:${jobId}`, onUpdate);
            controller.close();
          }
        };

        uploadManager.on(`update:${jobId}`, onUpdate);

        // Send current state immediately if job exists
        const job = uploadManager.getJob(jobId);
        if (job) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(job)}\n\n`));
        }

        req.signal.addEventListener("abort", () => {
          uploadManager.off(`update:${jobId}`, onUpdate);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use Prisma to find distinct documents for this user
    const documents = await prisma.documentChunk.groupBy({
      by: ['document_id', 'document_name'],
      where: {
        userId: session.userId,
      },
      _max: {
        created_at: true,
      },
      orderBy: {
        _max: {
          created_at: 'desc',
        },
      },
    });

    const result = documents.map(doc => ({
      id: doc.document_id,
      name: doc.document_name,
      createdAt: doc._max!.created_at,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Fetch documents error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "File missing" }, { status: 400 });

    const jobId = randomUUID();
    uploadManager.createJob(jobId, file.name);

    // Capture file content before returning response to ensure persistence in background
    const buffer = await file.arrayBuffer();
    const fileName = file.name;
    const fileType = file.type;

    // Start processing in the background
    processUpload(jobId, buffer, fileName, fileType, session.userId).catch(err => {
      console.error(`Background processing failed for ${jobId}:`, err);
    });

    return NextResponse.json({ jobId }, { status: 202 });
  } catch (error: any) {
    console.error("Upload POST API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function processUpload(jobId: string, buffer: ArrayBuffer, fileName: string, fileType: string, userId: string) {
  try {
    const fileBlob = new Blob([buffer], { type: fileType });

    // 1. Parsing
    const parsedData = await withRetry(
      async () => {
        uploadManager.updateStage(jobId, "Parsing", "in-progress");
        const fastApiForm = new FormData();
        fastApiForm.append("file", fileBlob, fileName);
        
        console.log(`[${jobId}] Sending request to FastAPI parser...`);
        const fastApiResponse = await fetch("http://127.0.0.1:8000/parse", {
          method: "POST",
          body: fastApiForm,
        });
        
        if (!fastApiResponse.ok) {
          const errorText = await fastApiResponse.text();
          throw new Error(`Parsing failed: ${fastApiResponse.status} ${errorText}`);
        }
        const data = await fastApiResponse.json();
        
        // Validate response structure
        if (!data || typeof data !== 'object') {
          throw new Error("Invalid response from parser: Not an object");
        }
        
        if (!Array.isArray(data.section_blocks)) {
          console.error(`[${jobId}] Missing section_blocks. Keys found:`, Object.keys(data));
          throw new Error("Invalid response from parser: Missing section_blocks array");
        }

        console.log(`[${jobId}] Parsing successful. Received ${data.section_blocks.length} blocks.`);
        return data;
      },
      (count, err) => {
        console.warn(`Retry ${count} for Parsing ${jobId}:`, err.message);
        uploadManager.updateStage(jobId, "Parsing", "retrying", `Retry ${count}/2`, count);
      }
    );
    uploadManager.updateStage(jobId, "Parsing", "completed", undefined, undefined, { 
      blockCount: parsedData.section_blocks.length,
      sampleBlock: parsedData.section_blocks[0]
    });

    // 2. Chunking
    const chunks = await withRetry(
      async () => {
        uploadManager.updateStage(jobId, "Chunking", "in-progress");
        console.log(`[${jobId}] Starting chunking...`);
        const result = buildContextChunks(parsedData.section_blocks);
        console.log(`[${jobId}] Chunking successful. Created ${result.length} chunks.`);
        return result;
      },
      (count, err) => {
        console.error(`[${jobId}] Chunking error:`, err.message);
        uploadManager.updateStage(jobId, "Chunking", "retrying", `Retry ${count}/2`, count);
      }
    );
    uploadManager.updateStage(jobId, "Chunking", "completed", undefined, undefined, { 
      chunkCount: chunks.length,
      sampleChunk: chunks[0]
    });

    // 3. Summarizing
    let summarizedChunks:any =[];
    try {
      uploadManager.updateStage(jobId, "Summarizing", "in-progress");
      console.log(`[${jobId}] Starting summarization...`);
      summarizedChunks = await summarizeChunks(chunks);
      console.log(`[${jobId}] Summarization complete.`);
      uploadManager.updateStage(jobId, "Summarizing", "completed", undefined, undefined, { 
        count: summarizedChunks.length,
        sampleSummary: typeof summarizedChunks[0]?.summary === 'string' 
          ? summarizedChunks[0].summary.substring(0, 100) + "..."
          : "Complex data structure"
      });
    } catch (error: any) {
      console.error(`[${jobId}] Summarization failed:`, error.message);
      uploadManager.updateStage(jobId, "Summarizing", "failed", error.message);
      throw error; // Re-throw to stop the pipeline
    }

    // 4. Embedding (with proper error handling for rate limits)
    let embeddedChunks:any =[];
    try {
      uploadManager.updateStage(jobId, "Embedding", "in-progress");
      console.log(`[${jobId}] Starting embedding...`);
      embeddedChunks = await embedChunks(summarizedChunks);
      console.log(`[${jobId}] Embedding complete.`);
      uploadManager.updateStage(jobId, "Embedding", "completed", undefined, undefined, { 
        count: embeddedChunks.length,
        vectorDim: embeddedChunks[0]?.embeddings?.text?.length 
      });
    } catch (error: any) {
      console.error(`[${jobId}] Embedding failed:`, error.message);
      uploadManager.updateStage(jobId, "Embedding", "failed", error.message);
      throw error; // Re-throw to stop the pipeline
    }

    // 5. Storing
    await withRetry(
      async () => {
        uploadManager.updateStage(jobId, "Storing", "in-progress");
        const documentId = randomUUID();
        await storeChunks(documentId, fileName, userId, embeddedChunks);
      },
      (count) => uploadManager.updateStage(jobId, "Storing", "retrying", `Retry ${count}/2`, count)
    );
    uploadManager.updateStage(jobId, "Storing", "completed", undefined, undefined, { success: true });

    uploadManager.cleanupJob(jobId);
  } catch (error: any) {
    console.error(`Error in processUpload for ${jobId}:`, error.message);
    const currentStage = uploadManager.getJob(jobId)?.currentStage || "Parsing";
    uploadManager.updateStage(jobId, currentStage, "failed", error.message, 2);
    uploadManager.cleanupJob(jobId);
  }
}
