import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';
import { tasksTable } from '../schema';

export async function getTasksForLast24Hours(
	page = 1,
	pageSize = 5,
): Promise<
	Array<{
		id: number | null;
		title: string | null;
	}>
>
{
	return db
		.select({
			id: tasksTable.id,
			title: tasksTable.title,
		})
		.from(tasksTable)
		.where(between(tasksTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
		.orderBy(asc(tasksTable.title), asc(tasksTable.id))
		.limit(pageSize)
		.offset((page - 1) * pageSize);
}
