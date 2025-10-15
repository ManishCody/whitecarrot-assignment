import { NextRequest, NextResponse } from 'next/server';
import { Application } from '@/models/Application';
import { connectDB } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const applications = await Application.find({ candidate: userId }).populate('job').lean();

    return NextResponse.json(applications);
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || 'Server error' }, { status });
  }
}
