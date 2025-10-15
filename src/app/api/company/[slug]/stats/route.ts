import { NextResponse } from 'next/server';
import { Application } from '@/models/Application';
import { Job } from '@/models/Job';
import { connectDB } from '@/lib/db';
import { requireAuthWithRole } from '@/lib/auth-helper';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuthWithRole('RECRUITER');

    await connectDB();

    const { slug } = await params;
    const jobs = await (Job as any).find({ companySlug: slug }).lean();
    const jobIds = jobs.map((job: any) => job._id);

    const applicationCount = await (Application as any).countDocuments({ job: { $in: jobIds } });

    return NextResponse.json({ applicationCount });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || 'Server error' }, { status });
  }
}
