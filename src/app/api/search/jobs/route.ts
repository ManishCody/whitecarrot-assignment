import { NextResponse } from "next/server";
import { searchJobs } from "@/lib/controllers/search-controller";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const jobs = await searchJobs(query);
    return NextResponse.json(jobs, { status: 200 });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || "Server error" }, { status });
  }
}
