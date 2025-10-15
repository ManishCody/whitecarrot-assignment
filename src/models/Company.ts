import { Schema, models, model } from "mongoose";

// Rich content section types for the page builder
export type ContentSection = {
  id: string;
  type: 'hero' | 'text' | 'image' | 'video' | 'values' | 'locations' | 'perks' | 'testimonial' | 'cta';
  title?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  alignment?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  data?: Record<string, any>; // For complex section data like values, locations
};

const CompanySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    cultureVideo: { type: String },
    primaryColor: { type: String, default: "#0A66C2" },
    sections: { type: Schema.Types.Mixed, default: [] }, // Array of ContentSection
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
  sections: ContentSection[];
  isPublished: boolean;
  publishedAt?: Date;
  createdBy: string;
};

export const Company = (models as any).Company || model("Company", CompanySchema);
