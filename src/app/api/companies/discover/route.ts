import { NextResponse } from "next/server";
import { getDiscoverCompanies } from "@/lib/controllers/company-controller";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const data = await getDiscoverCompanies(page, limit);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}
