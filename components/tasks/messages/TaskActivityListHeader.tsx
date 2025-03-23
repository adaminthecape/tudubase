import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { TaskActivityListHeaderProps } from '@/components/tasks/types';
import { useToggleMessagesPane } from '@/hooks/useToggleMessagesPane';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import I18N from '@/components/ui/I18N';
import { ItemTypes } from '@/zencore/ItemTypes';
import ItemEditButton from '@/components/itemForms/ItemEditButton';

export default function TaskActivityListHeader(props: TaskActivityListHeaderProps) 
{
	const { toggleMessagesPane } = useToggleMessagesPane();

	const { collection } = props;

	return (
		<Stack
			direction="row"
			sx={{
				justifyContent: 'space-between',
				py: { xs: 2, md: 2 },
				px: { xs: 1, md: 2 },
				borderBottom: '1px solid',
				borderColor: 'divider',
				backgroundColor: 'background.body',
			}}
		>
		<Stack
			direction="row"
			spacing={{ xs: 1, md: 2 }}
			sx={{ alignItems: 'center' }}
		>
			<IconButton
			variant="plain"
			color="neutral"
			size="sm"
			sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
			onClick={() => toggleMessagesPane()}
			>
			<ArrowBackIosNewRoundedIcon />
			</IconButton>
			<Avatar size="lg" src={collection?.collectionId} />
			<div>
			<Typography
				component="h2"
				noWrap
				endDecorator={collection?.hasActiveTasks ? (
					<Chip
					variant="outlined"
					size="sm"
					color="neutral"
					sx={{ borderRadius: 'sm' }}
					startDecorator={
						<CircleIcon sx={{ fontSize: 8 }} color="success" />
					}
					slotProps={{ root: { component: 'span' } }}
					>
					Online
					</Chip>
				) : undefined}
				sx={{ fontWeight: 'lg', fontSize: 'lg' }}
			>
				{collection?.name}
			</Typography>
			{collection?.taskMaster?.name && (
				<Typography level="body-sm">{collection?.taskMaster?.name}</Typography>
			)}
			</div>
		</Stack>
			<Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
			<ItemEditButton
				itemType={ItemTypes.TaskMaster}
				initialValues={collection?.taskMaster}
			/>
			<ItemEditButton
				itemType={ItemTypes.Collection}
				initialValues={collection}
			/>
			<IconButton size="sm" variant="plain" color="neutral">
				<MoreVertRoundedIcon />
			</IconButton>
		</Stack>
		</Stack>
	);
}