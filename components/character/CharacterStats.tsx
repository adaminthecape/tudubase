import { Stack } from "@mui/joy";
import { CharacterStat } from "./CharacterStat";

export type CharacterStatsProps = {
};

export function CharacterStats(props: CharacterStatsProps)
{
	return (
		<Stack spacing={1} direction="row">
			<CharacterStat statType="health" />
			<CharacterStat statType="mana" />
			<CharacterStat statType="agility" />
			<CharacterStat statType="strength" />
			<CharacterStat statType="intelligence" />
		</Stack>
	);
}
