import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Simple in-memory cache for public invitation lookups (slug → {data, expiry})
const publicCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 60_000; // 1 minute

function getCachedPublic(slug: string): any | null {
    const entry = publicCache.get(slug);
    if (entry && Date.now() < entry.expiry) {
        return entry.data;
    }
    publicCache.delete(slug);
    return null;
}

function setCachedPublic(slug: string, data: any) {
    publicCache.set(slug, { data, expiry: Date.now() + CACHE_TTL_MS });
}

/**
 * Invalidate cache when invitation is updated
 */
function invalidateCache(slug: string) {
    publicCache.delete(slug);
}

/**
 * GET /api/invitations
 * List all invitations for the authenticated user
 */
router.get('/', requireAuth, (req: AuthRequest, res) => {
    const invitations = db.prepare(
        'SELECT id, slug, status, meta, blocks, theme_config, created_at, updated_at FROM invitations WHERE tenant_id = ? ORDER BY created_at DESC'
    ).all(req.user!.tenant_id) as any[];

    // Parse JSON columns
    const parsed = invitations.map(inv => ({
        ...inv,
        meta: JSON.parse(inv.meta || '{}'),
        blocks: JSON.parse(inv.blocks || '[]'),
        theme_config: JSON.parse(inv.theme_config || '{}'),
    }));

    res.json({ invitations: parsed });
});

/**
 * GET /api/invitations/:slug/public
 * Public read endpoint — lightning-fast, cached
 */
router.get('/:slug/public', (req, res) => {
    const { slug } = req.params;

    // Check cache first
    const cached = getCachedPublic(slug);
    if (cached) {
        return res.json(cached);
    }

    const inv = db.prepare(
        'SELECT id, slug, status, meta, blocks, theme_config, created_at FROM invitations WHERE slug = ?'
    ).get(slug) as any;

    if (!inv || inv.status !== 'published') {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    const data = {
        id: inv.id,
        slug: inv.slug,
        meta: JSON.parse(inv.meta || '{}'),
        blocks: JSON.parse(inv.blocks || '[]'),
        theme_config: JSON.parse(inv.theme_config || '{}'),
        created_at: inv.created_at,
    };

    setCachedPublic(slug, data);
    res.json(data);
});

/**
 * GET /api/invitations/:id/detail
 * Get single invitation by ID (auth required, for editing)
 */
router.get('/:id/detail', requireAuth, (req: AuthRequest, res) => {
    const inv = db.prepare(
        'SELECT * FROM invitations WHERE id = ? AND tenant_id = ?'
    ).get(req.params.id, req.user!.tenant_id) as any;

    if (!inv) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    res.json({
        ...inv,
        meta: JSON.parse(inv.meta || '{}'),
        blocks: JSON.parse(inv.blocks || '[]'),
        theme_config: JSON.parse(inv.theme_config || '{}'),
    });
});

/**
 * POST /api/invitations
 * Create a new invitation
 */
router.post('/', requireAuth, (req: AuthRequest, res) => {
    const { slug, meta, blocks, theme_config, status } = req.body;

    if (!slug) {
        return res.status(400).json({ error: 'Slug wajib diisi' });
    }

    // Check slug uniqueness
    const existing = db.prepare('SELECT id FROM invitations WHERE slug = ?').get(slug);
    if (existing) {
        return res.status(409).json({ error: 'Slug sudah dipakai' });
    }

    const quota = db.prepare(`
        SELECT
          (SELECT COUNT(*) FROM invitations WHERE tenant_id = ?) AS used,
          free_invitation_limit AS freeLimit,
          paid_invitation_credits AS paidCredits
        FROM tenants WHERE id = ?
    `).get(req.user!.tenant_id, req.user!.tenant_id) as any;
    const allowance = (quota?.freeLimit || 1) + (quota?.paidCredits || 0);
    if ((quota?.used || 0) >= allowance) {
        return res.status(402).json({
            error: 'Kuota gratis sudah terpakai. Silakan beli 1 undangan tambahan untuk membuat undangan baru.',
            code: 'PAYMENT_REQUIRED',
        });
    }

    const id = uuidv4();

    db.prepare(`
    INSERT INTO invitations (id, user_id, tenant_id, slug, status, meta, blocks, theme_config)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        id,
        req.user!.id,
        req.user!.tenant_id,
        slug,
        status || 'draft',
        JSON.stringify(meta || {}),
        JSON.stringify(blocks || []),
        JSON.stringify(theme_config || {}),
    );

    const inv = db.prepare('SELECT * FROM invitations WHERE id = ?').get(id) as any;

    res.status(201).json({
        ...inv,
        meta: JSON.parse(inv.meta),
        blocks: JSON.parse(inv.blocks),
        theme_config: JSON.parse(inv.theme_config),
    });
});

/**
 * PUT /api/invitations/:id
 * Update invitation — saves entire blocks/meta/theme_config as JSON
 */
router.put('/:id', requireAuth, (req: AuthRequest, res) => {
    const { slug, meta, blocks, theme_config, status } = req.body;

    // Verify ownership
    const existing = db.prepare('SELECT * FROM invitations WHERE id = ? AND tenant_id = ?')
        .get(req.params.id, req.user!.tenant_id) as any;

    if (!existing) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    // If slug changed, check uniqueness
    if (slug && slug !== existing.slug) {
        const slugTaken = db.prepare('SELECT id FROM invitations WHERE slug = ? AND id != ?')
            .get(slug, req.params.id);
        if (slugTaken) {
            return res.status(409).json({ error: 'Slug sudah dipakai' });
        }
    }

    db.prepare(`
    UPDATE invitations SET
      slug = COALESCE(?, slug),
      status = COALESCE(?, status),
      meta = COALESCE(?, meta),
      blocks = COALESCE(?, blocks),
      theme_config = COALESCE(?, theme_config),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
        slug || null,
        status || null,
        meta ? JSON.stringify(meta) : null,
        blocks ? JSON.stringify(blocks) : null,
        theme_config ? JSON.stringify(theme_config) : null,
        req.params.id,
    );

    // Invalidate public cache
    invalidateCache(existing.slug);
    if (slug && slug !== existing.slug) {
        invalidateCache(slug);
    }

    const updated = db.prepare('SELECT * FROM invitations WHERE id = ?').get(req.params.id) as any;

    res.json({
        ...updated,
        meta: JSON.parse(updated.meta),
        blocks: JSON.parse(updated.blocks),
        theme_config: JSON.parse(updated.theme_config),
    });
});

/**
 * DELETE /api/invitations/:id
 * Delete invitation (cascades to guests and guestbook entries)
 */
router.delete('/:id', requireAuth, (req: AuthRequest, res) => {
    const existing = db.prepare('SELECT slug FROM invitations WHERE id = ? AND tenant_id = ?')
        .get(req.params.id, req.user!.tenant_id) as any;

    if (!existing) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan' });
    }

    db.prepare('DELETE FROM invitations WHERE id = ?').run(req.params.id);
    invalidateCache(existing.slug);

    res.json({ success: true });
});

export default router;
