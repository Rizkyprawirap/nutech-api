import { Jwt } from "../pkg/jwt/jwt";
import { AuthMiddleware } from "./types";

export const authMiddleware: AuthMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 108,
      message: "Token tidak valid atau kadaluwarsa",
      data: null,
    });
  }

  const token = header.split(" ")[1];
  const result = Jwt.verifyToken(token);

  if (!result.valid) {
    return res.status(401).json({
      status: 108,
      message: "Token tidak valid atau kadaluwarsa",
      data: null,
    });
  }

  res.locals.claims = {
    user_id: result.payload!.user_id,
    email: result.payload!.email,
  };

  next();
};
