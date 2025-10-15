import { NextResponse } from "next/server";
import { loginUser } from "@/lib/controllers/auth-controller";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const data = await loginUser({ email, password });
    const response = NextResponse.json({ user: data.user }, { status: 200 });
    
    // Set secure flag based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookies.set('token', data.token, { 
      httpOnly: true, 
      secure: isProduction, 
      sameSite: 'lax',
      path: '/', 
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return response;
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status || 500;
    return NextResponse.json({ error: (err as { message?: string })?.message || "Server error" }, { status });
  }
}
