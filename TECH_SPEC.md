# Tech Spec - WhiteCarrot Careers Platform

## What I Built
A careers page builder where recruiters can make custom job pages for their company. Candidates can browse and apply for jobs.

## Tech Stack
- **Frontend**: Next.js 14 (React), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Auth**: JWT tokens stored in cookies
- **Deployment**: Ready for Vercel/Netlify

## How Data is Stored Per Company

Each company gets their own document in MongoDB. The schema looks like:

```
Company Collection:
- _id (unique)
- name
- slug (unique URL like "acme-corp")
- recruiterId (who owns this company)
- logoUrl, bannerUrl, primaryColor (branding)
- sections[] (page builder content)
- isPublished (true/false)

Job Collection:
- _id
- companySlug (links to company)
- title, location, department, salary
- All job fields

Application Collection:
- _id
- jobId (which job)
- candidateId (who applied)
- status (pending/reviewing/accepted/rejected)
```

**Why this works**: Each company has a unique slug. When you visit `/acme-corp/careers`, we query by slug. Jobs filter by companySlug. Simple and fast.

## How Recruiters Build Pages

Made a drag-and-drop style page builder with tabs:

1. **Page Builder Tab**: Add sections like Hero, Video, Text, Features
2. **Jobs Tab**: Create/delete job postings with a form
3. **Brand Settings Tab**: Upload logo, pick colors, add banner

All changes save to MongoDB. Preview button shows live preview. Publish button makes it public.

**Key Feature**: Everything is in one place. No complicated steps.

## Safe Updates

Updates are safe because:

1. **Draft Mode**: Changes save but don't go live until you click Publish
2. **User Check**: Middleware verifies you own the company before allowing edits
3. **API Validation**: Backend checks userId matches recruiterId
4. **No Overwrite**: Updates use specific fields, not replacing whole document

Example flow:
```
Recruiter edits -> Saves draft -> Preview looks good -> Publish -> Now live
```

## Job Browsing for Candidates

Candidates can:
- Search by title, location, job type (filters with debounce)
- See all jobs from a company on their careers page
- Click Apply (must be logged in as candidate)
- View "My Applications" in dashboard

**Performance**: Jobs load with pagination, filters use indexes in MongoDB for speed.

## Responsive Design

Used Tailwind's responsive classes everywhere:

- Mobile: Single column, touch-friendly buttons
- Tablet: 2 columns for cards, hamburger menu
- Desktop: 3 columns, full layout

Tested on:
- iPhone (portrait/landscape)
- iPad
- Desktop (1920px)

All buttons have `touch-manipulation` class for better mobile feel.

## Scaling for Hundreds of Companies

If this grows, here's what I'd do:

**Database**:
- Add indexes on slug, recruiterId, isPublished
- Use MongoDB replica sets for read scaling
- Consider sharding by company if we hit millions

**Caching**:
- Cache public careers pages in Redis (TTL: 5 minutes)
- CDN for images (CloudFront or Cloudinary)
- Static generation for published pages

**Architecture**:
- Move to microservices if needed (Auth, Jobs, Companies separate)
- Use queue system (BullMQ) for email notifications
- Add rate limiting per user

**Current Capacity**:
With current setup, can easily handle 500-1000 companies with no changes. MongoDB can handle millions of documents easily.

## API Endpoints

```
Auth:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Companies:
GET /api/companies (recruiter's companies)
POST /api/companies (create)
GET /api/company/:slug/edit (edit page data)
PUT /api/company/:slug (update)
POST /api/company/:slug/publish (publish page)

Jobs:
GET /api/jobs?slug=company-slug (list jobs)
POST /api/jobs (create job)
DELETE /api/jobs/:id (delete job)

Applications:
POST /api/jobs/:id/apply (apply to job)
GET /api/applications/my-applications (candidate's applications)
```

## Security Measures

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days
- Middleware blocks unauthorized access
- Role-based access (RECRUITER vs CANDIDATE)
- Input validation on all forms
- Sanitized MongoDB queries to prevent injection

## What Could Be Better

1. File upload for logos (currently just URLs)
2. Email notifications when someone applies
3. Rich text editor for job descriptions
4. Analytics dashboard (views, applications)
5. Team members (multiple recruiters per company)
6. ATS integration (export to CSV/Excel)

## Test Plan (If I Had Time)

**Unit Tests**:
- Test auth functions (login, register, JWT)
- Test company controller methods
- Test job filtering logic

**Integration Tests**:
- Full flow: Register -> Create company -> Add job -> Apply
- Test middleware auth blocking
- Test publish/unpublish flow

**Manual Testing Done**:
- Created 2 companies with different slugs
- Posted 5 jobs total
- Applied to jobs as candidate
- Tested on mobile browser
- Checked preview vs published view
- Verified auth redirects work

## Assumptions Made

1. Each recruiter can have multiple companies
2. One recruiter code works for all (hardcoded for demo)
3. Jobs don't expire automatically
4. No payment/subscription system
5. Public pages are truly public (SEO friendly)
6. Recruiter approves/rejects manually
7. Simple status flow (no interview rounds)
8. Logo/banner are URLs (no file storage yet)

## Database Schema Details

**User Model**:
```javascript
{
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: Enum[RECRUITER, CANDIDATE]
}
```

**Company Model**:
```javascript
{
  name: String,
  slug: String (unique, indexed),
  recruiterId: ObjectId (indexed),
  logoUrl: String,
  bannerUrl: String,
  cultureVideo: String,
  primaryColor: String,
  sections: Array of {
    id, type, content, layout, bgColor
  },
  isPublished: Boolean (indexed)
}
```

**Job Model**:
```javascript
{
  companySlug: String (indexed),
  title: String,
  location: String,
  department: String,
  jobType: String,
  workPolicy: String,
  experience: String,
  salaryRange: String,
  slug: String
}
```

**Application Model**:
```javascript
{
  jobId: ObjectId (indexed),
  candidateId: ObjectId (indexed),
  status: Enum[pending, reviewing, accepted, rejected],
  appliedAt: Date
}
```

---

Built this in about 8-10 hours with help from Cascade AI. Most time spent on the page builder and making it look good on mobile.
