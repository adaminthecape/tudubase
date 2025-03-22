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

import { getItemHandler } from '@/api/ItemUtils';
import { ItemTypes } from '@/zencore/ItemTypes';
import { Uuid } from '@/zencore/Utils';

async function getCollections()
{
	const handler = getItemHandler({
		itemType: ItemTypes.Collection,
		id: Uuid.generateUuid(),
	});
}

export default async function TasksPage()
{
	const supabase = await createClient()

	const { data: { user } } = await supabase.auth.getUser();

	if(!user)
	{
		// redirect("/sign-in");
	}

	return (
		<div className="w-full">
			<TaskMessagesView />
		</div>
	);
}
