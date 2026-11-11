import { execSync } from "node:child_process";

export default function setup() {
  const url = process.env.DATABASE_URL_TEST ?? "postgresql://meridiano:meridiano_dev@localhost:5432/meridiano_pm_test";
  if (!/_test(\?|$)/.test(url)) throw new Error("DATABASE_URL_TEST debe apuntar a una base cuyo nombre termine en _test.");
  execSync("npx prisma migrate deploy", { env: { ...process.env, DATABASE_URL: url }, stdio: "pipe" });
  execSync("npx tsx prisma/seed.ts", { env: { ...process.env, DATABASE_URL: url }, stdio: "pipe" });
}
