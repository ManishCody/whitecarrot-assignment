import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { comparePassword, hashPassword, signJwt } from "@/lib/auth";

export async function getUserById(id: string) {
  await connectDB();
  const user = await (User as any).findById(id).select("-passwordHash");
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }
  return { id: String(user._id), email: user.email, name: user.name, role: user.role };
}

export async function registerUser(input: { name: string; email: string; password: string; recruiterCode?: string }) {
  await connectDB();
  const existing = await (User as any).findOne({ email: input.email });
  if (existing) {
    throw Object.assign(new Error("Email already in use"), { status: 409 });
  }
  const passwordHash = await hashPassword(input.password);

  const role = input.recruiterCode === "SUPER_SECRET_CODE" ? "RECRUITER" : "CANDIDATE";

  const user = await (User as any).create({ 
    name: input.name,
    email: input.email, 
    passwordHash, 
    role 
  });
  const token = signJwt({ sub: String(user._id), email: user.email, role: user.role });
  return { user: { id: String(user._id), email: user.email, name: user.name, role: user.role }, token };
}

export async function loginUser(input: { email: string; password: string }) {
  await connectDB();
  const user = await (User as any).findOne({ email: input.email });
  if (!user) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }
  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }
  const token = signJwt({ sub: String(user._id), email: user.email, role: user.role });
  return { user: { id: String(user._id), email: user.email, name: user.name, role: user.role }, token };
}
