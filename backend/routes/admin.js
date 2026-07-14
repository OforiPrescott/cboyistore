import { Router } from "express";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

// GET /api/admin/verify — used by the login screen to confirm the typed
// key actually works, instead of trusting whatever the user pasted in.
router.get("/verify", requireAdmin, (req, res) => {
  res.json({ ok: true });
});

export default router;
