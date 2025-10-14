import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth-middleware";
import { updateJob, deleteJob } from "@/lib/controllers/job-controller";

export const runtime = "nodejs";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  try {
    requireAuth(req);

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const job = await updateJob(params.id, body ?? {});
    return NextResponse.json({ job }, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    requireAuth(_req);

    const result = await deleteJob(params.id);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}
