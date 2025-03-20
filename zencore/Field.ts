// Zencore: FIELDS

import { ItemHandler } from "./Item";
import { FieldData, FieldItemData, FieldHandlerOpts, Nullable, FieldValidation, FieldType } from "./ItemTypes";
import { Utils, Uuid } from "./Utils";

export class FieldHandler extends ItemHandler implements FieldData
{
	protected data: Partial<FieldItemData> = {};

	constructor(opts: FieldHandlerOpts)
	{
		super(opts);
	}

	public get validation(): Nullable<FieldValidation>
	{
		return this.data.validation;
	}

	public set validation(value: Nullable<FieldValidation>)
	{
		if(value === null)
		{
			this.data.validation = null;
		}
		else if(!Utils.isPopulatedObject(value))
		{
			return;
		}

		// TODO: validate validation
		this.data.validation = value;
		this.markDirty('validation');
	}

	public get fieldType(): Nullable<FieldType>
	{
		return this.data.fieldType;
	}

	public set fieldType(value: Nullable<FieldType>)
	{
		if(value === null)
		{
			this.data.fieldType = null;
		}

		this.data.fieldType = value;
		this.markDirty('fieldType');
	}

	public get key(): Nullable<string>
	{
		return this.data.key;
	}

	public set key(value: Nullable<string>)
	{
		if(value === null)
		{
			this.data.key = null;
		}

		this.data.key = value;
		this.markDirty('key');
	}

	public get label(): Nullable<string>
	{
		return this.data.label;
	}

	public set label(value: Nullable<string>)
	{
		if(value === null)
		{
			this.data.label = null;
		}

		this.data.label = value;
		this.markDirty('label');
	}

	public get icon(): Nullable<string>
	{
		return this.data.icon;
	}

	public set icon(value: Nullable<string>)
	{
		if(value === null)
		{
			this.data.icon = null;
		}

		this.data.icon = value;
		this.markDirty('icon');
	}

	public get options(): Nullable<(string | number)[]>
	{
		return this.data.options;
	}

	public set options(value: Nullable<(string | number)[]>)
	{
		if(value === null)
		{
			this.data.options = null;
		}
		else if(!Array.isArray(value))
		{
			return;
		}

		this.data.options = value;
		this.markDirty('options');
	}

	public get itemType(): Nullable<string>
	{
		return this.data.itemType;
	}

	public set itemType(value: Nullable<string>)
	{
		if(value === null)
		{
			this.data.itemType = null;
		}
		else if(typeof value !== 'string')
		{
			return;
		}

		this.data.itemType = value;
		this.markDirty('options');
	}

	public get children(): Nullable<Array<string>>
	{
		return this.data.children;
	}

	public set children(value: unknown)
	{
		if(Uuid.isUuid(value))
		{
			value = [value];
		}

		this.setIfValid({
			key: 'children',
			value,
			validator: (val) => (Array.isArray(val) && val.every(Uuid.isUuid))
		});
	}

	public getData(): FieldData
	{
		return {
			id: this.id,
			typeId: this.typeId,
			updatedAt: this.updatedAt,
			createdAt: this.createdAt,
			createdBy: this.createdBy,
			key: this.key,
			label: this.label,
			icon: this.icon,
			fieldType: this.fieldType,
			itemType: this.itemType,
			validation: this.validation,
			options: this.options,
			children: this.children,
		};
	}

	public setData(data: Partial<FieldData>): void
	{
		if(!Utils.isPopulatedObject(data))
		{
			return;
		}

		try
		{
			this.typeId = 'Field';
			this.validation = data.validation;
			this.fieldType = data.fieldType;
			this.key = data.key;
			this.label = data.label;
			this.icon = data.icon;
			this.options = data.options;
			this.itemType = data.itemType;
			this.children = data.children;
		}
		catch(e)
		{
			console.error(e, data);
		}
	}
}