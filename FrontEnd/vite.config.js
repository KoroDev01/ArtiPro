import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/auth": "http://localhost:3000",
      "/me": "http://localhost:3000",
      "/createUser": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/posts": "http://localhost:3000",
      "/offers": "http://localhost:3000",
      "/messages": "http://localhost:3000",
      "/reviews": "http://localhost:3000",
      "/categories": "http://localhost:3000",
      "/pros": "http://localhost:3000",
      "/pro": "http://localhost:3000",
      "/notifications": "http://localhost:3000",
    },
  },
});
