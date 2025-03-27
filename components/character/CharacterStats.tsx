import { Stack } from "@mui/joy";
import { CharacterStat } from "./CharacterStat";
import CharacterName from "./CharacterName";
import CharacterAvatar from "./CharacterAvatar";
import { Item } from "@/zencore/ItemTypes";
import { Character } from "@/zencore/arch/Character";

export type CharacterStatsProps = {
	character: Item<Character>;
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
					character={props.character}
					variant="h4"
				/>
				<CharacterStat
					character={props.character}
					statType="health"
					width={statWidth}
				/>
				<CharacterStat
					character={props.character}
					statType="mana"
					width={statWidth}
				/>
			</Stack>
			<Stack spacing={1} direction="column">
				<CharacterStat
					character={props.character}
					statType="agility"
					width={statWidth}
				/>
				<CharacterStat
					character={props.character}
					statType="strength"
					width={statWidth}
				/>
				<CharacterStat
					character={props.character}
					statType="intelligence"
					width={statWidth}
				/>
			</Stack>
		</Stack>
	);
}
