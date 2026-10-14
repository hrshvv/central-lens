import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { Article } from '@/lib/db/models/Article';
import { Video } from '@/lib/db/models/Video';
import bcrypt from 'bcryptjs';

async function getHandler(req: NextRequest, user: any) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const roleFilter = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    await dbConnect();

    const query: any = {};
    if (roleFilter && roleFilter !== 'all') {
      query.role = roleFilter;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total, totalOwners, totalAdmins, totalEditors, totalReaders] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'editor' }),
      User.countDocuments({ role: 'reader' }),
    ]);

    // Enhance users with article and video counts
    const userIds = users.map((u) => u._id);
    const [articleCounts, videoCounts] = await Promise.all([
      Article.aggregate([
        { $match: { createdBy: { $in: userIds } } },
        { $group: { _id: '$createdBy', count: { $sum: 1 } } },
      ]),
      Video.aggregate([
        { $match: { createdBy: { $in: userIds } } },
        { $group: { _id: '$createdBy', count: { $sum: 1 } } },
      ]),
    ]);

    const articleMap = new Map(articleCounts.map((a) => [a._id.toString(), a.count]));
    const videoMap = new Map(videoCounts.map((v) => [v._id.toString(), v.count]));

    const enrichedUsers = users.map((u) => ({
      ...u,
      articlesCount: articleMap.get(u._id.toString()) || 0,
      videosCount: videoMap.get(u._id.toString()) || 0,
    }));

    return NextResponse.json({
      data: enrichedUsers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        counts: {
          owners: totalOwners,
          admins: totalAdmins,
          editors: totalEditors,
          readers: totalReaders,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

async function postHandler(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'नाम, ईमेल और पासवर्ड आवश्यक हैं।' }, { status: 400 });
    }

    const validRoles = ['reader', 'editor', 'admin', 'owner'];
    const assignedRole = validRoles.includes(role) ? role : 'reader';

    await dbConnect();

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ error: 'यह ईमेल पहले से पंजीकृत है।' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: assignedRole,
    });

    const userObj = newUser.toObject();
    delete (userObj as any).passwordHash;

    return NextResponse.json(userObj, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// Strictly restricted to owner only!
export const GET = withAuth(getHandler, ['owner']);
export const POST = withAuth(postHandler, ['owner']);
