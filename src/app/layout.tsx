import Header from "@/app/components/Header/Header";
import { ThemeProvider } from "@/components/theme-provider";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AI2SaaS",
	description: "Create your own AI SaaS",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={font.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					disableTransitionOnChange>
					<SupabaseProvider>
						<Header />
						<UserProvider>{children}</UserProvider>
					</SupabaseProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
