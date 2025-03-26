import { i18n } from "@/i18n";
import { Utils } from "@/zencore/Utils";
import { Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { TypographyOwnProps } from "@mui/material";
import { JSX } from "react";

export default function I18N(props: TypographyOwnProps & {
	sid: string;
	sx?: SxProps;
}): JSX.Element
{
	const {
		sid,
	} = props;

	const i18nValue = Utils.dotPick(i18n, sid);
	const fontSize = 14;

	return (
		<Typography
			{...{
				...props,
				fontSize: props.fontSize ?? fontSize,
			}}
			sx={props.sx}
		>{`${i18nValue}`}</Typography>
	);
}