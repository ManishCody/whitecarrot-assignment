import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { comparePassword, hashPassword, signJwt } from "@/lib/auth";

export async function registerUser(input: { email: string; password: string }) {
  await connectDB();
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw Object.assign(new Error("Email already in use"), { status: 409 });
  }
  const passwordHash = await hashPassword(input.password);
  const user = await User.create({ email: input.email, passwordHash });
  const token = signJwt({ sub: String(user._id), email: user.email });
  return { user: { id: String(user._id), email: user.email }, token };
}

export async function loginUser(input: { email: string; password: string }) {
  await connectDB();
  const user = await User.findOne({ email: input.email });
  if (!user) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }
  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }
  const token = signJwt({ sub: String(user._id), email: user.email });
  return { user: { id: String(user._id), email: user.email }, token };
}
