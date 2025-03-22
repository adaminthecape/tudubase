/**
 * Main Tasks Page
 *
 * This page displays all tasks for the current user.
 * The current paradigm is a Slack-like message view.
 * Other implementations will be placed in sub-routes.
 */

import TaskMessagesView from "@/components/tasks/TaskMessagesView";

export default function TasksPage()
{
	return (
		<div className="w-full">
			<TaskMessagesView />
		</div>
	);
}
