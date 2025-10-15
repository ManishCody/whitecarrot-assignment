import { getMyApplications } from "@/lib/controllers/application-controller";
import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from 'next/headers';
import { verifyJwt } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Try to get user info from middleware headers first
    const headerList = headers();
    let userId = (await headerList).get('x-user-id');
    let role = (await headerList).get('x-user-role');

    // If no user info from middleware, try to get token from cookies directly
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
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (role !== 'CANDIDATE' || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await getMyApplications(userId);
    return NextResponse.json(applications);
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}