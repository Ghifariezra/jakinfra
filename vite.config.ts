import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import customLogger from "./utils/logger";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		base: "/",
		customLogger,
		plugins: [
			TanStackRouterVite({ autoCodeSplitting: true }),
			tailwindcss(),
			react(),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			port: parseInt(env.VITE_PORT) || 5173,
			proxy: {
				// Setiap kali ada request ke '/api', Vite akan menangkapnya
				"/api": {
					target: env.VITE_API_URL || "http://localhost:3000",
					changeOrigin: true,
					secure: env.VITE_API_SECURE === "true",
					// rewrite: (path) => path.replace(/^\/api/, ""),
				},
			},
		},
		worker: {
			format: "es",
		},
		optimizeDeps: {
			include: [
				"maplibre-gl",
				// "react-map-gl",
				"@turf/turf",
				"axios",
				"zustand",
				"date-fns",
			],
			holdUntilCrawlEnd: true,
		},
		build: {
			chunkSizeWarningLimit: 500,
			rollupOptions: {
				output: {
					// Vite 8 / Rolldown: manualChunks harus berupa fungsi, bukan object
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (
								id.includes("maplibre-gl") ||
								id.includes("react-map-gl") ||
								id.includes("@turf")
							)
								return "vendor-map";
							if (id.includes("react") || id.includes("react-dom"))
								return "vendor-react";
							if (id.includes("@tanstack")) return "vendor-query";
							if (
								id.includes("radix-ui") ||
								id.includes("class-variance-authority") ||
								id.includes("clsx") ||
								id.includes("tailwind-merge")
							)
								return "vendor-ui";
						}
					},
				},
			},
		},
	};
});
