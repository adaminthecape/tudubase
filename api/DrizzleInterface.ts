'use server';

// Zencore: GenericDatabase handler that sends data to Drizzle ORM

import { DbFilters, DbFilterHandler, DbFilterOperator } from "@/zencore/Filters";
import { DbPaginationOpts, PaginatedItemResponse, PaginationHandler } from "@/zencore/Pagination";
import { IItemType, ItemTypes } from "@/zencore/ItemTypes";
import { Utils, Uuid } from "@/zencore/Utils";
import { PgTable } from "drizzle-orm/pg-core";
import { applyFilter } from "./DrizzleUtils";
import { eq } from "drizzle-orm";
import { db as drizzleDb } from "@/src/db";
import { getItemHandler } from "@/apiUtils/itemUtils";
import { getTableForItemType } from "@/src/db/schema";
import { RamDatabase } from "@/zencore/MemoryDatabase";
import { getDb } from "./TestingInterface";

function applyFilters(
	query: any,
	table: PgTable,
	filters: DbFilters,
	itemType: string,
)
{
	for(const filter of filters)
	{
		if(Utils.isGroupFilter(filter))
		{
			console.warn('TODO: Implement group filters');
			continue;
		}

		applyFilter(query, table, filter, itemType as ItemTypes);
	}
}

function applyPagination(query: any, page: number, pageSize: number)
{
	query.limit(pageSize).offset((page - 1) * pageSize);
}

export type DrizzleHandlerOpts = {
	isDebugMode?: boolean;
};

class DrizzleHandler
{
	public db = drizzleDb;

	constructor(opts: DrizzleHandlerOpts)
	{
		//
	}

	public validateItemTypeAndId(opts: {
		itemId: string;
		itemType: string;
	}): boolean
	{
		const isValid = (
			Uuid.isUuid(opts.itemId) &&
			typeof opts.itemType === 'string'
		);

		if(!isValid)
		{
			console.warn('Invalid itemType or itemId', opts);
		}

		return isValid;
	}

	public async update(opts: {
		itemId: string;
		itemType: string;
		path?: string | undefined;
		data: IItemType;
		setUpdated?: boolean;
	})
	{
		if(!this.validateItemTypeAndId(opts))
		{
			return;
		}

		const { table, idColumn } = getTableForItemType(opts.itemType);

		if(!table || !idColumn)
		{
			return;
		}

		await this.db.update(table)
			.set(opts.data)
			.where(eq(idColumn, opts.itemId));
	}

	public async updateMultiple(opts: {
		items: Record<string, IItemType>;
		itemType: string;
	})
	{
		for await(const itemId of Object.keys(opts.items))
		{
			const item = opts.items[itemId];
			const itemOpts = {
				itemId,
				itemType: opts.itemType,
				data: item
			};

			await this.update(itemOpts);
		}
	}

	public async insert(opts: {
		itemId: string;
		itemType: string;
		data: IItemType;
	}): Promise<void>
	{
		if(!this.validateItemTypeAndId(opts))
		{
			return;
		}

		const handler = getItemHandler({
			itemType: opts.itemType as ItemTypes,
			id: opts.itemId,
			// sandboxed validation
			db: new RamDatabase({}),
		});

		if(!handler)
		{
			return;
		}

		handler.setData(opts.data);

		const { table, idColumn } = getTableForItemType(opts.itemType);

		if(!table)
		{
			return;
		}

		const values = handler.getData();

		await this.db.insert(table).values(values);
	}

	public async insertMultiple(opts: {
		itemType: string;
		items: Record<string, IItemType>;
	}): Promise<void>
	{
		for(const itemId in opts.items)
		{
			const item = opts.items[itemId];
			const itemOpts = {
				itemId,
				itemType: opts.itemType,
				data: item
			};

			await this.insert(itemOpts);
		}
	}

	public async select(opts: {
		itemId: string;
		itemType: string;
		filters?: DbFilters;
	}): Promise<IItemType | undefined>
	{
		if(!this.validateItemTypeAndId(opts)) return;

		if(!opts.filters)
		{
			const { table, idColumn } = getTableForItemType(opts.itemType);

			if(!table || !idColumn)
			{
				return;
			}

			return (
				await this.db.select()
					.from(table)
					.where(eq(idColumn, opts.itemId))
					.limit(1)
			)?.[0];
		}

		const result = (await this.selectMultiple({
			itemType: opts.itemType,
			itemIds: [opts.itemId],
			filters: opts.filters
		}))?.results?.[0];

		return result;
	}

	public async selectMultiple(opts: {
		itemType: string;
		itemIds?: string[] | undefined;
		filters?: DbFilters;
		pagination?: DbPaginationOpts;
	}): Promise<PaginatedItemResponse<IItemType>>
	{
		const { itemType, itemIds, filters, pagination } = opts;

		// handle filters
		const fh = new DbFilterHandler({ filters });

		fh.updateFilter({
			key: 'typeId',
			operator: DbFilterOperator.isEqual,
			value: itemType,
		});

		if(Array.isArray(itemIds))
		{
			fh.updateFilter({
				key: 'id',
				operator: DbFilterOperator.in,
				value: itemIds,
			});
		}

		// handle pagination
		const ph = new PaginationHandler({ initialValue: pagination });
		const { page, pageSize } = ph.pagination;
		const pageNum = Utils.toNumber(page) ?? 1;
		const pageSizeNum = Utils.toNumber(pageSize) ?? 10;

		ph.setPage(pageNum);
		ph.setPageSize(pageSizeNum);
		ph.setTotal(0);

		// set up a query - $dynamic means this will be modified later

		const { table, idColumn } = getTableForItemType(opts.itemType);

		if(!table)
		{
			return {
				results: [],
				hasMore: false,
				totalItems: 0,
				pagination: {
					page: 1,
					pageSize: 10,
					totalRows: 0,
				}
			};
		}

		const query = this.db.select().from(table).$dynamic();

		applyPagination(query, pageNum, pageSizeNum);
		applyFilters(query, table, fh.filters, itemType);

		const results = ((await query.execute()) || []) as Array<IItemType>;

		return {
			results: results as Array<IItemType>,
			// TODO: convert to count query
			hasMore: results.length >= (pageNum * pageSizeNum),
			totalItems: ph.pagination.totalRows ?? 0,
			pagination: {
				page: ph.pagination.page,
				pageSize: ph.pagination.pageSize,
				totalRows: ph.pagination.totalRows,
				sortBy: ph.pagination.sortBy,
				sortOrder: ph.pagination.sortOrder,
			}
		};
	}

	public async remove(opts: {
		itemId: string;
		itemType: string;
	}): Promise<void>
	{
		if(!this.validateItemTypeAndId(opts)) return;

		const { table, idColumn } = getTableForItemType(opts.itemType);

		if(!table || !idColumn)
		{
			return;
		}

		await this.db.delete(table).where(eq(idColumn, opts.itemId));
	}

	public async removeMultiple(opts: {
		itemIds: Array<string>;
		itemType: string;
	}): Promise<void>
	{
		for(const itemId of opts.itemIds)
		{
			this.remove({
				itemId,
				itemType: opts.itemType
			});
		}
	}
}

export async function getDrizzleHandler(opts: {
	user?: any;
})
{
	return getDb();
	// return new DrizzleHandler({});
}