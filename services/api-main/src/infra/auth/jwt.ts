import jwt from 'jsonwebtoken';
import {Role} from '../../domain/enums/role.js';

export type TokenPayload = { role: Role };

export function signToken(payload: { role: Role }): string {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign(payload, secret, {expiresIn: '100d'});
}

export function verifyToken(token: string): TokenPayload {
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string') {
        throw new Error('Invalid token payload');
    }

    return decoded as TokenPayload;
}
