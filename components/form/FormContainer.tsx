'use client';

import { FieldData } from "@/zencore/ItemTypes";
import { Stack } from "@mui/joy";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ResolveField from "./ResolveField";

export function FormContainer({
	fields,
	values,
	updateValues,
	updateErrors,
	showSubmit,
	submitFn,
}: {
	fields: (FieldData & { key: string; })[];
	values: Record<string, unknown>;
	updateValues: (values: Record<string, unknown>) => void;
	updateErrors: (errors: Record<string, string | undefined>) => void;
	showSubmit?: boolean;
	submitFn?: (opts: {
		values: Record<string, unknown>;
		errors: Record<string, string | undefined>;
	}) => void;
})
{
	const [formValues, setFormValues] = useState<Record<string, unknown>>(values || {});
	const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

	function updateFormValue(key: string, value: unknown): void
	{
		const newValues = { ...formValues, [key]: value };

		setFormValues(newValues);

		if(updateValues)
		{
			updateValues(newValues);
		}
	}

	function updateFormError(key: string, message: string | undefined): void
	{
		const newValues = { ...formErrors, [key]: message };

		setFormErrors(newValues);

		if(updateErrors)
		{
			updateErrors(newValues);
		}
	}

	return (
		<div>
			<Stack spacing={1}>
				{fields.map((field, f) => (
					<div key={f}>
						<ResolveField
							field={field}
							formValues={formValues}
							updateFormValue={updateFormValue}
							updateFormError={updateFormError}
						/>
					</div>
				))}
				{(showSubmit && submitFn) && (
					<div className="flex flex-col gap-2 items-end">
						<Button type="submit" onClick={() => submitFn({
							values: formValues,
							errors: formErrors,
						})}>Submit</Button>
					</div>
				)}
			</Stack>
		</div>
	);
}