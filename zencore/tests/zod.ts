import { z } from 'zod';
import { ItemHandler } from '../Item';
import { RamDatabase } from '../MemoryDatabase';
import { Uuid, Utils } from '../Utils';
import { addEffort } from './effort';

export function zodItemTest(opts: {
	itemSchema: z.ZodTypeAny;
	getItemData: () => Record<string, unknown>;
})
{
	const itemData = opts.getItemData();
	const item = opts.itemSchema.safeParse(itemData);
	if(!item.success)
	{
		// console.log('Zod validation failed:', item.error);
		return;
	}
	const itemHandler = new ItemHandler({
		id: itemData.id as string,
		typeId: itemData.typeId as string,
		db: new RamDatabase({}),
		initialData: itemData,
	});
	itemHandler.setData(itemData);
}

const defaultBasicItemSchema = z.object({
	id: z.string(),
	typeId: z.literal('Item'),
	createdAt: z.number(),
	updatedAt: z.number(),
});

export const defaultItemSchema = z.object({
	id: z.string(),
	typeId: z.literal('Item'),
	createdAt: z.number(),
	updatedAt: z.number(),
	subItems: z.optional(z.array(defaultBasicItemSchema)),
});

function getFakeSubItems(num: number): Record<string, unknown>[]
{
	return Array.from({ length: Math.floor(Math.random() * num) }, () => ({
		id: Uuid.generateUuid(),
		typeId: 'Item',
		createdAt: Utils.getCurrentSecond() - Math.floor(Math.random() * 1000),
		updatedAt: Utils.getCurrentSecond(),
	}));
}

export function zodTest(opts: {
	itemData?: Record<string, unknown>;
	numTests?: number;
})
{
	const start = Date.now();

	const getItemData = () => 
	{
		return {
			id: Uuid.generateUuid(),
			typeId: 'Item',
			createdAt: Utils.getCurrentSecond() - Math.floor(Math.random() * 1000),
			updatedAt: Utils.getCurrentSecond(),
			...(opts.itemData || {}),
			subItems: getFakeSubItems(Math.floor(20 + (Math.random() * 50))),
			foo: 'bar',
		};
	};

	for(let i = 0; i < (opts.numTests || 1); i++)
	{
		zodItemTest({
			itemSchema: defaultItemSchema,
			getItemData,
		});
	}

	addEffort('zodTest', Date.now() - start);
}
