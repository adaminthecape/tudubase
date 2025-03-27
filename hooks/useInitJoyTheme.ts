import { useColorScheme } from "@mui/joy";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function useInitJoyTheme()
{
	const { mode, setMode } = useColorScheme();
	const { theme, setTheme } = useTheme();

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

	return {
		joyTheme: mode,
		setJoyTheme,
		baseTheme: theme,
		setBaseTheme: setTheme,
	};
}