import { connectDB } from "@/lib/db";
import { Company } from "@/models/Company";
import { Job } from "@/models/Job";

export async function searchCompanies(query: string) {
  await connectDB();
  const companies = await Company.find({
    name: { $regex: query, $options: 'i' },
    isPublished: true
  }).select('name slug').lean();
  return companies;
}

export async function searchJobs(query: string) {
  await connectDB();
  const jobs = await Job.aggregate([
    {
      $lookup: {
        from: 'companies',
        localField: 'companyId',
        foreignField: '_id',
        as: 'company'
      }
    },
    {
      $unwind: '$company'
    },
    {
      $match: {
        'company.isPublished': true,
        title: { $regex: query, $options: 'i' }
      }
    },
    {
      $project: {
        title: 1,
        location: 1,
        companyName: '$company.name',
        companySlug: '$company.slug'
      }
    }
  ]);
  return jobs;
}
