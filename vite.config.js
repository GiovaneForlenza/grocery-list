import { createRequire } from "module";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import whyIsNodeRunning from "why-is-node-running";
const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "force-exit-after-build",
      apply: "build",
      closeBundle() {
        whyIsNodeRunning();
        setTimeout(() => process.exit(0), 0);
      },
    },
  ],
});
