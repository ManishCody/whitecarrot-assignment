import { connectDB } from "@/lib/db";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company";
import { User } from "@/models/User";

export async function getMyApplications(userId: string) {
  await connectDB();
  const applications = await Application.find({ candidate: userId })
    .populate({ path: 'job', model: Job, select: 'title' })
    .lean();
  return applications;
}

export async function getApplicationsByCompany(companySlug: string) {
  await connectDB();
  const company = await Company.findOne({ slug: companySlug });
  if (!company) {
    throw new Error('Company not found');
  }

  const jobs = await Job.find({ companyId: company._id });
  const jobIds = jobs.map(job => job._id);

  const applications = await Application.find({ job: { $in: jobIds } })
    .populate({ path: 'candidate', model: User, select: 'name email' })
    .populate({ path: 'job', model: Job, select: 'title' })
    .lean();

  return applications;
}

export async function getMyApplicationJobIds(userId: string) {
  await connectDB();
  const applications = await Application.find({ candidate: userId }).select("job").lean();
  return applications.map(app => String(app.job));
}
