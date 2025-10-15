import { NextResponse } from "next/server";
import { publishCompanyBySlug, unpublishCompanyBySlug } from "@/lib/controllers/company-controller";



export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    const company = await publishCompanyBySlug(slug);
    return NextResponse.json(company, { status: 200 });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || "Server error" }, { status });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    const company = await unpublishCompanyBySlug(slug);
    return NextResponse.json(company, { status: 200 });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || "Server error" }, { status });
  }
}
