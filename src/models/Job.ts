import { Schema, models, model } from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    department: { type: String, required: true },
    employmentType: { type: String, required: true },
    experience: { type: String, required: true },
    jobType: { type: String, required: true },
    salaryRange: { type: String, required: true },
    slug: { type: String, required: true },
    postedDaysAgo: { type: Number, default: 0 },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  },
  { timestamps: true }
);

export type IJob = {
  _id: string;
  title: string;
  location: string;
  department: string;
  employmentType: string;
  experience: string;
  jobType: string;
  salaryRange: string;
  slug: string;
  postedDaysAgo: number;
  companyId: string;
};

export const Job = (models as any).Job || model("Job", JobSchema);
