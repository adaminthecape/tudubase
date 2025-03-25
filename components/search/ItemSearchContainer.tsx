'use client';

import { searchItems } from "@/api/actions/Generic";
import { DbFilterHandler, DbFilters } from "@/zencore/Filters";
import { FieldData, FieldType, Item, ItemTypes, Nullable } from "@/zencore/ItemTypes";
import { DbPaginationOpts, PaginationHandler } from "@/zencore/Pagination";
import { Utils, Uuid } from "@/zencore/Utils";
import { Button } from "@mui/joy";
import { useState } from "react";
import ItemSearchFilters from "./ItemSearchFilters";
import ItemFiltersInput from "../form/elements/ItemFiltersInput";
import { GenericInputProps } from "../form/elements/GenericInput";

export type ItemSearchContainerProps = {
	itemType: ItemTypes;
};

export default function ItemSearchContainer({
	itemType,
}: ItemSearchContainerProps)
{
	// Function:
	// 1. Fetches data from the server
	// 2. Renders the search filters
	// 3. Renders the search results
	// 4. Handles the search results pagination

	const pag = new PaginationHandler({});
	const fil = new DbFilterHandler({});

	const [filters, setFilters] = useState<DbFilters>({});
	const [pagination, setPagination] = useState<DbPaginationOpts>({});

	function updatePagination(newPagination: DbPaginationOpts): void
	{
		if(!newPagination)
		{
			return;
		}

		if(newPagination.page)
		{
			pag.setPage(newPagination.page);
		}

		if(newPagination.pageSize)
		{
			pag.setPageSize(newPagination.pageSize);
		}

		if(newPagination.sortBy)
		{
			pag.setSort(newPagination.sortBy);
		}

		if(newPagination.sortOrder)
		{
			pag.setSortDirection(newPagination.sortOrder === 'asc' ? 'asc' : 'desc');
		}

		if(newPagination.totalRows)
		{
			pag.setTotal(newPagination.totalRows);
		}

		setPagination(pag.pagination);
	}

	const [results, setResults] = useState<Item<Record<string, unknown>>[]>([]);

	// call to server function for search
	async function executeSearch()
	{
		const searchOpts: Parameters<typeof searchItems>[0] = {
			itemType,
			filters,
			pagination,
		};

		const { success, data } = await searchItems(searchOpts);

		if(!(
			Utils.isPopulatedObject(data) &&
			Array.isArray(data?.results) &&
			success
		))
		{
			console.warn('Search failed:', searchOpts, data);
			return;
		}

		const {
			results,
			totalItems,
			hasMore,
			pagination: receivedPagination,
		} = data;

		updatePagination(receivedPagination);
		setResults(results);

		console.log({
			results,
			totalItems,
			hasMore,
			receivedPagination,
			pagination,
			filters,
		});
	}

	function updateSelectedFilters({
		field,
		value,
	}: {
		field: FieldData;
		value: Nullable<DbFilters>;
	}): void
	{
		console.log('updateSelectedFilters:', field, value);
		if(value) fil.updateFilters(value);
		setFilters(fil.filters);
	}

	return (
		<>
			{/* Search Filters */}
			<ItemFiltersInput
				itemType={itemType}
				field={{
					id: Uuid.generateUuid(),
					typeId: ItemTypes.Field,
					label: 'Filters',
					key: '_____filters',
					fieldType: FieldType.itemFilters,
				}}
				value={fil.filters}
				updateValue={updateSelectedFilters}
				updateError={() => {}}
			/>
			{/* Search Results */}
			<pre>{JSON.stringify(results || {}, undefined, 4)}</pre>
			{/* Pagination */}
			{JSON.stringify(pagination || {})}
			{/* Search button */}
			<Button onClick={executeSearch}>Search</Button>
		</>
	);
}