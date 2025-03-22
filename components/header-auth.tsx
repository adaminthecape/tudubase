import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@mui/joy";

export default async function AuthButton()
{
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
		
	function trimEmail(email: string): string
	{
		const [name, domain] = email.split("@");
		const trimmedName = name.length > 1 ? `${name.slice(0, 1)}_` : name;
		const [domainName, domainTld] = domain.split(".");
		const trimmedDomain = domainName.length > 1 ? `${domainName.slice(0, 1)}_` : domainName;
		return `${trimmedName}@${trimmedDomain}.${domainTld}`;
	}

	if(!hasEnvVars) 
	{
		return (
		<>
			<div className="flex gap-4 items-center">
				<div>
					<Badge
					variant={"default"}
					className="font-normal pointer-events-none"
					>
					Please update .env.local file with anon key and url
					</Badge>
				</div>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="soft"
						disabled
						className="opacity-75 cursor-none pointer-events-none"
					>
					<Link href="/sign-in">Sign in</Link>
					</Button>
					<Button
						size="sm"
						variant="soft"
						disabled
						className="opacity-75 cursor-none pointer-events-none"
					>
					<Link href="/sign-up">Sign up</Link>
					</Button>
				</div>
			</div>
		</>
		);
	}
	return user ? (
		<div className="flex items-center gap-2">
			<div>{trimEmail(user.email ?? '')}</div>
			<form action={signOutAction}>
				<Button
					type="submit"
					variant="soft"
					color="neutral"
					style={{ whiteSpace: 'nowrap' }}
				>
					Sign out
				</Button>
			</form>
			</div>
		) : (
			<div className="flex gap-2">
			<Button size="sm" variant="soft" style={{whiteSpace:'nowrap'}}>
				<Link href="/sign-in">Sign in</Link>
			</Button>
			<Button size="sm" variant="soft" style={{whiteSpace:'nowrap'}}>
				<Link href="/sign-up">Sign up</Link>
			</Button>
		</div>
	);
}
