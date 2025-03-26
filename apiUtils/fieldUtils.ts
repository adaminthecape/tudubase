import { fieldsForEquipment } from "@/zencore/arch/Equipment";
import { fieldsForCharacter } from "@/zencore/arch/Character";
import { fieldsForCollection } from "@/zencore/arch/Collection";
import { fieldsForImageAsset } from "@/zencore/arch/ImageAsset";
import { fieldsForInAppNotification } from "@/zencore/arch/InAppNotification";
import { fieldsForProfile } from "@/zencore/arch/Profile";
import { fieldsForReminder } from "@/zencore/arch/Reminder";
import { fieldsForReward } from "@/zencore/arch/Reward";
import { fieldsForTag } from "@/zencore/arch/Tag";
import { fieldsForTaskMaster } from "@/zencore/arch/TaskMaster";
import { fieldsForEquipmentType } from "@/zencore/arch/EquipmentType";
import { fieldsForTask } from "@/zencore/arch/Task";
import { fieldsForTaskActivity } from "@/zencore/arch/TaskActivity";
import { ItemTypes, FieldData, FieldType } from "@/zencore/ItemTypes";
import { Utils } from "@/zencore/Utils";
import { DbFilter, DbFilterHandler, DbFilterOperator } from "@/zencore/Filters";

/**
 * Yes, async - this is intentional. This is to allow for the possibility of
 * fetching field data from an external source in the future. This should always
 * be used instead of the sync version, unless impossible.
 * @param itemType 
 * @returns 
 */
export async function getFieldsForItemType(
	itemType: ItemTypes
): Promise<FieldData[] | undefined>
{
	switch(itemType)
	{
		case ItemTypes.Task:
			return fieldsForTask;
		case ItemTypes.TaskActivity:
			return fieldsForTaskActivity;
		case ItemTypes.Archetype:
			return undefined;
		case ItemTypes.Character:
			return fieldsForCharacter;
		case ItemTypes.Collection:
			return fieldsForCollection;
		case ItemTypes.CustomItem:
			return undefined;
		case ItemTypes.Equipment:
			return fieldsForEquipment;
		case ItemTypes.EquipmentType:
			return fieldsForEquipmentType;
		case ItemTypes.Field:
			return undefined;
		case ItemTypes.ImageAsset:
			return fieldsForImageAsset;
		case ItemTypes.InAppNotification:
			return fieldsForInAppNotification;
		case ItemTypes.Profile:
			return fieldsForProfile;
		case ItemTypes.Reminder:
			return fieldsForReminder;
		case ItemTypes.Reward:
			return fieldsForReward;
		case ItemTypes.Tag:
			return fieldsForTag;
		case ItemTypes.TaskMaster:
			return fieldsForTaskMaster;
		default:
			return undefined;
	}
}

/**
 * ONLY use this if async operation is not feasible (e.g. in a constructor). If
 * kept to a minimum, this will be much easier to refactor later.
 * 
 * @deprecated
 * @param itemType 
 * @returns 
 */
export function getFieldsForItemTypeSync(
	itemType: ItemTypes
): FieldData[] | undefined
{
	switch(itemType)
	{
		case ItemTypes.Task:
			return fieldsForTask;
		case ItemTypes.TaskActivity:
			return fieldsForTaskActivity;
		case ItemTypes.Archetype:
			return undefined;
		case ItemTypes.Character:
			return fieldsForCharacter;
		case ItemTypes.Collection:
			return fieldsForCollection;
		case ItemTypes.CustomItem:
			return undefined;
		case ItemTypes.Equipment:
			return fieldsForEquipment;
		case ItemTypes.EquipmentType:
			return fieldsForEquipmentType;
		case ItemTypes.Field:
			return undefined;
		case ItemTypes.ImageAsset:
			return fieldsForImageAsset;
		case ItemTypes.InAppNotification:
			return fieldsForInAppNotification;
		case ItemTypes.Profile:
			return fieldsForProfile;
		case ItemTypes.Reminder:
			return fieldsForReminder;
		case ItemTypes.Reward:
			return fieldsForReward;
		case ItemTypes.Tag:
			return fieldsForTag;
		case ItemTypes.TaskMaster:
			return fieldsForTaskMaster;
		default:
			return undefined;
	}
}

export async function getFieldsMap(itemType: ItemTypes): Promise<Record<string, FieldData>>
{
	const fields = getFieldsForItemType(itemType);

	if(!(Array.isArray(fields) && fields.length))
	{
		return {};
	}

	return Utils.reduceIntoAssociativeArray(fields, 'id');
}

// Operators which can be used with different field types
export const numberOperators = [
	DbFilterOperator.isEqual,
	DbFilterOperator.isNotEqual,
	DbFilterOperator.greaterThan,
	DbFilterOperator.greaterThanOrEqualTo,
	DbFilterOperator.lessThan,
	DbFilterOperator.lessThanOrEqualTo,
];
export const stringOperators = [
	DbFilterOperator.isEqual,
	DbFilterOperator.isNotEqual,
	DbFilterOperator.fuzzyEqual,
];
export const arrayOperators = [
	DbFilterOperator.in,
	DbFilterOperator.arrayContains,
	DbFilterOperator.arrayContainsAny,
	DbFilterOperator.notIn,
]

export function getOperatorsForFieldType(fieldType: string): DbFilterOperator[]
{
	switch(fieldType)
	{
		case FieldType.fieldType:
		case FieldType.item:
		case FieldType.toggle:
		case FieldType.itemType:
		case FieldType.radio:
		case FieldType.text:
		case FieldType.textarea:
			return stringOperators;
		case FieldType.itemArray:
		case FieldType.checkbox:
		case FieldType.dropdown:
			return arrayOperators;
		case FieldType.timestamp:
		case FieldType.number:
			return numberOperators;
		case FieldType.itemFilters:
		case FieldType.repeater:
		case FieldType.readonly:
		default:
			return [];
	}
}
export function getFieldTypeForColumn(
	fieldKey: string,
	itemType: string
): FieldType | undefined
{
	const fields = getFieldsForItemTypeSync(itemType as ItemTypes);

	return fields?.find((f) => f.key === fieldKey)?.fieldType ?? undefined;
}

export function addFilterForItemType(opts: {
	itemType: ItemTypes;
	handler: DbFilterHandler;
	filter: DbFilter;
}): DbFilterHandler
{
	const fields = getFieldsForItemTypeSync(opts.itemType);
	const keys = fields?.map((f) => f.key);

	if(keys?.includes(opts.filter.key))
	{
		opts.handler.updateFilter(opts.filter);
	}

	return opts.handler;
}
