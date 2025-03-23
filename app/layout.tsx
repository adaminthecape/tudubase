import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/inter';
import InitColorSchemeScript from '@mui/joy/InitColorSchemeScript';
import { Button, CssVarsProvider } from "@mui/joy";
import UserControlsContainer from "@/components/user/UserControlsContainer";
import I18N from "@/components/ui/I18N";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "tudu",
  description: "A gamified task manager",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
	return (
		<html lang="en" className={geistSans.className} suppressHydrationWarning>
		<body className="bg-background text-foreground">
			<InitColorSchemeScript />
			<CssVarsProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
			<main className="min-h-screen flex flex-col items-center">
				<div className="flex-1 w-full flex flex-col items-center">
				<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
					<div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
						<div className="flex gap-2 items-start font-semibold" style={{alignItems: 'center'}}>
							<Link href={"/"}>tudu</Link>
							<div />
							<Button
								size="sm"
								color="neutral"
								variant="soft"
							>
								<Link href={"/user"}>
									<I18N sid="nav.test.title" />
								</Link>
							</Button>
							<Button
								size="sm"
								color="neutral"
								variant="soft"
							>
								<Link href={"/user/tasks"}>
									<I18N sid="nav.tasks.title" />
								</Link>
							</Button>
						</div>
					</div>
					<div className="flex justify-end items-center gap-2">
						<UserControlsContainer />
						{/* <HeaderAuth /> */}
						<div />
					</div>
				</nav>
				<div className="flex flex-col w-full">
					{children}
				</div>

				<footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
					<p>
						Powered by{" "}
						<a
							href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
							target="_blank"
							className="font-bold hover:underline"
							rel="noreferrer"
						>
							Supabase
						</a>
					</p>
					<ThemeSwitcher />
				</footer>
				</div>
			</main>
			</ThemeProvider>
				</CssVarsProvider>
			</body>
		</html>
	);
}
