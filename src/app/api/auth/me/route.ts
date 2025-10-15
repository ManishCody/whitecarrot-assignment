import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from 'next/headers';
import { getUserById } from "@/lib/controllers/auth-controller";
import { verifyJwt } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Try to get user ID from middleware headers first
    const headerList = headers();
    let userId = (await headerList).get('x-user-id');
    
    // If no user ID from middleware, try to get token from cookies directly
    if (!userId) {
      const cookieStore = cookies();
      const token = (await cookieStore).get('token')?.value;
      
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      try {
        const decoded = verifyJwt(token);
        userId = decoded.sub;
      } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}