import { NextRequest, NextResponse } from "next/server";
import { createCompany } from "@/lib/controllers/company-controller";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ["name", "slug"] as const;
    for (const key of required) {
      if (!body?.[key]) {
        return NextResponse.json({ error: `${key} is required` }, { status: 400 });
      }
    }
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const created = await createCompany(body, userId);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}
