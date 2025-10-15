import { connectDB } from '@/lib/db';
import { Company } from '@/models/Company';
import { Job } from '@/models/Job';
import { Application } from '@/models/Application';

export async function getRecruiterDashboardStats(userId: string) {
  await connectDB();

  // Find all companies created by the recruiter
  const companies = await Company.find({ createdBy: userId }).select('_id').lean();
  const companyIds = companies.map(c => c._id);

  // Find all jobs associated with those companies
  const jobs = await Job.find({ companyId: { $in: companyIds } }).select('_id').lean();
  const jobIds = jobs.map(j => j._id);

  // Count all applications for those jobs
  const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });

  return {
    totalCompanies: companies.length,
    totalJobs: jobs.length,
    totalApplications,
  };
}
