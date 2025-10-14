import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    companies: [{ type: Schema.Types.ObjectId, ref: "Company" }],
  },
  { timestamps: true }
);

export type IUser = {
  _id: string;
  email: string;
  passwordHash: string;
  companies?: string[];
};

export const User = (models as any).User || model("User", UserSchema);
