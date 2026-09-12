import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { Video } from '@/lib/db/models/Video';

async function getHandler(req: NextRequest, user: any, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const video = await Video.findById(params.id).populate('category', 'name');
    if (!video) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function putHandler(req: NextRequest, user: any, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await dbConnect();
    const video = await Video.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!video) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function deleteHandler(req: NextRequest, user: any, { params }: { params: { id: string } }) {
  try {
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
