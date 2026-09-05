import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    coverage: {
      include: ["app/**", "components/**", "features/**", "lib/**"],
      provider: "v8",
      reporter: ["text", "lcov"],
    },
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}", "lib/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
  },
});
