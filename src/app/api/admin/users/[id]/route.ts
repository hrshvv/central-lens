import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';

async function resolveParams(context: { params: Promise<{ id: string }> | { id: string } }): Promise<{ id: string }> {
  return context.params instanceof Promise ? await context.params : context.params;
}

async function putHandler(req: NextRequest, currentUser: any, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await resolveParams(context);
    const body = await req.json();
    const { role } = body;

    const validRoles = ['reader', 'editor', 'admin', 'owner'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'अमान्य भूमिका (Invalid role)। मान्य भूमिकाएं: reader, editor, admin, owner हैं।' }, { status: 400 });
    }

    await dbConnect();

    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: 'उपयोगकर्ता नहीं मिला (User not found)' }, { status: 404 });
    }

    // Safety guard: If target user is an owner and we're demoting them, make sure at least one other owner exists
    if (targetUser.role === 'owner' && role !== 'owner') {
      const ownerCount = await User.countDocuments({ role: 'owner' });
      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: 'सुरक्षा नियम: सिस्टम में कम से कम 1 ओनर (Owner) होना अनिवार्य है। आप अंतिम ओनर की भूमिका नहीं बदल सकते।' },
          { status: 400 }
        );
      }
    }

    targetUser.role = role;
    await targetUser.save();

    const result = targetUser.toObject();
    delete (result as any).passwordHash;

    return NextResponse.json({
      success: true,
      message: `उपयोगकर्ता ${targetUser.name} की भूमिका को सफलता पूर्वक '${role}' में बदल दिया गया है।`,
      user: result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

async function deleteHandler(req: NextRequest, currentUser: any, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await resolveParams(context);
    await dbConnect();

    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: 'उपयोगकर्ता नहीं मिला' }, { status: 404 });
    }

    // Prevent deleting self
    if (targetUser._id.toString() === currentUser.id) {
      return NextResponse.json({ error: 'आप अपना स्वयं का खाता नहीं हटा सकते।' }, { status: 400 });
    }

    // Prevent deleting the last owner
    if (targetUser.role === 'owner') {
      const ownerCount = await User.countDocuments({ role: 'owner' });
      if (ownerCount <= 1) {
        return NextResponse.json({ error: 'अंतिम ओनर को हटाया नहीं जा सकता।' }, { status: 400 });
      }
    }

    await User.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'उपयोगकर्ता हटा दिया गया।' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// Strictly restricted to owner only!
export const PUT = withAuth(putHandler, ['owner']);
export const PATCH = withAuth(putHandler, ['owner']);
export const DELETE = withAuth(deleteHandler, ['owner']);
