export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
	return (
		<div className="w-full">
			{children}
		</div>
	);
}
