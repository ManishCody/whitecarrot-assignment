import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from 'next/headers';
import { createCompany, getCompaniesByCreator } from "@/lib/controllers/company-controller";
import { Company } from "@/models/Company";
import { verifyJwt } from "@/lib/auth";



export async function GET(req: NextRequest) {
  try {
    const headerList = headers();
    let userId = (await headerList).get('x-user-id');
    let role = (await headerList).get('x-user-role');

    if (!userId || !role) {
      const cookieStore = cookies();
      const token = (await cookieStore).get('token')?.value;
      
      if (token) {
        try {
          const decoded = verifyJwt(token);
          userId = decoded.sub;
          role = decoded.role;
        } catch (error) {
        }
      }
    }

    if (role === 'RECRUITER' && userId) {
      const companies = await getCompaniesByCreator(userId);
      return NextResponse.json(companies);
    }
    
    const companies = await Company.find({ isPublished: true }).lean();
    return NextResponse.json(companies);
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const headerList = headers();
    let userId = (await headerList).get('x-user-id');
    let role = (await headerList).get('x-user-role');

    if (!userId || !role) {
      const cookieStore = cookies();
      const token = (await cookieStore).get('token')?.value;
      
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      try {
        const decoded = verifyJwt(token);
        userId = decoded.sub;
        role = decoded.role;
      } catch (error) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (role !== 'RECRUITER' || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug } = await req.json();
    
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const company = await createCompany({ name, slug, createdBy: userId });
    return NextResponse.json(company, { status: 201 });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || "Server error" }, { status });
  }
}