import { Pool } from "pg";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`환경변수 ${name}가 없습니다.`);
  }

  return value;
}

const dbPort = Number(getRequiredEnv("DB_PORT"));

if (!Number.isInteger(dbPort)) {
  throw new Error("DB_PORT는 정수여야 합니다.");
}

export const pool = new Pool({
  host: getRequiredEnv("DB_HOST"),
  port: dbPort,
  database: getRequiredEnv("DB_NAME"),
  user: getRequiredEnv("DB_USER"),
  password: getRequiredEnv("DB_PASSWORD"),
});

export async function checkDatabaseConnection(): Promise<void> {
  await pool.query("SELECT 1");
}