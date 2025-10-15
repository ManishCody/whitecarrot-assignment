import { NextRequest, NextResponse } from 'next/server';
import { Application } from '@/models/Application';
import { connectDB } from '@/lib/db';
import { requireAuthWithRole } from '@/lib/auth-helper';



export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthWithRole('CANDIDATE');
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { userId } = auth;

    await connectDB();

    const { id: jobId } = await params;

    const existingApplication = await (Application as any).findOne({ job: jobId, candidate: userId });
    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied for this job' }, { status: 409 });
    }

    const application = await (Application as any).create({ job: jobId, candidate: userId });

    return NextResponse.json(application, { status: 201 });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || 'Server error' }, { status });
  }
}
