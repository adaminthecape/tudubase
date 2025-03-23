import { getFieldsForItemType, getOperatorsForFieldType } from "./DrizzleUtils";
import { DbFilterOperator, DbFilterHandler, DbFilters, DbFilter } from "./Filters";
import { FieldData, ItemTypes } from "./ItemTypes";

type AvailableFilters = Array<{
	key: string;
	allowedOperators: DbFilterOperator[];
	isSearchable?: boolean;
}>;

export class ItemSearchFilterHandler
{
	public fields: FieldData[] = [];
	public filters: DbFilterHandler;

	constructor(opts: {
		itemType: ItemTypes;
		filters?: DbFilters;
	})
	{
		this.fields = getFieldsForItemType(opts.itemType) || [];
		this.filters = new DbFilterHandler({ filters: opts.filters });
	}

	public doesKeyExist(key: string): boolean
	{
		return !key ? false : this.fields.some((f) => f.key === key);
	}

	public updateFilter(filter: DbFilter): void
	{
		if(this.doesKeyExist(filter.key))
		{
			this.filters.updateFilter(filter);
		}
	}

	public getAvailableFilters(): any[]
	{
		return this.fields.reduce((agg: AvailableFilters, f) =>
		{
			if(f?.fieldType && f.key)
			{
				const allowedOperators = getOperatorsForFieldType(f.fieldType);

				if(allowedOperators)
				{
					agg.push({
						key: f.key,
						allowedOperators,
					});
				}
			}

			return agg;
		}, []);
	}
}