const { readdir, stat } = require('fs/promises');
const { join } = require('path');

type DummyFile = {
	name: string;
	isFile: () => boolean;
	isDirectory: () => boolean;
};

const dirSize = async (dir: string) =>
{
	const files = await readdir(dir, { withFileTypes: true });

	const paths = files.map(async (file: DummyFile) =>
	{
		const path = join(dir, file.name);

		if(file.isDirectory()) 
		{
			return await dirSize(path);
		}

		if(file.isFile())
		{
			const { size } = await stat(path);

			return size;
		}

		return 0;
	});

	return (await Promise.all(paths)).flat(Infinity).reduce((i, size) => i + size, 0);
};

type Result = {
	path: string;
	size: number;
	children?: Result[];
};

async function forEachDir(opts: {
	result: Result;
	rootDir: string;
	recursive?: boolean;
}): Promise<void>
{
	const { rootDir, recursive } = opts;
	const files = await readdir(rootDir, { withFileTypes: true });

	const paths = files.map(async (file: DummyFile) =>
	{
		const path = join(rootDir, file.name);

		if(recursive && file.isDirectory() && file.name !== 'node_modules')
		{
			return forEachDir({
				result: opts.result,
				rootDir: path,
				recursive: true,
			});
		}

		if(file.isFile())
		{
			const { size } = await stat(path);

			return size;
		}

		return 0;
	});

	const size = (await Promise.all(paths))
		.flat(Infinity)
		.reduce((i, size) => i + size, 0);

	opts.result.size = size;
	opts.result.path = rootDir;
};

function getArg(name: string): string | undefined
{
	return process.argv.slice(2)
		.find((arg) => arg.startsWith(`--${name}=`))
		?.split('=')[1];
}

function getAppropriateSize(size: number): string
{
	if(size < 1024)
	{
		return `${size} B`;
	}
	else if(size < 1024 * 1024)
	{
		return `${Math.floor(size / 1024)} KB`;
	}
	else if(size < 1024 * 1024 * 1024)
	{
		return `${Math.floor(size / 1024 / 1024)} MB`;
	}
	else
	{
		return `${Math.floor(size / 1024 / 1024 / 1024)} GB`;
	}
}

async function run()
{
	const dir = getArg('dir') || '.';
	const size = await dirSize(dir);
	const results = {
		dir,
		size,
		sizeInKB: Math.floor(size / 1024),
		sizeInMB: Math.floor(size / 1024 / 1024),
		sizeInGB: Math.floor(size / 1024 / 1024 / 1024),
		appro: getAppropriateSize(size),
	};

	console.log(results);
}

run();