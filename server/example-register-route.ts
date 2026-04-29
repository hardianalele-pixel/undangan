import { db } from "./db";

export async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    const tenantRes = await db.query(
      "INSERT INTO tenants(name) VALUES($1) RETURNING id",
      [name]
    );

    const tenantId = tenantRes.rows[0].id;

    await db.query(
      "INSERT INTO users(tenant_id, name, email, password_hash) VALUES($1,$2,$3,$4)",
      [tenantId, name, email, password]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "register failed" });
  }
}
