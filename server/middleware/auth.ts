import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lathe-invite-dev-secret-change-in-production';
const JWT_EXPIRY = '7d';

export interface AuthUser {
    id: string;
    tenant_id: string;
    email: string;
    name: string;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}

export function generateToken(user: AuthUser): string {
    return jwt.sign(
        { id: user.id, tenant_id: user.tenant_id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token diperlukan' });
    }

    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        if (!decoded.tenant_id) return res.status(401).json({ error: 'Token lama terdeteksi. Silakan login ulang.' });
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Token tidak valid atau kedaluwarsa' });
    }
}
