import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/terms-of-service";

export const Route = createFileRoute("/terms-of-service")({
	component: RouteComponent,
});
