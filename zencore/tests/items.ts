import { Uuid } from "../Utils";
import { getArg, faker, log } from "./utils";
import { FieldData, FieldType } from "../ItemTypes";
import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { FieldHandler } from "../Field";
import { RamDatabase } from "../MemoryDatabase";
import { generateNewId } from "./archetypes";

export function fakeFieldData(fields: FieldData[]): Record<string, unknown>
{
	const f = faker();
	const data: Record<string, unknown> = {};

	for(const field of fields)
	{
		if(!field.key)
		{
			continue;
		}

		switch(field.fieldType)
		{
			case FieldType.text:
			case FieldType.textarea:
				data[field.key] = f.string();
				break;
			case FieldType.number:
				data[field.key] = f.number(
					field.validation?.between?.min || 1,
					field.validation?.between?.max
				);
				break;
			case FieldType.timestamp:
				data[field.key] = f.timestamp();
				break;
			case FieldType.toggle:
				data[field.key] = f.boolean();
				break;
			default:
				data[field.key] = null;
				break;
		}
	}

	return data;
}

export async function createFakeItem(opts: {
	archetypeName: unknown;
	db: RamDatabase;
	archetypeId: string;
	itemData: Record<string, unknown>;
}): Promise<{ id: string | undefined; }>
{
	const archetype = new ArchetypeHandler({
		id: opts.archetypeId,
		db: opts.db,
	});

	await archetype.load();

	if(!(
		Array.isArray(archetype.attachedFields) &&
		archetype.attachedFields.length
	))
	{
		return { id: undefined };
	}
	const id = Uuid.generateUuid();
	const fieldDataArray = await ArchetypeHandler.loadFields({
		db: opts.db,
		fieldIds: archetype.attachedFields
	});
	const customItem = new CustomItemHandler({
		id,
		db: opts.db,
		definition: archetype.getData(),
		fieldDataArray,
	});
	await customItem.update({ data: opts.itemData });

	return { id };
}

export async function createArchetype(opts: {
	db: RamDatabase;
	name?: string;
	itemType: string;
	fields: FieldData[];
}): Promise<ArchetypeHandler | undefined>
{
	if(!opts.db || !Array.isArray(opts.fields) || !opts.fields.length)
	{
		return undefined;
	}

	let fields;

	if(getArg('reuseFields') === 'true')
	{
		fields = opts.fields;
	}
	else
	{
		fields = opts.fields.map(generateNewId);
	}

	for await(const field of fields)
	{
		const fieldHandler = new FieldHandler({
			id: field.id,
			db: opts.db,
		});
		await fieldHandler.update({ data: field });
	}

	const id = Uuid.generateUuid();

	const arch = new ArchetypeHandler({
		id,
		db: opts.db,
		fieldsArray: opts.fields,
	});

	await arch.update({
		data: {
			name: opts.name || opts.itemType,
			itemType: opts.itemType,
			attachedFields: opts.fields.map((f) => f.id)
		}
	});

	log(`New archetype (${arch.getData().name}):`, arch.getData(), '\n');

	return arch;
}
