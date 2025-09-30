import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADD THIS SERVER CONFIGURATION
  server: {
    proxy: {
      // All requests starting with /api will be proxied
      "/api": {
        target: "http://localhost:5000", // Your backend server URL
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false, // Recommended if your backend is not using HTTPS
      },
    },
  },
});
