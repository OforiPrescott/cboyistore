import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import { requireAdmin } from "../middleware/adminAuth.js";
import { logAudit, actorFromReq } from "../services/audit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "data", "tradein.json");

const router = Router();

async function loadDevices() {
  const raw = await readFile(dataPath, "utf-8");
  return JSON.parse(raw);
}

async function saveDevices(devices) {
  await writeFile(dataPath, JSON.stringify(devices, null, 2));
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Condition multipliers — kept simple and transparent on purpose. Real
// grading (screen, battery health, board condition) still happens in-store;
// this just gives customers a realistic ballpark before they visit.
const CONDITION_MULTIPLIERS = {
  excellent: 0.85,
  good: 0.7,
  fair: 0.5,
  faulty: 0.25,
};

router.get("/devices", async (req, res, next) => {
  try {
    const raw = await readFile(dataPath, "utf-8");
    res.json(JSON.parse(raw));
  } catch (err) {
    next(err);
  }
});

// POST /api/tradein/estimate  { deviceId, condition }
router.post("/estimate", async (req, res, next) => {
  try {
    const { deviceId, condition } = req.body;
    const raw = await readFile(dataPath, "utf-8");
    const devices = JSON.parse(raw);
    const device = devices.find((d) => d.id === deviceId);

    if (!device) return res.status(404).json({ error: "Device not found" });
    const multiplier = CONDITION_MULTIPLIERS[condition];
    if (!multiplier) return res.status(400).json({ error: "Invalid condition" });

    const estimate = Math.round(device.baseValue * multiplier);
    res.json({
      device: device.name,
      condition,
      estimate,
      range: [Math.round(estimate * 0.9), Math.round(estimate * 1.1)],
      note: "Final offer confirmed in-store after a quick device check.",
    });
  } catch (err) {
    next(err);
  }
});

// --- Admin-only management of trade-in devices ---

// GET /api/tradein/admin
router.get("/admin", requireAdmin, async (req, res, next) => {
  try {
    res.json(await loadDevices());
  } catch (err) {
    next(err);
  }
});

// POST /api/tradein/admin
router.post("/admin", requireAdmin, async (req, res, next) => {
  try {
    const { name, baseValue } = req.body;
    if (!name || baseValue === undefined || baseValue === "") {
      return res.status(400).json({ error: "name and baseValue are required" });
    }
    const devices = await loadDevices();
    const device = {
      id: req.body.id || `${slugify(name)}-${nanoid(4)}`,
      name: String(name).trim(),
      baseValue: Number(baseValue),
    };
    devices.push(device);
    await saveDevices(devices);
    res.status(201).json(device);
    const actor = actorFromReq(req);
    logAudit({ ...actor, action: "tradein.device_created", target: device.id, targetType: "tradein_device", details: `Added trade-in device ${device.name}` }).catch(() => {});
  } catch (err) {
    next(err);
  }
});

// PUT /api/tradein/admin/:id
router.put("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    const devices = await loadDevices();
    const index = devices.findIndex((d) => d.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Device not found" });
    if (req.body.baseValue !== undefined) {
      devices[index].baseValue = Number(req.body.baseValue);
    }
    if (req.body.name !== undefined) devices[index].name = String(req.body.name).trim();
    await saveDevices(devices);
    res.json(devices[index]);
    const actor = actorFromReq(req);
    logAudit({ ...actor, action: "tradein.device_updated", target: devices[index].id, targetType: "tradein_device", details: `Updated trade-in device ${devices[index].name}` }).catch(() => {});
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tradein/admin/:id
router.delete("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    const devices = await loadDevices();
    const next_ = devices.filter((d) => d.id !== req.params.id);
    if (next_.length === devices.length) {
      return res.status(404).json({ error: "Device not found" });
    }
    const removed = devices.find((d) => d.id === req.params.id);
    await saveDevices(next_);
    res.status(204).end();
    const actor = actorFromReq(req);
    logAudit({ ...actor, action: "tradein.device_deleted", target: removed.id, targetType: "tradein_device", details: `Deleted trade-in device ${removed.name}` }).catch(() => {});
  } catch (err) {
    next(err);
  }
});

export default router;
