import { Pool, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

pool.on("connect", () => {
  console.log("Kết nối thành công với PostgreSQL!");
});

pool.on("error", (err: Error) => {
  console.error("Lỗi kết nối PostgreSQL:", err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
  return pool.query(text, params);
};
