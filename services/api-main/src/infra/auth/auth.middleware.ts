import {verifyToken} from './jwt.js';

type RequestAny = any;
type ResponseAny = any;
type NextFunctionAny = (...args: any[]) => void;

/**
 * Middleware to handle authentication by verifying JWT tokens.
 * - Extracts the token from the Authorization header.
 * - Verifies the token and attaches the user to the request object.
 * - Returns a 401 Unauthorized response if the token is invalid.
 */
export function authMiddleware(req: RequestAny & { user?: any }, res: ResponseAny, next: NextFunctionAny) {
    const auth = req.headers?.authorization;
    if (auth && auth.startsWith('Bearer ')) {
        const token = auth.substring('Bearer '.length);
        try {
            req.user = verifyToken(token);
        } catch (_e) {
            res.status(401).json({error: 'Unauthorized'});
            return;
        }
    }
    next();
}
