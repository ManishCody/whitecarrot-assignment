import { headers } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export type AuthUser = { id: string; email: string };

export function getBearerToken(req?: Request): string | null {
  const h: Headers | Readonly<Headers> = req ? req.headers : (headers() as unknown as Headers);
  const auth = h.get("authorization") || h.get("Authorization");
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

export function requireAuth(req?: Request): AuthUser {
  const token = getBearerToken(req);
  if (!token) {
    throw Object.assign(new Error("Unauthorized"), { status: 401 });
  }
  const payload = verifyJwt(token);
  return { id: payload.sub, email: payload.email };
}
