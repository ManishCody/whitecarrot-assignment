import { NextResponse } from "next/server";
import { headers, cookies } from 'next/headers';
import { getCompanyBySlugForEdit } from "@/lib/controllers/company-controller";
import { verifyJwt } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Try to get user info from middleware headers first
    const headerList = headers();
    let userId = (await headerList).get('x-user-id');
    let userRole = (await headerList).get('x-user-role');

    // If no user info from middleware, try to get token from cookies directly
    if (!userId || !userRole) {
      const cookieStore = cookies();
      const token = (await cookieStore).get('token')?.value;
      
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      try {
        const decoded = verifyJwt(token);
        userId = decoded.sub;
        userRole = decoded.role;
      } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!userId || userRole !== 'RECRUITER') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const company = await getCompanyBySlugForEdit(slug, userId);
    return NextResponse.json(company, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}
