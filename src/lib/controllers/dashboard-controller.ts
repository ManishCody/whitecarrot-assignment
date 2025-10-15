import { connectDB } from '@/lib/db';
import { Company } from '@/models/Company';
import { Job } from '@/models/Job';
import { Application } from '@/models/Application';

export async function getRecruiterDashboardStats(userId: string) {
  await connectDB();

  const companies = await (Company as any).find({ createdBy: userId }).select('_id').lean();
  const companyIds = companies.map((c: { _id: unknown }) => c._id);

  const jobs = await (Job as any).find({ companyId: { $in: companyIds } }).select('_id').lean() as { _id: unknown }[];
  const jobIds = jobs.map((j: { _id: unknown }) => j._id);

  const totalApplications = await (Application as any).countDocuments({ job: { $in: jobIds } });

  return {
    totalCompanies: companies.length,
    totalJobs: jobs.length,
    totalApplications,
  };
}
