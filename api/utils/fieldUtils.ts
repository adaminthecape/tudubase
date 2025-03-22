'use server';

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
import { fieldsForTask, fieldsForTaskActivity } from "@/zencore/arch/Task";
import { ItemTypes, FieldData } from "@/zencore/ItemTypes";
import { Utils } from "@/zencore/Utils";

export function getFieldsForItemType(
	itemType: ItemTypes
): FieldData[] | undefined
{
	switch(itemType)
	{
		case ItemTypes.Task:
			return [...fieldsForTask, ...fieldsForTaskActivity];
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

export function getFieldsMap(itemType: ItemTypes): Record<string, FieldData>
{
	const fields = getFieldsForItemType(itemType);

	if(!(Array.isArray(fields) && fields.length))
	{
		return {};
	}

	return Utils.reduceIntoAssociativeArray(fields, 'id');
}
