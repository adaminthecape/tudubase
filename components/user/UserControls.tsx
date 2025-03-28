'use client';

import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from "@mui/joy";
import { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import { ThemeControl } from "./ThemeControl";

export default function UserControls({
	userId,
	userEmail,
}: {
	userId?: string;
	userEmail?: string;
})
{
	const [open, setOpen] = useState(false);

	const toggleDrawer = (inOpen: boolean) => (
		event: React.KeyboardEvent | React.MouseEvent
	) =>
	{
		if (
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
			(event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setOpen(inOpen);
	};

	return (
		<>
			<IconButton
				variant="soft"
				color="neutral"
				className="gap-1 mr-xs"
				size="sm"
				onClick={toggleDrawer(true)}
			>
				<div />
				{userId && <Typography fontSize={14}>{userEmail}</Typography>}
				<SettingsIcon />
				<div />
			</IconButton>
			<Drawer
				anchor="right"
				color="primary"
				invertedColors={false}
				variant="plain"
				open={open}
				onClose={toggleDrawer(false)}
			>
				<Box
					role="presentation"
					onKeyDown={toggleDrawer(false)}
				>
					{/* <div style={{
						position: 'absolute',
						right: 0,
						top: 0,
					}}>
						<IconButton
							variant={'plain'}
							color={'neutral'}
							size="md"
							onClick={() => toggleDrawer(false)}
						>
							{'X'}
						</IconButton>
					</div> */}
					<List>
						<ListItem>
							{/* <ListItemButton></ListItemButton> */}
							<ThemeControl />
						</ListItem>
					</List>
					<Divider />
					<List>
						{['All mail', 'Trash', 'Spam'].map((text) => (
						<ListItem key={text}>
							<ListItemButton>{text}</ListItemButton>
						</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
		</>
	);
}