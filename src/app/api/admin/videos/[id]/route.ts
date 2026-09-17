import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { Video } from '@/lib/db/models/Video';
import '@/lib/db/models/Category';

async function getHandler(req: NextRequest, user: any, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await context.params;
    await dbConnect();
    const video = await Video.findById(params.id).populate('category', 'name slug color');
    if (!video) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function putHandler(req: NextRequest, user: any, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await context.params;
    const body = await req.json();
    await dbConnect();

    if (body.status === 'published' && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const video = await Video.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
      .populate('category', 'name slug color');
    if (!video) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function deleteHandler(req: NextRequest, user: any, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await context.params;
    await dbConnect();
    const video = await Video.findByIdAndDelete(params.id);
    if (!video) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export const GET = withAuth(getHandler, ['admin', 'editor']);
export const PUT = withAuth(putHandler, ['admin', 'editor']);
export const DELETE = withAuth(deleteHandler, ['admin']);

