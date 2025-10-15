import { NextResponse } from "next/server";
import { listJobs, createJob } from "@/lib/controllers/job-controller";
import { requireAuthWithRole } from "@/lib/auth-helper";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const companySlug = url.searchParams.get("slug");
    if (!companySlug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    const location = url.searchParams.get("location") || undefined;
    const jobType = url.searchParams.get("jobType") || undefined;
    const title = url.searchParams.get("title") || undefined;
    const department = url.searchParams.get("department") || undefined;

    const { company, jobs } = await listJobs({ companySlug, location, jobType, title, department });
    return NextResponse.json({ company, jobs }, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}

export async function POST(req: Request) {
  try {
    // Require authentication for job creation
    let auth;
    try {
      auth = await requireAuthWithRole();
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const required = [
      "companySlug",
      "title",
      "workPolicy",
      "location",
      "department",
      "employmentType",
      "experience",
      "jobType",
      "salaryRange",
      "slug",
    ];
    const missing = required.filter((k) => !body?.[k]);
    if (missing.length) {
      return NextResponse.json({ error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
    }

    const job = await createJob({
      companySlug: body.companySlug,
      title: body.title,
      workPolicy: body.workPolicy,
      location: body.location,
      department: body.department,
      employmentType: body.employmentType,
      experience: body.experience,
      jobType: body.jobType,
      salaryRange: body.salaryRange,
      slug: body.slug,
      postedDaysAgo: body.postedDaysAgo ?? 0,
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}
