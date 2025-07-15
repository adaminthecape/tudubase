import { z } from 'zod';
import { FieldData, ItemTypes } from './ItemTypes';
import { Uuid } from './Utils';

export class ZodUtils
{
	/**
	 * Returns a list of keys from the Zod schema.
	 * @param zodSchema - The Zod schema to extract keys from.
	 * @returns An array of keys defined in the Zod schema.
	 */
	public static getZodKeys(zodSchema: z.ZodTypeAny | undefined): string[]
	{
		if(!zodSchema)
		{
			return [];
		}

		const shape = (zodSchema as any)?.def?.shape || {};
		return Object.keys(shape);
	}

	public static getZodShape(
		zodSchema: z.ZodTypeAny | undefined
	): Record<string, z.ZodTypeAny>
	{
		if(!zodSchema)
		{
			return {};
		}

		const shape = (zodSchema as any)?.def?.shape || {};
		return shape;
	}

	/**
	 * Validates an item against a Zod schema.
	 * @param itemSchema - The Zod schema to validate against.
	 * @param itemData - The data to validate.
	 * @returns An object containing the validation result and any errors.
	 */
	public static validateItem(
		itemSchema: z.ZodTypeAny,
		itemData: Record<string, unknown>
	): { success: boolean; error?: z.ZodError }
	{
		const result = itemSchema.safeParse(itemData);

		if(result.success)
		{
			return { success: true };
		}
		else
		{
			return { success: false, error: result.error };
		}
	}

	/**
	 * Creates a Zod schema from a given object.
	 * @param obj - The object to create a Zod schema from.
	 * @returns A Zod schema representing the object.
	 */
	public static createZodSchema(obj: Record<string, unknown>): z.ZodTypeAny
	{
		const shape: Record<string, z.ZodTypeAny> = {};

		for(const [key, value] of Object.entries(obj))
		{
			if(typeof value === 'string')
			{
				shape[key] = z.string();
			}
			else if(typeof value === 'number')
			{
				shape[key] = z.number();
			}
			else if(Array.isArray(value))
			{
				shape[key] = z.array(z.any());
			}
			else if(value && typeof value === 'object')
			{
				shape[key] = z.object(
					ZodUtils.createZodSchema(value as Record<string, unknown>)
				);
			}
			else
			{
				shape[key] = z.any();
			}
		}

		return z.object(shape);
	}

	public static convertZodSchemaToFieldData(
		schema: z.ZodTypeAny | undefined
	): FieldData[]
	{
		const keys = ZodUtils.getZodKeys(schema);
		const shape = ZodUtils.getZodShape(schema);
		const fieldDataArray: FieldData[] = [];

		for(const key of keys)
		{
			const fieldType = shape[key]?.constructor.name || 'unknown';
			const fieldData = {
				id: Uuid.generateUuid(),
				typeId: ItemTypes.Field,
				key,
				fieldType: fieldType as any,
				label: key.charAt(0).toUpperCase() + key.slice(1),
			};

			fieldDataArray.push(fieldData);
		}

		return fieldDataArray;
	}
}