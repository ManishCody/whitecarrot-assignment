import { NextResponse } from "next/server";
import { searchCompaniesByJobTitle } from "@/lib/controllers/company-controller";



export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    if (query.length < 2) {
      return NextResponse.json({ error: 'Query must be at least 2 characters long' }, { status: 400 });
    }
    const companies = await searchCompaniesByJobTitle(query);

    return NextResponse.json({
      companies,
      total: companies.length,
      page: 1,
      limit: companies.length
    }, { status: 200 });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || "Server error" }, { status });
  }
}
