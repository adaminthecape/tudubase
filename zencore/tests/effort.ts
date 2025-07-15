
let effort: Record<string, number> = {};
const effortTotals: Record<string, number> = {};
function timer(type: string)
{
	return {
		type,
		started: Date.now(),
		ended: 0,
		elapsed: 0,
		end()
		{
			this.ended = Date.now();
			this.elapsed = (this.ended - this.started);
		},
		effort(type?: string)
		{
			this.end();
			addEffort(type || this.type, this.elapsed);
		},
		lastPing: Date.now(),
		ping(msg = '', prefix = '')
		{
			const time = Date.now() - this.lastPing;

			if(!time) return;

			console.log(`${prefix}${this.type}:${msg ? ` ${msg}:` : ''} took:`, time, '| elapsed:', this.elapsed);
		}
	};
}
function addEffort(type: string, amount: number)
{
	if(!effort[type])
	{
		effort[type] = 0;
	}

	effort[type] += amount;
}
function addEffortTotal(type: string, amount: number)
{
	if(!effortTotals[type])
	{
		effortTotals[type] = 0;
	}

	effortTotals[type] += amount;
}
function flushEffort()
{
	Object.keys(effort).forEach((key) =>
	{
		addEffortTotal(key, effort[key]);
	});

	effort = {};
}
function getEffort()
{
	return effort;
}
function getEffortTotals()
{
	return effortTotals;
}

export
{
	timer,
	addEffort,
	addEffortTotal,
	flushEffort,
	getEffort,
	getEffortTotals,
}