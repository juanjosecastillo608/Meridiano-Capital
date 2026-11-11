import { defineConfig } from "vitest/config";
import path from "node:path";

// Los tests NUNCA usan la base de desarrollo: DATABASE_URL_TEST (por defecto
// meridiano_pm_test). tests/integration/db.ts se niega a limpiar una base cuyo
// nombre no termine en "_test".
const TEST_DB = process.env.DATABASE_URL_TEST ?? "postgresql://meridiano:meridiano_dev@localhost:5432/meridiano_pm_test";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 30000,
    globalSetup: ["tests/global-setup.ts"],
    env: { DATABASE_URL: TEST_DB, SESSION_SECRET: "test-secret-test-secret-test-secret-123", STORAGE_DIR: "./storage-test" },
  },
});
