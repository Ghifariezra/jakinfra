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
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={ogImage} />
			</Helmet>
			{children}
		</>
	);
}