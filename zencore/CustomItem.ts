// Zencore: CUSTOM ITEMS

import { DbFilter, DbFilters } from "./Filters";
import { ItemHandler } from "./Item";
import { CustomItem, Nullable, CustomItemItem, FieldData, CustomItemOpts, Item } from "./ItemTypes";
import { DbPaginationOpts } from "./Pagination";
import { Utils } from "./Utils";
import { FieldValidator } from "./Validation";

export class CustomItemHandler<T = CustomItemItem>
	extends ItemHandler
	implements CustomItem
{
	public typeId: string = 'Custom';
	public definitionId: Nullable<string>;
	public data: Partial<T> = {};
	protected validator: FieldValidator;
	protected fieldDataArray: (FieldData[]) | null;
	/** Map of field keys to their data */
	protected fieldKeyMap: Record<string, FieldData>;

	public static override async getInstance(
		opts: CustomItemOpts
	): Promise<CustomItemHandler>
	{
		const instance = new CustomItemHandler(opts);

		await instance.load();

		return instance;
	}

	constructor(opts: CustomItemOpts)
	{
		super(opts);

		if(!(
			opts.definition?.id &&
			Array.isArray(opts.definition?.attachedFields)
		))
		{
			throw new Error(`CustomHandler (${(
				opts.id
			)}) requires a definition with attachedFields`);
		}

		if(!Array.isArray(opts.fieldDataArray))
		{
			throw new Error(`CustomHandler (${(
				opts.id
			)}) requires either getFieldDataFn or fieldDataArray`);
		}

		this.definitionId = opts.definition.id as string;
		this.typeId = opts.itemType || opts.definition.itemType || 'Custom';
		this.definition = opts.definition;
		this.fieldDataArray = opts.fieldDataArray.filter(Utils.isPopulatedObject);

		this.validator = new FieldValidator({
			fieldsArray: this.fieldDataArray
		});

		this.fieldKeyMap = Utils.reduceIntoAssociativeArray(this.fieldDataArray, 'key');
	}

	protected logFailure(opts: {
		key: string;
		value: unknown;
		field: FieldData;
	}): void
	{
		const { key, value, field } = opts;

		console.log('FAILED (c):', key, value);
		// console.log('FAILED (c):', {
		// 	key,
		// 	value,
		// 	type: typeof value,
		// 	field: field.key,
		// 	message: this.validator.validateField({
		// 		field,
		// 		value
		// 	}).message
		// });
	}

	protected override setIfValid<T = unknown>(opts: {
		key: string;
		value: T;
		validator: (value: T) => boolean;
	}): void
	{
		const { key } = opts;
		const { value } = opts;

		if(value === null)
		{
			(this.data as Record<string, unknown>)[key] = value;
			this.markDirty(key);
		}
		else if(opts.validator(value))
		{
			(this.data as Record<string, unknown>)[key] = value;
			this.markDirty(key);
		}
		else if(typeof value !== 'undefined')
		{
			this.logFailure({
				key,
				value,
				field: this.fieldKeyMap[key]
			});
		}
	}

	/**
	 * For each of the attached fields, retrieve its corresponding data value
	 * as `this.data[field.key]`; this means that only the attached fields will
	 * yield any data.
	 * @returns An object containing this Item's field-based data
	 */
	protected getCustomFieldsData(): Record<string, unknown>
	{
		return Object.keys(this.fieldKeyMap).reduce((
			agg: Record<string, unknown>,
			key: string
		) =>
		{
			agg[key] = (this.data as Record<string, unknown>)[key];

			return agg;
		}, {});
	}

	public async loadFields(): Promise<void>
	{
		if(!(
			Array.isArray(this.definition?.attachedFields) &&
			this.definition.attachedFields.length
		))
		{
			throw new Error('No field IDs to load');
		}

		const fields = ((await this.db.selectMultiple({
			itemType: 'Field',
			itemIds: this.definition.attachedFields,
		}))?.results || []) as FieldData[];

		this.fieldKeyMap = Utils.reduceIntoAssociativeArray(
			fields,
			'key'
		) as Record<string, FieldData>;
		this.validator = new FieldValidator({ fieldsArray: fields });
	}

	public getData(): Item<T>
	{
		return {
			...this.getCustomFieldsData(),
			id: this.id,
			typeId: this.determineItemType(),
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			createdBy: this.createdBy,
			definitionId: this.definitionId || this.definition?.id,
		} as Item<T>;
	}

	protected determineItemType(): string
	{
		return this.definition?.itemType || this.typeId || 'Custom';
	}

	/**
	 * Set the Item's data based on its attached fields. Any values provided, if
	 * they do not correspond to a known field key, will be ignored. Any props
	 * which do correspond to a known field key will be validated according to
	 * the field's type, and any `validation` options specified on the field.
	 * @param data 
	 */
	public setData(data: Record<string, unknown>): void
	{
		if(!Utils.isPopulatedObject(data))
		{
			return;
		}

		const baseKeys = [
			'id',
			'typeId',
			'createdBy',
			'createdAt',
			'updatedAt',
			'definitionId',
		];

		try
		{
			Object.entries(data).forEach(([key, value]) =>
			{
				if(baseKeys.includes(key))
				{
					return;
				}

				if(!this.fieldKeyMap[key])
				{
					console.log(`Field not found for key: ${key}`);

					return;
				}

				this.setIfValid({
					key,
					value,
					validator: (val) => this.validator.validateField({
						field: this.fieldKeyMap[key],
						value: val
					}).success
				});
			});

			const now = Utils.getCurrentSecond();

			this.typeId = this.determineItemType();
			this.updatedAt = now;

			if(!this.createdAt)
			{
				this.createdAt = now;
			}

			if(data.definitionId)
			{
				this.definitionId = data.definitionId as string;
			}
		}
		catch(e)
		{
			console.error(e, data);
		}
	}

	public async search(opts: {
		filters?: DbFilters;
		pagination?: DbPaginationOpts;
	}): Promise<Item<T>[]>
	{
		const itemType = this.typeId;

		if(!('selectMultiple' in this.db && typeof this.db.selectMultiple === 'function'))
		{
			console.error('No selectMultiple method found on db');

			return {} as any;
		}

		const searchResults = await this.db.selectMultiple({
			itemType,
			filters: opts.filters,
			pagination: opts.pagination,
		});

		console.log('search:', this.typeId, searchResults);

		return searchResults;
	}
}