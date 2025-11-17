import { Pool } from "pg";
import dotenv from "dotenv";
import { AppEnv } from "../env/env";

dotenv.config();

export const pool = new Pool({
  host: AppEnv.DB_HOST || "localhost",
  user: AppEnv.DB_USER || "nutech",
  password: AppEnv.DB_PASS || "nutech123",
  database: AppEnv.DB_NAME || "nutech",
  port: Number(AppEnv.DB_PORT) || 5454,
});

pool
  .connect()
  .then(() => console.log("Connected to Database"))
  .catch((err: unknown) => console.error("[DATABASE] Connection Error:", err));
