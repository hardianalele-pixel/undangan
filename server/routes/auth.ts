import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.ts';
import { generateToken, requireAuth, AuthRequest } from '../middleware/auth.ts';

const router = Router();

router.post('/register', (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, dan nama wajib diisi' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'Email sudah terdaftar' });

    const id = uuidv4();
    const tenantId = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);

    db.prepare('INSERT INTO tenants (id, name) VALUES (?, ?)').run(tenantId, name);
    db.prepare('INSERT INTO users (id, tenant_id, email, password_hash, name) VALUES (?, ?, ?, ?, ?)')
        .run(id, tenantId, email, passwordHash, name);

    const user = { id, tenant_id: tenantId, email, name };
    const token = generateToken(user);
    res.status(201).json({ user, token });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email dan password wajib diisi' });

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Email atau password salah' });
    }
    if (!user.tenant_id) return res.status(500).json({ error: 'Tenant akun belum siap. Restart server untuk menjalankan migrasi.' });

    const safeUser = { id: user.id, tenant_id: user.tenant_id, email: user.email, name: user.name };
    const token = generateToken(safeUser);

    res.json({ user: safeUser, token });
});

router.get('/me', requireAuth, (req: AuthRequest, res) => {
    const user = db.prepare('SELECT id, tenant_id, email, name, created_at FROM users WHERE id = ?')
        .get(req.user!.id) as any;

    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json({ user });
});

export default router;
