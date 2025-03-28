# tudu: A gamified task manager

Welcome to tudu! This is an app for managing tasks, but also a miniature idle fantasy game, so you can slay goblins and finish quests while you complete your tasks.

## Purpose
The main reasoning for this app is to use Next.js and React to make an app. My primary experience is with Vue.js, so I wanted to hone my React skills. In addition, this is a fun concept I have been thinking about quite a bit this year, so I decided to put it into practice with React and NextJS.

## Components

### Technology Stack

- Auth: Supabase Auth
- App Framework: Next.js
- UI Framework: Joy UI
- Data framework: Zencraft Core
- ORM: Drizzle
- Database: PostgreSQL via Supabase

### Back end
The database is Postgres-based, with hosting provided by Supabase.

Drizzle ORM is being used as an interface to Supabase, mainly for managing migrations and making filters easy.

Zencraft Core (github.com/adaminthecape/zencraft-core) is my own personal data management system, which gives me an easy way to define items using Fields, which provides both validation and most of the data basis for the UI.

### Front end
The front end is React, via Next.js. Joy UI is being used for basic styling and components.