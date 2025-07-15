# Tudu: Record of Changes

## March 19, 2025

- Set up initial Next.js project with opts: `npx create-next-app@latest tudubase --ts --tailwind --eslint --app --src-dir --use-npm -e with-supabase`
- Added proposition and changelog documents
- Set up zencore - moved into separate files & cleaned up
- Set up Drizzle ORM
- Set up a Postgres schema through Drizzle
- Hook up database and test that it works
- Set up a central function to get an Item handler
- Set up Item handlers for a Task
- Ensure that you can change a Task's data with the handler
- Set up helper functions for search filters and for Item handler deduction
	- Should now be able to easily work with any Items with hardcoded validation

## March 20, 2025

- Set up all db schemas & migrated initial tables on Supabase
- Set up Joy UI components for use
- Agonizing practice with React and reactivity

## March 21, 2025

- Set up Form components and inputs for some FieldTypes
- Make a component that edits a value based on its FieldType (`GenericInput` & others)
- Make a component that decides which component to show based on its FieldType (`resolveField()`)
- Make a component that shows a list of the above component based on a list of Fields (`FormContainer`)
- Set up a basic layout
	- Navigation with top level and menus
	- Scrollable page with collapsible footer
	- Ensure layout is used for all in-game user routes
- Add dummy pages within the layout
	- Task Messages view
		- TODO: Fill with actual Task data
	- Character view (including loadout/inventory)
		- TODO: Flesh out
	- Rewards view

## March 22, 2025

- Hooked up search functionality w/ Drizzle => Supabase
- Added server functions to manage adding/updating Tasks
- Generalised server functions for all Item types (`Generic.ts`)
- Added TaskActivity handlers & db migration (ran on Supabase)
- Set up some RLS policies
	- TODO: Set up _all_ RLS policies
	- TODO: Test all RLS policies
- Got basic Item crud working
- Amended all naming & types for Messages views to use Collections/Tasks
- Made a basic workable Messages view, pending data

## March 23, 2025

- Added luxon for date picker functionality (https://mui.com/x/react-date-pickers/adapters-locale/)
- Removed luxon & react-date-pickers due to errors in the lib
- Changed to use JoyUI Input datetime-local

## March 25, 2025

- Create an Item Search component
- Added Character components
- Added caching via use-lru-cache
- Abandoned use-lru-cache due to weird implementation
- Implemented own cache solution which took less time to make than reading ulc docs and works better

## March 27, 2025

- Character page
	- Show loadout screen
		- Component to choose any given loadout option
			- Essentially a search container which displays the user's owned equipment
	- Show inventory
		- Proto-rewards page goes here

## In progress

## Todos
- Ensure that the FormContainer manages its fields' data instead of them

- Add error reporting system
- Add error reporting everywhere in zencore
- Add error reporting everywhere else as applicable

## Roadmap

- Profile page
	- Show profile information
	- Allow changing mutable fields
- Game page
	- Show current fight screen
	- Show character loadout on the side (if screen allows)
		- If small screen, use a modal with an activator button
	- Show current active task
		- Show progress ticker & time since started
		- Show potential rewards
- Tasks page
	- Make adding a task easy
	- Make a sidebar to see list of Tasks in active Collection
		- Clicking a Task in the list should scroll to latest interaction with that Task in the Collection messages view
- Settings drawer
	- Add wording
	- Add settings (?)
- Architecture
	- Add vitest & unit tests
	- Add error reporting
	- Add interaction reporting
