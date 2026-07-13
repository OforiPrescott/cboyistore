import { Router } from "express";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "data", "tradein.json");

const router = Router();

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

export default router;
