import { DrizzleHandler } from "../DrizzleInterface";
import { ItemTypes, CustomItemOpts } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { CharacterArchetype, CharacterHandler } from "./Character";
import { CollectionArchetype, CollectionHandler } from "./Collection";
import { EquipmentArchetype, EquipmentHandler } from "./Equipment";
import { EquipmentTypeArchetype, EquipmentTypeHandler } from "./EquipmentType";
import { ImageAssetArchetype, ImageAssetHandler } from "./ImageAsset";
import { InAppNotificationArchetype, InAppNotificationHandler } from "./InAppNotification";
import { ProfileArchetype, ProfileHandler } from "./Profile";
import { ReminderArchetype, ReminderHandler } from "./Reminder";
import { RewardArchetype, RewardHandler } from "./Reward";
import { TagArchetype, TagHandler } from "./Tag";
import { TaskArchetype, TaskHandler } from "./Task";
import { TaskMasterArchetype, TaskMasterHandler } from "./TaskMaster";

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
	TaskMasterArchetype
);

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
	TaskMasterHandler
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
		case ItemTypes.TaskMaster:
			return new TaskMasterArchetype(opts);
		default:
			return undefined;
	}
}

export function getItemHandler(options: {
	itemType: ItemTypes;
	id: CustomItemOpts['id'];
}): ItemHandlerType | undefined
{
	const opts = {
		id: options.id,
		db: new DrizzleHandler({}),
	};

	switch(options.itemType)
	{
		case ItemTypes.Archetype:
			return undefined;
		case ItemTypes.Character:
			return new CharacterHandler(opts);
		case ItemTypes.Collection:
			return new CollectionHandler(opts);
		case ItemTypes.CustomItem:
			return undefined;
		case ItemTypes.Equipment:
			return new EquipmentHandler(opts);
		case ItemTypes.EquipmentType:
			return new EquipmentTypeHandler(opts);
		case ItemTypes.Field:
			return undefined;
		case ItemTypes.ImageAsset:
			return new ImageAssetHandler(opts);
		case ItemTypes.InAppNotification:
			return new InAppNotificationHandler(opts);
		case ItemTypes.Profile:
			return new ProfileHandler(opts);
		case ItemTypes.Reminder:
			return new ReminderHandler(opts);
		case ItemTypes.Reward:
			return new RewardHandler(opts);
		case ItemTypes.Tag:
			return new TagHandler(opts);
		case ItemTypes.Task:
			return new TaskHandler(opts);
		case ItemTypes.TaskMaster:
			return new TaskMasterHandler(opts);
		default:
			return undefined;
	}
}
