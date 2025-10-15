import { connectDB } from "@/lib/db";
import { Company } from "@/models/Company";
import { Job } from "@/models/Job";

export async function listJobs(filters: {
  companySlug: string;
  location?: string;
  jobType?: string;
  title?: string;
  department?: string;
}) {
  await connectDB();

  const company = await Company.findOne({ slug: filters.companySlug });
  if (!company) {
    throw Object.assign(new Error("Company not found"), { status: 404 });
  }

  const query: Record<string, any> = { companyId: company._id };
  if (filters.location) query.location = filters.location;
  if (filters.jobType) query.jobType = filters.jobType;
  if (filters.department) query.department = filters.department;
  if (filters.title) query.title = { $regex: filters.title, $options: "i" };

  const jobs = await Job.find(query).sort({ createdAt: -1 });
  return { company, jobs };
}

export async function createJob(input: {
  companySlug: string;
  title: string;
  workPolicy: string;
  location: string;
  department: string;
  employmentType: string;
  experience: string;
  jobType: string;
  salaryRange: string;
  slug: string;
  postedDaysAgo?: number;
}) {
  await connectDB();

  const company = await Company.findOne({ slug: input.companySlug });
  if (!company) {
    throw Object.assign(new Error("Company not found"), { status: 404 });
  }

  const job = await Job.create({
    title: input.title,
    workPolicy: input.workPolicy,
    location: input.location,
    department: input.department,
    employmentType: input.employmentType,
    experience: input.experience,
    jobType: input.jobType,
    salaryRange: input.salaryRange,
    slug: input.slug,
    postedDaysAgo: input.postedDaysAgo ?? 0,
    companyId: company._id,
  });

  return job;
}

export async function updateJob(
  id: string,
  input: Partial<{
    title: string;
    location: string;
    department: string;
    employmentType: string;
    experience: string;
    jobType: string;
    salaryRange: string;
    slug: string;
    postedDaysAgo: number;
  }>
) {
  await connectDB();

  const patch: typeof input = { ...input };
  if (patch.postedDaysAgo !== undefined && patch.postedDaysAgo !== null) {
    // coerce to number
    (patch as any).postedDaysAgo = Number(patch.postedDaysAgo) || 0;
  }

  const job = await Job.findByIdAndUpdate(id, { $set: patch }, { new: true });
  if (!job) {
    throw Object.assign(new Error("Job not found"), { status: 404 });
  }
  return job;
}

export async function deleteJob(id: string) {
  await connectDB();
  const job = await Job.findByIdAndDelete(id);
  if (!job) {
    throw Object.assign(new Error("Job not found"), { status: 404 });
  }
  return { ok: true };
}
