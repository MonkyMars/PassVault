import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // Ensure base path is set to root
  build: {
    outDir: "build",
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps for embedded builds
    rollupOptions: {
      output: {
        manualChunks: undefined, // Keep everything in one chunk for simpler embedding
      },
    },
  },
  define: {
    // Ensure NODE_ENV is properly defined
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
