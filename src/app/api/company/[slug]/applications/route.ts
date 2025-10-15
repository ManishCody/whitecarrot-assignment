import { NextResponse } from 'next/server';
import { getApplicationsByCompany } from '@/lib/controllers/application-controller';
import { requireAuthWithRole } from '@/lib/auth-helper';

export const runtime = 'nodejs';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuthWithRole('RECRUITER');
    const { slug } = await params;
    const applications = await getApplicationsByCompany(slug);
    return NextResponse.json(applications);
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    const status = err instanceof Error && 'status' in err ? (err as any).status : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
