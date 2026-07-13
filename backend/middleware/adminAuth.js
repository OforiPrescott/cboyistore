// Lightweight admin protection: the /admin frontend sends the key typed
// into its login screen as an `x-admin-key` header on every request.
// Good enough for a single-owner shop dashboard; swap for real auth
// (sessions, hashed passwords, multiple staff accounts) if you grow the team.
export function requireAdmin(req, res, next) {
  const key = req.header("x-admin-key");
  const expected = process.env.ADMIN_KEY;

  if (!expected) {
    return res.status(500).json({ error: "ADMIN_KEY is not configured on the server" });
  }
  if (!key || key !== expected) {
    return res.status(401).json({ error: "Invalid admin key" });
  }
  next();
}
