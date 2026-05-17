import { Link } from "@tanstack/react-router";
import { BrandLogo } from "./brand-logo";

export function Footer() {
	// Array data untuk mengatasi DRY pada tautan footer
	const footerLinks = [
		{ name: "Kebijakan Privasi", path: "/privacy-policy" },
		{ name: "Syarat & Ketentuan", path: "/terms-of-service" },
		{ name: "Kontak", path: "/contact" },
	];

	return (
		<footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-md py-6 px-6 md:px-12 relative z-10 mt-auto">
			<div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
				{/* BAGIAN KIRI: Gunakan BrandLogo dengan prop khusus */}
				<BrandLogo iconSize={20} textClassName="gradient-text-teal" />

				{/* BAGIAN TENGAH: Copyright */}
				<p className="text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} JakInfra. Built by EzDev.
				</p>

				{/* BAGIAN KANAN: Mapping Tautan (DRY Resolved) */}
				<div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
					{footerLinks.map((link) => (
						<Link
							key={link.name}
							to={link.path}
							aria-label={link.name}
							className="hover:text-foreground hover:glow-primary transition-all"
						>
							{link.name}
						</Link>
					))}
				</div>
			</div>
		</footer>
	);
}
