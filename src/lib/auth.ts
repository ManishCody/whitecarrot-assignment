import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('[AUTH] CRITICAL: JWT_SECRET environment variable is missing!');
  console.error('[AUTH] Available env vars:', Object.keys(process.env).filter(k => !k.includes('SECRET')));
  throw new Error("Missing JWT_SECRET environment variable");
}
console.log('[AUTH] JWT_SECRET is configured');

export type JwtPayload = { sub: string; email: string; role: string };

export function signJwt(payload: JwtPayload, expiresIn: string | number = "7d") {
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn } as jwt.SignOptions);
}

export function verifyJwt(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  } catch (error) {
    console.error('[AUTH] JWT verification failed:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
