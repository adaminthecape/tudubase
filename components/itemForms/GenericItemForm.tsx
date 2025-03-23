import { getFieldsForItemType } from "@/api/utils/fieldUtils";
import { FieldData, Item, ItemTypes } from "@/zencore/ItemTypes";
import { useEffect, useState } from "react";
import { FormContainer } from "../form/FormContainer";
import { LoaderPinwheel } from "lucide-react";
import { loadItem } from "@/api/actions/Generic";

export type GenericItemFormProps = {
	isModalOpen: boolean;
	setIsModalOpen: (isOpen: boolean) => void;
	onClose: () => void;
	itemType: ItemTypes;
	itemId?: string;
	fieldFilterFn?: (field: FieldData) => boolean;
	initialValues: Partial<Item<Record<string, unknown>>>;
};

export default function GenericItemForm(props: GenericItemFormProps)
{
	const {
		itemId,
		itemType,
		initialValues,
		isModalOpen,
		setIsModalOpen,
		onClose
	} = props;

	const [
		formValues,
		setFormValues
	] = useState<Record<string, unknown>>(initialValues);

	const [fields, setFields] = useState<FieldData[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() =>
	{
		setIsLoading(true);

		const start = Date.now();
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

			console.log('Fields loaded in', Date.now() - start, 'ms');
			setIsLoading(false);
		});
	}, [itemType]);

	useEffect(() =>
	{
		if(!itemId)
		{
			setFormValues(initialValues);
			setIsLoading(false);
			return;
		}

		const start = Date.now();
		loadItem({
			id: itemId,
			itemType
		}).then((item) =>
		{
			if(item)
			{
				setFormValues(item);
			}
			else
			{
				console.error('Failed to load item:', itemId);
			}

			console.log('Values loaded in', Date.now() - start, 'ms');
			setIsLoading(false);
		});
	}, [itemId]);

	function onSubmit({ values, errors }: {
		values: Record<string, unknown>;
		errors: Record<string, string | undefined>;
	})
	{
		console.log('Submit:', values, errors);
	}

	function close()
	{
		setIsModalOpen(false);
		onClose?.();
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
		<FormContainer
			fields={fields}
			values={formValues}
			updateValues={setFormValues}
			updateErrors={() => {}}
			showSubmit
			submitFn={onSubmit}
		/>
	);
}