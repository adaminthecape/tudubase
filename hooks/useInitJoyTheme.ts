import { useColorScheme } from "@mui/joy";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function useInitJoyTheme()
{
	const { setMode } = useColorScheme();
	const { theme } = useTheme();

	function setJoyTheme(t: unknown)
	{
		if(
			typeof t === 'string' &&
			['light', 'dark', 'system'].includes(t)
		)
		{
			setMode(t as 'light' | 'dark' | 'system');
		}
	}

	useEffect(() =>
	{
		setJoyTheme(theme);
	}, [theme]);
}