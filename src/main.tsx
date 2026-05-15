/** biome-ignore-all lint/style/noNonNullAssertion: ... */

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";

// --- PENCEGAH KEDIP (FOUC PREVENTER) ---
// Mengeksekusi ini sebelum React jalan agar HTML sudah punya class yang benar
const storedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
	? "dark"
	: "light";
document.documentElement.classList.add(storedTheme || systemTheme);
// ---------------------------------------

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
