import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vercel from "vite-plugin-vercel";
import { resolve } from "path";
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: 'src/main.tsx',
    },
  },
  // server: {
  //   port: 8080, // Specify the port
  // },
  plugins: [react(), vercel()],
});


