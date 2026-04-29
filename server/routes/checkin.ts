import { Router } from 'express';
import db from '../db';
import { sseManager } from '../sse';

const router = Router();

/**
 * POST /api/checkin/:qr_token
 * Mark a guest as checked in via QR code scan.
 * Broadcasts SSE event to kiosk + broadcast screens.
 */
router.post('/:qr_token', (req, res) => {
    const guest = db.prepare(`
    SELECT g.*, i.slug, i.meta FROM guests g
    JOIN invitations i ON g.invitation_id = i.id
    WHERE g.qr_token = ?
  `).get(req.params.qr_token) as any;

    if (!guest) {
        return res.status(404).json({ error: 'QR code tidak valid' });
    }

    if (guest.checked_in_at) {
        return res.status(200).json({
            guest,
            already_checked_in: true,
            message: `${guest.name} sudah check-in sebelumnya`,
        });
    }

    // Mark as checked in
    db.prepare('UPDATE guests SET checked_in_at = datetime(\'now\') WHERE id = ?')
        .run(guest.id);

    const updatedGuest = db.prepare('SELECT * FROM guests WHERE id = ?').get(guest.id) as any;

    // Get stats for the SSE broadcast
    const stats = getCheckinStats(guest.invitation_id);

    // Broadcast to kiosk + broadcast screens
    sseManager.broadcast(guest.slug, 'guest_checked_in', {
        guest: updatedGuest,
        stats,
    });

    res.json({
        guest: updatedGuest,
        already_checked_in: false,
        message: `Selamat datang, ${guest.name}!`,
        stats,
    });
});

/**
 * GET /api/checkin/:slug/stats
 * Get check-in statistics for an invitation
 */
router.get('/:slug/stats', (req, res) => {
    const inv = db.prepare('SELECT id FROM invitations WHERE slug = ?')
        .get(req.params.slug) as any;

    if (!inv) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    res.json(getCheckinStats(inv.id));
});

/**
 * GET /api/checkin/:slug/search?q=name
 * Search guests by name for manual check-in
 */
router.get('/:slug/search', (req, res) => {
    const inv = db.prepare('SELECT id FROM invitations WHERE slug = ?')
        .get(req.params.slug) as any;

    if (!inv) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    const query = req.query.q as string;
    if (!query || query.length < 2) {
        return res.json({ guests: [] });
    }

    const guests = db.prepare(
        'SELECT * FROM guests WHERE invitation_id = ? AND name LIKE ? ORDER BY name LIMIT 20'
    ).all(inv.id, `%${query}%`);

    res.json({ guests });
});

/**
 * POST /api/checkin/:slug/manual
 * Manual check-in by guest ID (for guests without QR code)
 */
router.post('/:slug/manual', (req, res) => {
    const inv = db.prepare('SELECT id, slug FROM invitations WHERE slug = ?')
        .get(req.params.slug) as any;

    if (!inv) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    const { guest_id } = req.body;
    if (!guest_id) {
        return res.status(400).json({ error: 'ID tamu diperlukan' });
    }

    const guest = db.prepare('SELECT * FROM guests WHERE id = ? AND invitation_id = ?')
        .get(guest_id, inv.id) as any;

    if (!guest) {
        return res.status(404).json({ error: 'Tamu tidak ditemukan' });
    }

    if (guest.checked_in_at) {
        return res.json({
            guest,
            already_checked_in: true,
            message: `${guest.name} sudah check-in sebelumnya`,
        });
    }

    db.prepare('UPDATE guests SET checked_in_at = datetime(\'now\') WHERE id = ?').run(guest.id);
    const updatedGuest = db.prepare('SELECT * FROM guests WHERE id = ?').get(guest.id) as any;
    const stats = getCheckinStats(inv.id);

    sseManager.broadcast(inv.slug, 'guest_checked_in', {
        guest: updatedGuest,
        stats,
    });

    res.json({
        guest: updatedGuest,
        already_checked_in: false,
        message: `Selamat datang, ${guest.name}!`,
        stats,
    });
});

/**
 * GET /api/checkin/:slug/stream
 * SSE endpoint for real-time check-in events
 */
router.get('/:slug/stream', (req, res) => {
    const inv = db.prepare('SELECT id FROM invitations WHERE slug = ?')
        .get(req.params.slug) as any;

    if (!inv) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    // Set up SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
    });

    // Send initial stats
    const stats = getCheckinStats(inv.id);
    res.write(`event: init\ndata: ${JSON.stringify({ stats })}\n\n`);

    // Register this connection
    sseManager.addClient(req.params.slug, res);
});

/**
 * Helper: get check-in stats for an invitation
 */
function getCheckinStats(invitationId: string) {
    const total = db.prepare('SELECT COUNT(*) as count FROM guests WHERE invitation_id = ?')
        .get(invitationId) as any;
    const checkedIn = db.prepare('SELECT COUNT(*) as count FROM guests WHERE invitation_id = ? AND checked_in_at IS NOT NULL')
        .get(invitationId) as any;
    const vipTotal = db.prepare('SELECT COUNT(*) as count FROM guests WHERE invitation_id = ? AND is_vip = 1')
        .get(invitationId) as any;
    const vipCheckedIn = db.prepare('SELECT COUNT(*) as count FROM guests WHERE invitation_id = ? AND is_vip = 1 AND checked_in_at IS NOT NULL')
        .get(invitationId) as any;
    const totalPax = db.prepare('SELECT COALESCE(SUM(pax), 0) as total FROM guests WHERE invitation_id = ? AND checked_in_at IS NOT NULL')
        .get(invitationId) as any;

    return {
        total_guests: total.count,
        checked_in: checkedIn.count,
        vip_total: vipTotal.count,
        vip_checked_in: vipCheckedIn.count,
        total_pax: totalPax.total,
    };
}

export default router;
