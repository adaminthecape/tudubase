// Zencore: DB PAGINATION

export type DbPaginationOpts = {
	page?: number;
	pageSize?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	totalRows?: number;
};
export type PaginatedItemResponse<T = Record<string, unknown>> = {
	// returns a list of items
	results: Array<T>;
	// as well as the initial pagination data that generated the list
	pagination: DbPaginationOpts;
	// and the total amount found
	totalItems: number;
	// and whether there are more to obtain
	hasMore: boolean;
};
export type PaginationHandlerOpts = {
	initialValue?: DbPaginationOpts;
};
export class PaginationHandler
{
	public pagination: DbPaginationOpts;

	public static getDefaultPagination(): DbPaginationOpts
	{
		return {
			page: 1,
			pageSize: 10,
			sortBy: undefined,
			sortOrder: undefined,
			totalRows: 20
		};
	}

	constructor(opts: PaginationHandlerOpts)
	{
		if(opts.initialValue)
		{
			this.pagination = opts.initialValue;
		}
		else
		{
			this.pagination = PaginationHandler.getDefaultPagination();
		}
	}

	public updatePagination(newPagination: DbPaginationOpts): void
	{
		if(!newPagination)
		{
			return;
		}

		if(newPagination.page)
		{
			this.setPage(newPagination.page);
		}

		if(newPagination.pageSize)
		{
			this.setPageSize(newPagination.pageSize);
		}

		if(newPagination.sortBy)
		{
			this.setSort(newPagination.sortBy);
		}

		if(newPagination.sortOrder)
		{
			this.setSortDirection(newPagination.sortOrder === 'asc' ? 'asc' : 'desc');
		}

		if(newPagination.totalRows)
		{
			this.setTotal(newPagination.totalRows);
		}
	}

	public incrementPage()
	{
		if(!this.isDone)
		{
			this.pagination.page = (this.pagination.page ?? 0) + 1;
		}
	}

	public get totalPages(): number
	{
		if(!(
			this.pagination.pageSize &&
			this.pagination.totalRows
		))
		{
			return 0;
		}

		return Math.ceil(this.pagination.totalRows / this.pagination.pageSize);
	}

	public get isDone(): boolean
	{
		if(!(
			this.pagination.page &&
			this.pagination.pageSize &&
			this.pagination.totalRows
		))
		{
			return false;
		}

		return ((this.pagination.page ?? 0) >= this.totalPages);
	}

	public setTotal(value: number): void
	{
		this.pagination.totalRows = value;
	}

	public setPage(value: number): void
	{
		if(value <= this.totalPages)
		{
			this.pagination.page = value;
		}
	}

	public setPageSize(value: number): void
	{
		this.pagination.pageSize = value;
	}

	public setSort(value: string): void
	{
		this.pagination.sortBy = value;
	}

	public setSortDirection(value: DbPaginationOpts['sortOrder']): void
	{
		this.pagination.sortOrder = value;
	}
}