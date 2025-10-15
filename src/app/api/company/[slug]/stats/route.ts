import { NextResponse } from 'next/server';
import { Application } from '@/models/Application';
import { Job, IJob } from '@/models/Job';
import { connectDB } from '@/lib/db';
import { requireAuthWithRole } from '@/lib/auth-helper';

export const runtime = 'nodejs';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuthWithRole('RECRUITER');

    await connectDB();

    const { slug } = await params;
    const jobs = await Job.find({ companySlug: slug }).lean();
    const jobIds = jobs.map((job: IJob) => job._id);

    const applicationCount = await Application.countDocuments({ job: { $in: jobIds } });

    return NextResponse.json({ applicationCount });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || 'Server error' }, { status });
  }
}
