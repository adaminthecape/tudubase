'use client';

import { searchItems } from "@/cache/actions/Generic";
import { DbFilterHandler, DbFilters } from "@/zencore/Filters";
import { FieldData, FieldType, Item, ItemTypes, Nullable } from "@/zencore/ItemTypes";
import { DbPaginationOpts, PaginationHandler } from "@/zencore/Pagination";
import { Utils, Uuid } from "@/zencore/Utils";
import { Button, Stack } from "@mui/joy";
import { JSX, useState } from "react";
import ItemFiltersInput from "../form/elements/ItemFiltersInput";
import Pagination from "./Pagination";
import { SxProps } from "@mui/material";

export type ItemSearchContainerProps = {
	itemType: ItemTypes;
	renderResult?: (item: Item<Record<string, unknown>>) => JSX.Element;
	renderResults?: (items: Item<Record<string, unknown>>[]) => JSX.Element;
	sx?: SxProps;
};

export default function ItemSearchContainer({
	itemType,
	renderResult,
	renderResults,
	sx,
}: ItemSearchContainerProps)
{
	// Function:
	// 1. Fetches data from the server
	// 2. Renders the search filters
	// 3. Renders the search results
	// 4. Handles the search results pagination

	const [filters, setFilters] = useState<DbFilters>([]);
	const [pagination, setPagination] = useState<DbPaginationOpts>({});
	const [results, setResults] = useState<Item<Record<string, unknown>>[]>([]);

	const pag = new PaginationHandler({});
	const fil = new DbFilterHandler({});

	pag.setPageSize(5);

	function updatePagination(newPagination: DbPaginationOpts): void
	{
		pag.updatePagination(newPagination);
		setPagination(pag.pagination);
	}

	// call to server function for search
	async function executeSearch()
	{
		const searchOpts: Parameters<typeof searchItems>[0] = {
			itemType,
			filters: fil.filters,
			pagination: pag.pagination,
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
		if(value)
		{
			fil.updateFilters(value);
			setFilters(fil.filters);
		}
	}

	return (
		<Stack direction={'column'} spacing={1} sx={{
			width: {
				xs: 'calc(100vw - 3rem)',
				sm: 'calc(100vw - 3rem)',
				md: '50vw',
				lg: '50vw',
		}, ...sx }}>
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
			{renderResults ? (renderResults(results)) : null}
			{/* Search Results */}
			{renderResult ? results.map((result) => (renderResult(result))) : null}
			{/* Pagination */}
			<Pagination
				{...pagination}
				setPage={(page) =>
				{
					updatePagination({ ...pagination, page });
					executeSearch();
				}}
			/>
			{/* Search button */}
			<Button onClick={executeSearch}>Search</Button>
		</Stack>
	);
}