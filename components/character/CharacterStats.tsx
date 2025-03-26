import { Stack } from "@mui/joy";
import { CharacterStat } from "./CharacterStat";
import CharacterName from "./CharacterName";
import CharacterAvatar from "./CharacterAvatar";

export type CharacterStatsProps = {
};

export function CharacterStats(props: CharacterStatsProps)
{
	const statWidth = '38vw';

	return (
		// Display:
		// ------  Name                Agility
		// Avatar  Health              Strength
		// ------  Mana                Intelligence
		<Stack
			direction="row"
			spacing={3}
			padding={2}
			alignItems="center"
			alignContent="center"
		>
			<Stack spacing={1} direction="column" padding={1}>
				<CharacterAvatar />
			</Stack>
			<Stack spacing={1} direction="column">
				<CharacterName
					character={{ name: "Character Name" }}
					variant="h4"
				/>
				<CharacterStat statType="health" width={statWidth} />
				<CharacterStat statType="mana" width={statWidth} />
			</Stack>
			<Stack spacing={1} direction="column">
				<CharacterStat statType="agility" width={statWidth} />
				<CharacterStat statType="strength" width={statWidth} />
				<CharacterStat statType="intelligence" width={statWidth} />
			</Stack>
		</Stack>
	);
}
