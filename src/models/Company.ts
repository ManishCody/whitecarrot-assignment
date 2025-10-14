import { Schema, models, model } from "mongoose";

const CompanySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    cultureVideo: { type: String },
    primaryColor: { type: String, default: "#0A66C2" },
    sections: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

export type ICompany = {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  cultureVideo?: string;
  primaryColor: string;
  sections: any[];
};

export const Company = (models as any).Company || model("Company", CompanySchema);
