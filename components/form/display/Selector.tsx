import { FieldData, FieldType } from "@/zencore/ItemTypes";
import { JSX } from "react";
import Number from "./Number";
import Text from "./Text";

export default function FormDisplaySelector(props: {
	field: FieldData;
	value?: any;
}): JSX.Element
{
	switch(props.field?.fieldType)
	{
		case FieldType.checkbox:
		case FieldType.dropdown:
		case FieldType.fieldType:
		case FieldType.item:
		case FieldType.itemArray:
		case FieldType.itemFilters:
		case FieldType.itemType:
		case FieldType.multiSelect:
		case FieldType.number:
			return (<Number field={props.field} value={props.value} />);
		case FieldType.radio:
		case FieldType.readonly:
		case FieldType.repeater:
		case FieldType.text:
			return (<Text field={props.field} value={props.value} />);
		case FieldType.textarea:
		case FieldType.timestamp:
		case FieldType.toggle:
		default:
			return (
				<div>Unknown field type {`${props.field?.fieldType}`}</div>
			);
	}
}