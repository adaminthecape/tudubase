import { getFieldsForItemType } from "@/apiUtils/fieldUtils";
import { useEffect, useState } from "react";
import { FormContainer } from "../form/FormContainer";
import { LoaderPinwheel } from "lucide-react";
import { createItem, loadItem, updateItem } from "@/cache/actions/Generic";
import { FieldData, Item, ItemTypes } from "@/zencore/ItemTypes";
import { Utils, Uuid } from "@/zencore/Utils";

export type GenericItemFormProps = {
	isModalOpen?: boolean;
	setIsModalOpen?: (isOpen: boolean) => void;
	onClose?: () => void;
	itemType: ItemTypes;
	itemId?: string;
	isNew?: boolean;
	setItemId?: (id: string) => void;
	fieldFilterFn?: (field: FieldData) => boolean;
	initialValues: Partial<Item<Record<string, unknown>>>;
};

export default function GenericItemForm(props: GenericItemFormProps)
{
	const {
		itemId,
		setItemId,
		itemType,
		initialValues,
	} = props;

	const [formValues, setFormValues] = useState(initialValues);
	const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
	const [fields, setFields] = useState<FieldData[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	function getFields()
	{
		setIsLoading(true);

		getFieldsForItemType(itemType).then((fieldsArray) =>
		{
			if(Array.isArray(fieldsArray))
			{
				setFields(fieldsArray);
			}
			else
			{
				console.error('Failed to get fields for item type:', itemType);
			}

			setIsLoading(false);
		});
	}

	function loadTargetItem()
	{
		if(!Uuid.isUuid(itemId))
		{
			setFormValues(initialValues);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		loadItem({ id: itemId, itemType }).then((item) =>
		{
			if(item)
			{
				setFormValues(item);
			}
			else
			{
				console.error('Failed to load item:', itemId);
			}

			setIsLoading(false);
		});
	}

	useEffect(getFields, []);
	useEffect(loadTargetItem, []);

	function onSubmit({ values, errors }: {
		values: Record<string, unknown>;
		errors: Record<string, string | undefined>;
	}): void
	{
		console.log('Submit:', values, errors);
		if(
			Utils.isPopulatedObject(errors) &&
			Object.keys(errors).length &&
			Object.values(errors).some((v) => !!v)
		)
		{
			setFormErrors(errors);
			return;
		}

		if(!itemId || props.isNew)
		{
			const id = Uuid.generateUuid();

			setItemId?.(id);

			createItem({
				id,
				itemType,
				data: values
			}).then((response) =>
			{
				console.log('Create item response:', response);
			});
		}
		else
		{
			updateItem({
				id: itemId,
				itemType,
				data: values
			}).then((response) =>
			{
				console.log('Update item response:', response);
			});
		}
	}

	if(isLoading || !itemType || !(Array.isArray(fields) && fields.length))
	{
		return (
			<div className="w-full flex justify-center">
				<div className="w-full flex justify-center items-center" style={{ minHeight: '200px' }}>
					<LoaderPinwheel />
				</div>
			</div>
		);
	}

	return (
		<>
			<FormContainer
				fields={fields}
				values={formValues}
				updateValues={setFormValues}
				updateErrors={setFormErrors}
				showSubmit
				submitFn={onSubmit}
			/>
		</>
	);
}