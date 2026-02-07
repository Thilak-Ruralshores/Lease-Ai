import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { leaseKeywordQueries } from '@/lib/keywordsEmbeddingTemplate';
import { categorizeKeywords } from '@/lib/utils';
import { embeddingsModel } from '@/lib/openai/openai';
import { randomUUID } from 'crypto';

/**
 * POST: Seed Default Keywords with Embeddings
 */
export async function POST() {
  try {
    // const session = await getSession();
    // if (!session || session.role !== 'ORG_ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    // }

    console.log('Seeding default keywords with embeddings...');

    // 1. Check if already seeded to prevent duplicates
    const count = await prisma.keywords.count({
      where: { isCustom: false }
    });

   if (count > 0) {
  console.log('Existing default keywords found. Clearing table before reseeding...');

  await prisma.$executeRaw`
    TRUNCATE TABLE "Keywords" RESTART IDENTITY CASCADE
  `;
}


    // 2. Prepare keywords and categories
    const allKeywordStrings = leaseKeywordQueries.map(q => q.keyword);
    const categorized = categorizeKeywords(allKeywordStrings);
    
    // Create a reverse map for easy lookup: keyword -> category
    const keywordToCategory: Record<string, string> = {};
    Object.entries(categorized).forEach(([category, keywords]) => {
      keywords.forEach(kw => {
        keywordToCategory[kw] = category;
      });
    });

    const fullData = leaseKeywordQueries.map(entry => ({
      keyword: entry.keyword,
      query: entry.query,
      category: keywordToCategory[entry.keyword] || 'Legal, Compliance & ESG', // Fallback category
      isActive: true,
      isCustom: false,
    }));

    // 3. Batched Embedding Generation and Insertion
    const BATCH_SIZE = 10;
    const results = {
      success: 0,
      failed: 0,
      failures: [] as { keyword: string; error: string }[],
    };

    for (let i = 0; i < fullData.length; i += BATCH_SIZE) {
      const currentBatch = fullData.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(fullData.length / BATCH_SIZE)}...`);

      try {
        // Generate embeddings for the batch
        const batchQueries = currentBatch.map(item => item.query);
        const embeddings = await embeddingsModel.embedDocuments(batchQueries);

        // Insert into DB one by one in the batch to handle pgvector Unsupported type via raw SQL
        // We do this sequentially to respect rate limits and ensure stability
        for (let j = 0; j < currentBatch.length; j++) {
          const item = currentBatch[j];
          const embedding = embeddings[j];

          try {
            const id = randomUUID();
            const createdAt = new Date();

            // Using row SQL because Prisma doesn't natively support the pgvector 'vector' type in 'create'
            await prisma.$executeRaw`
              INSERT INTO "Keywords" ("id", "keyword", "category", "query", "query_emb", "isCustom", "isActive", "createdAt")
              VALUES (${id}, ${item.keyword}, ${item.category}, ${item.query}, ${embedding}::vector, ${item.isCustom}, ${item.isActive}, ${createdAt})
            `;
            results.success++;
          } catch (insertError: any) {
            console.error(`Failed to insert keyword "${item.keyword}":`, insertError);
            results.failed++;
            results.failures.push({ keyword: item.keyword, error: insertError.message || 'Insertion failed' });
          }
        }
      } catch (batchError: any) {
        console.error(`Failed to process embedding batch starting at index ${i}:`, batchError);
        // Mark all items in this batch as failed
        currentBatch.forEach(item => {
          results.failed++;
          results.failures.push({ keyword: item.keyword, error: `Batch embedding generation failed: ${batchError.message}` });
        });
      }
    }

    return NextResponse.json({ 
      message: 'Completed seeding default keywords', 
      summary: {
        total: fullData.length,
        success: results.success,
        failed: results.failed
      },
      failures: results.failures.length > 0 ? results.failures : undefined
    });

  } catch (error) {
    console.error('Fatal error seeding keywords:', error);
    return NextResponse.json({ error: 'Failed to seed keywords due to a fatal error' }, { status: 500 });
  }
}
