import { Character } from "@/zencore/arch/Character";
import { Item } from "@/zencore/ItemTypes";
import { Typography } from "@mui/joy";

export default function CharacterName({
	variant,
	character,
	marginBottom,
	marginTop,
}: {
	variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	character: Item<Character>;
	marginBottom?: number;
	marginTop?: number;
})
{
	return (
		<div>
			{/* Character Name */}
			<Typography
				variant={variant ?? 'h6'}
				sx={{ marginBottom: 1, marginTop: 1.25 }}
			>{character.name}</Typography>
		</div>
	);
}