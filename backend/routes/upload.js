import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import { requireAdmin } from "../middleware/adminAuth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "..", "uploads");

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_IMAGES = 7;
const MAX_VIDEO_MB = 40;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 12);
    const kind = file.mimetype.startsWith("video") ? "vid" : "img";
    cb(null, `${kind}-${nanoid(10)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_MB * 1024 * 1024, files: MAX_IMAGES + 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      return cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  },
});

const router = Router();

// POST /api/upload  — admin only. Accepts a mix of image + video files and
// returns their public URLs (served from /api/uploads). The product form
// attaches these to a product's `images` array / `video` field.
router.post("/", requireAdmin, upload.array("files", MAX_IMAGES + 1), (req, res) => {
  const files = req.files || [];
  const images = files
    .filter((f) => f.mimetype.startsWith("image"))
    .map((f) => `/api/uploads/${f.filename}`);
  const videos = files
    .filter((f) => f.mimetype.startsWith("video"))
    .map((f) => `/api/uploads/${f.filename}`);
  res.status(201).json({ images, videos, urls: [...images, ...videos] });
});

export default router;
