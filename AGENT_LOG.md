# AI Usage Log - WhiteCarrot Project

This is how I used AI (Cascade) to build this project. Writing in my own words, not AI style.

## Overall Approach

I used Cascade AI as a coding partner. I'd describe what I want, and it would generate code. Then I'd test, find issues, tell it to fix, repeat. Probably 70% of code was AI-generated, but I reviewed everything and made changes where needed.

## Prompt Examples & What Worked

**Initial Setup:**
- "Create a Next.js 14 app with TypeScript, MongoDB, auth with JWT"
- Worked well. Got the basic structure in minutes.
- Had to manually add some dependencies it missed.

**Database Models:**
- "Make mongoose models for User, Company, Job, Application with these fields..."
- Listed all fields I wanted
- AI created schemas with proper types and indexes
- I added some validations later that were missing

**Auth System:**
- "Build JWT authentication with login and register API routes"
- First version had issues with cookies not being set properly
- Told it: "cookies not working in production"
- Second attempt worked better (secure: false for dev)
- Learned: Be specific about environment (dev vs prod)

**Page Builder:**
- "Create a drag-and-drop page builder component with sections"
- This took multiple iterations
- First version was too complex
- Said: "make it simpler, just up/down arrows to reorder"
- Much better result
- Then asked to add different section types one by one

**API Routes:**
- For each feature, I'd say: "create API route for [feature]"
- Example: "API route to create a new job for a company"
- Usually worked first try
- Sometimes forgot to add auth checks, had to remind it

**Middleware:**
- "Add Next.js middleware to protect routes"
- First version didn't work at all in development
- Lots of back and forth debugging
- Finally added fallback pattern (check headers, if not found check cookies directly)
- This was the trickiest part, took maybe 2 hours

**UI Components:**
- "Make this page responsive" - worked great
- "Add loading spinners to all buttons" - did it in one go
- "Make cards look better on mobile" - good results
- shadcn/ui made this easier because AI knows those components well

## Refinement Process

Most features went like this:

1. Me: "Build [feature]"
2. AI: Generates code
3. Me: Test it, find bug
4. Me: "It's not working because [error message]"
5. AI: Fixes it
6. Repeat 3-5 until it works

Average iterations per feature: 2-3 times

## What AI Was Great At

- Boilerplate code (models, routes, components)
- TypeScript types and interfaces
- Responsive CSS with Tailwind
- Following patterns (once I showed it one example)
- Finding syntax errors when I described the issue

## What AI Struggled With

- Authentication edge cases (worked in dev, broke in preview)
- Complex state management (had to guide it)
- Performance optimizations (didn't think about it unless asked)
- Understanding Next.js App Router specifics sometimes
- MongoDB connection issues (had to debug myself)

## Prompts That Didn't Work Well

"Make it better" - too vague, got random changes
"Fix the bug" - needed to explain what the bug was
"Optimize this" - didn't know what to optimize for

## Prompts That Worked Great

"Add loading spinner to the login button that shows when form is submitting"
"Create API route that filters jobs by company slug, location, and job type"
"Make this responsive for mobile, tablet, desktop"
"Add error handling for when MongoDB connection fails"

Key learning: Be specific!

## Time Breakdown

Total: ~10 hours

- Initial setup & auth: 2 hours
- Database models & API routes: 2 hours  
- Page builder UI: 2.5 hours
- Jobs & applications: 1.5 hours
- Bug fixes & middleware: 1.5 hours
- Polish & loading states: 30 mins

Without AI: Would've taken 20-25 hours probably.

## Debugging with AI

When stuck:
1. Copy error message from console
2. Tell AI: "Getting this error: [paste error]"
3. AI suggests fixes
4. Try them one by one

Worked maybe 60-70% of the time. Other times had to Google or check docs myself.

## Code Review Process

After AI generated code:
- I always read it before using
- Checked for security issues (SQL injection, XSS, etc.)
- Made sure it matches the rest of the codebase
- Sometimes simplified overly complex code
- Added comments where needed

## Things I Changed From AI Suggestions

- Simplified the page builder drag-drop (AI made it too fancy)
- Changed how images are handled (AI wanted file upload, I used URLs for speed)
- Modified auth cookie settings (AI's version didn't work in my setup)
- Removed some unnecessary validation checks
- Changed some component names to be clearer

## What I Learned

1. **AI is a tool, not magic**: Still need to understand what you're building
2. **Start simple**: Don't ask for everything at once, build incrementally
3. **Be specific in prompts**: Vague = bad results
4. **Always test**: AI code often works in theory but has edge cases
5. **Read the code**: Don't blindly copy-paste
6. **Debug yourself first**: Understand the error before asking AI
7. **Use AI for boilerplate**: Saves tons of time on repetitive stuff

## Would I Use AI Again?

100% yes. It's like having a junior developer who's really fast at typing but needs supervision. Great for:
- Getting started quickly
- Generating repetitive code
- Learning new patterns
- Fixing simple bugs

Not replacing actual coding skills though. Still need to:
- Understand architecture
- Debug complex issues
- Make design decisions
- Know when AI is wrong

## Tips for Using AI in Coding

1. Learn the basics first - don't use AI if you don't understand the language
2. Start with small, clear requests
3. Test everything the AI generates
4. Keep context - remind it what you're building if starting new conversation
5. Don't trust it blindly, especially for security stuff
6. Use it to learn - ask "why" when it suggests something
7. Have a plan - AI can't design your app architecture for you

## Funny Moments

- AI once generated a 500-line file when I asked for "a simple form"
- Created a component called "TheThing" because I said "add the thing for filtering"
- Kept trying to add TypeScript strict mode which broke everything
- Made up a library that doesn't exist and imported it confidently

## Final Thoughts

AI coding assistants are game-changers for solo projects. Probably saved me 50% of development time. But you still need to be a developer to use them effectively.

The best workflow: I think about what to build, AI helps me build it faster.

Not: AI thinks what to build and builds it. That doesn't work.
