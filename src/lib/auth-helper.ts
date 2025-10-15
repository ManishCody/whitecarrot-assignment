import { headers, cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';

export type AuthResult = {
  userId: string;
  role: string;
} | null;

export async function getAuthenticatedUser(): Promise<AuthResult> {
  try {
    const headerList = headers();
    let userId = (await headerList).get('x-user-id');
    let role = (await headerList).get('x-user-role');

    if (!userId || !role) {
      const cookieStore = cookies();
      const token = (await cookieStore).get('token')?.value;
      
      if (!token) {
        return null;
      }
      
      try {
        const decoded = verifyJwt(token);
        userId = decoded.sub;
        role = decoded.role;
      } catch (_error) {
        return null;
      }
    }

    if (!userId || !role) {
      return null;
    }

    return { userId, role };
  } catch (_error) {
    return null;
  }
}

export async function requireAuthWithRole(requiredRole?: string): Promise<AuthResult> {
  const auth = await getAuthenticatedUser();
  
  if (!auth) {
    throw new Error('Unauthorized');
  }

  if (requiredRole && auth.role !== requiredRole) {
    throw new Error('Forbidden');
  }

  return auth;
}
