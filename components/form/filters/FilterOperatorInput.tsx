import { getOperatorsForFieldType } from "@/apiUtils/fieldUtils";
import { DbFilterOperator } from "@/zencore/Filters";
import { FieldData, ItemTypes } from "@/zencore/ItemTypes";
import { Select, Option } from "@mui/joy";
import { useEffect, useState } from "react";

export default function FilterOperatorInput({
	field,
	itemType,
	value,
	updateValue,
}: {
	field?: FieldData;
	itemType: ItemTypes;
	value: DbFilterOperator;
	updateValue: (newValue: DbFilterOperator) => void;
})
{
	// determine operators allowed for this field type
	const [operators, setOperators] = useState<DbFilterOperator[]>([]);
	const [selectedOperator, setSelectedOperator] = useState<DbFilterOperator>();

	function init()
	{
		if(field?.fieldType)
		{
			const operators = getOperatorsForFieldType(field.fieldType);

			if(Array.isArray(operators))
			{
				setOperators(operators);
				setSelectedOperator(operators[0]);
			}
		}
	}

	useEffect(init, [field]);

	return (
		<Select
			value={value}
			onChange={(e, newVal) => updateValue(newVal as DbFilterOperator)}
		>
			{operators.map((operator) => (
				<Option key={operator} value={operator}>
					{operator}
				</Option>
			))}
		</Select>
	);
}