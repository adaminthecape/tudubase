import { Test } from "@/components/test";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage()
{
	const supabase = await createClient()

	const { data: { user } } = await supabase.auth.getUser();

	if(!user)
	{
		// redirect("/sign-in");
	}

	const basicFormStyles = {
		backgroundColor: "var(--geist-background)",
		borderRadius: "6px",
		padding: "20px",
		minWidth: '400px',
		maxWidth: '600px',
	};

	return (
		<div className="flex-1 w-full flex flex-col gap-2">
			<div className="w-full">
				<div style={basicFormStyles}><Test /></div>
			</div>
		</div>
	);
}
