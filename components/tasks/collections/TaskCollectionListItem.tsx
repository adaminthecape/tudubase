import * as React from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { ListItemButtonProps } from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import AvatarWithStatus from '@/components/tasks/AvatarWithStatus';
import { useToggleMessagesPane } from '@/hooks/useToggleMessagesPane';
import { TaskCollectionListItemProps } from '@/components/tasks/types';
import { useEffect } from 'react';
import { timeSince } from '@/lib/date';

export default function TaskCollectionListItem(props: (
	ListItemButtonProps &
	TaskCollectionListItemProps
))
{
	const { toggleMessagesPane } = useToggleMessagesPane();

	const {
		collectionId,
		typeId,
		createdAt,
		updatedAt,
		createdBy,
		name,
		description,
		items,
		hasActiveTasks,
		hasDueTasks,
		lastActivity,
		taskMaster,
		selectedItemId,
		setSelectedItem
	} = props;

	const selected = (selectedItemId === collectionId);

	const [
		lastActivityMeta,
		setLastActivityMeta
	] = React.useState<{
		createdBy: string;
		createdAt: string;
	} | undefined>(undefined);

	useEffect(() =>
	{
		if(lastActivity?.createdAt)
		{
			const created = timeSince(lastActivity.createdAt * 1000, true);

			setLastActivityMeta({
				createdBy: `${lastActivity.createdBy}`,
				createdAt: created,
			});
		}
		else
		{
			setLastActivityMeta(undefined);
		}
	}, [collectionId]);

	return (
		<React.Fragment>
			{/* {JSON.stringify(props)} */}
			<ListItem>
				<ListItemButton
					onClick={() => {
						toggleMessagesPane();
						setSelectedItem({
							id: collectionId,
							typeId,
							collectionId,
							createdAt,
							updatedAt,
							createdBy,
							name,
							description,
							items,
							hasActiveTasks,
							hasDueTasks,
							lastActivity,
							taskMaster,
						});
					}}
					selected={selected}
					color="neutral"
					sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1 }}
				>
					<Stack direction="row" spacing={1.5}>
						<AvatarWithStatus online={hasActiveTasks} />
						<Box sx={{ flex: 1 }}>
							<Typography level="title-sm">{name}</Typography>
							<Typography level="body-xs">{description}</Typography>
						</Box>
						<Box sx={{ lineHeight: 1.5, textAlign: 'right' }}>
							{lastActivity?.id && (
								<CircleIcon sx={{ fontSize: 12 }} color="primary" />
							)}
							<Typography
								level="body-xs"
								noWrap
								sx={{ display: { xs: 'none', md: 'block' } }}
							>
								{lastActivityMeta?.createdAt}
							</Typography>
						</Box>
					</Stack>
					{/* {lastActivityMeta?.createdAt && <Typography
						level="body-sm"
						sx={{
							display: '-webkit-box',
							WebkitLineClamp: '2',
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{lastActivityMeta?.createdAt}
					</Typography>} */}
				</ListItemButton>
			</ListItem>
			<ListDivider sx={{ margin: 0 }} />
		</React.Fragment>
	);
}