import { eq, not, gt, gte, lt, lte, arrayContains } from "drizzle-orm";
import { PgTable, PgColumn } from "drizzle-orm/pg-core";
import { DbFilterOperator, DbFilter } from "@/zencore/Filters";
import { FieldType, ItemTypes } from "@/zencore/ItemTypes";
import { Utils } from "@/zencore/Utils";
import { getFieldTypeForColumn, getOperatorsForFieldType } from "@/apiUtils/fieldUtils";

// Filter validation
type ValidFilter<T> = {
	key: string;
	operator: DbFilterOperator;
	value: T;
};
export function validateFilter<T = unknown>(
	filter: DbFilter
): filter is ValidFilter<T>
{
	if(
		!filter ||
		!filter.key ||
		!filter.operator ||
		!Object.values(DbFilterOperator).includes(filter.operator)
	)
	{
		return false;
	}

	if([
		DbFilterOperator.in,
		DbFilterOperator.arrayContains,
		DbFilterOperator.arrayContainsAny,
		DbFilterOperator.notIn,
	].includes(filter.operator))
	{
		return Boolean(Array.isArray(filter.value) && filter.value.length);
	}

	if([
		DbFilterOperator.greaterThan,
		DbFilterOperator.greaterThanOrEqualTo,
		DbFilterOperator.lessThan,
		DbFilterOperator.lessThanOrEqualTo,
	].includes(filter.operator))
	{
		return (filter.value == 0) ||  Utils.isNumber(Utils.toNumber(filter.value));
	}

	return true;
}
export function validateColumn(
	table: PgTable,
	column: string
): column is keyof typeof table
{
	return Boolean(
		(column in table) &&
		table[column as keyof typeof table] &&
		table[column as keyof typeof table] instanceof PgColumn
	);
}

// Filter application
export function applyStringFilter(
	query: any,
	table: PgTable,
	filter: DbFilter
): void
{
	if(!(
		validateFilter<string>(filter) &&
		validateColumn(table, filter.key)
	))
	{
		console.warn('Filter failed validation', filter);
		return;
	}

	const col = table[filter.key as keyof typeof table] as PgColumn;

	switch(filter.operator)
	{
		case DbFilterOperator.isEqual:
			query.where(eq(col, filter.value));
			break;
		case DbFilterOperator.isNotEqual:
			query.where(not(eq(col, filter.value)));
			break;
		default:
			break;
	}
}
export function applyNumberFilter(
	query: any,
	table: PgTable,
	filter: DbFilter
): void
{
	if(!(
		validateFilter<number>(filter) &&
		validateColumn(table, filter.key)
	))
	{
		console.warn('Filter failed validation', filter);
		return;
	}

	const col = table[filter.key as keyof typeof table] as PgColumn;

	switch(filter.operator)
	{
		case DbFilterOperator.isEqual:
			query.where(eq(col, filter.value));
			break;
		case DbFilterOperator.isNotEqual:
			query.where(not(eq(col, filter.value)));
			break;
		case DbFilterOperator.greaterThan:
			query.where(gt(col, filter.value));
			break;
		case DbFilterOperator.greaterThanOrEqualTo:
			query.where(gte(col, filter.value));
			break;
		case DbFilterOperator.lessThan:
			query.where(lt(col, filter.value));
			break;
		case DbFilterOperator.lessThanOrEqualTo:
			query.where(lte(col, filter.value));
			break;
		default:
			break;
	}
}
export function applyArrayFilter(
	query: any,
	table: PgTable,
	filter: DbFilter
): void
{
	if(!(
		validateFilter<unknown[]>(filter) &&
		validateColumn(table, filter.key)
	))
	{
		console.warn('Filter failed failed validation', filter);
		return;
	}

	const col = table[filter.key as keyof typeof table] as PgColumn;

	switch(filter.operator)
	{
		case DbFilterOperator.in:
		case DbFilterOperator.arrayContains:
		case DbFilterOperator.arrayContainsAny:
			query.where(arrayContains(col, filter.value));
			break;
		case DbFilterOperator.notIn:
			query.where(not(arrayContains(col, filter.value)));
			break;
		default:
			break;
	}
}

/**
 * General function to determine the type of field, and apply the
 * appropriate filter, if the filter data is valid.
 * @param query 
 * @param table 
 * @param filter 
 * @param itemType 
 * @returns {void}
 */
export function applyFilter(
	query: any,
	table: PgTable,
	filter: DbFilter,
	itemType: ItemTypes
): void
{
	if(filter.key === 'typeId')
	{
		if(filter.value == itemType)
		{
			applyStringFilter(query, table, filter);
		}
		else
		{
			// not sure what's going on here, but it's wrong
			console.warn('Filter value does not match item type', filter, itemType);
		}

		return;
	}

	const fieldType = getFieldTypeForColumn(filter.key, itemType);

	const validOperators = fieldType && getOperatorsForFieldType(fieldType);

	if(!validOperators?.includes(filter.operator))
	{
		console.warn(`Invalid operator for field type: ${fieldType}`, itemType, filter);
		return;
	}

	switch(fieldType)
	{
		case FieldType.fieldType:
		case FieldType.item:
		case FieldType.toggle:
		case FieldType.itemType:
		case FieldType.radio:
		case FieldType.text:
		case FieldType.textarea:
			applyStringFilter(query, table, filter);
			break;
		case FieldType.itemArray:
		case FieldType.checkbox:
		case FieldType.dropdown:
			applyArrayFilter(query, table, filter);
			break;
		case FieldType.timestamp:
		case FieldType.number:
			applyNumberFilter(query, table, filter);
			break;
		case FieldType.itemFilters:
		case FieldType.repeater:
		case FieldType.readonly:
		default:
			break;
	}
}
