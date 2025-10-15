import { headers } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export type AuthUser = { id: string; email: string };

export async function getBearerToken(req?: Request): Promise<string | null> {
  const h: Headers | Readonly<Headers> = req ? req.headers : (await headers());
  const auth = h.get("authorization") || h.get("Authorization");
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

export async function requireAuth(req?: Request): Promise<AuthUser> {
  const token = await getBearerToken(req);
  console.log(token);
  
  if (!token) {
    throw Object.assign(new Error("Unauthorized"), { status: 401 });
  }
  const payload = verifyJwt(token);
  return { id: payload.sub, email: payload.email };
}
