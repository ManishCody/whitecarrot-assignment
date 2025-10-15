import { NextResponse } from "next/server";
import { searchJobs } from "@/lib/controllers/search-controller";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const jobs = await searchJobs(query);
    return NextResponse.json(jobs, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}
