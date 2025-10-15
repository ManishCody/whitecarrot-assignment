import { NextResponse } from "next/server";
import { updateJob, deleteJob } from "@/lib/controllers/job-controller";
import { requireAuthWithRole } from "@/lib/auth-helper";



type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  try {
    await requireAuthWithRole('RECRUITER');
    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { id } = await params;
    const job = await updateJob(id, body ?? {});
    return NextResponse.json({ job }, { status: 200 });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || "Server error" }, { status });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const result = await deleteJob(id);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status || 500;
    return NextResponse.json({ error: error?.message || "Server error" }, { status });
  }
}
