import { authMiddleware } from "./auth";
import { upload } from "./upload";
import { MiddlewareCollection } from "./types";

export const Middleware: MiddlewareCollection = {
  auth: authMiddleware,
  upload: upload,
  uploadSingle: upload.single("file"),
};
