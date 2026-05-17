import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/privacy-policy";

export const Route = createFileRoute("/privacy-policy")({
	component: RouteComponent,
});
