// Zencore: BASIC ITEMS

import { DbFilterOperator } from "./Filters";
import { ItemData, Nullable, ItemOpts, OnDirtyFieldFn, ArchetypeData, IItemType, Item } from "./ItemTypes";
import { RamDatabase } from "./MemoryDatabase";
import { Utils, Uuid } from "./Utils";

export class ItemHandler implements ItemData
{
	// ## Item variables
	public id: string;
	public typeId: string = 'Item';
	public definitionId: Nullable<string>;

	// ## Class variables
	protected db: ItemOpts['db'];
	protected isLoaded = false;
	protected data: Record<string, unknown> = {};
	protected onDirtyField: OnDirtyFieldFn | undefined;
	protected definition: Nullable<ArchetypeData>;

	/**
	 * Log of properties which have been mutated. Intended to facilitate saving a
	 * partial update, if desired.
	 */
	public dirtyFields: Record<string, boolean> = {};

	public static async getInstance(
		opts: ItemOpts
	): Promise<ItemHandler>
	{
		if(!(opts.db instanceof RamDatabase))
		{
			throw new Error(`Database unavailable for item "${opts.id}"`);
		}

		const instance = new ItemHandler(opts);

		await instance.init();

		return instance;
	}

	constructor(opts: ItemOpts)
	{
		if(!opts.db)
		{
			throw new Error(`Database unavailable or unspecified for item "${opts.id}"`);
		}

		this.id = opts.id;
		this.db = opts.db;

		this.data = this.getBaseData() as Item<IItemType>;

		if(typeof opts.onDirtyField === 'function')
		{
			this.setOnDirtyField(opts.onDirtyField);
		}

		if(Utils.isPopulatedObject(opts.initialData))
		{
			this.setData(opts.initialData as Partial<IItemType>);
		}

		if(opts.typeId)
		{
			this.typeId = opts.typeId;
		}

		if(opts.definition || opts.definitionId)
		{
			this.setDefinition({
				definition: opts.definition,
				definitionId: opts.definitionId
			});
		}
	}

	protected setDefinition(opts: {
		definitionId?: string;
		definition?: ArchetypeData;
		overwriteExisting?: boolean;
	})
	{
		if(this.definitionId && !opts.overwriteExisting)
		{
			return;
		}

		if(opts.definitionId)
		{
			if(Uuid.isUuid(opts.definitionId))
			{
				this.definitionId = opts.definitionId;
			}
			else if(opts.definitionId === null)
			{
				this.definitionId = null;
			}
			else
			{
				throw new Error(`Invalid definition value for item ${this.id}`);
			}
		}
		else if(opts.definition)
		{
			this.definition = opts.definition;
			this.definitionId = opts.definition.id;
		}
	}

	public async loadRelatedItems(opts: {
		itemType: string;
		itemIds: Array<string>;
	}): Promise<Record<string, unknown>[]>
	{
		if(
			!opts ||
			!(Array.isArray(opts.itemIds) && opts.itemIds.every(Uuid.isUuid)) ||
			!(this.db instanceof RamDatabase) ||
			!Uuid.isUuid(opts.itemType)
		)
		{
			return [];
		}

		const { results } = (await this.db.selectMultiple({
			itemType: opts.itemType,
			filters: [
				{
					key: 'id',
					operator: DbFilterOperator.in,
					value: opts.itemIds
				}
			]
		})) || {};

		return results || [];
	}

	protected async loadDefinition(): Promise<ArchetypeData | undefined>
	{
		if(Utils.isPopulatedObject(this.definition))
		{
			return;
		}

		if(!Uuid.isUuid(this.definitionId))
		{
			return;
		}

		const definitionData = await this.db.select({
			itemType: 'Archetype',
			itemId: this.definitionId,
		});

		if(!definitionData)
		{
			return undefined;
		}

		this.definition = definitionData as ArchetypeData;

		return this.definition;
	}

	protected setIfValid<T>(opts: {
		key: string;
		value: T;
		validator: (value: T) => boolean;
	}): void
	{
		const { key, value } = opts;

		if(value === null)
		{
			(this.data as Record<string, unknown>)[key] = null;
			this.markDirty(key);
		}
		/**
		 * Surprise! Hidden caveat! This will fail as if it's a race condition if
		 * you use an imported regex for validation. Make sure to use a regex copied
		 * to the location you need it (yes, as awful as that is to maintain) unless
		 * you are really sure it won't fail validation here!
		 */
		else if(opts.validator(value))
		{
			(this.data as Record<string, unknown>)[key] = value;
			this.markDirty(key);
		}
		else if(typeof value !== 'undefined')
		{
			console.log('FAILED:', {
				key,
				value,
				type: typeof value,
			});
		}
	}

	public get updatedAt(): number
	{
		if(!Utils.isNumber(this.data.updatedAt))
		{
			return Utils.getCurrentSecond();
		}

		return this.data.updatedAt;
	}

	public set updatedAt(value: number | null)
	{
		if(value === null)
		{
			this.data.updatedAt = undefined;
		}
		else
		{
			if(!Number.isInteger(value))
			{
				throw new Error(`updatedAt must be a number, got "${value}"`);
			}

			if(`${value}`.length === 13)
			{
				value = Math.floor(value / 1000);
			}

			this.data.updatedAt = value;
		}

		// disabled due to spam - any update updates this value
		// this.markDirty('updatedAt');
	}

	public get createdAt(): number | undefined
	{
		if(!Utils.isNumber(this.data.createdAt))
		{
			if(!this.isLoaded)
			{
				// we don't know it yet; don't presume it doesn't exist
				return undefined;
			}

			return Utils.getCurrentSecond();
		}

		return this.data.createdAt;
	}

	public set createdAt(value: number | null)
	{
		if(Number.isInteger(this.data.createdAt))
		{
			throw new Error(`Attempted to override createdAt for item ${this.id}`);
		}

		if(value === null)
		{
			this.data.createdAt = undefined;
		}
		else
		{
			if(!Number.isInteger(value))
			{
				throw new Error(`createdAt must be a number, got "${value}"`);
			}

			if(`${value}`.length === 13)
			{
				value = Math.floor(value / 1000);
			}

			this.data.createdAt = value;
		}

		this.markDirty('createdAt');
	}

	public get createdBy(): string | number
	{
		return (['string', 'number'].includes(typeof this.data.createdBy)) ?
			this.data.createdBy as string | number :
			'ca84b5a0-a0ae-425d-993a-4e63d235f222';
	}

	public set createdBy(value: string | number | null)
	{
		// if(this.data.createdBy)
		// {
		// 	throw new Error(`Attempted to override createdBy for item ${this.id}`);
		// }

		if(typeof value === 'string')
		{
			this.data.createdBy = value;
			this.markDirty('createdBy');
		}
	}

	public async load({
		force = false
	} = {}): Promise<Item<IItemType> | undefined>
	{
		if(this.isLoaded && !force)
		{
			return undefined;
		}

		const item = await this.db.select({
			itemType: this.typeId,
			itemId: this.id as string
		});

		if(!Utils.isPopulatedObject(item))
		{
			console.log(`Failed to retrieve item ${this.id} (${this.typeId})`);

			return undefined;
		}

		this.setData(item as Partial<Item<IItemType>>);
		this.isLoaded = true;

		return this.getData();
	}

	public async save(): Promise<void>
	{
		await this.update({ data: this.getData() });
	}

	public async create(): Promise<void>
	{
		try
		{
			await this.db.insert({
				itemId: this.id,
				itemType: this.typeId,
				data: this.getData(),
			});

			console.log(`Created item ${this.typeId} ${this.id}`);
		}
		catch(e)
		{
			console.error(e);
		}
	}

	/** To be overridden by descendants */
	public async init(): Promise<void>
	{
		await this.load();
	}

	public async update(opts: {
		data: Partial<Item<IItemType>>;
		doNotSetData?: boolean;
	}): Promise<void>
	{
		if(!Utils.isPopulatedObject(opts.data))
		{
			console.warn(`Tried to update item (id: "${this.id}") with empty data`);

			return;
		}

		const data = { ...opts.data };

		if(!data.updatedAt)
		{
			data.updatedAt = Utils.getCurrentSecond();
		}

		if(!data.createdAt)
		{
			data.createdAt = Utils.getCurrentSecond();
		}

		if(!opts.doNotSetData)
		{
			this.setData(data);
		}

		try
		{
			await this.db.update({
				itemType: this.typeId,
				itemId: this.id,
				data: this.getData(),
			});
		}
		catch(e)
		{
			console.warn(`Failed to update item (id: "${this.id}") with error: ${(e as Error).message}`);
		}
	}

	protected getBaseData()
	{
		return {
			id: this.id,
			typeId: this.typeId,
			updatedAt: this.updatedAt,
			createdAt: this.createdAt,
			createdBy: this.createdBy,
		};
	}

	public setData(
		item: Record<string, unknown>,
		opts?: {
			overwriteExisting?: boolean;
		}
	): void
	{
		// TODO: zod validation
		if(!Utils.isPopulatedObject(item))
		{
			return;
		}

		const baseData = this.getBaseData();

		this.typeId = [
			item.typeId,
			baseData.typeId
		].find((s) => typeof s === 'string') || this.typeId;

		this.data = {
			// existing data
			...(!opts?.overwriteExisting && { ...this.data }),
			// new data
			...item,
			// necessary data
			...baseData,
			typeId: this.typeId
		} as Partial<IItemType>;
	}

	public getData(): Item<IItemType>
	{
		return {
			...this.data,
			...this.getBaseData(),
		} as Item<IItemType>;
	}

	public setOnDirtyField(fn: OnDirtyFieldFn | undefined): void
	{
		this.onDirtyField = fn;
	}

	public markDirty(name: string): void
	{
		this.dirtyFields[name] = true;

		if(typeof this.onDirtyField === 'function')
		{
			this.onDirtyField(
				this.id,
				this.typeId,
				name,
				(this.data as Record<string, unknown>)[name]
			);
		}
	}

	public markClean(name: string): void
	{
		if(name in this.dirtyFields)
		{
			delete this.dirtyFields[name];
		}
	}

	public async destroy(): Promise<void>
	{
		await this.db.remove({
			itemType: this.typeId,
			itemId: this.id
		});
	}
}