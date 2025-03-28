'use client';

import { searchItems } from "@/cache/actions/Generic";
import { DbFilterHandler, DbFilters } from "@/zencore/Filters";
import { FieldData, FieldType, Item, ItemTypes, Nullable } from "@/zencore/ItemTypes";
import { DbPaginationOpts, PaginationHandler } from "@/zencore/Pagination";
import { Utils, Uuid } from "@/zencore/Utils";
import { Button, Stack } from "@mui/joy";
import { JSX, useEffect, useState } from "react";
import ItemFiltersInput from "../form/elements/ItemFiltersInput";
import Pagination from "./Pagination";
import { SxProps } from "@mui/material";

export type ItemSearchContainerProps = {
	itemType: ItemTypes;
	renderResult?: (item: Item<Record<string, unknown>>) => JSX.Element;
	renderResults?: (items: Item<Record<string, unknown>>[]) => JSX.Element;
	sx?: SxProps;
	hideFilters?: boolean;
	renderFilters?: (
		filters: DbFilters,
		updateFilters: ((opts: {
			field: FieldData;
			value: Nullable<DbFilters>;
			event?: any;
		}) => void),
		search: () => void,
	) => JSX.Element;
	initialFilters?: DbFilters;
	initialPagination?: DbPaginationOpts;
	showSearchButton?: boolean;
};

export default function ItemSearchContainer({
	itemType,
	renderResult,
	renderResults,
	sx,
	hideFilters,
	renderFilters,
	initialFilters,
	initialPagination,
	showSearchButton,
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

	const pag = new PaginationHandler({ initialValue: initialPagination });
	const fil = new DbFilterHandler({});

	useEffect(() =>
	{
		if(initialFilters)
		{
			fil.updateFilters(initialFilters);
			setFilters(initialFilters);
		}
	}, []);

	pag.setPageSize(5);

	function updatePagination(newPagination: DbPaginationOpts): void
	{
		pag.updatePagination(newPagination);
		setPagination(pag.pagination);
	}

	// call to server function for search
	async function executeSearch()
	{
		if(initialFilters)
		{
			fil.updateFilters(initialFilters);
		}

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

	useEffect(() =>
	{
		executeSearch();
	}, []);

	return (
		<Stack direction={'column'} spacing={1} sx={{
			width: {
				xs: 'calc(100vw - 3rem)',
				sm: 'calc(100vw - 3rem)',
				md: '50vw',
				lg: '50vw',
			}, ...sx
		}}>
			{/* Search Filters */}
			{!hideFilters && <ItemFiltersInput
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
			/>}
			{renderFilters && (renderFilters(filters, updateSelectedFilters, executeSearch))}
			{/* Search Results */}
			{renderResults ? (renderResults(results)) : null}
			{/* Search Results */}
			{renderResult ? results.map((result) => (renderResult(result))) : null}
			{/* Pagination */}
			<Stack direction="row" sx={{
				justifyContent: 'center',
				alignContent: 'center',
				alignItems: 'center',
			}}>
				<Pagination
					{...pagination}
					setPage={(page) =>
					{
						updatePagination({ ...pagination, page });
						executeSearch();
					}}
				/>
			</Stack>
			{/* Search button */}
			{showSearchButton && <Button onClick={executeSearch}>Search</Button>}
		</Stack>
	);
}