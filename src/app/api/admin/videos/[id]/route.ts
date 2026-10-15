import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { Video } from '@/lib/db/models/Video';
import '@/lib/db/models/Category';

async function resolveParams(context: { params: Promise<{ id: string }> | { id: string } }): Promise<{ id: string }> {
  return context.params instanceof Promise ? await context.params : context.params;
}

function getCreatorId(createdBy: any): string | null {
  if (!createdBy) return null;
  if (typeof createdBy === 'object' && '_id' in createdBy) {
    return createdBy._id?.toString() || null;
  }
  return typeof createdBy.toString === 'function' ? createdBy.toString() : String(createdBy);
}

async function getHandler(req: NextRequest, user: any, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await resolveParams(context);
    await dbConnect();

    const video = await Video.findById(params.id)
      .populate('category', 'name slug color')
      .populate('createdBy', 'name email role');

    if (!video) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Authorization: owner can view all, admin can only view their own
    if (user.role !== 'owner') {
      const creatorId = getCreatorId(video.createdBy);
      const isCreator = creatorId === user.id;

      if (!isCreator) {
        return NextResponse.json(
          { error: 'अनधिकृत: आप अन्य एडमिन द्वारा जोड़े गए वीडियो नहीं देख सकते।' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function putHandler(req: NextRequest, user: any, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await resolveParams(context);
    const body = await req.json();
    await dbConnect();

    const existing = await Video.findById(params.id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Authorization: owner can edit all, admin can only edit their own
    if (user.role !== 'owner') {
      const creatorId = getCreatorId(existing.createdBy);
      const isCreator = creatorId === user.id;
      if (!isCreator) {
        return NextResponse.json(
          { error: 'अनधिकृत: आप अन्य एडमिन द्वारा जोड़े गए वीडियो संपादित नहीं कर सकते।' },
          { status: 403 }
        );
      }
    }

    // Handle scheduled status and dates
    if (body.status === 'scheduled') {
      if (!body.scheduledAt) {
        return NextResponse.json(
          { error: 'शेड्यूल करने के लिए प्रकाशन का समय चुनना अनिवार्य है।' },
          { status: 400 }
        );
      }
      const schedDate = new Date(body.scheduledAt);
      if (isNaN(schedDate.getTime())) {
        return NextResponse.json({ error: 'अमान्य तारीख या समय।' }, { status: 400 });
      }
      if (schedDate <= new Date()) {
        body.status = 'published';
        body.publishedAt = new Date();
        body.scheduledAt = null;
      } else {
        body.scheduledAt = schedDate;
      }
    } else if (body.status === 'published') {
      body.publishedAt = existing.publishedAt || new Date();
      body.scheduledAt = null;
    } else {
      body.scheduledAt = null;
    }

    if (user.role !== 'owner') {
      delete body.createdBy;
    }

    const video = await Video.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
      .populate('category', 'name slug color')
      .populate('createdBy', 'name email role');

    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function deleteHandler(req: NextRequest, user: any, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await resolveParams(context);
    await dbConnect();

    const existing = await Video.findById(params.id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Authorization: owner can delete all, admin can only delete their own
    if (user.role !== 'owner') {
      const creatorId = getCreatorId(existing.createdBy);
      const isCreator = creatorId === user.id;
      if (!isCreator) {
        return NextResponse.json(
          { error: 'अनधिकृत: आप अन्य एडमिन द्वारा जोड़े गए वीडियो हटा नहीं सकते।' },
          { status: 403 }
        );
      }
    }

    await Video.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export const GET = withAuth(getHandler, ['admin', 'editor']);
export const PUT = withAuth(putHandler, ['admin', 'editor']);
export const DELETE = withAuth(deleteHandler, ['admin', 'editor']);
