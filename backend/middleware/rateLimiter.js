import { Router } from "express";

const attempts = new Map();

export function rateLimiter(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const record = attempts.get(key);

    if (!record || now - record.startTime > windowMs) {
      attempts.set(key, { count: 1, startTime: now });
      return next();
    }

    record.count += 1;
    if (record.count > maxAttempts) {
      const remaining = Math.ceil((windowMs - (now - record.startTime)) / 1000);
      return res.status(429).json({ error: `Too many attempts. Please try again in ${remaining} seconds.` });
    }

    next();
  };
}

export default rateLimiter;
