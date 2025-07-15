'use client';

import Sheet from '@mui/joy/Sheet';
import TaskActivityList from '@/components/tasks/messages/TaskActivityList';
import TaskCollectionList from '@/components/tasks/collections/TaskCollectionList';
import { useInitJoyTheme } from '@/hooks/useInitJoyTheme';
import { useEffect, useState } from 'react';
import { CollectionListItem } from '@/components/tasks/types';
import { Item, ItemTypes, Task, TaskActivity } from '@/zencore/ItemTypes';
import { searchItems } from '@/cache/actions/Generic';
import { Collection } from '@/zencore/arch/Collection';
import { Utils } from '@/zencore/Utils';

/**
 * TaskMessagesView component
 * 
 * Displays tasks as messages.
 * 
 * Top level (left pane) contains Collections, or individual Tasks.
 * 
 * Bottom level (right pane) contains Tasks and their activity.
 * 
 * Needs to fetch paginated Collections and Tasks.
 */

const testCollections: Collection[] = [
	{
		id: 'programming-tasks',
		name: 'Programming Tasks',
		description: 'Collection of programming-related tasks and activities',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		type: ItemTypes.Collection,
		tasks: ['1', '3', '5', '7', '9'],  // IDs of relevant programming tasks
		members: ['John Doe', 'Alice Johnson', 'Michael Brown', 'Chris Taylor', 'David Clark'],
		owner: 'John Doe',
		status: 'Active'
	}
];

export default function TaskMessagesView() 
{
	const { baseTheme, setBaseTheme, joyTheme, setJoyTheme } = useInitJoyTheme();

	const [
		items,
		setItems
	] = useState<CollectionListItem[]>([]);
	const [
		selectedItem,
		setSelectedItem
	] = useState<CollectionListItem>(items[0]);

	async function getCollections()
	{
		return testCollections;
		const collections = await searchItems<Collection>({
			itemType: ItemTypes.Collection,
			filters: [],
		});

		console.log('getCollections:', collections.data?.results);

		return collections.data?.results || [];
	}

	// useEffect(() =>
	// {
	// 	getCollections().then((collections) =>
	// 	{
	// 		const mappedCollections = collections.map((collection) =>
	// 		{
	// 			return {
	// 				...collection,
	// 				collectionId: collection.id,
	// 				hasActiveTasks: false,
	// 				hasDueTasks: false,
	// 				lastActivity: undefined,
	// 				taskMaster: undefined,
	// 			};
	// 		});
	// 		setItems(mappedCollections);
	// 		setSelectedItem(mappedCollections[0]);
	// 	});
	// }, []);

	function setSelectedCollection(collection: Item<Collection>)
	{
		// it might not exist in the list, so we need to find it
		const foundCollection = items.find((item) => item.id === collection.id);

		if(foundCollection)
		{
			setSelectedItem(foundCollection);
		}
		// if not found, add it
		else
		{
			console.log('adding collection:', collection);
			setItems([
				...items,
				{
					...collection,
					collectionId: collection.id,
					hasActiveTasks: false,
					hasDueTasks: false,
					lastActivity: undefined,
					taskMaster: undefined,
				}
			]);
			setSelectedItem(items[items.length - 1]);
		}
	}

	function onTaskAdded(taskId: string, task: Item<Task> | undefined)
	{
		console.log('task added:', taskId, task);
	}

	const [taskActivityListKey, setTaskActivityListKey] = useState(0);

	return (
		<Sheet
			sx={{
				flex: 1,
				width: '100%',
				mx: 'auto',
				pt: { xs: 'var(--Header-height)', md: 0 },
				display: 'grid',
				gridTemplateColumns: {
					xs: '1fr',
					sm: 'minmax(min-content, min(30%, 400px)) 1fr',
				},
			}}
		>
			<Sheet
				sx={{
					position: { xs: 'fixed', sm: 'sticky' },
					transform: {
						xs: 'translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))',
						sm: 'none',
					},
					transition: 'transform 0.4s, width 0.4s',
					zIndex: 100,
					width: '100%',
					height: '100dvh',
					top: 52,
				}}
			>
				<TaskCollectionList
					listItems={testCollections}
					selectedItemId={selectedItem?.id}
					setSelectedItem={setSelectedCollection}
				/>
			</Sheet>
			<TaskActivityList
				key={`task-activity-list-${taskActivityListKey}`}
				collection={selectedItem}
				onTaskAdded={onTaskAdded}
			/>
		</Sheet>
	);
}