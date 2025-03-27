'use client';

import Sheet from '@mui/joy/Sheet';
import TaskActivityList from '@/components/tasks/messages/TaskActivityList';
import TaskCollectionList from '@/components/tasks/collections/TaskCollectionList';
import { useInitJoyTheme } from '@/hooks/useInitJoyTheme';
import { useEffect, useState } from 'react';
import { CollectionListItem } from '@/components/tasks/types';
import { Utils } from '@/zencore/Utils';
import { ItemTypes, TaskActivityType } from '@/zencore/ItemTypes';
import { searchItems } from '@/api/actions/Generic';
import { Collection } from '@/zencore/arch/Collection';
import { useTheme } from 'next-themes';
import { getCollectionAndTaskAndActivityData } from './utils';

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

const dummyTask = {
	id: 'fb528522-e713-4407-98e7-83b01acfbc1c',
	createdAt: 1742674692,
	updatedAt: 1742674692,
	createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
	title: 'asdf',
	due: null,
	priority: null,
	notes: 'asdf',
	completed: null,
	completedAt: null,
	recurring: null,
	tags: null
};
const dummyItems: CollectionListItem[] = [
	{
		id: 'cb189579-0698-479b-b14f-d1e86f162d23',
		typeId: ItemTypes.Collection,
		collectionId: 'cb189579-0698-479b-b14f-d1e86f162d23',
		name: 'Collection 1',
		description: 'Collection 1',
		items: [dummyTask.id],
		hasActiveTasks: false,
		hasDueTasks: false,
		lastActivity: {
			id: '1',
			description: 'Task 1',
			createdAt: Utils.getCurrentSecond() - 7200,
			typeId: ItemTypes.TaskActivity,
			taskId: dummyTask.id,
			activityType: TaskActivityType.Created,
			createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		},
		taskMaster: {
			id: '2',
			typeId: ItemTypes.TaskMaster,
			name: 'TaskMaster 2',
			description: 'TaskMaster 2',
			isActive: true,
			createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		} as any,
	},
	{
		id: 'cb189579-0698-479b-b14f-d1e86f162d27',
		typeId: ItemTypes.Collection,
		collectionId: 'cb189579-0698-479b-b14f-d1e86f162d27',
		name: 'Collection 2',
		description: 'Collection 2',
		items: [dummyTask.id],
		hasActiveTasks: false,
		hasDueTasks: false,
		lastActivity: {
			id: '2',
			description: 'Task 2',
			createdAt: Utils.getCurrentSecond() - 3600,
			typeId: ItemTypes.TaskActivity,
			taskId: dummyTask.id,
			activityType: TaskActivityType.Created,
			createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		},
		taskMaster: {
			id: '2',
			typeId: ItemTypes.TaskMaster,
			name: 'TaskMaster 2',
			description: 'TaskMaster 2',
			isActive: true,
			createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		} as any,
	},
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
		const collections = await searchItems<Collection>({
			itemType: ItemTypes.Collection,
			filters: [],
		})

		console.log('getCollections:', collections.data?.results);

		return collections.data?.results || [];
	}

	useEffect(() =>
	{
		getCollections().then((collections) =>
		{
			const mappedCollections = collections.map((collection) =>
			{
				return {
					...collection,
					collectionId: collection.id,
					hasActiveTasks: false,
					hasDueTasks: false,
					lastActivity: undefined,
					taskMaster: undefined,
				};
			});
			setItems(mappedCollections);
			setSelectedItem(mappedCollections[0]);
		});
	}, []);

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
					listItems={items}
					selectedItemId={selectedItem?.id}
					setSelectedItem={setSelectedItem}
				/>
			</Sheet>
			<TaskActivityList collection={selectedItem} />
		</Sheet>
	);
}