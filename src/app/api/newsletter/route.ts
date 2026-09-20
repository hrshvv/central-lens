import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Newsletter } from '@/lib/db/models/Newsletter';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'कृपया एक वैध ईमेल पता दर्ज करें।' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    await dbConnect();
    
    const existing = await Newsletter.findOne({ email: cleanEmail });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
      }
      return NextResponse.json({ 
        success: true, 
        message: 'आप पहले से ही सेंट्रल लेंस न्यूज़लेटर से जुड़े हुए हैं!' 
      });
    }

    await Newsletter.create({ email: cleanEmail });

    return NextResponse.json({ 
      success: true, 
      message: 'धन्यवाद! आप सेंट्रल लेंस न्यूज़लेटर से सफलतापूर्वक जुड़ गए हैं।' 
    }, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'सर्वर त्रुटि। कृपया कुछ समय बाद पुनः प्रयास करें।' }, { status: 500 });
  }
}
