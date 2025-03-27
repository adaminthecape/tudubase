import { Chip, LinearProgress, Stack } from "@mui/joy";
import I18N from "../ui/I18N";
import { Character } from "@/zencore/arch/Character";
import { Item, ItemTypes } from "@/zencore/ItemTypes";
import { cache } from "@/cache/actions/Generic";
import { useEffect, useState } from "react";

type CharacterStatType = 'health' | 'mana' | 'strength' | 'agility' | 'intelligence';

export type CharacterStatProps = {
	character: Item<Character>;
	statType: CharacterStatType;
	width?: string;
};

const defaultProps = {
	health: {
		name: 'Health',
		color: 'danger',
	},
	mana: {
		name: 'Mana',
		color: 'primary',
	},
	strength: {
		name: 'Strength',
		color: 'warning',
	},
	agility: {
		name: 'Agility',
		color: 'neutral',
	},
	intelligence: {
		name: 'Intelligence',
		color: 'success',
	},
};

function renderStat(
	character: Item<Character>,
	statType: CharacterStatType
)
{
	const vars = defaultProps[statType as keyof typeof defaultProps];

	return (
		<Stack spacing={0.5} direction="column" sx={{ width: '100%' }}>
			<I18N sid={`character.stats.${vars?.name}.title`} sx={{ paddingLeft: '8px' }} />
			<LinearProgress
				thickness={20}
				value={character[statType] ?? 1}
				size="lg"
				variant="soft"
				color={vars?.color || 'neutral'}
				determinate
			/>
		</Stack>
	);
}

export function CharacterStat(props: CharacterStatProps)
{
	const {
		character,
		statType,
		width,
	} = props;

	const [statValue, setStatValue] = useState(character[statType]);

	useEffect(() =>
	{
		if(!(
			character?.id &&
			statType &&
			cache?.cacheByType?.[ItemTypes.Character]?.[character.id]
		))
		{
			return;
		}

		const newValue = cache.cacheByType[ItemTypes.Character][character.id][statType];

		if(newValue === statValue)
		{
			return;
		}

		if(newValue)
		{
			setStatValue(newValue as number);
			console.log({ statType, newValue });
		}
	}, []);

	const vars = defaultProps[statType as keyof typeof defaultProps];

	return (
		<Stack
			spacing={2}
			direction="row"
			sx={{ width: width || '500px' }}
		>
			<Stack spacing={0.5} direction="column" sx={{ width: '100%' }}>
				<I18N sid={`character.stats.${vars?.name}.title`} sx={{ paddingLeft: '8px' }} />
				<LinearProgress
					thickness={30}
					value={statValue}
					size="lg"
					variant="soft"
					color={vars?.color || 'neutral'}
					determinate
				>
					<Chip sx={{ padding: 0.25, margin: 0.25 }}>
						{statValue} / 100
					</Chip>
				</LinearProgress>
			</Stack>
		</Stack>
	);
}
