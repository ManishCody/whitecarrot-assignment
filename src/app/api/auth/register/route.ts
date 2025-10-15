import { NextResponse } from "next/server";
import { registerUser } from "@/lib/controllers/auth-controller";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, recruiterCode } = body || {};
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 });
    }
    const data = await registerUser({ name, email, password, recruiterCode });
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status || 500;
    return NextResponse.json({ error: (err as { message?: string })?.message || "Server error" }, { status });
  }
}
