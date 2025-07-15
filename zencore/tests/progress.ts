import { RamDatabase } from "../MemoryDatabase";
import { getEffortTotals } from "./effort";
import { getArg, getHeapUsed } from "./utils";

const progress = {
	numTests: 0,
	numToAddMin: 0,
	numToAddMax: 0,
	currentTest: 0,
	startTime: 0,
	endTime: 0,
	took: 0,
	percent: 0,
	cacheLen: 0,
	cacheKb: 0,
	heapUsed: 0,
	heapMax: 0,
	message: '',
};
function getProgress(key: keyof typeof progress): typeof progress[typeof key]
{
	return progress[key];
}
function setProgress(key: keyof typeof progress, value: unknown)
{
	(progress as any)[key] = value;
}
function printProgress(progress: number, text?: string): void
{
	process.stdout.clearLine(0);
	process.stdout.cursorTo(0);
	process.stdout.write(progress + ' % ... ' + (text || ''));
}
function printTestProgress(db: RamDatabase)
{
	progress.cacheLen = countItemsInCache(db)._total;
	progress.cacheKb = Math.floor(JSON.stringify(db.cacheByType).length / 1024);
	progress.percent = Math.floor(progress.currentTest * (100 / progress.numTests));
	progress.heapUsed = getHeapUsed();
	progress.heapMax = Math.max(progress.heapMax, progress.heapUsed);
	progress.message = [
		`Test ${progress.currentTest + 1}`,
		`T + ${Date.now() - progress.startTime} ms`,
		`Cached items ${progress.cacheLen} (${progress.cacheKb} KB)`,
		`${progress.heapUsed} MB used`,
	].join(' | ');
	printProgress(progress.percent, progress.message);
}
function startProgress(db: RamDatabase)
{
	progress.startTime = Date.now();
	progress.heapMax = getHeapUsed();
	progress.numTests = parseInt(getArg('tests') ?? '100', 10);
	progress.numToAddMin = parseInt(getArg('addFrom') ?? '0', 10);
	progress.numToAddMax = parseInt(getArg('addTo') ?? '100', 10);
	console.log([
		'Starting tests ...',
		`${progress.numTests} iterations`,
		`${progress.numToAddMin}-${progress.numToAddMax} items/test`,
	].join(' | '));
	printTestProgress(db);
}
function countItemsInCache(db: RamDatabase)
{
	const itemTypes = Object.keys(db.cacheByType);

	const results: Record<string, number> = {};
	let _total = 0;

	itemTypes.forEach((typeId) =>
	{
		const itemIds = Object.keys(db.cacheByType[typeId] || {});

		results[typeId] = itemIds.length;
		_total += itemIds.length;
	});

	return {
		...results,
		_total
	};
}
function printFinalProgress(db: RamDatabase)
{
	progress.percent = 100;
	progress.endTime = Date.now();
	// const systemEffort = getEffortTotals().systemTest || 0;
	progress.took = (progress.endTime - progress.startTime);
	const itemsInCache = countItemsInCache(db);
	const itemsAddedPerTest = (itemsInCache._total / progress.took);
	const itemsPerSec = (itemsAddedPerTest * 1000).toLocaleString('en-US', { maximumFractionDigits: 0 });
	const timePerTest = Math.ceil(progress.took / progress.numTests);
	console.log([
		`Tests: ${progress.numTests}`,
		`Took: ${progress.took} ms`,
		`${timePerTest} ms/test`,
		`${itemsPerSec} items/sec`,
		`${progress.heapMax} MB max RAM`,
	].join(' | '));
	console.log('Total Effort (ms):', getEffortTotals());
	console.log('Items in cache (#):', itemsInCache);
}

export
{
	printFinalProgress,
	printProgress,
	printTestProgress,
	startProgress,
	countItemsInCache,
	getProgress,
	setProgress,
};
