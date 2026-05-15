import { createFileRoute } from "@tanstack/react-router";
import { Index } from "@/lib/features/home";

export const Route = createFileRoute("/")({
	component: Index,
});
