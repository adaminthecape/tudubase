'use client';

import { cache } from "@/cache/actions/Generic";

export default function Cache()
{
	return (
		<>
			<pre>{JSON.stringify(cache.cacheByType, null, 2)}</pre>
		</>
	);
}