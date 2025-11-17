import { Request, Response, NextFunction } from "express";

export type BaseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;

export type AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Response | Promise<void>;

export interface MiddlewareCollection {
  auth: AuthMiddleware;
  upload: any;
  uploadSingle: any;
}
