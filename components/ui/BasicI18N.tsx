import { i18n } from "@/i18n";
import { Utils } from "@/zencore/Utils";

export default function BasicI18N(props: {
	sid: string;
})
{
	const {
		sid,
	} = props;

	const i18nValue = Utils.dotPick(i18n, sid);
	const fontSize = 14;

	return (
		<span>{`${i18nValue}`}</span>
	);
}