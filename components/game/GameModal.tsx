import { Button, Stack, Typography } from "@mui/joy";
import { JSX, useState } from "react";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import React from "react";
import GameProgressBar from "./ProgressBar";
import Reward from "./Reward";

export type GameModalProps = {
	activator: JSX.Element;
	label?: string | undefined;
};

export default function GameModal(props: GameModalProps)
{
	const {
		activator,
		label,
	} = props;

	const [isModalOpen, setIsModalOpen] = useState(false);

	const defaults = {
		char: {
			name: "Hero",
			sprite: "🧙‍♂️",
			health: 10,
			mana: 50,
		},
		monster: {
			name: "Goblin",
			sprite: "👹",
			health: 8,
			mana: 30,
		},
	};

	// Upon choosing the attack, show the attack animation and update the health of the target monster
	// Upon being attacked, show the attack animation and update the health of the current character
	const [character, setCharacter] = useState(defaults.char);

	const [monster, setMonster] = useState(defaults.monster);

	const [heroLoading, setHeroLoading] = useState(false);
	const [monsterLoading, setMonsterLoading] = useState(false);

	function rand(min: number, max: number)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getHealth()
	{
		return {
			character: character.health,
			monster: monster.health,
		}
	}

	async function handleHeroAttack()
	{
		restartTimer();
		setHeroLoading(true);

		setMonster((prev) =>
		{
			const health = Math.max(prev.health - rand(0, 3), 0);

			return { ...prev, health };
		});

		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Simulate counterattack on monster
		setCharacter((prev) =>
		{
			const health = Math.max(prev.health - rand(0, 1), 0);

			return { ...prev, health };
		});

		setHeroLoading(false);
	};

	async function handleMonsterAttack()
	{
		restartTimer();
		setMonsterLoading(true);

		setCharacter((prev) =>
		{
			const health = Math.max(prev.health - rand(0, 1), 0);

			return { ...prev, health };
		});

		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Simulate counterattack on monster
		setMonster((prev) =>
		{
			const health = Math.max(prev.health - rand(0, 1), 0);

			return { ...prev, health };
		});

		setMonsterLoading(false);
	};

	const [progressKey, setProgressKey] = useState(0);

	function restartTimer()
	{
		setProgressKey((prev) => prev + 1);
	}

	const [lastAttacker, setLastAttacker] = useState('');
	const [isDone, setIsDone] = useState(false);

	async function attackIfReady(): Promise<boolean>
	{
		console.log('state 1:', character.health, monster.health);

		const isDone = (
			character.health <= 0 ||
			monster.health <= 0
		);

		console.log('done:', isDone);

		if(isDone)
		{
			setIsDone(true);
			return true;
		}

		if(lastAttacker === 'hero')
		{
			await handleMonsterAttack();
			setLastAttacker('monster');
		}
		else
		{
			await handleHeroAttack();
			setLastAttacker('hero');
		}

		console.log('state 2:', character.health, monster.health);

		return false;
	}

	return (
		<React.Fragment>
			<div
				style={{ cursor: 'pointer' }}
				onClick={() => setIsModalOpen(true)}
			>{activator}</div>
			<Modal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			>
				<ModalDialog variant="plain">
					<ModalClose />
					{label}
					{/* // Create a view which shows:
					// On the left, the current character, its name and sprite
					// On the right, the target monster, its name and sprite
					// Below each sprite, show action bar (for now only basic attack)
					// Below each sprite, show health and mana bars */}
					{!(character.health <= 0 || monster.health <= 0) ? <Stack
						direction={'column'}
						sx={{
							justifyContent: 'center',
							alignContent: 'center',
							alignItems: 'center',
						}}
						className="w-full"
					>
						<Stack>
							<Button onClick={attackIfReady}>Start</Button>
						</Stack>
						<Stack
							sx={{
								minWidth: '80dvw',
								maxWidth: '600px',
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-around',
								alignItems: 'center',
								padding: 2,
							}}
						>
							{/* Character Section */}
							<div style={{ textAlign: 'center' }}>
								<Typography fontSize={24}>{character.name}</Typography>
								<div style={{ fontSize: '10rem' }}>{character.sprite}</div>
								<div className="mb-2">
									<Button
										loading={heroLoading}
										onClick={handleHeroAttack}
									>Basic Attack</Button>
								</div>
								<Typography fontSize={24}>Health: {character.health}</Typography>
								<Typography fontSize={24}>Mana: {character.mana}</Typography>
							</div>

							{/* Monster Section */}
							<div style={{ textAlign: 'center' }}>
								<Typography fontSize={24}>{monster.name}</Typography>
								<div style={{ fontSize: '10rem' }}>{monster.sprite}</div>
								<div className="mb-2">
									<Button
										loading={monsterLoading}
										onClick={handleMonsterAttack}
									>Basic Attack</Button>
								</div>
								<Typography fontSize={24}>Health: {monster.health}</Typography>
								<Typography fontSize={24}>Mana: {monster.mana}</Typography>
							</div>
						</Stack>
						<Stack
							direction="row"
							sx={{
								justifyContent: 'center',
								alignContent: 'center',
								alignItems: 'center',
							}}
							className="w-full"
						>
							<GameProgressBar
								key={progressKey}
								timeout={2000}
							/>
						</Stack>
					</Stack> :
					<Stack
						direction={'column'}
						sx={{
							justifyContent: 'center',
							alignContent: 'center',
							alignItems: 'center',
						}}
						className="w-full"
					>
						<Stack>
							<Button onClick={attackIfReady}>Start</Button>
						</Stack>
						<Stack
							sx={{
								minWidth: '80dvw',
								maxWidth: '600px',
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-around',
								alignItems: 'center',
								padding: 2,
							}}
						>
							{/* Character Section */}
							<div style={{ textAlign: 'center' }}>
								<Typography fontSize={24}>{character.name}</Typography>
								<div style={{ fontSize: '10rem' }}>{character.sprite}</div>
								<Typography fontSize={24}>Victorious</Typography>
							</div>

							{/* Monster Section */}
							<div style={{ textAlign: 'center' }}>
								<Typography fontSize={24}>{monster.name}</Typography>
								<div style={{ fontSize: '10rem' }}>{monster.sprite}</div>
								<Typography fontSize={24}>Dead</Typography>
							</div>
							</Stack>
							<Stack className="mt-2">
								{/* Reward Section */}
								<div style={{ textAlign: 'center' }}>
									<Typography fontSize={20}>Reward</Typography>
									<Reward />
									<Typography fontSize={20}>+10 Gold</Typography>
								</div>
							</Stack>
					</Stack>}
				</ModalDialog>
			</Modal>
		</React.Fragment>
	);
}