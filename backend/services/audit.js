import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIT_PATH = path.join(__dirname, "..", "data", "audit.json");

async function readAudit() {
  try {
    const raw = await readFile(AUDIT_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeAudit(entries) {
  await writeFile(AUDIT_PATH, JSON.stringify(entries, null, 2));
}

export function actorFromReq(req) {
  if (req.worker) {
    return { workerId: req.worker.id, workerName: req.worker.name, workerRole: req.worker.role };
  }
  const adminKey = req.header("x-admin-key");
  return {
    workerId: null,
    workerName: adminKey ? "admin-key" : "unknown",
    workerRole: "admin",
  };
}

export async function logAudit({
  workerId = null,
  workerName = null,
  workerRole = null,
  action,
  target = null,
  targetType = null,
  details = null,
  ip = null,
}) {
  const entries = await readAudit();
  entries.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    workerId,
    workerName,
    workerRole,
    action,
    target,
    targetType,
    details,
    ip: ip || null,
    timestamp: new Date().toISOString(),
  });
  if (entries.length > 5000) entries.splice(0, entries.length - 5000);
  await writeAudit(entries);
}
