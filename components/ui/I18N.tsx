import { i18n } from "@/i18n";
import { Utils } from "@/zencore/Utils";
import { Typography } from "@mui/joy";
import { JSX } from "react";

export default function I18N({
	sid,
	size,
	ml,
	mr,
	mt,
	mb,
}: {
	sid: string;
	size?: number;
	ml?: 'sm' | 'md' | 'lg';
	mr?: 'sm' | 'md' | 'lg';
	mt?: 'sm' | 'md' | 'lg';
	mb?: 'sm' | 'md' | 'lg';
}): JSX.Element
{
	const i18nValue = Utils.dotPick(i18n, sid);
	const fontSize = size ?? 14;

	const classes = Object.keys({ ml, mr, mt, mb }).reduce((acc, key) =>
	{
		if(key === 'ml' && ml) return `${acc} ml-${ml}`;
		else if(key === 'mr' && mr) return `${acc} mr-${mr}`;
		else if(key === 'mt' && mt) return `${acc} mt-${mt}`;
		else if(key === 'mb' && mb) return `${acc} mb-${mb}`;

		return acc;
	}, '');

	return (
		<Typography
			fontSize={14}
			className={classes}
		>{`${i18nValue}`}</Typography>
	);
}