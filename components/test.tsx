'use client';

import { FormContainer } from "./form/FormContainer";
import { useEffect, useState } from "react";
import { fieldsForCharacter } from "@/zencore/arch/Character";
import { fieldsForProfile } from "@/zencore/arch/Profile";
import { ItemTypes } from "@/zencore/ItemTypes";
import ItemSearchContainer from "./search/ItemSearchContainer";

export function Test()
{
	const [tasks, setTasks] = useState({});

	useEffect(() =>
	{
		// searchItems({ itemType: ItemTypes.Task }).then(setTasks);
	}, []);

	const [formValues, setFormValues] = useState({});

	return (
		<div className="flex flex-col gap-4">
			<ItemSearchContainer itemType={ItemTypes.Task} />
			<pre>{JSON.stringify(tasks, undefined, 4)}</pre>
			<div>
				<FormContainer
					fields={fieldsForProfile}
					values={formValues}
					updateErrors={() => {}}
					updateValues={setFormValues}
				/>
			</div>
			<div>
				<FormContainer
					fields={fieldsForCharacter}
					values={formValues}
					updateErrors={() => {}}
					updateValues={setFormValues}
				/>
			</div>
		</div>
	);
}