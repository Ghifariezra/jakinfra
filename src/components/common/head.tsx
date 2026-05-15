export function Head({
	children,
	title,
	description,
	ogImage = "https://jakinfra.ezdev.xyz/og-image.png", // Nilai default jika tidak diisi
}: {
	children: React.ReactNode;
	title: string;
	description: string;
	ogImage?: string;
}) {
	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={ogImage} />

			{/* Konten Halaman */}
			{children}
		</>
	);
}
