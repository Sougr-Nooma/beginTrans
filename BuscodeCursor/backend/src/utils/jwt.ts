import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'fasobus-dev-secret';
const EXPIRES_IN = '7d';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  companyId?: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function formatUserResponse(user: User) {
  const companyId = user.role === 'COMPANY' ? user.companySlug ?? undefined : undefined;
  const name =
    user.role === 'COMPANY'
      ? user.companyName || user.email
      : user.role === 'ADMIN'
        ? user.firstName || 'Administrateur FasoBus'
        : `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

  return {
    id: user.id,
    name,
    email: user.email,
    phone: user.phone ?? undefined,
    role: user.role,
    companyId,
  };
}

export function authPayload(user: User) {
  const body = formatUserResponse(user);
  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    companyId: body.companyId,
  });
  return { token, user: body };
}
