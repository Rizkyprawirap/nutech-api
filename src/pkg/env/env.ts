import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export const AppEnv = {
  PORT: process.env.PORT || "7777",
  DB_USER: process.env.DB_USER || "nutech",
  DB_PORT: process.env.DB_PORT || "5432",
  DB_PASS: process.env.DB_PASS || "nutech123",
  DB_NAME: process.env.DB_NAME || "nutech",
  DB_HOST: process.env.DB_HOST || "localhost",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
};
