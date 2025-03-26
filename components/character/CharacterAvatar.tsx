import { Stack } from "@mui/joy";

export default function CharacterAvatar()
{
	return (
		<Stack
			style={{
				width: 100,
				height: 100,
				backgroundColor: 'gray',
				borderRadius: '50%',
			}}
			padding={2}
		></Stack>
	);
}