function getCurrentSecond(): number
{
	return Math.floor(Date.now() / 1000);
}

const logs: unknown[] = [];
export function log(...msgs: unknown[])
{
	logs.push(...msgs);
}
export function printLogs()
{
	console.log(...logs);
}

export function getArg(name: string): string | undefined
{
	return process.argv.slice(2)
		.find((arg) => arg.startsWith(`--${name}=`))
		?.split('=')[1];
}
export function getHeapUsed()
{
	return Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
}

export function assert(condition: unknown, msg?: string, data?: unknown)
{
	if(!condition)
	{
		if(data) console.log(data);
		throw new Error(`Assertion failed${msg ? `: ${msg}` : ''}`);
	}
}

export function faker()
{
	return {
		string: () => Math.random().toString(36).substring(2, 15),
		number: (min?: number, max?: number) => (
			Math.floor(Math.random() * ((max ?? 1000) - (min ?? 0))) + (min ?? 0)
		),
		boolean: () => Math.random() > 0.5,
		timestamp: () => getCurrentSecond(),
	};
}
