import { tasksTable } from "@/src/db/schema";
import { eq, not, gt, gte, lt, lte, arrayContains } from "drizzle-orm";
import { PgTable, PgColumn } from "drizzle-orm/pg-core";
import { fieldsForCollection } from "./arch/Collection";
import { fieldsForReminder } from "./arch/Reminder";
import { fieldsForReward } from "./arch/Reward";
import { fieldsForTag } from "./arch/Tag";
import { fieldsForTask } from "./arch/Task";
import { fieldsForTaskMaster } from "./arch/TaskMaster";
import { DbFilterOperator, DbFilter } from "./Filters";
import { ItemTypes, FieldType, FieldData } from "./ItemTypes";
import { Utils } from "./Utils";

export function getTableForItemType(itemType: string): ({
	table?: PgTable | undefined;
	idColumn?: PgColumn | undefined;
})
{
	switch(itemType)
	{
		case ItemTypes.Task:
			return { table: tasksTable, idColumn: tasksTable.id };
		case ItemTypes.Collection:
		case ItemTypes.Reminder:
		case ItemTypes.Reward:
		case ItemTypes.Tag:
		case ItemTypes.TaskMaster:
		case ItemTypes.Archetype:
		case ItemTypes.CustomItem:
		case ItemTypes.Field:
		default:
			return {};
	}
}
export function getOperatorsForFieldType(fieldType: string): DbFilterOperator[]
{
	switch(fieldType)
	{
		case FieldType.fieldType:
		case FieldType.item:
		case FieldType.toggle:
		case FieldType.itemType:
		case FieldType.radio:
		case FieldType.text:
		case FieldType.textarea:
			return stringOperators;
		case FieldType.itemArray:
		case FieldType.checkbox:
		case FieldType.dropdown:
			return arrayOperators;
		case FieldType.timestamp:
		case FieldType.number:
			return numberOperators;
		case FieldType.itemFilters:
		case FieldType.repeater:
		case FieldType.readonly:
		default:
			return [];
	}
}
export function getFieldsForItemType(itemType: string): FieldData[] | undefined
{
	switch(itemType)
	{
		case ItemTypes.Collection:
			return fieldsForCollection;
		case ItemTypes.Reminder:
			return fieldsForReminder;
		case ItemTypes.Reward:
			return fieldsForReward;
		case ItemTypes.Tag:
			return fieldsForTag;
		case ItemTypes.Task:
			return fieldsForTask;
		case ItemTypes.TaskMaster:
			return fieldsForTaskMaster;
		case ItemTypes.Archetype:
		case ItemTypes.CustomItem:
		case ItemTypes.Field:
		default:
			return undefined;
	}
}
export function getFieldTypeForColumn(
	fieldKey: string,
	itemType: string
): FieldType | undefined
{
	const fields = getFieldsForItemType(itemType);

	return fields?.find((f) => f.key === fieldKey)?.fieldType ?? undefined;
}

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
		return Utils.isNumber(Utils.toNumber(filter.value));
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

// Operators which can be used with different field types
const numberOperators = [
	DbFilterOperator.isEqual,
	DbFilterOperator.isNotEqual,
	DbFilterOperator.greaterThan,
	DbFilterOperator.greaterThanOrEqualTo,
	DbFilterOperator.lessThan,
	DbFilterOperator.lessThanOrEqualTo,
];
const stringOperators = [
	DbFilterOperator.isEqual,
	DbFilterOperator.isNotEqual,
];
const arrayOperators = [
	DbFilterOperator.in,
	DbFilterOperator.arrayContains,
	DbFilterOperator.arrayContainsAny,
	DbFilterOperator.notIn,
]

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
	itemType: string
): void
{
	const fieldType = getFieldTypeForColumn(filter.key, itemType);

	const validOperators = getOperatorsForFieldType(filter.key);

	if(!validOperators.includes(filter.operator))
	{
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
