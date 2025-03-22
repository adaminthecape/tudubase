import { FieldData } from "@/zencore/ItemTypes";
import { Typography } from "@mui/joy";
import { JSX } from "react";

export default function Text(props: {
	field: FieldData;
	value?: any;
}): JSX.Element
{
	return (
		<Typography
			// TODO: add variants
			variant="soft"
			className="text-sm"
		>{`${props.value}`}</Typography>
	);
}