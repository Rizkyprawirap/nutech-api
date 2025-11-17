import fs from "fs";
import multer from "multer";
import path from "path";
import { InvalidImageFormatError } from "./multer_error";

// TODO: No where to upload
const uploadDir = "uploads/profile";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

function fileFilter(_req: any, file: Express.Multer.File, cb: any) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new InvalidImageFormatError(), false);
  }
  cb(null, true);
}

export const upload = multer({ storage, fileFilter });
