import { LinearProgress, Stack } from "@mui/joy";
import I18N from "../ui/I18N";

export type CharacterStatProps = {
	statType: 'health' | 'mana' | 'strength' | 'agility' | 'intelligence';
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

function renderStat(statType: string)
{
	const vars = defaultProps[statType as keyof typeof defaultProps];

	return (
		<Stack spacing={0.5} direction="column" sx={{ width: '100%' }}>
			<I18N sid={`character.stats.${vars?.name}.title`} sx={{ paddingLeft: '8px' }} />
			<LinearProgress
				thickness={20}
				value={50}
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
	return (
		<Stack spacing={2} direction="row" sx={{ width: props.width || '500px' }}>
			{renderStat(props.statType)}
		</Stack>
	);
}
