# WhiteCarrot - Careers Page Builder

A platform where companies can build their own careers pages and manage job applications. Recruiters get a page builder to customize their company page, and candidates can browse jobs and apply.

## What I Built

Two main parts:

1. **Recruiter Side**: Login, create company, build careers page with drag-drop sections, post jobs, view applications
2. **Candidate Side**: Browse companies, search jobs, apply for positions, track applications

Each company gets a custom URL like `/acme-corp/careers` which they can share anywhere.

## How to Run Locally

1. Clone the repo and go to project folder:
```bash
cd project/whitecarrot
```

2. Install packages:
```bash
npm install
```

3. Create a `.env` file with these:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the dev server:
```bash
npm run dev
```

5. Open http://localhost:3000

## First Time Setup

**Create a Recruiter Account:**
- Go to `/register`
- Fill in your details
- Use recruiter code: `RECRUITER2024` (this makes you a recruiter instead of candidate)
- Login and you'll see dashboard

**Create a Company:**
- Click "Add Company" button
- Give it a name like "Acme Corp"
- It creates a URL slug automatically

**Build Your Careers Page:**
- Click "Edit" on your company
- Add sections (hero, video, text, features)
- Upload logo and banner URLs
- Add jobs in the Jobs tab
- Click "Publish" when ready

**As a Candidate:**
- Register without recruiter code (you become a candidate)
- Browse companies in dashboard
- Click on any company to see their careers page
- Apply for jobs

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login & Register pages
│   ├── (recruiter)/         # Company edit & preview pages
│   ├── [company]/careers/   # Public careers pages
│   ├── dashboard/           # Main dashboard
│   └── api/                 # All API endpoints
├── components/ui/           # Reusable UI components
├── lib/
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth middleware
│   └── auth.ts              # JWT functions
├── models/                  # MongoDB schemas
└── store/                   # Zustand state management
```

## Key Features

**Page Builder:**
- Add different section types (hero, video, text, features, team)
- Drag sections up/down
- Live preview before publishing
- Custom colors and branding

**Job Management:**
- Create jobs with form
- Filter by title, location, type
- Delete jobs easily
- See all company jobs in one place

**Applications:**
- One-click apply for candidates
- Recruiter sees all applications in dashboard
- Track application status

**Auth & Security:**
- JWT tokens in cookies
- Role-based access (recruiter vs candidate)
- Middleware protects routes
- Only company owner can edit

## Tech Used

- Next.js 14 (React framework)
- TypeScript (type safety)
- MongoDB (database)
- Mongoose (MongoDB ORM)
- TailwindCSS (styling)
- shadcn/ui (component library)
- JWT (authentication)
- Zustand (state management)
- React Hook Form (form handling)
- Zod (validation)

