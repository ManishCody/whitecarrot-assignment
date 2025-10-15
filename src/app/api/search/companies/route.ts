import { NextResponse } from "next/server";
import { searchCompaniesByJobTitle } from "@/lib/controllers/company-controller";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    if (query.length < 2) {
      return NextResponse.json({ error: 'Query must be at least 2 characters long' }, { status: 400 });
    }
    const companies = await searchCompaniesByJobTitle(query);
    return NextResponse.json(companies, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}
