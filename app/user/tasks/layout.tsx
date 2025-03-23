import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
	const supabase = await createClient()

	const { data: { session } } = await supabase.auth.getSession();

	if(!session)
	{
		// redirect("/sign-in");
	}

	return (
		<div className="w-full">
			{children}
		</div>
	);
}
