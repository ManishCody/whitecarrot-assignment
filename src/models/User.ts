import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    companies: [{ type: Schema.Types.ObjectId, ref: "Company" }],
    role: {
      type: String,
      enum: ["CANDIDATE", "RECRUITER"],
      default: "CANDIDATE",
    },
  },
  { timestamps: true }
);

export type IUser = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  companies?: string[];
  role: "CANDIDATE" | "RECRUITER";
};

export const User = (models as any).User || model("User", UserSchema);
