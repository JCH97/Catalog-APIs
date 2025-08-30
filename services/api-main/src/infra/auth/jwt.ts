import jwt from 'jsonwebtoken';
import { Role } from '../../domain/enums/role';

export function signToken(payload: { role: Role }): string {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.sign(payload, secret);
}

export function verifyToken<T = any>(token: string): T {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.verify(token, secret) as T;
}
