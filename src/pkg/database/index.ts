import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const pool = isProduction
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      keepAlive: true,
    })
  : new Pool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "nutech",
      password: process.env.DB_PASS || "nutech123",
      database: process.env.DB_NAME || "nutech",
      port: Number(process.env.DB_PORT) || 5432,
    });

pool
  .connect()
  .then(() => console.log("[DATABASE] Connected"))
  .catch((err) => console.error("[DATABASE] Connection Error:", err));
