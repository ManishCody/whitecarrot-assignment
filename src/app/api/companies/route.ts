import { NextResponse } from "next/server";
import { getCompanyBySlug, createCompany, updateCompanyBySlug } from "@/lib/controllers/company-controller";
import { requireAuth } from "@/lib/middleware/auth-middleware";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    const company = await getCompanyBySlug(slug);
    if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ company }, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}

export async function POST(req: Request) {
  try {
    requireAuth(req);

    const body = await req.json();
    const { name, slug, logoUrl, bannerUrl, cultureVideo, primaryColor, sections } = body ?? {};
    if (!name || !slug) {
      return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
    }
    const company = await createCompany({ name, slug, logoUrl, bannerUrl, cultureVideo, primaryColor, sections });
    return NextResponse.json({ company }, { status: 201 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}

export async function PUT(req: Request) {
  try {
    // auth for writes
    requireAuth(req);

    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const body = await req.json();
    const company = await updateCompanyBySlug(slug, body);
    return NextResponse.json({ company }, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}
