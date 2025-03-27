import { Stack } from "@mui/joy";
import { SxProps } from "@mui/material";

export function CharacterView({
	children,
	sx,
}: {
	children: React.ReactNode;
	sx?: SxProps;
})
{
	return (
		<Stack
			spacing={1}
			direction="column"
			sx={sx}
		>
			{children}
		</Stack>
	);
}
