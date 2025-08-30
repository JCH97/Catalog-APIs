import {verifyToken} from './jwt.js';

type RequestAny = any;
type ResponseAny = any;
type NextFunctionAny = (...args: any[]) => void;

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
