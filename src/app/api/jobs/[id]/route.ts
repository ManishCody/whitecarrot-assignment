import { NextResponse } from "next/server";
import { updateJob, deleteJob } from "@/lib/controllers/job-controller";
import { requireAuthWithRole } from "@/lib/auth-helper";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  try {
    // Require authentication
    let auth;
    try {
      auth = await requireAuthWithRole();
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { userId } = auth;

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { id } = await params;
    const job = await updateJob(id, body ?? {});
    return NextResponse.json({ job }, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    // Require authentication
    let auth;
    try {
      auth = await requireAuthWithRole();
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { userId } = auth;

    const { id } = await params;
    const result = await deleteJob(id);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}
