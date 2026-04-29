import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.DATA_DIR || (process.env.VERCEL ? path.join("/tmp", "lathe-invite-data") : path.resolve(__dirname, "..", "data"));
const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, "lathe.db");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(path.join(DATA_DIR, 'uploads', 'signatures'), { recursive: true });
fs.mkdirSync(path.join(DATA_DIR, 'uploads', 'photos'), { recursive: true });
fs.mkdirSync(path.join(DATA_DIR, 'uploads', 'media'), { recursive: true });

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function hasColumn(table: string, column: string) {
  return (db.prepare(`PRAGMA table_info(${table})`).all() as any[]).some((c) => c.name === column);
}

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      free_invitation_limit INTEGER DEFAULT 1,
      paid_invitation_credits INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      tenant_id TEXT REFERENCES tenants(id),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      tenant_id TEXT REFERENCES tenants(id),
      slug TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft','published')),
      meta TEXT DEFAULT '{}',
      blocks TEXT DEFAULT '[]',
      theme_config TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS guests (
      id TEXT PRIMARY KEY,
      invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
      qr_token TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      pax INTEGER DEFAULT 1,
      is_vip INTEGER DEFAULT 0,
      checked_in_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      merchant_ref TEXT UNIQUE NOT NULL,
      tripay_reference TEXT,
      tripay_payload TEXT DEFAULT '{}',
      amount INTEGER NOT NULL,
      credits INTEGER DEFAULT 1,
      status TEXT DEFAULT 'UNPAID',
      payment_url TEXT,
      checkout_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      paid_at TEXT
    );

    CREATE TABLE IF NOT EXISTS guestbook_entries (
      id TEXT PRIMARY KEY,
      invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
      guest_id TEXT REFERENCES guests(id),
      guest_name TEXT NOT NULL,
      message TEXT,
      signature_path TEXT,
      photo_path TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  if (!hasColumn('users', 'tenant_id')) db.exec('ALTER TABLE users ADD COLUMN tenant_id TEXT REFERENCES tenants(id)');
  if (!hasColumn('invitations', 'tenant_id')) db.exec('ALTER TABLE invitations ADD COLUMN tenant_id TEXT REFERENCES tenants(id)');

  const usersWithoutTenant = db.prepare('SELECT id, name FROM users WHERE tenant_id IS NULL').all() as any[];
  for (const user of usersWithoutTenant) {
    const tenantId = `tenant_${user.id}`;
    const tenant = db.prepare('SELECT id FROM tenants WHERE id = ?').get(tenantId);
    if (!tenant) db.prepare('INSERT INTO tenants (id, name) VALUES (?, ?)').run(tenantId, user.name || 'Workspace');
    db.prepare('UPDATE users SET tenant_id = ? WHERE id = ?').run(tenantId, user.id);
    db.prepare('UPDATE invitations SET tenant_id = ? WHERE user_id = ? AND tenant_id IS NULL').run(tenantId, user.id);
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
    CREATE INDEX IF NOT EXISTS idx_invitations_user ON invitations(user_id);
    CREATE INDEX IF NOT EXISTS idx_invitations_tenant ON invitations(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_guests_qr ON guests(qr_token);
    CREATE INDEX IF NOT EXISTS idx_guests_invitation ON guests(invitation_id);
    CREATE INDEX IF NOT EXISTS idx_guestbook_invitation ON guestbook_entries(invitation_id);
    CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_payments_ref ON payments(merchant_ref);
  `);
}

migrate();

export default db;
export { DATA_DIR };
