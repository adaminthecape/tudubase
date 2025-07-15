# Tudu: A gamified task app

## Project Overview

This document serves as the central specification for the Tudu project. It contains all the necessary information about the technology stack, features, database schema, and implementation details. Future development should reference this document to maintain consistency.

## Technology Stack

- Auth: Supabase Auth
- App Framework: Next.js
- UI Framework: Joy UI
- Data framework: Zencraft Core
- ORM: Drizzle
- Database: PostgreSQL via Supabase
- Push notifications: Socket.io

## Data management
When managing data on the platform, we will use this approach:

- Supabase project (Postgres DB)
- Drizzle ORM instance pointed to Supabase
- In-house data access layer which extends Zencore GenericDatabase
	- This layer imports the Drizzle db instance & uses it for db operations
- Archetypes & their Fields are hardcoded and imported as needed
- Each Item handler wraps a CustomItem which imports its Archetype immediately
	- There should be a function which constructs a CustomItem instance for the given Archetype
		- This function should be async, but should not do async operations (to allow for future changes, but still be fast)
		- This function should call another function to get the db, which should be configurable, but not while the app is running
		- This function should be used anywhere a CustomItem is needed
		- This function should return the correct type inference
- Once the Item handler is instantiated, the app can manage data for an object
	- Any time data is set for the object, it must go through the Item for validation
	- Any time data is saved to the db, it must be validated first
	- Any time data is retrieved from the object, it must be done via getData()

## Core Features

- **Managing an individual Task**
	- Add a Task
	- Edit a Task
	- Start, finish, or partially progress on a Task

- **Managing multiple Tasks**
	- Create a Collection of Tasks which uses search filters
	- Create Goals, which are a set of related Tasks that, when all are completed, gives a larger reward
	- View previous interactions with TaskMasters

- **Managing Rewards**
	- View a list of all achieved Rewards
	- 

- **Dashboard**
	- View all Tasks in a searchable table, with all data available, but able to choose which fields are displayed in the table
	- Manage profile data for your account
	- View and configure system settings, such as theme
	- View system policies, such as privacy policy and data usage policy

- **Profile**
	- View username
	- Set name
	- Set description
	- Set location (country only)
	- Choose whether any profile variable (except username) is private or public
	- TODO: See other apps for other profile options to offer

- **Automatic Task management**
	- Add TaskMaster
	- See existing TaskMasters
	- Configure TaskMaster options
	- Activate or inactivate a TaskMaster

## Automatic Task management

A TaskMaster is a class which, based on its configuration (such as search filters), looks for a Task to assign to the user, and checks periodically whether the Task is completed. Upon completion, a Reward is given to the user.

Users begin with the default TaskMaster (the Wizard), who guides them through the platform, and will assign tasks when no other TaskMasters are active.

Users may create, share, or use existing TaskMasters, and may select which ones are active. It is possible for no TaskMasters to be active, in which case the user must manage their own tasks.

When a user completes a task assigned by a TaskMaster, the reward for the task should be modified according to the TaskMaster's configuration. For example, if a Task has a 20% chance of giving a Reward in the Rare category, and is then assigned by a TaskMaster with a "10% more Rewards" modifier, the Task will then have a 22% chance of giving a Rare Reward (20 * (100 + 10)%).

A record should be kept, for each user, of how many Tasks they have completed for each TaskMaster, and the Rewards gained. This means each Reward should have a Field indicating which TaskMaster assigned the Task which granted the Reward.

## Notes

From Habitica:
- Initial impression, it's far too busy. There's too much going on and it doesn't make a lot of sense.
- I see that there are kanban-style Collections, i.e. Habits, Dailies, and Todo, but they are a bit too busy and don't encourage me to add things or guide me into getting started.
- Adding a Task is really just a modal Form. This should be easy to replicate. They have used a design style with a primary background behind the required and primary fields. The rest of the fields are in a standard form format.
	- I think this is too busy.
	- It should only show the required properties, and should show a hint at the bottom suggesting that there are more to fill in.
	- There should also be a dropdown with which the user can choose a field to add, whereby the select option shows a hint explaining the reason for the field. E.g. for the optional field "Repeat Every", it should have a hint of "This task should be done periodically".
	- There should also be a button which displays all of the available fields instead of using the dropdown and hint.
- "Get Started" button is only for group play. This is too much of a barrier and should not take up so much screen space.
- The button to complete a task is not clear at all. It looks like it should add something, but it immediately completes the task, with no confirmation, and no immediate lingering satisfaction; i.e., even though it shows a reward at the top right, the reward is not related to the task in a meaningful way, and is not directly tied to the task beyond the fact that it shows up at the same time.

What I would do better:
- Simpler interface. The user should be guided into creating their first task, instead of faced with multiple pre-created tasks. There should be a user flow which, by default, only shows the required information. The user should be able to toggle a global setting which displays all of the information that can be entered, and there should be a toggle at all times on each form, which toggles this setting for that form.
- Instead of a kanban-style board, tasks should be displayed as threads, like in Slack or Whatsapp.
	- This chat-style view should display caption-style text lines, with some minimal color and an icon, which indicates progress on a task. It should say something like "Adam completed 'Task name'" or "Adam worked on 'Task name' for 17 minutes". This serves as a positive feedback mechanism which shows the user that they have progressed. There should be a toggle for each thread which hides these activity logs.
		- TODO: Decide between these being inline or in a separate view
	- There should be a single (pinned) thread which contains once-off tasks. There should be a dropdown within this thread to show only tasks of a certain priority.

## Layout

Essential layout is as follows:
- Log in or register
	- Register
	- Forgot password
- User area (must be logged in)
	- Tasks view
		- Collections or individual tasks as threads
			- Thread view
				- Individual tasks in collection
				- Activity history for single task
	- Profile view
		- Card with profile data
		- Buttons to edit or manage profile data
		- Choose whether profile is private
	- Character view
		- Inventory
			- See all owned items
			- See all earned achievements
		- Equipment
			- See all equipped items
				- Click any item to change selected equipment
			- See stats computed from equipment
				- Display base stats and modifiers
	- Game view
		- .... the game
- Site info
	- Site map
	- Project information
	- Github link