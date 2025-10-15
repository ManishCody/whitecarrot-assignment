import { Schema, models, model, Model, Document, Types } from "mongoose";

export interface IApplication extends Document {
  job: Types.ObjectId;
  candidate: Types.ObjectId;
  status: "APPLIED" | "REVIEWED" | "INTERVIEWING" | "OFFERED" | "REJECTED";
}

const ApplicationSchema = new Schema<IApplication>(
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

export const Application: Model<IApplication> =
  models.Application || model<IApplication>("Application", ApplicationSchema);
