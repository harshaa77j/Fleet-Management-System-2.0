import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,   // or 3001, 4000, etc.
    strictPort: true
  }
});
