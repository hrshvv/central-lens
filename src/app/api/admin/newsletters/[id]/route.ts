import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { NewsletterPost } from '@/lib/db/models/NewsletterPost';

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

    const newsletter = await NewsletterPost.findById(params.id).populate('createdBy', 'name email role');
    if (!newsletter) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Authorization: owner can view all, admin can only view their own
    if (user.role !== 'owner') {
      const creatorId = getCreatorId(newsletter.createdBy);
      const isCreator = creatorId === user.id;

      if (!isCreator) {
        return NextResponse.json(
          { error: 'अनधिकृत: आप अन्य एडमिन द्वारा जोड़े गए न्यूज़लेटर नहीं देख सकते।' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(newsletter);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function putHandler(req: NextRequest, user: any, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await resolveParams(context);
    const body = await req.json();
    await dbConnect();

    const existing = await NewsletterPost.findById(params.id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Authorization: owner can edit all, admin can only edit their own
    if (user.role !== 'owner') {
      const creatorId = getCreatorId(existing.createdBy);
      const isCreator = creatorId === user.id;
      if (!isCreator) {
        return NextResponse.json(
          { error: 'अनधिकृत: आप अन्य एडमिन द्वारा जोड़े गए न्यूज़लेटर संपादित नहीं कर सकते।' },
          { status: 403 }
        );
      }
    }

    if (body.status === 'sent' && !existing.sentAt) {
      body.sentAt = new Date();
    }

    if (user.role !== 'owner') {
      delete body.createdBy;
    }

    const updated = await NewsletterPost.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
      .populate('createdBy', 'name email role');

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function deleteHandler(req: NextRequest, user: any, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await resolveParams(context);
    await dbConnect();

    const existing = await NewsletterPost.findById(params.id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Authorization: owner can delete all, admin can only delete their own
    if (user.role !== 'owner') {
      const creatorId = getCreatorId(existing.createdBy);
      const isCreator = creatorId === user.id;
      if (!isCreator) {
        return NextResponse.json(
          { error: 'अनधिकृत: आप अन्य एडमिन द्वारा जोड़े गए न्यूज़लेटर हटा नहीं सकते।' },
          { status: 403 }
        );
      }
    }

    await NewsletterPost.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export const GET = withAuth(getHandler, ['admin', 'editor']);
export const PUT = withAuth(putHandler, ['admin', 'editor']);
export const DELETE = withAuth(deleteHandler, ['admin', 'editor']);
