import { Stack } from "@mui/joy";

export function CharacterView({
	children,
}: {
	children: React.ReactNode;
})
{
	return (
		<Stack spacing={1} direction="row">
			{children}
		</Stack>
	);
}
