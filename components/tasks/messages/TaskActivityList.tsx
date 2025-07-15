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
	const { collection, onTaskAdded } = props;
	const [activityMessages, setActivityMessages] = useState<TaskActivityListItem[]>([]);
	const [inputValues, setInputValues] = useState<Partial<Item<Task>>>({});

	function getSortedActivityList(messages: TaskActivityListItem[]): TaskActivityListItem[]
	{
		const activities = messages.filter((m) => m.typeId === ItemTypes.TaskActivity);
		const tasks = messages.filter((m) => m.typeId === ItemTypes.Task);

		console.log({ tasks, activities });

		return messages;
	}

const testTasks: Task[] = [
	{
		id: '1',
		typeId: ItemTypes.Task,
		title: 'Daily Standup Meeting',
		description: 'Attend the daily standup meeting with the team.',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'Pending',
		dueDate: new Date(new Date().setHours(9, 0, 0)).toISOString(),
		priority: 'High',
		assignee: 'John Doe',
	},
	{
		id: '2',
		typeId: ItemTypes.Task,
		title: 'Project Kickoff',
		description: 'Initial meeting to discuss project goals and deliverables.',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'Completed',
		dueDate: new Date(new Date().setHours(14, 0, 0)).toISOString(),
		priority: 'Medium',
		assignee: 'Jane Smith',
	},
	{
		id: '3',
		typeId: ItemTypes.Task,
		title: 'Code Review',
		description: 'Review the codebase for the new feature implementation.',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'In Progress',
		dueDate: new Date(new Date().setHours(16, 0, 0)).toISOString(),
		priority: 'Low',
		assignee: 'Alice Johnson',
	},
	{
		id: '4',
		typeId: ItemTypes.Task,
		title: 'Design Mockups',
		description: 'Create design mockups for the new application interface.',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'Pending',
		dueDate: new Date(new Date().setHours(11, 0, 0)).toISOString(),
		priority: 'High',
		assignee: 'Emily Davis',
	},
	{
		id: '5',
		typeId: ItemTypes.Task,
		title: 'Database Optimization',
		description: 'Optimize database queries for better performance.',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'In Progress',
		dueDate: new Date(new Date().setHours(15, 0, 0)).toISOString(),
		priority: 'Medium',
		assignee: 'Michael Brown',
	},
	{
		id: '6',
		typeId: ItemTypes.Task,
		title: 'Client Presentation',
		description: 'Prepare and deliver a presentation to the client.',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'Pending',
		dueDate: new Date(new Date().setHours(10, 0, 0)).toISOString(),
		priority: 'High',
		assignee: 'Sarah Wilson',
	},
	{
		id: '7',
		typeId: ItemTypes.Task,
		title: 'Bug Fixing',
		description: 'Fix critical bugs reported by the QA team.',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'In Progress',
		dueDate: new Date(new Date().setHours(13, 0, 0)).toISOString(),
		priority: 'High',
		assignee: 'Chris Taylor',
	},
	{
		id: '8',
		typeId: ItemTypes.Task,
		title: 'Team Retrospective',
		description: 'Conduct a retrospective meeting to discuss team performance.',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'Completed',
		dueDate: new Date(new Date().setHours(17, 0, 0)).toISOString(),
		priority: 'Low',
		assignee: 'Laura Martinez',
	},
	{
		id: '9',
		typeId: ItemTypes.Task,
		title: 'API Integration',
		description: 'Integrate third-party APIs into the application.',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'Pending',
		dueDate: new Date(new Date().setHours(12, 0, 0)).toISOString(),
		priority: 'Medium',
		assignee: 'David Clark',
	},
	{
		id: '10',
		typeId: ItemTypes.Task,
		title: 'Performance Testing',
		description: 'Conduct performance testing for the application.',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'In Progress',
		dueDate: new Date(new Date().setHours(18, 0, 0)).toISOString(),
		priority: 'Low',
		assignee: 'Sophia Lewis',
	}
];
const testActivities: TaskActivity[] = [
	{
		id: '1',
		typeId: ItemTypes.TaskActivity,
		taskId: '1',
		type: 'CREATED',
		description: 'Task created',
		createdAt: new Date(new Date().getTime() - 3600000).toISOString(),
		createdBy: 'John Doe'
	},
	{
		id: '2',
		typeId: ItemTypes.TaskActivity,
		taskId: '1',
		type: 'COMMENT',
		description: 'We need to prepare the agenda for today\'s standup meeting.',
		createdAt: new Date(new Date().getTime() - 3000000).toISOString(),
		createdBy: 'John Doe'
	},
	{
		id: '3',
		typeId: ItemTypes.TaskActivity,
		taskId: '2',
		type: 'CREATED',
		description: 'Task created',
		createdAt: new Date(new Date().getTime() - 86400000).toISOString(),
		createdBy: 'Jane Smith'
	},
	{
		id: '4',
		typeId: ItemTypes.TaskActivity,
		taskId: '2',
		type: 'STATUS_CHANGE',
		description: 'Status changed from Pending to Completed',
		createdAt: new Date(new Date().getTime() - 7200000).toISOString(),
		createdBy: 'Jane Smith'
	},
	{
		id: '5',
		typeId: ItemTypes.TaskActivity,
		taskId: '3',
		type: 'CREATED',
		description: 'Task created',
		createdAt: new Date(new Date().getTime() - 172800000).toISOString(),
		createdBy: 'Alice Johnson'
	},
	{
		id: '6',
		typeId: ItemTypes.TaskActivity,
		taskId: '3',
		type: 'STATUS_CHANGE',
		description: 'Status changed from Pending to In Progress',
		createdAt: new Date(new Date().getTime() - 43200000).toISOString(),
		createdBy: 'Alice Johnson'
	},
	{
		id: '7',
		typeId: ItemTypes.TaskActivity,
		taskId: '5',
		type: 'CREATED',
		description: 'Task created',
		createdAt: new Date(new Date().getTime() - 259200000).toISOString(),
		createdBy: 'Michael Brown'
	},
	{
		id: '8',
		typeId: ItemTypes.TaskActivity,
		taskId: '5',
		type: 'COMMENT',
		description: 'I\'ve optimized the main queries. Working on the joins now.',
		createdAt: Utils.getCurrentSecond() - 1827368,
		createdBy: 'Michael Brown'
	},
	{
		id: '9',
		typeId: ItemTypes.TaskActivity,
		taskId: '7',
		type: 'CREATED',
		description: 'Task created',
		createdAt: Utils.getCurrentSecond() - 1856768,
		createdBy: 'Chris Taylor'
	},
	{
		id: '10',
		typeId: ItemTypes.TaskActivity,
		taskId: '7',
		type: 'COMMENT',
		description: 'Fixed the authentication bug. Still investigating the rendering issues.',
		createdAt: Utils.getCurrentSecond() - 1851268,
		createdBy: 'Chris Taylor'
	}
];
	async function selectCollection({ collectionId }: { collectionId: string })
	{
		// const res = await getCollectionAndTaskAndActivityData({
		// 	collectionIds: [collectionId],
		// });

		// const messages = [...res.activity, ...res.tasks];
		const messages = [...testActivities, ...testTasks];

		// console.log('unsorted\n', JSON.stringify(messages.map((m) => m.id), null, 4));
		
		// messages.sort(
		// 	(a, b) => (a.createdAt ?? a.updatedAt ?? 0) - (b.createdAt ?? b.updatedAt ?? 0)
		// );

		// console.log('sorted\n', JSON.stringify(messages.map((m) => m.id), null, 4));

		const sorted = getSortedActivityList(messages);

		setActivityMessages(messages);
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

		if(addTaskRes.success)
		{
			onTaskAdded(addTaskRes.taskId, addTaskRes.taskData);
			setInputValues({});
		}
		else
		{
			console.warn('Failed to add task:', addTaskRes.taskId);
		}
	}

	return (
		<Sheet
			sx={{
				height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
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
				{[...testActivities, ...testTasks]?.map((
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
