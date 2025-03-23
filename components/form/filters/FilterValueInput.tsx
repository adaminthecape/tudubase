import { FieldData, ItemTypes } from "@/zencore/ItemTypes";
import { FormContainer } from "../FormContainer";
import { useState } from "react";

export default function FilterValueInput({
	field,
	itemType,
	value,
	updateValue,
}: {
	field?: FieldData;
	itemType: ItemTypes;
	value: unknown;
	updateValue: (newValue: unknown) => void;
})
{
	const [values, setValues] = useState({});
	const [errors, setErrors] = useState({});

	return (
		<FormContainer
			fields={field ? [field] : []}
			values={values}
			updateValues={setValues}
			updateErrors={setErrors}
		/>
	);
}