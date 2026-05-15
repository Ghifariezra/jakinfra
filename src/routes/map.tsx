import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/map";

export const Route = createFileRoute("/map")({
	component: RouteComponent,
});
