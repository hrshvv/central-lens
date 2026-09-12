import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Category } from '@/lib/db/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
