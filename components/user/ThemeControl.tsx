"use client";

import { Button, ButtonGroup } from "@mui/joy";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import I18N from "../ui/I18N";

const ThemeControl = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() =>
	{
		setMounted(true);
	}, []);

	if(!mounted) 
	{
		return null;
	}

	const ICON_SIZE = 16;

	return (
		<ButtonGroup variant="soft" aria-label="Basic button group">
			<Button
				variant="soft"
				size={"md"}
				className="gap-1"
				color={theme === 'light' ? 'primary' : 'neutral'}
				onClick={() => setTheme('light')}
			>
				<Sun
					key="light"
					size={ICON_SIZE}
					className={"text-muted-foreground"}
				/>
				<I18N sid={`theme.light.label`} />
			</Button>
			<Button
				variant="soft"
				size={"md"}
				className="gap-1"
				color={theme === 'dark' ? 'primary' : 'neutral'}
				onClick={() => setTheme('dark')}
			>
				<Moon
					key="dark"
					size={ICON_SIZE}
					className={"text-muted-foreground"}
				/>
				<I18N sid={`theme.dark.label`} />
			</Button>
			<Button
				variant="soft"
				size={"md"}
				className="gap-1"
				color={theme === 'system' ? 'primary' : 'neutral'}
				onClick={() => setTheme('system')}
			>
				<Laptop
					key="system"
					size={ICON_SIZE}
					className={"text-muted-foreground"}
				/>
				<I18N sid={`theme.system.label`} />
			</Button>
		</ButtonGroup>
	);
};

export { ThemeControl };
