import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { queryClient } from "@/lib/query-client";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<Navbar />
					<main className="pt-16 min-h-screen">
						<Outlet />
					</main>
					<Footer />
				</ThemeProvider>
				{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
			</QueryClientProvider>
		</HelmetProvider>
	);
}
