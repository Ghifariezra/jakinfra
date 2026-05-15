import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/analytics";

export const Route = createFileRoute("/analytics")({
	component: RouteComponent,
});
