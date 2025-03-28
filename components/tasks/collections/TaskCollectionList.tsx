import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Box, IconButton, Input } from '@mui/joy';
import List from '@mui/joy/List';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TaskCollectionListItem from './TaskCollectionListItem';
import { useToggleMessagesPane } from '@/hooks/useToggleMessagesPane';
import { TaskCollectionListProps } from '@/components/tasks/types';
import { ItemTypes } from '@/zencore/ItemTypes';
import ItemEditButton from '@/components/itemForms/ItemEditButton';
import { Uuid } from '@/zencore/Utils';
import AddIcon from '@mui/icons-material/Add';

export default function TaskCollectionList(props: TaskCollectionListProps) 
{
	const { toggleMessagesPane } = useToggleMessagesPane();
	const { listItems, setSelectedItem, selectedItemId } = props;

	return (
		<Sheet
			sx={{
				borderRight: '1px solid',
				borderColor: 'divider',
				height: { sm: '100dvh', md: '100dvh' },
				overflowY: 'auto',
			}}
		>
			<Stack
				direction="row"
				spacing={1}
				sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 1.5 }}
			>
				<Typography
					sx={{ fontSize: { xs: 'md', md: 'lg' }, fontWeight: 'lg', mr: 'auto' }}
				>
					Collections
				</Typography>
				<ItemEditButton
					itemType={ItemTypes.Collection}
					itemId={Uuid.generateUuid()}
					initialValues={{}}
					isNew={true}
					label={null}
					icon={<AddIcon />}
					onItemAdded={(col) =>
					{
						if(col)
						{
							setSelectedItem(col);
						}
					}}
				/>
				<IconButton
					variant="plain"
					aria-label="edit"
					color="neutral"
					size="sm"
					onClick={() => {
						toggleMessagesPane();
					}}
					sx={{ display: { sm: 'none' } }}
				>
					<CloseRoundedIcon />
				</IconButton>

			</Stack>
			<Box sx={{ px: 2, pb: 1.5 }}>
				<Input
					size="sm"
					startDecorator={<SearchRoundedIcon />}
					placeholder="Search"
					aria-label="Search"
				/>
			</Box>
			<List
				className="my-list"
				sx={{
					py: 0,
					'--ListItem-paddingY': '0.75rem',
					'--ListItem-paddingX': '1rem',
				}}
			>
				{listItems.map((collection, c) => (
					<TaskCollectionListItem
						key={`collection-${collection.collectionId}-${c}`}
						{...collection}
						setSelectedItem={setSelectedItem}
						selectedItemId={selectedItemId}
					/>
				))}
			</List>
		</Sheet>
	);
}