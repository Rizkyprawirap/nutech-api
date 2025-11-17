import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { JwtPayload } from "./interface";
import { GenerateTokenOptions, VerifyTokenResult } from "./types";

const ACCESS_TOKEN_DEFAULT = "59m";

const JWT_SECRET: Secret = (process.env.JWT_SECRET as Secret) || "devsecret";
const JWT_REFRESH_SECRET: Secret =
  (process.env.JWT_REFRESH_SECRET as Secret) || JWT_SECRET;

type p = {
  user_id: string;
  email: string;
};

export class Jwt {
  static generateToken(
    payload: p,
    secret: Secret,
    options: GenerateTokenOptions = {},
  ): string {
    const signOptions: SignOptions = {
      expiresIn: (options.expiresIn ??
        ACCESS_TOKEN_DEFAULT) as SignOptions["expiresIn"],
      ...(options.jwtid ? { jwtid: options.jwtid } : {}),
    };

    return jwt.sign(payload as object, secret, signOptions);
  }

  static generateAccessToken(
    payload: JwtPayload,
    options: GenerateTokenOptions = {},
  ): string {
    return this.generateToken(payload, JWT_SECRET, {
      expiresIn: options.expiresIn ?? ACCESS_TOKEN_DEFAULT,
      jwtid: options.jwtid,
    });
  }

  static verifyToken<T = JwtPayload>(
    token: string,
    isRefresh = false,
  ): VerifyTokenResult<T> {
    const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_SECRET;

    try {
      const decoded = jwt.verify(token, secret) as T;
      return {
        valid: true,
        expired: false,
        payload: decoded,
      };
    } catch (err: any) {
      const message = err?.message ?? String(err);
      return {
        valid: false,
        expired: /jwt expired/i.test(message),
        error: message,
      };
    }
  }
}
