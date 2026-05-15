import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BrandLogo } from "./brand-logo";

const navLinks = [
	{ name: "Beranda", path: "/" },
	{ name: "Peta", path: "/map" },
	{ name: "Analitik", path: "/analytics" },
	{ name: "Tentang", path: "/about" },
];

export function Navbar() {
	const [open, setOpen] = useState(false);

	return (
		<nav className="glass-navbar fixed top-0 left-0 right-0 z-50 h-16 px-6 md:px-12 flex items-center justify-between border-b border-border/40">
			{/* KIRI: Logo */}
			<BrandLogo />

			{/* TENGAH: Desktop nav */}
			<div className="hidden md:flex items-center gap-8 h-full">
				{navLinks.map((link) => (
					<Link
						key={link.path}
						to={link.path}
						activeOptions={{ exact: link.path === "/" }}
						className="h-full flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent px-1 mt-0.5"
						activeProps={{
							className: "text-foreground !border-teal-400",
						}}
					>
						{link.name}
					</Link>
				))}
			</div>

			{/* KANAN: Actions */}
			<div className="flex items-center gap-3 md:gap-5">
				<AnimatedThemeToggler
					variant="star"
					duration={400}
					className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
					aria-label="Toggle dark mode"
				/>

				<Button
					title="Dapatkan akses ke dataset infrastruktur Jakarta"
					className="hidden sm:flex gradient-teal text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
				>
					Minta Akses Data
				</Button>

				{/* Mobile: Hamburger */}
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						{/** biome-ignore lint/a11y/useButtonType: ... */}
						<button
							onClick={() => setOpen(!open)}
							className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border/40 bg-background/40 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/10 transition-all cursor-pointer"
							aria-label="Buka menu"
						>
							{open ? <X size={16} /> : <Menu size={16} />}
						</button>
					</SheetTrigger>

					<SheetContent
						side="right"
						className="w-72 glass border-l border-border/40 p-0 flex flex-col"
					>
						{/* Sheet header */}
						<div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
							<BrandLogo />
						</div>

						{/* Nav links */}
						<nav className="flex flex-col px-4 py-6 gap-1 flex-1">
							{navLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									activeOptions={{ exact: link.path === "/" }}
									onClick={() => setOpen(false)}
									className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
									activeProps={{
										className:
											"text-teal-400 bg-teal-400/10 hover:bg-teal-400/15 !text-teal-400",
									}}
								>
									{link.name}
								</Link>
							))}
						</nav>

						{/* Sheet footer */}
						<div className="px-6 py-5 border-t border-border/40">
							<Button
								className="w-full gradient-teal text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
								onClick={() => setOpen(false)}
							>
								Minta Akses Data
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}
