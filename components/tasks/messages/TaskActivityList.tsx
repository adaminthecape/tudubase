import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import MessageInput from './MessageInput';
import TaskActivityListHeader from '@/components/tasks/messages/TaskActivityListHeader';
import { TaskActivityListItem, TaskActivityListProps } from '@/components/tasks/types';
import { Item, ItemTypes, Task, TaskActivity } from '@/zencore/ItemTypes';
import { Utils } from '@/zencore/Utils';
import { i18n } from '@/i18n';
import { TaskMaster } from '@/zencore/arch/TaskMaster';
import { Card, Typography } from '@mui/joy';
import ItemEditButton from '@/components/itemForms/ItemEditButton';
import { useEffect, useState } from 'react';
import { addTaskToCollection, getCollectionAndTaskAndActivityData } from '../utils';

function displayActivityListItem(item: Item<TaskActivity>, index: number)
{
	if(!item.activityType)
	{
		return (<div>Unknown</div>);
	}

	const i18nMessage = i18n.activityMessages[item.activityType];

	return (
		<div className="w-full flex flex-row justify-end">
			<Typography
				key={index}
				color='success'
				sx={{ fontSize: 'sm', fontWeight: 'sm' }}
			>{i18nMessage}</Typography>
		</div>
	);
}

function displayTaskListItem(item: Item<Task>, index: number)
{
	return (
		<Card
			variant='plain'
			className="mr-4"
		>
			<Typography>{item.title}</Typography>
			<Typography sx={{ fontSize: 'xs' }}>{item.notes}</Typography>
			<div className="w-full flex flex-row justify-end">
				<ItemEditButton
					itemType={ItemTypes.Task}
					itemId={item.id}
					initialValues={item}
				/>
			</div>
		</Card>
	);
}

function displayTaskMasterListItem(item: Item<TaskMaster>, index: number)
{
	return (<div key={index}>TaskMaster</div>);
}

function parseActivityListItem(listItem: TaskActivityListItem, index: number)
{
	if(listItem.typeId === ItemTypes.Task)
	{
		return displayTaskListItem(listItem as Item<Task>, index);
	}
	else if(listItem.typeId === ItemTypes.TaskActivity)
	{
		return displayActivityListItem(listItem as Item<TaskActivity>, index);
	}
	else if(listItem.typeId === ItemTypes.TaskMaster)
	{
		return displayTaskMasterListItem(listItem as Item<TaskMaster>, index);
	}
	else
	{
		return (<div>parseActivityListItem: Unknown {JSON.stringify(listItem)}</div>);
	}
}

export default function TaskActivityList(props: TaskActivityListProps)
{
	const { collection } = props;
	const [activityMessages, setActivityMessages] = useState<TaskActivityListItem[]>([]);
	const [inputValues, setInputValues] = useState<Partial<Item<Task>>>({});

	async function selectCollection({ collectionId }: { collectionId: string })
	{
		const res = await getCollectionAndTaskAndActivityData({
			collectionIds: [collectionId],
		});

		setActivityMessages([...res.activity, ...res.tasks].sort(
			(a, b) => (a.createdAt ?? a.updatedAt ?? 0) - (b.createdAt ?? b.updatedAt ?? 0)
		));
	}

	useEffect(() => 
	{
		if(collection?.collectionId)
		{
			selectCollection(collection);
		}
	}, [collection?.collectionId]);

	async function submitMessage()
	{
		if(!Utils.isPopulatedObject(inputValues))
		{
			return;
		}

		if(!collection?.collectionId)
		{
			console.warn('No collection ID!');
			return;
		}

		// submit the task data to the server
		const addTaskRes = await addTaskToCollection({
			collectionId: collection?.collectionId,
			baseData: inputValues,
		});
	}

	return (
		<Sheet
			sx={{
				height: { xs: 'calc(80dvh - var(--Header-height))', md: '80dvh' },
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: 'background.level1',
			}}
		>
		<TaskActivityListHeader collection={collection} />
		<Box
			sx={{
				display: 'flex',
				flex: 1,
				minHeight: '40vh',
				maxHeight: 'calc(100vh - 300px)',
				px: 2,
				py: 3,
				overflowY: 'scroll',
				flexDirection: 'column-reverse',
			}}
		>
			<Stack spacing={2} sx={{ justifyContent: 'flex-end' }}>
				{activityMessages?.map((
					listItem: TaskActivityListItem,
					index: number
				) =>
				{
					return (
						<div key={`${`${listItem.id}-${index}`}`}>
							{parseActivityListItem(listItem, index)}
						</div>
					);
				})}
			</Stack>
			</Box>
		<MessageInput
			values={inputValues}
			setValues={setInputValues}
			onSubmit={submitMessage}
		/>
		</Sheet>
	);
}
