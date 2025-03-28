import { Stack } from "@mui/joy";
import { JSX, useState } from "react";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import React from "react";
import { ItemTypes } from "@/zencore/ItemTypes";
import ItemSearchContainer, { ItemSearchContainerProps } from "./ItemSearchContainer";

export type ItemSearchInputModalProps = ItemSearchContainerProps & {
	itemType: ItemTypes;
	activator: JSX.Element;
	label: JSX.Element;
};

export default function ItemSearchInputModal(props: ItemSearchInputModalProps)
{
	const { 
		itemType,
		label,
		activator,
		renderResult,
		renderResults,
		sx,
		hideFilters,
		renderFilters,
		initialFilters,
		initialPagination,
	} = props;

	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<React.Fragment>
			<div
				style={{ cursor: 'pointer' }}
				onClick={() => setIsModalOpen(true)}
			>{activator}</div>
			<Modal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			>
				<ModalDialog variant="plain">
					<ModalClose />
					{label}
					<Stack
						sx={{
							minWidth: '80dvw',
						}}
					>
						<ItemSearchContainer
							itemType={itemType}
							renderResult={renderResult}
							renderResults={renderResults}
							hideFilters={hideFilters}
							renderFilters={renderFilters}
							initialFilters={initialFilters}
							initialPagination={initialPagination}
							sx={sx}
						/>
					</Stack>
				</ModalDialog>
			</Modal>
		</React.Fragment>
	);
}