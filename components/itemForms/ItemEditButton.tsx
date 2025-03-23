import { Button, Stack } from "@mui/joy";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import I18N from '@/components/ui/I18N';
import GenericItemForm, { GenericItemFormProps } from "./GenericItemForm";
import { JSX, useState } from "react";
import { Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";

export type ItemEditButtonProps = {
	icon?: JSX.Element;
};

export default function ItemEditButton(props: GenericItemFormProps & ItemEditButtonProps)
{
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Button
				color="primary"
				variant="soft"
				size="sm"
				sx={{ display: { xs: 'none', md: 'inline-flex' } }}
				onClick={() => setIsModalOpen(true)}
			>
				{props.icon || <EditNoteRoundedIcon sx={{ mr: 0.25 }} />}
				<I18N sid={`items.${props.itemType}.edit`} />
			</Button>
			<Modal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			>
				<ModalDialog variant="plain">
					<ModalClose />
				<I18N sid={`items.${props.itemType}.edit`} variant="h3" />
					<Stack
						sx={{
							minWidth: '400px',
						}}
					>
						<GenericItemForm
							{...props}
						/>
					</Stack>
				</ModalDialog>
			</Modal>
		</>
	);
}