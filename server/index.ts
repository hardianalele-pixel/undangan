import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { DATA_DIR } from "./db.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.ts';
import invitationRoutes from './routes/invitations.ts';
import guestRoutes from './routes/guests.ts';
import checkinRoutes from './routes/checkin.ts';
import guestbookRoutes from './routes/guestbook.ts';
import uploadRoutes from './routes/upload.ts';
import billingRoutes from './routes/billing.ts';

const app = express();
const PORT = parseInt(process.env.API_PORT || '3001');

// ─── Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '15mb', verify: (req: any, _res, buf) => { req.rawBody = buf.toString('utf8'); } })); // Allow large Base64 payloads
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
// app.use('/uploads', express.static(path.join(DATA_DIR, 'uploads')));

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/invitations', guestRoutes);   // Nested under /api/invitations/:id/guests
app.use('/api/guests', guestRoutes);         // Also /api/guests/:id for PUT/DELETE
app.use('/api/checkin', checkinRoutes);
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/billing', billingRoutes);

// ─── Health Check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Production: Serve React SPA ────────────────────────────────
if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, '..', 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// Start Server
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log("Lathe Invite API running on http://localhost:" + PORT);
        console.log("Uploads served from " + path.join(DATA_DIR, "uploads"));
    });
}

export default app;
