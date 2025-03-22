/**
 * Main Rewards Page
 *
 * This page displays the rewards the user has earned from completing tasks.
 */

import TaskMessagesView from "@/components/tasks/TaskMessagesView";

export default function RewardsPage()
{
	return (
		<div className="w-full">
			<TaskMessagesView />
		</div>
	);
}
