// Zencore: UTILITIES

import { DbFilter, DbFilterOperator, DbFilterGroup } from "./Filters";
import { FieldData } from "./ItemTypes";
import { ValidationResult } from "./Validation";

export class Utils
{
	public static dotPick(obj: Record<string, unknown>, path: string)
	{
		if(!path || typeof path !== 'string') return undefined;

		path = path.replaceAll('[', '.');
		path = path.replaceAll(']', '.');
		path = path.replaceAll('..', '.');

		if(path.substring(path.length - 1, path.length) === '.')
		{
			path = path.substring(0, path.length - 1);
		}

		const arr = path.split('.');
		let res: unknown = obj;

		do
		{
			const nextKey = arr.shift();

			if(nextKey)
			{
				res = (res as Record<string, unknown>)?.[nextKey];
			}
			else
			{
				break;
			}
		}
		while(arr.length && Utils.isPopulatedObject(res));

		return res;
	}

	public static isPopulatedObject(obj: unknown): obj is Record<string, unknown>
	{
		return !!(
			obj &&
			typeof obj === 'object' &&
			!Array.isArray(obj) &&
			Object.keys(obj).length > 0
		);
	}

	public static isNumber(num: unknown): num is number
	{
		return (typeof num === 'number') && !Number.isNaN(num);
	}

	public static getCurrentSecond(): number
	{
		return Math.floor(Date.now() / 1000);
	}

	public static reduceIntoAssociativeArray<T = unknown>(
		arr: Array<T>,
		key: string
	): Record<string, T>
	{
		return arr.reduce((agg: Record<string, T>, item: T) =>
		{
			if(
				Utils.isPopulatedObject(item) &&
				['string', 'number'].includes(typeof item[key])
			)
			{
				agg[`${item[key]}`] = item;
			}

			return agg;
		}, {});
	}

	public static isSingleFilter(filter: unknown): filter is DbFilter
	{
		return !!(
			Utils.isPopulatedObject(filter) &&
			Object.keys(filter).every((k) => (
				['key', 'operator', 'value'].includes(k)
			)) &&
			(
				'key' in filter &&
				(typeof filter.key === 'string')
			) &&
			(
				'operator' in filter &&
				typeof filter.operator === 'string' &&
				Object.values(DbFilterOperator).includes(filter.operator as DbFilterOperator)
			)
		);
	}

	public static isGroupFilter(filter: unknown): filter is DbFilterGroup
	{
		return !!(
			filter &&
			typeof filter === 'object' &&
			(filter as DbFilterGroup).group &&
			Array.isArray((filter as DbFilterGroup).children)
		);
	}

	public static toNumber(num: unknown): number | undefined
	{
		if(typeof num === 'number')
		{
			if(Number.isNaN(num))
			{
				return undefined;
			}

			return num;
		}

		if(num && typeof num === 'string')
		{
			const parsedNum = num.includes('.') ? parseFloat(num) : parseInt(num, 10);

			if(`${parsedNum}` === `${num}`)
			{
				return parsedNum;
			}
		}

		return undefined;
	}

	public static stringBetween(valOpts: {
		min: number | undefined;
		max: number | undefined;
		value: unknown;
	}): ValidationResult
	{
		if(typeof valOpts.value !== 'string')
		{
			return 'Invalid value';
		}

		const { min, max, value } = valOpts;

		if((Utils.isNumber(min) && (value.length < min)))
		{
			return `Must be ${min} characters or greater.`;
		}

		if((Utils.isNumber(max) && (value.length > max)))
		{
			return `Must be ${max} characters or fewer.`;
		}

		return true;
	}

	public static numberBetween(valOpts: {
		min: number | undefined;
		max: number | undefined;
		value: unknown;
	}): ValidationResult
	{
		const { min, max } = valOpts;
		const { value } = valOpts;

		if((typeof value !== 'number') || Number.isNaN(value))
		{
			return 'Invalid value';
		}

		if((Utils.isNumber(min) && (value < min)))
		{
			return `Must be ${min} or more.`;
		}

		if((Utils.isNumber(max) && (value > max)))
		{
			return `Must be ${max} or less.`;
		}

		return true;
	}

	/**
	 * Recursively retrieve field ids from a nested array of fields
	 * @param fieldsArray 
	 * @returns 
	 */
	public static retrieveFieldIds(fieldsArray: Array<FieldData | string>): string[]
	{
		const result: string[] = [];

		if(!Array.isArray(fieldsArray))
		{
			return result;
		}

		fieldsArray.forEach((field) =>
		{
			if(!field)
			{
				return;
			}

			if(typeof field === 'string')
			{
				if(Uuid.isUuid(field))
				{
					result.push(field);
				}
			}
			else if(Uuid.isUuid(field?.id))
			{
				result.push(field.id);
			}
			else if(Array.isArray(field?.children))
			{
				result.push(...(Utils.retrieveFieldIds(field.children)));
			}
		});

		return result;
	}
}
export class Uuid
{
	private static generateNumber(limit: number)
	{
		const value = limit * Math.random();
		return value | 0;
	}
	private static generateX()
	{
		const value = Uuid.generateNumber(16);
		return value.toString(16);
	}
	private static generateXes(count: number)
	{
		let result = '';
		for(let i = 0; i < count; ++i)
		{
			result += Uuid.generateX();
		}
		return result;
	}
	private static generateVariant()
	{
		const value = Uuid.generateNumber(16);
		const variant = (value & 0x3) | 0x8;
		return variant.toString(16);
	}
	public static generateUuid()
	{
		const result = Uuid.generateXes(8)
			+ '-' + Uuid.generateXes(4)
			+ '-' + '4' + Uuid.generateXes(3)
			+ '-' + Uuid.generateVariant() + Uuid.generateXes(3)
			+ '-' + Uuid.generateXes(12);
		return result;
	};
	public static isUuid(id: unknown): id is string
	{
		const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;

		return ((typeof id === 'string') && pattern.test(id));
	}
}