'use client';

import { useEffect, useState } from "react";
import { FormContainer } from "@/components/form/FormContainer";
import { createTask, loadTask, updateTask } from "@/api/actions/Task";
import { ActionResponse } from "@/api/actions/types";
import { Item, Task } from "@/zencore/ItemTypes";
import { Uuid } from "@/zencore/Utils";
import { fieldsForTask } from "@/zencore/arch/Task";

export default function TaskForm(props: {
	taskId: string | null;
	isNew?: boolean;
})
{
	const [taskData, setTaskData] = useState({});

	useEffect(() =>
	{
		if(props.isNew)
		{
			return;
		}

		if(!props.taskId)
		{
			console.warn(`TaskForm: No task ID provided.`);
			return;
		}

		loadTask({ id: props.taskId as string }).then((res: ActionResponse) =>
		{
			if(res.data)
			{
				setTaskData(res.data);
			}
		});
	}, []);

	const [formValues, setFormValues] = useState({});

	const [taskId, setTaskId] = useState<string | null>(null);

	useEffect(() =>
	{
		if(props.taskId)
		{
			setTaskId(props.taskId);
		}
	}, []);

	async function onSubmitForm(opts: {
		values: Record<string, unknown>;
		errors: Record<string, string | undefined>;
	})
	{
		console.log('submit:', opts, props);

		if(props.isNew)
		{
			if(!taskId)
			{
				setTaskId(Uuid.generateUuid());
			}

			const res = await createTask({
				id: taskId as string,
				data: opts.values,
			});

			if(!res.success)
			{
				console.error(`Failed to create task: ${res.message}`);
			}
			else
			{
				console.log(`Task created:`, res.data);

				setTaskId((res.data as Item<Task>)?.id || null);
			}
		}
		else if(props.taskId && typeof props.taskId === 'string')
		{
			const res = await updateTask({
				id: props.taskId,
				data: opts.values,
			});

			if(!res.success)
			{
				console.error(`Failed to update task: ${res.message}`);
			}
			else
			{
				console.log(`Task updated:`, res.data);
			}
		}
		else
		{
			console.error(`Not enough data to update task.`);
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<pre>{JSON.stringify(taskData, undefined, 4)}</pre>
			<pre>{JSON.stringify(formValues, undefined, 4)}</pre>
			<FormContainer
				fields={fieldsForTask}
				values={formValues}
				updateErrors={() => {}}
				updateValues={setFormValues}
				showSubmit={true}
				submitFn={onSubmitForm}
			/>
		</div>
	);
}