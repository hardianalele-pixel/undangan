import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const isVercel = Boolean(process.env.VERCEL);
export const DATA_DIR = isVercel ? '/tmp/lathe-invite' : path.resolve(process.cwd(), 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(path.join(DATA_DIR, 'uploads'), { recursive: true });

const dbPath = path.join(DATA_DIR, 'lathe.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  free_invitation_limit INTEGER NOT NULL DEFAULT 1,
  paid_invitation_credits INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  meta TEXT NOT NULL DEFAULT '{}',
  blocks TEXT NOT NULL DEFAULT '[]',
  theme_config TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  qr_token TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  pax INTEGER NOT NULL DEFAULT 1,
  is_vip INTEGER NOT NULL DEFAULT 0,
  checked_in_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS guestbook_entries (
  id TEXT PRIMARY KEY,
  invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_id TEXT REFERENCES guests(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  message TEXT,
  signature_path TEXT,
  photo_path TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  merchant_ref TEXT NOT NULL UNIQUE,
  tripay_reference TEXT,
  tripay_payload TEXT,
  amount INTEGER NOT NULL,
  credits INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'UNPAID',
  payment_url TEXT,
  checkout_url TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_invitations_tenant ON invitations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
CREATE INDEX IF NOT EXISTS idx_guests_invitation ON guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_guests_qr_token ON guests(qr_token);
CREATE INDEX IF NOT EXISTS idx_guestbook_invitation ON guestbook_entries(invitation_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
`);

function ensureColumn(table: string, column: string, ddl: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  if (!columns.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  }
}

ensureColumn('tenants', 'free_invitation_limit', 'free_invitation_limit INTEGER NOT NULL DEFAULT 1');
ensureColumn('tenants', 'paid_invitation_credits', 'paid_invitation_credits INTEGER NOT NULL DEFAULT 0');
ensureColumn('invitations', 'tenant_id', 'tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE');
ensureColumn('payments', 'tripay_payload', 'tripay_payload TEXT');

export default db;
