import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/about";

export const Route = createFileRoute("/about")({
	component: RouteComponent,
});
