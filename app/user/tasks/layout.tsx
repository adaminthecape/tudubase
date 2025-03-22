import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
	const supabase = await createClient()

	const { data: { user } } = await supabase.auth.getUser();

	if(!user)
	{
		// redirect("/sign-in");
	}

	return (
		<div className="w-full">
			{children}
		</div>
	);
}
