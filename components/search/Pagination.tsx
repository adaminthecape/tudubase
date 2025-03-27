import { DbPaginationOpts } from "@/zencore/Pagination";
import { Button, Chip, Stack } from "@mui/joy";

export type PaginationProps = DbPaginationOpts & {
	setPage: (page: number) => void;
};

export default function Pagination(props: PaginationProps)
{
	const defaultProps: DbPaginationOpts & {
		page: number;
		pageSize: number;
		totalRows: number;
	} = {
		page: 1,
		pageSize: 10,
		sortBy: undefined,
		sortOrder: undefined,
		totalRows: 20,
	};

	const {
		page,
		pageSize,
		sortBy,
		sortOrder,
		totalRows,
	} = {
		page: props.page ?? defaultProps.page,
		pageSize: props.pageSize ?? defaultProps.pageSize,
		sortBy: props.sortBy ?? defaultProps.sortBy,
		sortOrder: props.sortOrder ?? defaultProps.sortOrder,
		totalRows: props.totalRows ?? defaultProps.totalRows,
	};

	return (
		<Stack direction="row" spacing={1}>
			<Button
				disabled={page <= 1}
				onClick={() => props.setPage(page - 1)}
			>Previous</Button>
			<Chip sx={{ paddingRight: 2, paddingLeft: 2 }}>{page}</Chip>
			<Button
				disabled={(page * pageSize) >= totalRows}
				onClick={() => props.setPage(page + 1)}
			>Next</Button>
		</Stack>
	);
}