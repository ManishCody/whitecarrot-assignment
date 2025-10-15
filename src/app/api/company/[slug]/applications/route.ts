import { NextResponse } from 'next/server';
import { getApplicationsByCompany } from '@/lib/controllers/application-controller';
import { requireAuthWithRole } from '@/lib/auth-helper';



export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuthWithRole('RECRUITER');
    const { slug } = await params;
    const applications = await getApplicationsByCompany(slug);
    return NextResponse.json(applications);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || 'Server error' }, { status });
  }
}
