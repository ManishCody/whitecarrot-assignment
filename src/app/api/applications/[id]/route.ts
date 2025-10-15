import { NextResponse } from 'next/server';
import { Application } from '@/models/Application';
import { connectDB } from '@/lib/db';
import { requireAuthWithRole } from '@/lib/auth-helper';

export const runtime = 'nodejs';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuthWithRole('RECRUITER');

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    await connectDB();

    // TODO: Add a check to ensure the recruiter owns the company associated with this application

    const { id } = await params;
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('candidate').populate('job').lean();

    if (!updatedApplication) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(updatedApplication);
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || 'Server error' }, { status });
  }
}
