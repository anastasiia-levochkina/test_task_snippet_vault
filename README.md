# Snippet Vault

A small full-stack app for saving useful snippets - notes, links or commands.

Built as a test task using Next.js + NestJS.

---

##  What’s inside

- Create snippets
- View list
- Search by text
- Filter by tag
- Delete snippets

---

##  Stack

- Frontend: Next.js, TypeScript, Tailwind
- Backend: NestJS, MongoDB (Mongoose)

---

## Run locally

### Backend

```bash
cd backend
npm install
npm run start:dev

Create .env:

PORT=3001
MONGODB_URI=your_connection_string
Frontend
cd frontend
npm install
npm run dev

Create .env.local:

NEXT_PUBLIC_API_URL=http://localhost:3001

App: http://localhost:3000

API: http://localhost:3001/snippets
