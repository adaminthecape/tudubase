import { ItemTypes, CustomItemOpts } from "@/zencore/ItemTypes";
import { RamDatabase } from "@/zencore/MemoryDatabase";
import { Uuid } from "@/zencore/Utils";
import { CharacterArchetype, CharacterHandler } from "@/zencore/arch/Character";
import { CollectionArchetype, CollectionHandler } from "@/zencore/arch/Collection";
import { EquipmentArchetype, EquipmentHandler } from "@/zencore/arch/Equipment";
import { EquipmentTypeArchetype, EquipmentTypeHandler } from "@/zencore/arch/EquipmentType";
import { ImageAssetArchetype, ImageAssetHandler } from "@/zencore/arch/ImageAsset";
import { InAppNotificationArchetype, InAppNotificationHandler } from "@/zencore/arch/InAppNotification";
import { ProfileArchetype, ProfileHandler } from "@/zencore/arch/Profile";
import { ReminderArchetype, ReminderHandler } from "@/zencore/arch/Reminder";
import { RewardArchetype, RewardHandler } from "@/zencore/arch/Reward";
import { TagArchetype, TagHandler } from "@/zencore/arch/Tag";
import { TaskArchetype, TaskHandler } from "@/zencore/arch/Task";
import { TaskActivityArchetype, TaskActivityHandler } from "@/zencore/arch/TaskActivity";
import { TaskMasterArchetype, TaskMasterHandler } from "@/zencore/arch/TaskMaster";

const defaultArchetypeIds: Record<ItemTypes, string> = {
	[ItemTypes.Archetype]: Uuid.generateUuid(),
	[ItemTypes.Character]: Uuid.generateUuid(),
	[ItemTypes.Collection]: Uuid.generateUuid(),
	[ItemTypes.CustomItem]: Uuid.generateUuid(),
	[ItemTypes.Equipment]: Uuid.generateUuid(),
	[ItemTypes.EquipmentType]: Uuid.generateUuid(),
	[ItemTypes.Field]: Uuid.generateUuid(),
	[ItemTypes.ImageAsset]: Uuid.generateUuid(),
	[ItemTypes.InAppNotification]: Uuid.generateUuid(),
	[ItemTypes.Profile]: Uuid.generateUuid(),
	[ItemTypes.Reminder]: Uuid.generateUuid(),
	[ItemTypes.Reward]: Uuid.generateUuid(),
	[ItemTypes.Tag]: Uuid.generateUuid(),
	[ItemTypes.Task]: Uuid.generateUuid(),
	[ItemTypes.TaskActivity]: Uuid.generateUuid(),
	[ItemTypes.TaskMaster]: Uuid.generateUuid(),
};

export type ArchetypeHandlerType = (
	CharacterArchetype |
	CollectionArchetype |
	EquipmentArchetype |
	EquipmentTypeArchetype |
	ImageAssetArchetype |
	InAppNotificationArchetype |
	ProfileArchetype |
	ReminderArchetype |
	RewardArchetype |
	TagArchetype |
	TaskArchetype |
	TaskActivityArchetype |
	TaskMasterArchetype
);

export function getArchetypeForItemType(
	itemType: ItemTypes,
	archetypeId?: string
): ArchetypeHandlerType | undefined
{
	const db = new RamDatabase({});

	const opts = { id: archetypeId || defaultArchetypeIds[itemType], db };

	switch(itemType)
	{
		case ItemTypes.Archetype:
			return undefined;
		case ItemTypes.Character:
			return new CharacterArchetype(opts);
		case ItemTypes.Collection:
			return new CollectionArchetype(opts);
		case ItemTypes.CustomItem:
			return undefined;
		case ItemTypes.Equipment:
			return new EquipmentArchetype(opts);
		case ItemTypes.EquipmentType:
			return new EquipmentTypeArchetype(opts);
		case ItemTypes.Field:
			return undefined;
		case ItemTypes.ImageAsset:
			return new ImageAssetArchetype(opts);
		case ItemTypes.InAppNotification:
			return new InAppNotificationArchetype(opts);
		case ItemTypes.Profile:
			return new ProfileArchetype(opts);
		case ItemTypes.Reminder:
			return new ReminderArchetype(opts);
		case ItemTypes.Reward:
			return new RewardArchetype(opts);
		case ItemTypes.Tag:
			return new TagArchetype(opts);
		case ItemTypes.Task:
			return new TaskArchetype(opts);
		case ItemTypes.TaskActivity:
			return new TaskActivityArchetype(opts);
		case ItemTypes.TaskMaster:
			return new TaskMasterArchetype(opts);
		default:
			return undefined;
	}
}

export type ItemHandlerType = (
	CharacterHandler |
	CollectionHandler |
	EquipmentHandler |
	EquipmentTypeHandler |
	ImageAssetHandler |
	InAppNotificationHandler |
	ProfileHandler |
	ReminderHandler |
	RewardHandler |
	TagHandler |
	TaskHandler |
	TaskActivityHandler |
	TaskMasterHandler
);

export function getItemHandler(opts: {
	itemType: ItemTypes;
	id: CustomItemOpts['id'];
	db: any;
}): ItemHandlerType | undefined
{
	const handlerOpts = {
		id: opts.id,
		db: opts.db,
	};

	switch(opts.itemType)
	{
		case ItemTypes.Archetype:
			return undefined;
		case ItemTypes.Character:
			return new CharacterHandler(handlerOpts);
		case ItemTypes.Collection:
			return new CollectionHandler(handlerOpts);
		case ItemTypes.CustomItem:
			return undefined;
		case ItemTypes.Equipment:
			return new EquipmentHandler(handlerOpts);
		case ItemTypes.EquipmentType:
			return new EquipmentTypeHandler(handlerOpts);
		case ItemTypes.Field:
			return undefined;
		case ItemTypes.ImageAsset:
			return new ImageAssetHandler(handlerOpts);
		case ItemTypes.InAppNotification:
			return new InAppNotificationHandler(handlerOpts);
		case ItemTypes.Profile:
			return new ProfileHandler(handlerOpts);
		case ItemTypes.Reminder:
			return new ReminderHandler(handlerOpts);
		case ItemTypes.Reward:
			return new RewardHandler(handlerOpts);
		case ItemTypes.Tag:
			return new TagHandler(handlerOpts);
		case ItemTypes.Task:
			return new TaskHandler(handlerOpts);
		case ItemTypes.TaskActivity:
			return new TaskActivityHandler(handlerOpts);
		case ItemTypes.TaskMaster:
			return new TaskMasterHandler(handlerOpts);
		default:
			return undefined;
	}
}
