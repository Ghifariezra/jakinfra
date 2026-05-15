import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import customLogger from "./utils/logger";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const isProd = mode === "production";

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
			port: parseInt(env.VITE_PORT, 10) || 5173,
			proxy: {
				"/api": {
					target: env.VITE_API_URL || "http://localhost:3000",
					changeOrigin: true,
					secure: env.VITE_API_SECURE === "true",
				},
			},
		},
		worker: {
			format: "es",
		},
		optimizeDeps: {
			include: [
				"maplibre-gl",
				"react-map-gl",
				"@turf/turf",
				"axios",
				"zustand",
				"date-fns",
				"recharts",
			],
			holdUntilCrawlEnd: true,
		},
		build: {
			// Minify pakai esbuild (default, lebih cepat dari terser)
			minify: "esbuild",
			// Hapus console.log dan debugger di production
			esbuildOptions: isProd ? { drop: ["console", "debugger"] } : undefined,
			// Aktifkan CSS code splitting
			cssCodeSplit: true,
			// Source map hanya di dev
			sourcemap: !isProd,
			chunkSizeWarningLimit: 500,
			rollupOptions: {
				output: {
					// Nama file pakai hash untuk cache busting
					chunkFileNames: "assets/[name]-[hash].js",
					entryFileNames: "assets/[name]-[hash].js",
					assetFileNames: "assets/[name]-[hash].[ext]",
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (
								id.includes("maplibre-gl") ||
								id.includes("react-map-gl") ||
								id.includes("@turf")
							)
								return "vendor-map";
							if (id.includes("recharts") || id.includes("d3-"))
								return "vendor-charts";
							if (id.includes("react/") || id.includes("react-dom"))
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
