import { connectDB } from "@/lib/db";
import { Company } from "@/models/Company";

export async function getCompanyBySlug(slug: string) {
  await connectDB();
  return Company.findOne({ slug });
}

type UpsertCompanyInput = {
  name: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  cultureVideo?: string;
  primaryColor?: string;
  sections?: any[];
};

export async function createCompany(input: UpsertCompanyInput) {
  await connectDB();
  const exists = await Company.findOne({ slug: input.slug });
  if (exists) {
    throw Object.assign(new Error("Company slug already exists"), { status: 409 });
  }
  return Company.create({
    name: input.name,
    slug: input.slug,
    logoUrl: input.logoUrl,
    bannerUrl: input.bannerUrl,
    cultureVideo: input.cultureVideo,
    primaryColor: input.primaryColor ?? "#0A66C2",
    sections: input.sections ?? [],
  });
}

export async function updateCompanyBySlug(slug: string, input: Partial<UpsertCompanyInput>) {
  await connectDB();
  const company = await Company.findOneAndUpdate({ slug }, { $set: input }, { new: true });
  if (!company) {
    throw Object.assign(new Error("Company not found"), { status: 404 });
  }
  return company;
}
