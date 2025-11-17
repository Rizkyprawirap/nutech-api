import { Router, Request, Response } from "express";
import InformationController from "../../controllers/information/information";

const controller = new InformationController();

export function InformationRoutes() {
  const group = Router();

  group.get("/v1/banner", async (req: Request, res: Response) => {
    try {
      const response = await controller.getBannerList();
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
  });

  group.get("/v1/services", async (req: Request, res: Response) => {
    try {
      const response = await controller.getBannerList();
      return res.status(200).json({
        code: 200,
        message: "Sukses",
        data: response.data,
      });
    } catch (err: any) {
      return res.status(500).json({
        code: err.code ?? 500,
        message: err.message ?? "Internal server error",
        error: err,
      });
    }
  });

  return group;
}
