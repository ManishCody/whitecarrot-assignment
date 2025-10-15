import { Schema, models, model } from "mongoose";

const ApplicationSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["APPLIED", "REVIEWED", "INTERVIEWING", "OFFERED", "REJECTED"],
      default: "APPLIED",
    },
  },
  { timestamps: true }
);

export type IApplication = {
  _id: string;
  job: string;
  candidate: string;
  status: "APPLIED" | "REVIEWED" | "INTERVIEWING" | "OFFERED" | "REJECTED";
};

export const Application = (models as any).Application || model("Application", ApplicationSchema);
