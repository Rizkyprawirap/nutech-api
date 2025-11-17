import z from "zod";
import { ServiceCode } from "../../pkg/conf/enum/service";

export const TopUpBalanceSchema = z.object({
  top_up_amount: z
    .number()
    .int()
    .refine((val) => val >= 1, {
      message:
        "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    }),
});

export const ServiceTransactionSchema = z.object({
  service_code: z
    .nativeEnum(ServiceCode)
    .refine((val) => Object.values(ServiceCode).includes(val), {
      message: "Service atau Layanan tidak ditemukan",
    }),
});

export const ServiceTransactionHistorySchema = z.object({
  offset: z.coerce
    .number()
    .int("offset harus berupa bilangan bulat")
    .min(0, "offset minimal 0")
    .default(0),

  limit: z.coerce
    .number()
    .int("limit harus berupa bilangan bulat")
    .min(1, "limit minimal 1")
    .max(100, "limit maksimal 100")
    .default(10),
});
