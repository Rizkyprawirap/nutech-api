import {
  LoginMembershipSchema,
  RegisterMembershipSchema,
  UpdateProfileMembershipSchema,
} from "./types";
import { Router, Request, Response } from "express";
import MembershipController from "../../controllers/membership/membership";
import { Middleware } from "../../middleware/middleware";

const controller = new MembershipController();

export function MembershipRoutes() {
  const group = Router();

  group.post("/v1/registration", async (req: Request, res: Response) => {
    try {
      const parsed = RegisterMembershipSchema.safeParse(req.body);

      if (!parsed.success) {
        const message = parsed.error.issues[0].message;

        return res.status(400).json({
          code: 400,
          message: "Validasi gagal",
          error: { message },
        });
      }

      const { email, first_name, last_name, password } = parsed.data;

      const response = await controller.registerMembership({
        email,
        first_name,
        last_name,
        password,
      });

      return res.status(200).json({
        code: 200,
        message: "Registrasi berhasil silahkan login",
        data: response,
      });
    } catch (err: any) {
      return res.status(500).json({
        code: err.code ?? 500,
        message: err.message ?? "Internal server error",
        error: err,
      });
    }
  });

  group.post("/v1/login", async (req: Request, res: Response) => {
    try {
      const parsed = LoginMembershipSchema.safeParse(req.body);

      if (!parsed.success) {
        const message = parsed.error.issues[0].message;

        return res.status(400).json({
          code: 400,
          message: "Validasi gagal",
          error: { message },
        });
      }

      const { email, password } = parsed.data;
      const response = await controller.loginMembership({
        email,
        password,
      });

      return res.status(200).json({
        code: 200,
        message: "Login Sukses",
        data: response,
      });
    } catch (err: any) {
      return res.status(500).json({
        code: err.code ?? 500,
        message: err.message ?? "Internal server error",
        error: err,
      });
    }
  });

  group.put(
    "/v1/profile/update",
    Middleware.auth,
    async (req: Request, res: Response) => {
      try {
        const parsed = UpdateProfileMembershipSchema.safeParse(req.body);
        if (!parsed.success) {
          const message = parsed.error.issues[0].message;

          return res.status(400).json({
            code: 400,
            message: "Validasi gagal",
            error: { message },
          });
        }

        const { first_name, last_name } = parsed.data;
        const { email } = res.locals.claims;
        const response = await controller.updateProfileMembership({
          email: email,
          first_name,
          last_name,
        });

        return res.status(200).json({
          code: 200,
          message: "Update Profile berhasil",
          data: response,
        });
      } catch (err: any) {
        return res.status(500).json({
          code: err.code ?? 500,
          message: err.message ?? "Internal server error",
          error: err,
        });
      }
    },
  );

  group.get(
    "/v1/profile",
    Middleware.auth,
    async (req: Request, res: Response) => {
      try {
        const { email } = res.locals.claims;
        const response = await controller.getProfileMembership({
          email,
        });

        return res.status(200).json({
          code: 200,
          message: "Sukses",
          data: response,
        });
      } catch (err: any) {
        return res.status(500).json({
          code: err.code ?? 500,
          message: err.message ?? "Internal server error",
          error: err,
        });
      }
    },
  );

  group.put(
    "/v1/profile/image",
    Middleware.auth,
    Middleware.uploadSingle,
    async (req: Request, res: Response) => {
      try {
        const { email } = res.locals.claims;
        const response = await controller.updateProfileImageMembership({
          email: email,
          file: req.file! || null,
        });

        res.status(200).json({
          code: 200,
          message: "Update Profile Image berhasil",
          data: response,
        });
      } catch (err) {
        res.status(500).json({ status: 500, message: "Internal server error" });
      }
    },
  );

  return group;
}
