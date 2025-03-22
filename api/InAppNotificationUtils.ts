import {
	ITEM_TYPE,
	InAppNotification,
	InAppNotificationHandler
} from "@/zencore/arch/InAppNotification";
import { DrizzleHandler } from "@/api/DrizzleInterface";
import { DbFilterOperator } from "@/zencore/Filters";
import { Uuid } from "@/zencore/Utils";


export async function createNotification(
	data: Partial<InAppNotification>
): Promise<InAppNotificationHandler | undefined>
{
	const handler = new InAppNotificationHandler({
		id: Uuid.generateUuid(),
		db: new DrizzleHandler({}),
	});

	handler.setData(data);

	// validate that it is a valid notification
	const notification = handler.getData();

	if(
		!notification.title ||
		!notification.message ||
		!notification.date
	)
	{
		return undefined;
	}

	await handler.save();

	return handler;
}

export async function getUnreadNotifications(): Promise<InAppNotificationHandler[]>
{
	const db = new DrizzleHandler({});
	const notifications = await db.selectMultiple({
		itemType: ITEM_TYPE,
		filters: [
			{
				key: 'readAt',
				operator: DbFilterOperator.isEqual,
				value: null,
			}
		],
	});

	return (notifications?.results || [])
		.map((notification) => (
			typeof notification.id === 'string' ?
				new InAppNotificationHandler({
					id: notification.id,
					db,
				}) :
				undefined
		))
		.filter((handler) => handler) as InAppNotificationHandler[];
}