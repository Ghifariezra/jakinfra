import { Helmet } from "react-helmet-async";

export function Head({
	children,
	title,
	description,
	ogImage = "https://jakinfra.ezdev.xyz/og-image.png",
}: {
	children: React.ReactNode;
	title: string;
	description: string;
	ogImage?: string;
}) {
	return (
		<>
			<Helmet>
				<title>{title}</title>
				<meta name="description" content={description} />

				{/* Open Graph for Facebook, LinkedIn */}
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={ogImage} />

				{/* Twitter Card */}
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={ogImage} />
				<meta name="twitter:card" content="summary_large_image" />
				<link rel="icon" href="/logo.svg" />
			</Helmet>
			{children}
		</>
	);
}
