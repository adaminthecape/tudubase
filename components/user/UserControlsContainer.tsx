import UserControls from "@/components/user/UserControls";
import { createClient } from "@/utils/supabase/server";
import { CssVarsProvider } from "@mui/joy";
import { ThemeProvider } from "next-themes";

export default async function UserControlsContainer()
{
	const supabase = await createClient();

	const { data: { user } } = await supabase.auth.getUser();

	console.log('UserControls: user', user?.aud === 'authenticated');

	function trimEmail(email: string): string
	{
		const [name, domain] = email.split("@");
		const trimmedName = name.length > 1 ? `${name.slice(0, 1)}_` : name;
		const [domainName, domainTld] = domain.split(".");
		const trimmedDomain = domainName.length > 1 ? `${domainName.slice(0, 1)}_` : domainName;
		return `${trimmedName}@${trimmedDomain}.${domainTld}`;
	}

	return (
		
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<CssVarsProvider>
				<UserControls
					userId={user?.id}
					userEmail={user?.email ? trimEmail(user.email) : ''}
				/>
			</CssVarsProvider>
		</ThemeProvider>
	);
}
