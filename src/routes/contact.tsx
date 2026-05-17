import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/contact";

export const Route = createFileRoute("/contact")({
	component: RouteComponent,
});
