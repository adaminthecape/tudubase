# Example user stories for task management

## Logging on
- User visits the website
- User is not logged on
- Login screen is displayed
- User may choose: register, forgot password, or sign in
	- Register:
		- User directed to registration page
		- User fills in email/username/password
		- User waits for confirmation email
		- User clicks confirmation email & redirected to website
		- Go to: start
	- Forgot password:
		- User enters email address / username
		- User waits for confirmation email
		- ??
	- Sign in
		- User enters email/username/password
		- User clicks sign in
		- If successful, user redirected to `/tasks`
		- If failed ??

## Filling out a form (ItemType)
- For the given ItemType:
	- Modal displays Item form based on the hardcoded Fields
	- User enters details
		- If error, message will be displayed and Submit will be disabled
		- If success:
			- Validate form input
			- If form input invalid, show error
			- If is valid, show loading indicator & process ORM response

## Managing tasks
- User is signed in and on `/tasks` route
- Task messages view is displayed
- Last worked on task is selected
- Last worked on task details pane is displayed at the right
- User adds collection
	- Go to: Filling out a form (Collection)
- Newly added Collection auto-opens OR user chooses Collection
- Display all Tasks in Collection, with their activity interpolated by time
	- When adding a Task to the Collection, or when updating something about a Task, there should be a message with TaskOptions. This will appear as if it was a message sent by that Task.
	- When a TaskMaster adds a message about a Task, there should be a Task message as above, but with the TaskMaster as the sender.
	- When any activity is done on a Task, the activity should be added to the conversation as a caption.
	- Messages from the same sender, in succession, should have a single Task header.
- 