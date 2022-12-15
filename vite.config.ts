import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    outDir: "build",
  },
  test: {
    globals: true,
    setupFiles: "./test/setupTests.ts",
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
});
