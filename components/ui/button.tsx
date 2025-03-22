import { ButtonProps, Button as JoyButton } from "@mui/joy";
import { forwardRef } from "react";

const Button = forwardRef<typeof JoyButton, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<JoyButton
				// className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...{
					variant: 'soft',
					color: 'neutral',
					...props,
				}}
				style={{whiteSpace:'nowrap'}}
			/>
		);
	},
);

Button.displayName = "Button";

export { Button };
