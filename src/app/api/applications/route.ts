import { NextRequest, NextResponse } from 'next/server';
import { Application } from '@/models/Application';
import { connectDB } from '@/lib/db';



export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const applications = await (Application as any).find({ candidate: userId }).populate('job').lean();

    return NextResponse.json(applications);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || 'Server error' }, { status });
  }
}
