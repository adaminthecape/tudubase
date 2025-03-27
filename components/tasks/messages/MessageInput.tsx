import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import { Stack } from '@mui/joy';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { FormContainer } from '@/components/form/FormContainer';
import { fieldsForTask } from '@/zencore/arch/Task';
import { Item, Task } from '@/zencore/ItemTypes';

export type MessageInputProps = {
	values: Partial<Item<Task>>;
	setValues: (value: Partial<Item<Task>>) => void;
	onSubmit: (value: Partial<Item<Task>>) => Promise<void> | void;
};

type FormErrors = Partial<Record<keyof Item<Task>, string | undefined>>;

export default function MessageInput(props: MessageInputProps) 
{
	const { values, setValues, onSubmit } = props;
	const fieldsToShow = fieldsForTask.filter((f) => f.validation?.required);

	function updateValues(values: Partial<Item<Task>>)
	{
		setValues(values);
	}

	function submit()
	{
		console.log('submit', values);
		onSubmit(values);
	}

	return (
		<Box sx={{ px: 2, pb: 2 }}>
			<FormContainer
				fields={fieldsToShow}
				values={values}
				updateValues={updateValues}
				updateErrors={() => {}}
			/>
			<Stack direction="row" spacing={2} sx={{ mt: 1 }}>
				<div className="flex-1" />
				<Button
					size="sm"
					color="primary"
					sx={{ alignSelf: 'center', borderRadius: 'sm' }}
					endDecorator={<SendRoundedIcon />}
					onClick={submit}
				>
					Add
				</Button>
			</Stack>
		</Box>
	);
}