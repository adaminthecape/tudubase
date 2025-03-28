import { Button, Stack } from "@mui/joy";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import I18N from '@/components/ui/I18N';
import GenericItemForm, { GenericItemFormProps } from "./GenericItemForm";
import { JSX, useState } from "react";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import React from "react";
import { Item } from "@/zencore/ItemTypes";

export type ItemEditButtonProps = {
	label?: string | null;
	icon?: JSX.Element;
	onItemAdded?: (item: Item<any>) => void;
};

export default function ItemEditButton(props: GenericItemFormProps & ItemEditButtonProps)
{
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<React.Fragment>
			<Button
				color="primary"
				variant="soft"
				size="sm"
				sx={{ display: { xs: 'inline-flex', md: 'inline-flex' } }}
				onClick={() => setIsModalOpen(true)}
			>
				{props.icon || <EditNoteRoundedIcon sx={
					props.label === null ? {} : { mr: 0.25 }
				} />}
				{(props.label || (props.label === null)) ?
					props.label && (<span>{props.label}</span>) :
					<I18N sid={`items.${props.itemType}.edit`} />
				}
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
		</React.Fragment>
	);
}