import { buildContextChunks } from "@/lib/chunking/chunkFile";
import { NextRequest, NextResponse } from "next/server";
import { summarizeChunks } from "@/lib/embeddings/summarizeChunk";
import { embedChunks } from "@/lib/embeddings/embedChunks";
// import path from "path";
// import os from "os";
// import fs from "fs/promises";
// import { randomUUID } from "crypto";
// import { parseFile } from "@/lib/parsing/parseFile";
// import { cleanText } from "@/lib/cleaning/cleanText";
export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ message: "Hello" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "File missing" }, { status: 400 });

    const fastApiForm = new FormData();
    fastApiForm.append("file", file, file.name);

    const fastApiResponse = await fetch("http://localhost:8000/parse", {
      method: "POST",
      body: fastApiForm,
    });
    if (!fastApiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to parse file" },
        { status: 500 }
      );
    }
    const parsedData = await fastApiResponse.json();
    // Build Chunks
    const chunks = buildContextChunks(parsedData.section_blocks)
    // Embed
    const summarizedChunks = await summarizeChunks(chunks);
    // ---------- EMBED (TEXT + SUMMARY) ----------
    const embeddedChunks = await embedChunks(summarizedChunks);
    // Chunk
    // const chunks = await chunkFile(parsedDocs)
    // if (!chunks || chunks.length === 0) {
    //   return NextResponse.json({ error: "File produced no chunks" }, { status: 400 })
    // }
    // Embed
    // const embeddings = await embedWithOpenAI(chunks)
    // if (!embeddings) {
    //   return NextResponse.json({ error: "Embedding failed" }, { status: 500 })
    // }
    // const documentId = randomUUID();
    // const documentName = file.name;

    //      await storeEmbeddings({
    //       chunks,
    //   embeddings,
    //   fileUrl : tempPath,
    //   fileType:fileType!,
    //   documentId,
    //   documentName,
    //      })

    return NextResponse.json({ embeddedChunks }, { status: 200 });
  } catch (error: any) {
    console.log(error.message, "Upload API error");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
