import { Schema, models, model, Model, Document, Types } from "mongoose";

export interface IJob extends Document {
  title: string;
  workPolicy: string;
  location: string;
  department: string;
  employmentType: string;
  experience: string;
  jobType: string;
  salaryRange: string;
  slug: string;
  postedDaysAgo: number;
  companyId: Types.ObjectId;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    workPolicy: { type: String, required: true },
    location: { type: String, required: true },
    department: { type: String, required: true },
    employmentType: { type: String, required: true },
    experience: { type: String, required: true },
    jobType: { type: String, required: true },
    salaryRange: { type: String, required: true },
    slug: { type: String, required: true },
    postedDaysAgo: { type: Number, default: 0 },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Job: Model<IJob> =
  models.Job || model<IJob>("Job", JobSchema);
