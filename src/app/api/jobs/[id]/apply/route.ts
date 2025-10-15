import { NextRequest, NextResponse } from 'next/server';
import { Application } from '@/models/Application';
import { connectDB } from '@/lib/db';
import { requireAuthWithRole } from '@/lib/auth-helper';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require authentication
    let auth;
    try {
      auth = await requireAuthWithRole('CANDIDATE');
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { userId } = auth;

    await connectDB();

    const { id: jobId } = await params;

    const existingApplication = await Application.findOne({ job: jobId, candidate: userId });
    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied for this job' }, { status: 409 });
    }

    const application = await Application.create({ job: jobId, candidate: userId });

    return NextResponse.json(application, { status: 201 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || 'Server error' }, { status });
  }
}
