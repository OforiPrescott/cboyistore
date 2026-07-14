// Lightweight admin protection: the /admin frontend sends the key typed
// into its login screen as an `x-admin-key` header on every request.
// Good enough for a single-owner shop dashboard; swap for real auth
// (sessions, hashed passwords, multiple staff accounts) if you grow the team.
//
// On platforms like Render the ADMIN_KEY is set via an environment variable.
// If it's missing (e.g. not configured yet), fall back to the same key used
// locally so the dashboard still works — but always prefer setting ADMIN_KEY
// in the host's dashboard for production.
const FALLBACK_KEY = "CboyIstore@2026";

export function requireAdmin(req, res, next) {
  const key = req.header("x-admin-key");
  const expected = process.env.ADMIN_KEY || FALLBACK_KEY;

  if (!process.env.ADMIN_KEY) {
    console.warn(
      "[admin] ADMIN_KEY env var is not set — using the built-in fallback key. " +
        "Set ADMIN_KEY in your host (e.g. Render) dashboard for a secure, custom key."
    );
  }

  if (!key || key !== expected) {
    return res.status(401).json({ error: "Invalid admin key" });
  }
  next();
}
