import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import db from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * Generate a short, unique QR token (12 chars alphanumeric)
 */
function generateQrToken(): string {
    return crypto.randomBytes(6).toString('hex');
}

/**
 * Verify user owns the invitation
 */
function verifyOwnership(invitationId: string, userId: string): any {
    return db.prepare('SELECT id FROM invitations WHERE id = ? AND user_id = ?')
        .get(invitationId, userId);
}

/**
 * GET /api/invitations/:invitationId/guests
 * List all guests for an invitation
 */
router.get('/:invitationId/guests', requireAuth, (req: AuthRequest, res) => {
    if (!verifyOwnership(req.params.invitationId, req.user!.id)) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    const guests = db.prepare(
        'SELECT * FROM guests WHERE invitation_id = ? ORDER BY created_at DESC'
    ).all(req.params.invitationId);

    res.json({ guests });
});

/**
 * POST /api/invitations/:invitationId/guests
 * Add a single guest
 */
router.post('/:invitationId/guests', requireAuth, (req: AuthRequest, res) => {
    if (!verifyOwnership(req.params.invitationId, req.user!.id)) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    const { name, phone, pax, is_vip } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Nama tamu wajib diisi' });
    }

    const id = uuidv4();
    const qrToken = generateQrToken();

    db.prepare(`
    INSERT INTO guests (id, invitation_id, qr_token, name, phone, pax, is_vip)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.params.invitationId, qrToken, name, phone || null, pax || 1, is_vip ? 1 : 0);

    const guest = db.prepare('SELECT * FROM guests WHERE id = ?').get(id);
    res.status(201).json({ guest });
});

/**
 * POST /api/invitations/:invitationId/guests/import
 * Batch import guests from CSV data
 * Body: { guests: [{ name, phone, pax, is_vip }] }
 */
router.post('/:invitationId/guests/import', requireAuth, (req: AuthRequest, res) => {
    if (!verifyOwnership(req.params.invitationId, req.user!.id)) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    const { guests: guestList } = req.body;
    if (!Array.isArray(guestList) || guestList.length === 0) {
        return res.status(400).json({ error: 'Data tamu diperlukan' });
    }

    const insertStmt = db.prepare(`
    INSERT INTO guests (id, invitation_id, qr_token, name, phone, pax, is_vip)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

    const insertMany = db.transaction((guests: any[]) => {
        const inserted: string[] = [];
        for (const g of guests) {
            const id = uuidv4();
            const qrToken = generateQrToken();
            insertStmt.run(id, req.params.invitationId, qrToken, g.name, g.phone || null, g.pax || 1, g.is_vip ? 1 : 0);
            inserted.push(id);
        }
        return inserted;
    });

    const insertedIds = insertMany(guestList);

    res.status(201).json({
        imported: insertedIds.length,
        message: `${insertedIds.length} tamu berhasil diimpor`,
    });
});

/**
 * PUT /api/guests/:id
 * Update a guest
 */
router.put('/:id', requireAuth, (req: AuthRequest, res) => {
    const guest = db.prepare('SELECT g.*, i.user_id FROM guests g JOIN invitations i ON g.invitation_id = i.id WHERE g.id = ?')
        .get(req.params.id) as any;

    if (!guest || guest.user_id !== req.user!.id) {
        return res.status(404).json({ error: 'Tamu tidak ditemukan' });
    }

    const { name, phone, pax, is_vip } = req.body;

    db.prepare(`
    UPDATE guests SET
      name = COALESCE(?, name),
      phone = COALESCE(?, phone),
      pax = COALESCE(?, pax),
      is_vip = COALESCE(?, is_vip)
    WHERE id = ?
  `).run(name || null, phone, pax || null, is_vip !== undefined ? (is_vip ? 1 : 0) : null, req.params.id);

    const updated = db.prepare('SELECT * FROM guests WHERE id = ?').get(req.params.id);
    res.json({ guest: updated });
});

/**
 * DELETE /api/guests/:id
 * Remove a guest
 */
router.delete('/:id', requireAuth, (req: AuthRequest, res) => {
    const guest = db.prepare('SELECT g.*, i.user_id FROM guests g JOIN invitations i ON g.invitation_id = i.id WHERE g.id = ?')
        .get(req.params.id) as any;

    if (!guest || guest.user_id !== req.user!.id) {
        return res.status(404).json({ error: 'Tamu tidak ditemukan' });
    }

    db.prepare('DELETE FROM guests WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

export default router;
