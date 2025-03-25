/**
 * Main Tasks Page
 *
 * This page displays all tasks for the current user.
 * The current paradigm is a Slack-like message view.
 * Other implementations will be placed in sub-routes.
 */

import TaskMessagesView from "@/components/tasks/TaskMessagesView";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TasksPage()
{
	const supabase = await createClient()

	const { data: { session } } = await supabase.auth.getSession();

	if(!session)
	{
		// redirect("/sign-in");
	}

	return (
		<div className="w-full">
			<TaskMessagesView />
		</div>
	);
}
