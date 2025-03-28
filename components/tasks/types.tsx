import { Collection } from '@/zencore/arch/Collection';
import { Item, Task, TaskActivity } from '@/zencore/ItemTypes';
import { TaskMaster } from '@/zencore/arch/TaskMaster';

/**
 * Collection list: to collect for each Collection:
 * - Collection data
 * - Whether a Task in it is active
 * - Whether a Task in it is due soon
 * - Last activity (especially how long ago & latest message)
 * - Whether a TaskMaster is assigned
 */
export type CollectionListItem = Item<Collection> & {
	collectionId: string;
	hasActiveTasks?: boolean;
	hasDueTasks?: boolean;
	lastActivity?: Item<TaskActivity>;
	taskMaster?: Item<TaskMaster>;
}

export type TaskCollectionListProps = {
	listItems: CollectionListItem[];
	setSelectedItem: (item: CollectionListItem) => void;
	selectedItemId?: string;
};

export type TaskCollectionListItemProps = CollectionListItem & {
	setSelectedItem: (item: CollectionListItem) => void;
	selectedItemId?: string;
};

/**
 * List of TaskActivity items
 * Needs to display the info about the activity, and the Task it belongs to.
 * Multiple activities under the same Task will be grouped, so we need to
 * display the relevant Task or TaskMaster fewer times.
 * For efficiency, we will just group all the Items together in the props array.
 */
export type TaskActivityListItem = (
	Item<Task> |
	Item<TaskMaster> |
	Item<TaskActivity>
)

export type TaskActivityListProps = {
	collection: CollectionListItem | undefined;
	onTaskAdded: (taskId: string, task: Item<Task> | undefined) => void;
};

export type TaskActivityListHeaderProps = {
	collection: CollectionListItem | undefined;
};