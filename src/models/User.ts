import { Schema, models, model, Model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  companies?: string[];
  role: "CANDIDATE" | "RECRUITER";
}

const UserSchema = new Schema<IUser>(
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

export const User: Model<IUser> =
  models.User || model<IUser>("User", UserSchema);
