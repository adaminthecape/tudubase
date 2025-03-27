import { useEffect } from "react";

export default function Parchment({
	children,
	height,
	width,
}: {
	children?: React.ReactNode;
	height?: string;
	width?: string;
})
{
	function scrollHeight() {
		const content = document.querySelector('#parchment');
		const container = document.querySelector('#contain');

		if(!content || !container) return;

		// SVG feTurbulence can modify all others elements, for this reason
		// "parchment" is in another <div> and in absolute position.
		// so for a better effect, absolute height is defined by his content.
		// @ts-ignore
		content.style.height = container.offsetHeight + 'px';
	}

	// Redraw when viewport is modified
	window.addEventListener('resize', scrollHeight);
	useEffect(scrollHeight, []);

	return (
		<>
			<div id="parchment" style={{ height, width }}></div>
			<div id="contain" style={{ height, width }}>
				{children}
			</div>

			<svg>
				<filter id="wavy2">
					<feTurbulence x="0" y="0" baseFrequency="0.02" numOctaves="5" seed="1" />
					<feDisplacementMap in="SourceGraphic" scale="20" />
				</filter>
			</svg>
		</>
	);
}