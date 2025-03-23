export type IItemType = Record<string, unknown>;
export type Nullable<T> = T | null | undefined;
export type Item<T> = T & ItemData;
export type ItemHandler<T> = ItemData & {
	data: Partial<T>;
	getData(): Item<Partial<T>>;
	setData(data: Partial<T>): void;
};

export enum ItemTypes
{
	Archetype = 'Archetype',
	Character = 'Character',
	Collection = 'Collection',
	CustomItem = 'CustomItem',
	Equipment = 'Equipment',
	EquipmentType = 'EquipmentType',
	Field = 'Field',
	InAppNotification = 'InAppNotification',
	ImageAsset = 'ImageAsset',
	Profile = 'Profile',
	Reminder = 'Reminder',
	Reward = 'Reward',
	Tag = 'Tag',
	Task = 'Task',
	TaskActivity = 'TaskActivity',
	TaskMaster = 'TaskMaster',
};

export type ItemData = {
	id: string;
	typeId: string;
	definitionId?: Nullable<string>;
	createdBy?: string | number;
	updatedAt?: number;
	createdAt?: number;
};
export type OnDirtyFieldFn = (
	(itemId: string, itemType: string, name: string, value: unknown) => void
);
export type ItemOpts = {
	db: any;
	id: string;
	typeId?: string;
	initialData?: Partial<IItemType>;
	definitionId?: string;
	definition?: ArchetypeData;
	onDirtyField?: OnDirtyFieldFn | undefined;
};

export type ArchetypeOpts = ItemOpts & {
	fieldsArray?: FieldData[];
	fieldsMap?: Record<string, FieldData>;
	fieldIds?: string[];
};
export type ArchetypeItemData = ItemData & {
	name: Nullable<string>;
	itemType: Nullable<string>;
	attachedFields: Nullable<string[]>;
	scopeId: Nullable<string>;
};
export type ArchetypeData = ItemData & ArchetypeItemData;

export type CustomItemOpts = ItemOpts & {
	/**
	 * In order to reliably validate data by fields, we need the definition
	 * to be loaded before all else; we can either have the attachedFields
	 * available along with a synchronous function to get the field data (e.g.
	 * if retrieving it from a store or cache), or we can provide the field data
	 * directly in the opts. Not using a function here because field data must
	 * be definitively loaded before the handler is created.
	 */
	definition: ArchetypeData;
	fieldDataArray?: FieldData[];
	itemType?: string;
};
export type CustomItemItem = Record<string, unknown>;
export type CustomItem = ItemData;

export type FieldValidation = {
	required?: boolean;
	between?: {
		min?: number;
		max?: number;
	};
	options?: string[] | boolean;
	isBoolean?: boolean;
	isString?: boolean;
	isNumber?: boolean;
	isArray?: boolean;
	isObject?: boolean;
	isTimestamp?: boolean;
	isUuid?: boolean;
	isUuidArray?: boolean;
	isItemFilterArray?: boolean;
};
export enum FieldType
{
	text = 'text',
	textarea = 'textarea',
	number = 'number',
	timestamp = 'timestamp',
	dropdown = 'dropdown',
	multiSelect = 'multiSelect',
	toggle = 'toggle',
	checkbox = 'checkbox',
	radio = 'radio',
	readonly = 'readonly',
	item = 'item',
	itemArray = 'itemArray',
	itemFilters = 'itemFilters',
	fieldType = 'fieldType',
	itemType = 'itemType',
	repeater = 'repeater',
};
export type FieldItemData = ItemData & {
	key: string;
	label?: Nullable<string>;
	icon?: Nullable<string>;
	/** Category of field to display in the UI, e.g. text, number, item */
	fieldType: Nullable<FieldType>;
	/** The type of Item whose IDs this field stores */
	itemType?: Nullable<string>;
	/** {@link FieldValidation} */
	validation?: Nullable<FieldValidation>;
	/** Dropdown options, if applicable */
	options?: Nullable<(string | number)[]>;
	/** IDs of child fields of this field (for repeaters) */
	children?: Nullable<Array<string>>;
};
export type FieldData = ItemData & FieldItemData;
export type FieldHandlerOpts = ItemOpts;

export interface RewardCategory
{
	name: Nullable<string>;
	description: Nullable<string>;
}
export interface TaskCategory
{
	name: Nullable<string>;
}
export interface Task
{
	title: Nullable<string>;
	due: Nullable<number>;
	priority: Nullable<string>;
	notes: Nullable<string>;
	completed: Nullable<boolean>;
	completedAt: Nullable<number>;
	recurring: Nullable<boolean>;
	tags: Nullable<string[]>;
	activity: Nullable<string[]>;
}
export enum TaskActivityType
{
	// CRUD
	Created = 'Created',
	Updated = 'Updated',
	Deleted = 'Deleted',

	// Self handling
	Started = 'Started',
	Completed = 'Completed',
	Activated = 'Activated',
	Deactivated = 'Deactivated',

	// Master handling
	MasterAssigned = 'MasterAssigned',
	MasterDropped = 'MasterDropped',
	MasterCheckedIn = 'MasterCheckedIn',
	AcknowledgedMaster = 'AcknowledgedMaster',
	MasterCompleted = 'MasterCompleted',
	MasterFailed = 'MasterFailed',

	// Rewards
	OfferedReward = 'OfferedReward',
	RerolledReward = 'RerolledReward',
	AcceptedReward = 'AcceptedReward',
}
export interface TaskActivity
{
	/** The Task to which this activity belongs */
	taskId: Nullable<string>;
	/** What happened */
	activityType: Nullable<TaskActivityType>;
	/**
	 * A short blurb about what happened.
	 * Regretfully not storing actual Item data here, for simplicity; also, this
	 * will be in the user's target language at the time of generation.
	 */
	description?: Nullable<string>;
	/** If not performed by the owner, the user to which this action applies */
	targetUserId?: Nullable<string>;
}