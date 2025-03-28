import { LinearProgress } from "@mui/joy";
import { useEffect, useState } from "react";

export type GameProgressBarProps = {
	timeout: number;
	min?: number;
	max?: number;
};

export default function GameProgressBar(props: GameProgressBarProps)
{
	const min = props.min ?? 0;
	const max = props.max ?? 100;
	const timeout = props.timeout ?? 2000;

	const [value, setValue] = useState(min);

	function incrementValue()
	{
		setValue((prev) => Math.min(prev + 1, max));
	}

	function resetValue()
	{
		setValue(min);
	}

	function incrementOverTime(time: number = 2000)
	{
		const intervalTime = time / (max - min);
		const interval = setInterval(() => {
			incrementValue();
		}, intervalTime);

		setTimeout(() => {
			clearInterval(interval);
		}, time * (max - value));
	}

	useEffect(incrementOverTime, []);

	return (
		<LinearProgress
			value={value}
			variant="soft"
			determinate
		>
		</LinearProgress>
	);
}