import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.ts';
import { sseManager } from '../sse.ts';
import { decodeBase64ToFile } from '../utils/assets.ts';

const router = Router();

/**
 * POST /api/guestbook/:slug
 * Submit a guest book entry (from kiosk).
 * Decodes Base64 images to files.
 * Broadcasts to broadcast screen via SSE.
 */
router.post('/:slug', (req, res) => {
    const inv = db.prepare('SELECT id, slug FROM invitations WHERE slug = ?')
        .get(req.params.slug) as any;

    if (!inv) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    const { guest_id, guest_name, message, signature_image, photo } = req.body;

    if (!guest_name) {
        return res.status(400).json({ error: 'Nama tamu wajib diisi' });
    }

    // Decode Base64 images to files
    let signaturePath: string | null = null;
    let photoPath: string | null = null;

    try {
        if (signature_image && signature_image.startsWith('data:image')) {
            signaturePath = decodeBase64ToFile(signature_image, 'signatures');
        }
        if (photo && photo.startsWith('data:image')) {
            photoPath = decodeBase64ToFile(photo, 'photos');
        }
    } catch (err) {
        console.error('Error processing images:', err);
        // Continue without images rather than failing
    }

    const id = uuidv4();

    db.prepare(`
    INSERT INTO guestbook_entries (id, invitation_id, guest_id, guest_name, message, signature_path, photo_path)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, inv.id, guest_id || null, guest_name, message || null, signaturePath, photoPath);

    const entry = db.prepare('SELECT * FROM guestbook_entries WHERE id = ?').get(id) as any;

    // Broadcast to broadcast screens
    sseManager.broadcast(inv.slug, 'guestbook_entry', { entry });

    res.status(201).json({ entry });
});

/**
 * GET /api/guestbook/:slug
 * List all guest book entries for an invitation
 */
router.get('/:slug', (req, res) => {
    const inv = db.prepare('SELECT id FROM invitations WHERE slug = ?')
        .get(req.params.slug) as any;

    if (!inv) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    const entries = db.prepare(
        'SELECT * FROM guestbook_entries WHERE invitation_id = ? ORDER BY created_at DESC'
    ).all(inv.id);

    res.json({ entries });
});

/**
 * GET /api/guestbook/:slug/stream
 * SSE endpoint for real-time guest book entries (for broadcast screen)
 */
router.get('/:slug/stream', (req, res) => {
    const inv = db.prepare('SELECT id FROM invitations WHERE slug = ?')
        .get(req.params.slug) as any;

    if (!inv) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    // SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
    });

    // Send recent entries as initial payload
    const recentEntries = db.prepare(
        'SELECT * FROM guestbook_entries WHERE invitation_id = ? ORDER BY created_at DESC LIMIT 10'
    ).all(inv.id);

    res.write(`event: init\ndata: ${JSON.stringify({ entries: recentEntries })}\n\n`);

    // Register for future events
    sseManager.addClient(req.params.slug, res);
});

export default router;
