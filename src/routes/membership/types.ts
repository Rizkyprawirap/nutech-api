import { z } from "zod";

export const RegisterMembershipSchema = z.object({
  email: z.string().email("Parameter email tidak sesuai format"),
  first_name: z.string().min(1, "first_name harus diisi"),
  last_name: z.string().min(1, "last_name harus diisi"),
  password: z.string().min(6, "password minimal 6 karakter"),
});

export const LoginMembershipSchema = z.object({
  email: z.string().email("Parameter email tidak sesuai format"),
  password: z.string().min(6, "password minimal 6 karakter"),
});
export const UpdateProfileMembershipSchema = z.object({
  first_name: z.string().min(1, "first_name harus diisi"),
  last_name: z.string().min(1, "last_name harus diisi"),
});
