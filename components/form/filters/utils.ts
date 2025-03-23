import { DbFilterOperator, DbFilterGroupType } from "@/zencore/Filters";

export function getDefaultFilter()
{
	return { key: '', operator: DbFilterOperator.isEqual, value: '' };
}

export function getDefaultGroupFilter()
{
	return { group: DbFilterGroupType.and, children: [] };
}
