import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import { INITIAL_KEYWORDS } from '@/lib/dummy-data';
import { categorizeKeywords } from '@/lib/utils';

/**
 * POST: Seed Default Keywords
 */
export async function POST() {
  try {
    console.log('Seeding default keywords...');
    // Check if already seeded to prevent duplicates
    const count = await prisma.keywords.count({
      where: { isCustom: false }
    });

    if (count > 0) {
      return NextResponse.json({ message: 'Default keywords already seeded' }, { status: 400 });
    }

    const categorized = categorizeKeywords(INITIAL_KEYWORDS);
    const dataToSeed: { keyword: string; category: string; isActive: boolean; isCustom: boolean; createdAt: Date }[] = [];

    Object.entries(categorized).forEach(([category, keywords]) => {
      keywords.forEach((keyword) => {
        dataToSeed.push({
          keyword,
          category,
          isActive: true, // Default keywords are active
          isCustom: false,
          createdAt: new Date(),
        });
      });
    });

    const createdCount = await prisma.keywords.createMany({
      data: dataToSeed,
    });

    return NextResponse.json({ 
      message: 'Successfully seeded default keywords', 
      count: createdCount.count 
    });
  } catch (error) {
    console.error('Error seeding keywords:', error);
    return NextResponse.json({ error: 'Failed to seed keywords' }, { status: 500 });
  }
}
