/**
 * Main Character Page
 *
 * This page displays the character information and equipment.
 * This includes stats, inventory, and other character-specific information.
 */

import TaskMessagesView from "@/components/tasks/TaskMessagesView";

export default function CharacterPage()
{
	return (
		<div className="w-full">
			<TaskMessagesView />
		</div>
	);
}
