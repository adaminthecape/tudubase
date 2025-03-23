import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from '@/components/tasks/AvatarWithStatus';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TaskActivityListHeader from '@/components/tasks/messages/TaskActivityListHeader';
import { TaskActivityListItem, TaskActivityListProps } from '@/components/tasks/types';

export default function TaskActivityList(props: TaskActivityListProps)
{
	const { collection } = props;
	const [
		chatMessages,
		setChatMessages
	] = React.useState<TaskActivityListItem[]>([]);
	const [textAreaValue, setTextAreaValue] = React.useState('');

	React.useEffect(() => {
		setChatMessages([]);
	}, [collection?.collectionId]);

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
			{chatMessages?.map((message: TaskActivityListItem, index: number) => {
				const isYou = message.createdBy === 'ca84b5a0-a0ae-425d-993a-4e63d235f222';
				return (
				<Stack
					key={index}
					direction="row"
					spacing={2}
					sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
				>
					{isYou && (
					<AvatarWithStatus
						online={!!message.id}
						src={'message'}
					/>
					)}
					<MessageBubble variant={isYou ? 'sent' : 'received'} {...message} />
				</Stack>
				);
			})}
			</Stack>
		</Box>
		<MessageInput
			textAreaValue={textAreaValue}
			setTextAreaValue={setTextAreaValue}
			onSubmit={() => {
			const newId = chatMessages.length + 1;
			const newIdString = newId.toString();
			setChatMessages([
				...chatMessages,
				{
					id: newIdString,
					sender: 'You',
					content: textAreaValue,
					timestamp: 'Just now',
				},
			]);
			}}
		/>
		</Sheet>
	);
}