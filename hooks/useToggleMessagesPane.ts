import { useColorScheme } from "@mui/joy";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function useToggleMessagesPane()
{
	function openMessagesPane()
	{
		if(typeof window !== 'undefined')
		{
			document.body.style.overflow = 'hidden';
			document.documentElement.style.setProperty('--MessagesPane-slideIn', '1');
		}
	}

	function closeMessagesPane()
	{
		if(typeof window !== 'undefined')
		{
			document.documentElement.style.removeProperty('--MessagesPane-slideIn');
			document.body.style.removeProperty('overflow');
		}
	}

	function toggleMessagesPane()
	{
		if(typeof window !== 'undefined' && typeof document !== 'undefined')
		{
			const slideIn = window
				.getComputedStyle(document.documentElement)
				.getPropertyValue('--MessagesPane-slideIn');
			if(slideIn)
			{
				closeMessagesPane();
			} else
			{
				openMessagesPane();
			}
		}
	}

	return {
		openMessagesPane,
		closeMessagesPane,
		toggleMessagesPane,
	};
}