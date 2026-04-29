import { Router } from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.ts';
import { requireAuth, AuthRequest } from '../middleware/auth.ts';

const router = Router();
const TRIPAY_BASE_URL = process.env.TRIPAY_MODE === 'production'
  ? 'https://tripay.co.id/api'
  : 'https://tripay.co.id/api-sandbox';
const INVITE_PRICE = Number(process.env.INVITE_PRICE || 49000);
const DEFAULT_METHOD = process.env.TRIPAY_DEFAULT_METHOD || 'QRIS2';

function getCredentials() {
  return {
    apiKey: process.env.TRIPAY_API_KEY || '',
    privateKey: process.env.TRIPAY_PRIVATE_KEY || '',
    merchantCode: process.env.TRIPAY_MERCHANT_CODE || '',
  };
}

router.get('/usage', requireAuth, (req: AuthRequest, res) => {
  const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(req.user!.tenant_id) as any;
  const used = (db.prepare('SELECT COUNT(*) as total FROM invitations WHERE tenant_id = ?').get(req.user!.tenant_id) as any)?.total || 0;
  const pending = db.prepare(`SELECT * FROM payments WHERE tenant_id = ? AND status IN ('UNPAID','PENDING') ORDER BY created_at DESC LIMIT 1`).get(req.user!.tenant_id) as any;
  res.json({
    used,
    free_limit: tenant?.free_invitation_limit || 1,
    paid_credits: tenant?.paid_invitation_credits || 0,
    remaining: Math.max(((tenant?.free_invitation_limit || 1) + (tenant?.paid_invitation_credits || 0)) - used, 0),
    invite_price: INVITE_PRICE,
    pending_payment: pending ? {
      merchant_ref: pending.merchant_ref,
      status: pending.status,
      amount: pending.amount,
      payment_url: pending.payment_url,
      checkout_url: pending.checkout_url,
      tripay_reference: pending.tripay_reference,
    } : null,
  });
});

router.post('/checkout', requireAuth, async (req: AuthRequest, res) => {
  const { method = DEFAULT_METHOD, credits = 1 } = req.body || {};
  const qty = Math.max(1, Math.min(Number(credits) || 1, 10));
  const amount = INVITE_PRICE * qty;
  const { apiKey, privateKey, merchantCode } = getCredentials();
  if (!apiKey || !privateKey || !merchantCode) {
    return res.status(500).json({ error: 'Credential Tripay belum diatur di environment.' });
  }

  const merchantRef = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const signature = crypto.createHmac('sha256', privateKey)
    .update(merchantCode + merchantRef + amount)
    .digest('hex');
  const origin = `${req.protocol}://${req.get('host')}`;
  const payload = {
    method,
    merchant_ref: merchantRef,
    amount,
    customer_name: req.user!.name,
    customer_email: req.user!.email,
    order_items: [{ name: `Kuota ${qty} undangan digital`, price: amount, quantity: 1 }],
    callback_url: `${origin}/api/billing/tripay/callback`,
    return_url: `${origin}/billing`,
    expired_time: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    signature,
  };

  const response = await fetch(`${TRIPAY_BASE_URL}/transaction/create`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    return res.status(400).json({ error: result.message || 'Gagal membuat transaksi Tripay', detail: result });
  }

  db.prepare(`INSERT INTO payments (id, tenant_id, user_id, merchant_ref, tripay_reference, tripay_payload, amount, credits, status, payment_url, checkout_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(uuidv4(), req.user!.tenant_id, req.user!.id, merchantRef, result.data?.reference || null, JSON.stringify(result.data || {}), amount, qty, result.data?.status || 'UNPAID', result.data?.pay_url || result.data?.checkout_url || null, result.data?.checkout_url || result.data?.pay_url || null);

  res.status(201).json({ payment: result.data, merchant_ref: merchantRef });
});

router.post('/tripay/callback', (req, res) => {
  const privateKey = process.env.TRIPAY_PRIVATE_KEY || '';
  const rawBody = (req as any).rawBody || JSON.stringify(req.body || {});
  const callbackSignature = req.header('X-Callback-Signature') || '';
  const expected = crypto.createHmac('sha256', privateKey).update(rawBody).digest('hex');
  if (!privateKey || callbackSignature !== expected) return res.status(403).json({ success: false, message: 'Invalid signature' });

  const data = req.body || {};
  const merchantRef = data.merchant_ref;
  const status = String(data.status || '').toUpperCase();
  const payment = db.prepare('SELECT * FROM payments WHERE merchant_ref = ?').get(merchantRef) as any;
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

  const alreadyPaid = payment.status === 'PAID';
  db.prepare('UPDATE payments SET status = ?, tripay_reference = COALESCE(?, tripay_reference), tripay_payload = ?, paid_at = CASE WHEN ? = \'PAID\' THEN COALESCE(paid_at, datetime(\'now\')) ELSE paid_at END WHERE merchant_ref = ?')
    .run(status || 'PENDING', data.reference || null, JSON.stringify(data), status, merchantRef);
  if (status === 'PAID' && !alreadyPaid) {
    db.prepare('UPDATE tenants SET paid_invitation_credits = paid_invitation_credits + ? WHERE id = ?')
      .run(payment.credits || 1, payment.tenant_id);
  }

  res.json({ success: true });
});

function expressRawJson(req: any, _res: any, next: any) {
  let chunks: Buffer[] = [];
  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf8');
    req.rawBody = raw;
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
    next();
  });
}

export default router;
