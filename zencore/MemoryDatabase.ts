// Zencore: In-memory data store used only for prototyping

import { DbFilters, DbFilterHandler, DbFilter, DbFilterOperator } from "./Filters";
import { DbPaginationOpts, PaginatedItemResponse, PaginationHandler } from "./Pagination";
import { IItemType } from "./ItemTypes";
import { Utils, Uuid } from "./Utils";

export type RamDatabaseOpts = {
	isDebugMode?: boolean;
};
export class RamDatabase<T = IItemType>
{
	public cacheByType: Record<string, Record<string, T>> = {};

	constructor(opts: RamDatabaseOpts)
	{
		//
	}

	public validateItemTypeAndId(opts: {
		itemId: string;
		itemType: string;
	}): boolean
	{
		const isValid = (
			typeof opts.itemId === 'string' &&
			typeof opts.itemType === 'string'
		);

		if(!isValid)
		{
			console.error('Invalid itemType or itemId', opts);
		}

		return isValid;
	}

	public getCacheKey(opts: {
		itemId: string;
		itemType: string;
	}): string
	{
		return `${opts.itemType}:${opts.itemId}`;
	}

	public cacheItem<T = IItemType>(opts: {
		itemType: string;
		itemId: string;
		itemData: T;
	})
	{
		if(!this.cacheByType[opts.itemType])
		{
			this.cacheByType[opts.itemType] = {};
		}

		this.cacheByType[opts.itemType][opts.itemId] = opts.itemData;
	}

	public getCachedItem<T = IItemType>(opts: {
		itemType: string;
		itemId: string;
	}): T | undefined
	{
		return this.cacheByType[opts.itemType]?.[opts.itemId];
	}

	public getCachedItemsOfType(itemType: string): Record<string, T> | undefined
	{
		return this.cacheByType[itemType];
	}

	public async update<T = IItemType>(opts: {
		itemId: string;
		itemType: string;
		path?: string | undefined;
		data: T;
		setUpdated?: boolean;
	})
	{
		if(!this.validateItemTypeAndId(opts))
		{
			return;
		}

		const item = await this.select(opts);

		if(item)
		{
			Object.assign(item, opts.data);
		}
		else
		{
			await this.insert(opts);
		}
	}

	public async updateMultiple<T = IItemType>(opts: {
		items: Record<string, T>;
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

	public async insert<T = IItemType>(opts: {
		itemId: string;
		itemType: string;
		data: T;
	}): Promise<void>
	{
		if(!this.validateItemTypeAndId(opts))
		{
			return;
		}

		this.cacheItem({
			itemId: opts.itemId,
			itemType: opts.itemType,
			itemData: opts.data,
		});
	}

	public async insertMultiple<T = IItemType>(opts: {
		itemType: string;
		items: Record<string, T>;
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

			await this.insert<T>(itemOpts);
		}
	}

	public async select<T = IItemType>(opts: {
		itemId: string;
		itemType: string;
		filters?: DbFilters;
	}): Promise<T | undefined>
	{
		if(!this.validateItemTypeAndId(opts)) return;

		if(!opts.filters)
		{
			return this.getCachedItem(opts);
		}

		const result = (await this.selectMultiple({
			itemType: opts.itemType,
			itemIds: [opts.itemId],
			filters: opts.filters
		}))?.results?.[0];

		return result;
	}

	protected slowFilter<T = IItemType>(filters: DbFilters): T[]
	{
		const result: T[] = [];

		Object.values(this.cacheByType).forEach((items) =>
		{
			Object.values(items).forEach((item) =>
			{
				if(DbFilterHandler.traverseFilters(filters, item))
				{
					result.push(item);
				}
			});
		});
		return result;
	}

	protected filterByIdAndType<T = IItemType>(filters: DbFilters): T[]
	{
		const itemType = (filters.find((f) => (
			Utils.isSingleFilter(f) &&
			f.key === 'typeId'
		)) as DbFilter)?.value;
		const itemIds = (filters.find((f) => (
			Utils.isSingleFilter(f) &&
			(f.key === 'id')
		)) as DbFilter)?.value;

		if(typeof itemType !== 'string')
		{
			return [];
		}

		if(Uuid.isUuid(itemIds))
		{
			const item = this.getCachedItem({ itemType, itemId: itemIds });

			if(item)
			{
				return [item];
			}

			return [];
		}

		if(!Array.isArray(itemIds))
		{
			return [];
		}

		const cachedItems = this.getCachedItemsOfType(itemType);

		if(!cachedItems)
		{
			return [];
		}

		const result = itemIds.reduce((agg, itemId) =>
		{
			const item = this.getCachedItem({ itemType, itemId });

			if(item)
			{
				agg.push(item);
			}

			return agg;
		}, []);

		return result;
	}

	public async selectMultiple<T = IItemType>(opts: {
		itemType: string;
		itemIds?: string[] | undefined;
		filters?: DbFilters;
		pagination?: DbPaginationOpts;
	}): Promise<PaginatedItemResponse<T>>
	{
		const { itemType, itemIds, filters, pagination } = opts;

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

		const onlyCheckingIdsAndTypes = (
			fh.filters.every((f) => 'key' in f && ['typeId', 'id'].includes(f.key))
		);

		let filteredData;

		if(fh.filters.length > 1)
		{
			filteredData = onlyCheckingIdsAndTypes ?
				this.filterByIdAndType(fh.filters) :
				this.slowFilter(fh.filters);
		}
		else
		{
			filteredData = this.cacheByType[itemType] ?
				Object.values(this.cacheByType[itemType]) :
				[];
		}

		const ph = new PaginationHandler({
			initialValue: pagination,
		});

		ph.setTotal((filteredData || []).length);

		if(pagination)
		{
			const { page, pageSize } = ph.pagination;
			const pageNum = Utils.toNumber(page);
			const pageSizeNum = Utils.toNumber(pageSize);

			if(pageNum && pageSizeNum)
			{
				const results = (filteredData || [])
					.slice((pageNum - 1) * pageSizeNum, pageNum * pageSizeNum);

				return {
					results: results as Array<T>,
					hasMore: results.length > (pageNum * pageSizeNum),
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
		}

		return {
			results: (filteredData || []) as Array<T>,
			hasMore: false,
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

		if(this.getCachedItem(opts))
		{
			delete this.cacheByType[opts.itemType][opts.itemId];
		}
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