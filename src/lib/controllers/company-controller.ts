import { connectDB } from "@/lib/db";
import { Company, ICompany } from "@/models/Company";
import { Job, IJob } from "@/models/Job";

export type UpsertCompanyInput = Partial<ICompany>;

export async function getCompaniesByCreator(userId: string) {
  await connectDB();
  return Company.find({ createdBy: userId }).lean();
}

export async function createCompany(data: { name: string; slug: string; createdBy: string }) {
  await connectDB();
  
  const existingCompany = await Company.findOne({ slug: data.slug });
  if (existingCompany) {
    throw Object.assign(new Error("Company with this slug already exists"), { status: 400 });
  }
  
  const company = await Company.create({
    name: data.name,
    slug: data.slug,
    createdBy: data.createdBy,
    isPublished: false,
    sections: []
  });
  
  return company;
}



export async function getDiscoverCompanies(page: number = 1, limit: number = 10) {
  await connectDB();
  const skip = (page - 1) * limit;
  const companies = await Company.find({ isPublished: true })
    .select('name slug')
    .skip(skip)
    .limit(limit)
    .lean();

  const companyIds = companies.map((c: ICompany) => c._id);
  const jobs: IJob[] = await Job.find({ companyId: { $in: companyIds } }).select('title companyId').lean();

  const companiesWithJobData = companies.map((company: ICompany) => {
    const companyJobs = jobs.filter((job: IJob) => String(job.companyId) === String(company._id));
    return {
      ...company,
      jobCount: companyJobs.length,
      jobTitles: companyJobs.map((job: IJob) => job.title).slice(0, 3), // Show up to 3 job titles
    };
  });

  const total = await Company.countDocuments({ isPublished: true });
  return { companies: companiesWithJobData, total, page, limit };
}

export async function getCompanyBySlugForEdit(slug: string, userId: string) {
  await connectDB();
  const company = await Company.findOne({ slug });
  if (!company) {
    throw Object.assign(new Error("Company not found"), { status: 404 });
  }
  if (String(company.createdBy) !== userId) {
    throw Object.assign(new Error("Unauthorized"), { status: 401 });
  }
  return company;
}

export async function getCompanyBySlug(slug: string) {
  await connectDB();
  return Company.findOne({ slug }).lean();
}



export async function updateCompanyBySlug(slug: string, input: Partial<UpsertCompanyInput>, userId: string) {
  await connectDB();
  const company = await Company.findOneAndUpdate({ slug, createdBy: userId }, { $set: input }, { new: true });
  if (!company) {
    throw Object.assign(new Error("Company not found"), { status: 404 });
  }
  return company;
}

export async function publishCompanyBySlug(slug: string) {
  await connectDB();
  const company = await Company.findOneAndUpdate(
    { slug },
    { $set: { isPublished: true, publishedAt: new Date() } },
    { new: true }
  );
  if (!company) {
    throw Object.assign(new Error("Company not found"), { status: 404 });
  }
  return company;
}


export async function searchCompaniesByJobTitle(query: string) {
  await connectDB();

  const jobs = await Job.find({ title: { $regex: query, $options: 'i' } }).select('companyId').lean();
  const companyIds = [...new Set(jobs.map((job: IJob) => job.companyId))];

  const companies = await Company.find({ _id: { $in: companyIds }, isPublished: true }).select('name slug').lean();

  const allJobs: IJob[] = await Job.find({ companyId: { $in: companyIds } }).select('title companyId').lean();

  const companiesWithJobData = companies.map((company: ICompany) => {
    const companyJobs = allJobs.filter((job: IJob) => String(job.companyId) === String(company._id));
    return {
      ...company,
      jobCount: companyJobs.length,
      jobTitles: companyJobs.map((job: IJob) => job.title).slice(0, 3),
    };
  });

  return companiesWithJobData;
}

export async function unpublishCompanyBySlug(slug: string) {
  await connectDB();
  const company = await Company.findOneAndUpdate(
    { slug },
    { $set: { isPublished: false }, $unset: { publishedAt: 1 } },
    { new: true }
  );
  if (!company) {
    throw Object.assign(new Error("Company not found"), { status: 404 });
  }
  return company;
}
