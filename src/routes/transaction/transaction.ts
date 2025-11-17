import { Router, Response, Request } from "express";
import TransactionController from "../../controllers/transaction/transaction";
import {
  ServiceTransactionHistorySchema,
  ServiceTransactionSchema,
  TopUpBalanceSchema,
} from "./types";
import { Middleware } from "../../middleware/middleware";

const controller = new TransactionController();

export function TransactionRoutes() {
  const group = Router();

  group.get(
    "/v1/balance",
    Middleware.auth,
    async (req: Request, res: Response) => {
      try {
        const { user_id } = res.locals.claims;
        const response = await controller.getBalance({
          user_id: user_id,
        });

        return res.status(200).json({
          status: 0,
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

  group.post(
    "/v1/topup",
    Middleware.auth,
    async (req: Request, res: Response) => {
      try {
        const parsed = TopUpBalanceSchema.safeParse(req.body);
        if (!parsed.success) {
          const message = parsed.error.issues[0].message;

          return res.status(400).json({
            code: 400,
            message: "Validasi gagal",
            error: { message },
          });
        }

        const { top_up_amount } = parsed.data;
        const { user_id } = res.locals.claims;

        const response = await controller.addBalance({
          user_id: user_id,
          top_up_amount,
        });

        return res.status(200).json({
          code: 0,
          message: "Top Up Balance berhasil",
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

  group.post(
    "/v1/transaction",
    Middleware.auth,
    async (req: Request, res: Response) => {
      try {
        const parsed = ServiceTransactionSchema.safeParse(req.body);

        if (!parsed.success) {
          const message = parsed.error.issues[0].message;

          return res.status(400).json({
            code: 400,
            message: "Validasi gagal",
            error: { message },
          });
        }

        const { service_code } = parsed.data;
        const { user_id } = res.locals.claims;

        const response = await controller.serviceTransaction({
          user_id: user_id,
          service_code,
        });

        return res.status(200).json({
          code: 200,
          message: "Transaksi berhasil",
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
    "/v1/transaction/history",
    Middleware.auth,
    async (req: Request, res: Response) => {
      try {
        const parsed = ServiceTransactionHistorySchema.safeParse(req.query);

        if (!parsed.success) {
          const message = parsed.error.issues[0].message;

          return res.status(400).json({
            code: 400,
            message: "Validasi gagal",
            error: { message },
          });
        }

        const { limit, offset } = parsed.data;
        const { user_id } = res.locals.claims;

        const response = await controller.getTransactionHistory({
          user_id: user_id,
          limit,
          offset,
        });

        return res.status(200).json({
          code: 200,
          message: "Get History Berhasil",
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

  return group;
}
