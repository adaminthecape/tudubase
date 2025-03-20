// Zencore: ARCHETYPES

import { DbFilterOperator } from "./Filters";
import { ItemHandler } from "./Item";
import { ArchetypeData, FieldData, ArchetypeItemData, ArchetypeOpts, ItemOpts, Nullable } from "./ItemTypes";
import { RamDatabase } from "./MemoryDatabase";
import { Utils, Uuid } from "./Utils";

export class ArchetypeHandler extends ItemHandler implements ArchetypeData
{
	public typeId: string = 'Archetype';
	protected fieldsMap?: Record<FieldData['id'], FieldData>;
	protected data: Partial<ArchetypeItemData> = {};

	public static async loadFields(opts: {
		db: RamDatabase;
		fieldIds: Array<string>;
	}): Promise<FieldData[]>
	{
		if(
			!opts ||
			!(Array.isArray(opts.fieldIds) && opts.fieldIds.every(Uuid.isUuid)) ||
			!(opts.db instanceof RamDatabase)
		)
		{
			return [];
		}

		let results: FieldData[] = [];

		results = ((await opts.db.selectMultiple({
			itemType: 'Field',
			filters: [
				{
					key: 'typeId',
					operator: DbFilterOperator.isEqual,
					value: 'Field'
				},
				{
					key: 'id',
					operator: DbFilterOperator.in,
					value: opts.fieldIds
				}
			]
		}))?.results || []) as FieldData[];

		return results as FieldData[];
	}

	constructor(opts: ArchetypeOpts)
	{
		super(opts);

		this.setFields(opts);
	}

	public setFields(opts: Omit<ArchetypeOpts, keyof ItemOpts>)
	{
		if(Array.isArray(opts.fieldsArray))
		{
			this.attachedFields = opts.fieldsArray.map((f) => f.id);

			this.fieldsMap = Utils.reduceIntoAssociativeArray(
				opts.fieldsArray,
				'id'
			);
		}
		else if(Utils.isPopulatedObject(opts.fieldsMap))
		{
			this.attachedFields = Object.values(opts.fieldsMap).map((f) => f.id);
			this.fieldsMap = opts.fieldsMap;
		}
		else if(
			Array.isArray(opts.fieldIds) &&
			opts.fieldIds.length &&
			opts.fieldIds.every(Uuid.isUuid)
		)
		{
			// need to load fields - methods will error if not loaded first
			this.attachedFields = opts.fieldIds;
		}
	}

	public async load(opts?: {
		force?: boolean | undefined;
	}): Promise<ArchetypeData | undefined>
	{
		const data = (await super.load(opts)) as ArchetypeData | undefined;

		if(Array.isArray(this.attachedFields) && this.attachedFields.length)
		{
			if(opts?.force || !Utils.isPopulatedObject(this.fieldsMap))
			{
				const foundFields = await ArchetypeHandler.loadFields({
					db: this.db,
					fieldIds: this.attachedFields
				});

				if(Array.isArray(foundFields) && foundFields.length)
				{
					this.setFields({ fieldsArray: foundFields });
				}
			}
		}

		return data;
	}

	get name(): Nullable<string>
	{
		return this.data.name;
	}

	set name(value: unknown)
	{
		this.setIfValid({
			key: 'name',
			value,
			validator: (val) => (typeof val === 'string')
		});
	}

	get attachedFields(): Nullable<string[]>
	{
		return this.data.attachedFields;
	}

	set attachedFields(value: unknown)
	{
		this.setIfValid({
			key: 'attachedFields',
			value,
			validator: (val) => (Array.isArray(val) && val.every(Uuid.isUuid))
		});
	}

	get scopeId(): Nullable<string>
	{
		return this.data.scopeId;
	}

	set scopeId(value: unknown)
	{
		this.setIfValid({ key: 'scopeId', value, validator: Uuid.isUuid });
	}

	get itemType(): Nullable<string>
	{
		return this.data.itemType;
	}

	set itemType(value: unknown)
	{
		this.setIfValid({
			key: 'itemType',
			value,
			validator: (val) => !!(val && (typeof val === 'string'))
		});
	}

	public getData(): ArchetypeData
	{
		// for each field, get its value from data if it exists
		return {
			...super.getData(),
			name: this.name,
			itemType: this.itemType,
			scopeId: this.scopeId,
			attachedFields: this.attachedFields
		} as ArchetypeData;
	}

	public setData(data: Partial<ArchetypeData>): void
	{
		if(!Utils.isPopulatedObject(data))
		{
			return;
		}

		try
		{
			// super.setData({});

			this.typeId = 'Archetype';
			this.name = data.name;
			this.itemType = data.itemType;
			this.scopeId = data.scopeId;
			this.attachedFields = data.attachedFields;
		}
		catch(e)
		{
			console.error(e, data);
		}
	}
}