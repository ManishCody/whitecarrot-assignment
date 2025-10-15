import { getMyApplications } from "@/lib/controllers/application-controller";
import { NextResponse } from "next/server";
import { headers, cookies } from 'next/headers';
import { verifyJwt } from "@/lib/auth";



export async function GET() {
  try {
    const headerList = headers();
    let userId = (await headerList).get('x-user-id');
    let role = (await headerList).get('x-user-role');

    if (!userId || !role) {
      const cookieStore = cookies();
      const token = (await cookieStore).get('token')?.value;
      
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      try {
        const decoded = verifyJwt(token);
        userId = decoded.sub;
        role = decoded.role;
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (role !== 'CANDIDATE' || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await getMyApplications(userId);
    return NextResponse.json(applications);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || "Server error" }, { status });
  }
}