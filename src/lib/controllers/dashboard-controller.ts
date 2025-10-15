import { connectDB } from '@/lib/db';
import { Company } from '@/models/Company';
import { Job } from '@/models/Job';
import { Application } from '@/models/Application';

export async function getRecruiterDashboardStats(userId: string) {
  await connectDB();

  const companies = await Company.find({ createdBy: userId }).select('_id').lean();
  const companyIds = companies.map((c: { _id: any }) => c._id);

  const jobs = await Job.find({ companyId: { $in: companyIds } }).select('_id').lean() as { _id: any }[];
  const jobIds = jobs.map((j: { _id: any }) => j._id);

  const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });

  return {
    totalCompanies: companies.length,
    totalJobs: jobs.length,
    totalApplications,
  };
}
