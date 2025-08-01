// Zencore: DB FILTERS

import { Utils } from "./Utils";

export enum DbFilterOperator
{
	lessThan = '<',
	lessThanOrEqualTo = '<=',
	greaterThan = '>',
	greaterThanOrEqualTo = '>=',
	fuzzyEqual = '~',
	isEqual = '==',
	isNotEqual = '!=',
	arrayContains = 'ac',
	notArrayContains = 'nac',
	arrayContainsAny = 'aca',
	notArrayContainsAny = 'naca',
	in = 'in',
	notIn = 'not-in'
};
export type DbFilter = {
	key: string;
	operator: DbFilterOperator;
	value: unknown;
};
export enum DbFilterGroupType
{
	or = 'or',
	and = 'and'
}
export type DbFilterGroup = {
	group: DbFilterGroupType;
	children: DbFilters;
};
export type DbFilters = Array<DbFilter | DbFilterGroup>;
export type DbFilterHandlerOpts = {
	filters?: DbFilters;
};
export class DbFilterHandler
{
	public filters: DbFilters;

	constructor(opts: DbFilterHandlerOpts)
	{
		this.filters = opts.filters || [];
	}

	public ensureItemTypeFilter(itemType: string | undefined): void
	{
		if(!this.filters.some((f) => (
			Utils.isSingleFilter(f) &&
			(f.key === 'typeId') &&
			(!itemType || (f.value === itemType))
		)))
		{
			this.filters.push({
				key: 'typeId',
				operator: DbFilterOperator.isEqual,
				value: itemType,
			});
		}
	}

	public mergeFilters(arraysToMerge: (DbFilters | undefined)[]): DbFilters
	{
		const filterHashes: string[] = [];
		const filtersToUse: DbFilters = [];

		arraysToMerge.forEach((arr) =>
		{
			if(Array.isArray(arr) && arr.length)
			{
				filtersToUse.push(...arr);
			}
		});

		const result = filtersToUse.reduce((
			agg: DbFilters,
			filter: unknown
		) =>
		{
			if(Utils.isGroupFilter(filter))
			{
				agg.push(filter);

				return agg;
			}
			else if(Utils.isSingleFilter(filter))
			{
				const hash = `${filter.key}_${filter.operator}`;

				if(!filterHashes.includes(hash))
				{
					filterHashes.push(hash);

					agg.push(filter);
				}
			}

			return agg;
		}, []);

		filterHashes.splice(0, filterHashes.length);

		return result;
	}

	public updateFilter(filter: DbFilter | DbFilterGroup): void
	{
		const index = this.filters.findIndex((f) => (
			Utils.isSingleFilter(f) &&
			f.key === (filter as DbFilter).key
		));

		if(index > -1)
		{
			this.filters[index] = filter;
		}
		else
		{
			this.filters.push(filter);
		}
	}

	public updateFilters(filters: DbFilters): void
	{
		if(!(Array.isArray(filters) && filters.length))
		{
			// blank the filters
			this.filters.splice(0, this.filters.length);
		}

		filters.forEach((filter) =>
		{
			this.updateFilter(filter);
		});
	}

	public static toNumbers(...args: Array<unknown>): number[]
	{
		return args
			.map((arg) => Utils.toNumber(arg))
			.filter((arg) => typeof arg === 'number');
	}

	/**
	 * Given two numbers and a comparison operator, return whether the comparison is true.
	 * @param num1
	 * @param num2
	 * @param operator
	 * @returns {boolean}
	 */
	public static compareNumbers(
		num1: unknown,
		num2: unknown,
		operator: DbFilterOperator,
	): boolean
	{
		const [a, b] = DbFilterHandler.toNumbers(num1, num2);

		if(typeof a === 'number' && typeof b === 'number')
		{
			switch(operator)
			{
				case DbFilterOperator.lessThan:
					return a < b;
				case DbFilterOperator.lessThanOrEqualTo:
					return a <= b;
				case DbFilterOperator.greaterThan:
					return a > b;
				case DbFilterOperator.greaterThanOrEqualTo:
					return a >= b;
				case DbFilterOperator.isEqual:
					return a === b;
				case DbFilterOperator.isNotEqual:
					return a !== b;
				default:
					return false;
			}
		}

		return false;
	}

	/**
	 * Given an object, return the `jsonData` property if it exists and is a string or object.
	 * @param obj
	 * @returns {Record<string, unknown> | undefined}
	 */
	public static getItemData(obj: unknown): Record<string, unknown> | undefined
	{
		if(!Utils.isPopulatedObject(obj))
		{
			return undefined;
		}

		try
		{
			if(typeof obj.jsonData === 'string')
			{
				return JSON.parse(obj.jsonData);
			}
			else if(Utils.isPopulatedObject(obj.jsonData))
			{
				return obj.jsonData;
			}

			return undefined;
		}
		catch(e)
		{
			return undefined;
		}
	}

	/**
	 * Apply a single filter to a single item, and return the result.
	 * @param filter
	 * @param target
	 * @returns {boolean}
	 */
	public static processFilter(
		filter: DbFilter,
		target: Record<string, unknown>,
	): boolean
	{
		const { key, value, operator } = filter;

		const data = DbFilterHandler.getItemData(target);
		let dataValue = target[key] || data?.[key];

		if(key === 'id' && !dataValue && (target.id || data?.id))
		{
			dataValue = target.id || data?.id;
		}

		switch(operator)
		{
			case DbFilterOperator.in:
			case DbFilterOperator.arrayContains:
			case DbFilterOperator.arrayContainsAny:
				if(dataValue && Array.isArray(value))
				{
					return value.some((v: unknown) => dataValue == v);
				}

				return false;
			case DbFilterOperator.notIn:
				if(dataValue && Array.isArray(value))
				{
					return !value.some((v: unknown) => dataValue == v);
				}

				return true;
			case DbFilterOperator.fuzzyEqual:
				if(!value && !dataValue)
				{
					return true;
				}

				if(typeof value === 'string' && typeof dataValue === 'string')
				{
					return dataValue.toLowerCase().includes(value.toLowerCase());
				}

				return false;
			case DbFilterOperator.isEqual:
				if(typeof value === 'string' && [
					'string',
					'number'
				].includes(typeof dataValue))
				{
					return value == dataValue;
				}

				return DbFilterHandler.compareNumbers(value, dataValue, operator);
			case DbFilterOperator.isNotEqual:
				if(typeof value === 'string')
				{
					return value !== dataValue;
				}

				return DbFilterHandler.compareNumbers(value, dataValue, operator);
			case DbFilterOperator.greaterThan:
			case DbFilterOperator.greaterThanOrEqualTo:
			case DbFilterOperator.lessThan:
			case DbFilterOperator.lessThanOrEqualTo:
				return DbFilterHandler.compareNumbers(value, dataValue, operator);
			default:
				console.warn('selectMultiple: Unknown filter operator', operator);
				return false;
		}
	}

	/**
	 * Apply a filter or group of filters to a single item, and return the result.
	 * @param filter
	 * @param item
	 * @returns {boolean}
	 */
	public static processFilterOrGroup(
		filter: DbFilter | DbFilterGroup,
		item: Record<string, unknown>,
	): boolean
	{
		if(Utils.isSingleFilter(filter))
		{
			return DbFilterHandler.processFilter(filter, item);
		}
		else if(Utils.isGroupFilter(filter))
		{
			console.warn('group:', filter.group, filter.children);
			if(filter.group === DbFilterGroupType.and)
			{
				return filter.children.every((subFilter) => (
					DbFilterHandler.processFilterOrGroup(subFilter, item)
				));
			}
			else if(filter.group === DbFilterGroupType.or)
			{
				return filter.children.some((subFilter) => (
					DbFilterHandler.processFilterOrGroup(subFilter, item)
				));
			}
		}

		return false;
	}

	/**
	 * Given an item and a set of filters, return whether the item passes all filters.
	 * @param filters 
	 * @param item 
	 * @returns 
	 */
	public static traverseFilters(
		filters: DbFilters,
		item: Record<string, unknown>,
	): boolean
	{
		if(!(Array.isArray(filters) && filters.length))
		{
			return true;
		}

		if(!Utils.isPopulatedObject(item))
		{
			return false;
		}

		return filters.every((filter) => (
			DbFilterHandler.processFilterOrGroup(filter, item)
		));
	}

	public static create(
		key: string,
		operator: `${DbFilterOperator}`,
		value: unknown
	): DbFilter
	{
		return {
			key,
			operator: operator as DbFilterOperator,
			value,
		};
	}

	public applyFiltersToItem(item: unknown): boolean
	{
		if(!Utils.isPopulatedObject(item))
		{
			return false;
		}

		return DbFilterHandler.traverseFilters(this.filters, item);
	}
}
