# K.Sam Code School

A spaced repetition learning platform for tracking and reviewing coding concepts. Organize what you're learning into modules, add exercises to each, and let the SM-2 spaced repetition algorithm schedule your reviews at increasing intervals as you demonstrate mastery.

## Stack

**Frontend**
- React 19 with Vite
- React Router for navigation
- Tailwind CSS v4
- Google OAuth via @react-oauth/google
- Axios for API requests

**Backend**
- Node.js with Express
- PostgreSQL via Supabase
- Prisma ORM
- JWT authentication with bcrypt password hashing
- Nodemailer for password reset emails

## Features

- Email and password authentication, plus Google sign in
- Password reset via emailed link
- Create and manage learning modules
- Add exercises to each module
- Review queue driven by the SM-2 spaced repetition algorithm
- Dashboard showing module count, exercise count, review activity, and a real consecutive day streak
- Row Level Security enabled on all database tables, application access only

## Project structure

K.Sam Code School/
├── client/ React frontend
│ └── src/
│ ├── pages/ Login, Register, Dashboard, Modules, Review, etc.
│ ├── components/ Shared components including route protection
│ ├── context/ Authentication state and hook
│ └── api/ Axios instance and interceptors
└── learning-engine/ Express backend
├── controllers/ Request handlers for each resource
├── routes/ API route definitions
├── middleware/ Auth and error handling
├── prisma/ Database schema and migrations
└── utils/ Shared error and async handling utilities


## Getting started

### Prerequisites

- Node.js 18 or later
- A PostgreSQL database (this project uses Supabase)
- A Google Cloud OAuth client ID
- A Gmail account with an App Password for sending reset emails

### Backend setup

```bash
cd learning-engine
npm install
```

Create a `.env` file in `learning-engine/` with the following variables:

DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
VITE_GOOGLE_CLIENT_ID=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=http://localhost:5173


Run the initial migration and start the server:

```bash
npx prisma migrate dev
npm run dev
```

The API runs on `http://localhost:5000` by default.

### Frontend setup

```bash
cd client
npm install
```

Create a `.env` file in `client/` with:

VITE_GOOGLE_CLIENT_ID=
VITE_API_URL=http://localhost:5000/api


Start the development server:

```bash
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Database

Schema is managed entirely through Prisma migrations. Never run `prisma db push` on this project, always use `prisma migrate dev` for schema changes to keep migration history intact.

Row Level Security is enabled on all tables in Supabase. The backend connects as the table owner and bypasses RLS by design, this only blocks access through Supabase's public REST API, which this application does not use.

## Spaced repetition

Review scheduling uses the SM-2 algorithm. Each review is rated on a 0 to 5 quality scale, and the next review date, ease factor, and interval are recalculated accordingly. A separate append only log of every review event powers the streak calculation shown on the dashboard.

## License

Private project, not licensed for reuse.