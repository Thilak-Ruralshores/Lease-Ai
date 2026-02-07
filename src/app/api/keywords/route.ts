import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import { getSession } from '@/lib/auth';

/**
 * GET: Fetch all keywords from the database
 */
export async function GET() {
  try {
    const keywords = await prisma.keywords.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json({ error: 'Failed to fetch keywords' }, { status: 500 });
  }
}

/**
 * POST: Add Custom Keyword
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ORG_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { keyword, category } = body;

    if (!keyword || !category) {
      return NextResponse.json({ error: 'Keyword and Category are required' }, { status: 400 });
    }

    // 1. Check if the keyword already exists GLOBALLY (case-insensitive)
    const existingKeyword = await prisma.keywords.findFirst({
      where: {
        keyword: {
          equals: keyword,
          mode: 'insensitive'
        }
      }
    });

    if (existingKeyword) {
      return NextResponse.json({ 
        error: `Keyword already exists in category: ${existingKeyword.category}` 
      }, { status: 400 });
    }

    // 2. Check for category consistency (case-insensitive match but different casing)
    const existingCategory = await prisma.keywords.findFirst({
      where: {
        category: {
          equals: category,
          mode: 'insensitive'
        }
      }
    });

    if (existingCategory && existingCategory.category !== category) {
      return NextResponse.json({ 
        error: `Category already exists with different casing: "${existingCategory.category}". Please use the existing casing.` 
      }, { status: 400 });
    }

    const newKeyword = await prisma.keywords.create({
      data: {
        keyword,
        category,
        isActive: false,
        isCustom: true,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(newKeyword);
  } catch (error) {
    console.error('Error adding custom keyword:', error);
    return NextResponse.json({ error: 'Failed to add keyword' }, { status: 500 });
  }
}
