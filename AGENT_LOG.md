# AI Usage Log - WhiteCarrot Project

## How I Used AI

Used Cascade AI to build ~70% of the code. I described features, it generated code, I tested and refined. Total time: ~10 hours (would've been 20-25 without AI).

## What Worked
**AI Struggled With:**
- Auth edge cases (dev vs production)
- Complex state management
- Next.js middleware (took 2 hours debugging)
- Performance optimizations
- MongoDB connection issues

## Process

Typical feature cycle:
1. Me: "Build [feature]"
2. AI: Generates code
3. Me: Test, find issues
4. Me: "Getting error: [paste error message]"
5. AI: Fixes it
6. Repeat until working (2-3 iterations average)

## What I Changed

- Simplified page builder (AI made it too complex)
- Fixed auth cookies for production
- Changed image handling (URLs instead of uploads)
- Removed unnecessary validations
- Added proper error handling

## Key Learnings

1. **Start simple** - Build incrementally, not everything at once
2. **Be specific** - Detailed prompts = better results
3. **Always test** - AI code has edge cases
4. **Read everything** - Don't blindly copy-paste
5. **Debug first** - Understand errors before asking AI
6. **Security matters** - Always review for vulnerabilities

## When to Use AI

**Great for:**
- Getting started quickly
- Boilerplate/repetitive code
- Learning new patterns
- Simple bug fixes

**Not good for:**
- App architecture decisions
- Complex debugging
- Security-critical code
- Performance optimization

## Reality Check

AI is a fast junior developer that needs supervision. You still need to:
- Understand what you're building
- Know the tech stack basics
- Make design decisions
- Debug complex issues
- Review for security

**Best workflow:** You think what to build → AI helps build it faster

**Doesn't work:** AI thinks what to build → AI builds it

## Final Thought

AI coding assistants are powerful tools for solo projects, but you still need to be a real developer to use them effectively. They accelerate execution, not replace thinking.
