import { headers, cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';

export type AuthResult = {
  userId: string;
  role: string;
} | null;

/**
 * Helper function to get authenticated user info with fallback pattern
 * First tries middleware headers, then falls back to cookie authentication
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  try {
    // Try to get user info from middleware headers first
    const headerList = headers();
    let userId = (await headerList).get('x-user-id');
    let role = (await headerList).get('x-user-role');

    // If no user info from middleware, try to get token from cookies directly
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
      } catch (error) {
        return null;
      }
    }

    if (!userId || !role) {
      return null;
    }

    return { userId, role };
  } catch (error) {
    return null;
  }
}

/**
 * Helper function to require authentication with specific role
 */
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
