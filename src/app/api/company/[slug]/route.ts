import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from 'next/headers';
import { getCompanyBySlug, updateCompanyBySlug } from "@/lib/controllers/company-controller";
import { verifyJwt } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    const company = await getCompanyBySlug(slug);
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    return NextResponse.json(company, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    const body = await req.json();
    
    // Try to get user info from middleware headers first
    const headerList = headers();
    let userId = (await headerList).get('x-user-id');
    let userRole = (await headerList).get('x-user-role');

    // If no user info from middleware, try to get token from cookies directly
    if (!userId) {
      const cookieStore = cookies();
      const token = (await cookieStore).get('token')?.value;
      
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      try {
        const decoded = verifyJwt(token);
        userId = decoded.sub;
        userRole = decoded.role;
      } catch (error) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const updated = await updateCompanyBySlug(slug, body, userId);
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}
