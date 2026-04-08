# Survey Application

A behavioral survey application with Treatment/Control groups, designed to measure how participants respond to suggested answers across multiple phases.

## Setup

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts   # populate default questions
npm run dev
```

The app runs at `http://localhost:3000`.

## How It Works

### Survey Flow

Participants are randomly assigned to either the **Treatment** or **Control** group when they start the survey. The survey has 3 phases:

| Phase | Questions | Details |
|-------|-----------|---------|
| Phase 1 | 10 | Multiple-choice (3 options). Different questions and suggested answers for Treatment vs Control. |
| Phase 2 | 10 + 1 trapped | Multiple-choice (3 options). Same for both groups. One question is flagged as a trapped question and marked with an "Attention Question" badge. |
| Phase 3 | 1 | Yes/No question: "Do you want to bet?" |

Each normal question displays a **suggested answer** on the right side of the screen along with a **reason** (blurred by default). The participant can click the blurred reason to reveal it.

The system tracks per question:
- Time taken to answer (seconds)
- Whether the participant chose the suggested answer
- Whether the participant unblurred the reason

### Pages

| URL | Purpose |
|-----|---------|
| `/` | Landing page where participants start the survey |
| `/survey` | The survey itself (all 22 questions in sequence) |
| `/admin` | Statistics dashboard with participant results |
| `/admin/questions` | Question management (add, edit, delete questions) |

## Admin Guide

### Viewing Results (`/admin`)

The statistics table shows one row per participant with these columns:

- **Participant ID** and **Group** (Treatment/Control)
- **P1 Suggested Rate** -- how often the participant chose the suggested answer in Phase 1
- **P1 Avg Time** -- average seconds per question in Phase 1
- **P2 Suggested Rate** -- how often the participant chose the suggested answer in Phase 2 (excluding the trapped question)
- **P2 Avg Time** -- average seconds per question in Phase 2
- **P2 Open Reason Rate** -- how often the participant unblurred the reason in Phase 2
- **P2 Open + Suggested** -- unblurred reason AND chose suggested answer
- **P2 Open + Not Suggested** -- unblurred reason but did NOT choose suggested answer
- **P2 No Open + Suggested** -- did NOT unblur reason but chose suggested answer
- **P2 No Open + Not Suggested** -- did NOT unblur reason and did NOT choose suggested answer
- **Trapped Wrong** -- whether the participant got the trapped question wrong
- **Bet** -- whether the participant chose to bet

To delete a participant's record, click the **Delete** button on their row.

### Managing Questions (`/admin/questions`)

Use the filter buttons at the top to view questions by phase and group.

**Adding a question:** Click "+ Add Question", fill in the form, and click Save.

- **Key** -- a unique identifier (e.g., `p1_t_q11`, `p2_q12`)
- **Phase** -- 1, 2, or 3
- **Group** -- TREATMENT, CONTROL, or ALL (Phase 2 and 3 questions should be ALL)
- **Options** -- the answer choices. The correct option is highlighted in green
- **Correct Option Index** -- which option is the suggested/correct answer
- **Reason** -- explanation shown to the participant (blurred until clicked)
- **Sort Order** -- controls the display order within a phase/group
- **Trapped** -- check this for the trapped question (should only be one in Phase 2)
- **Bet Question** -- check this for the final yes/no question

**Editing a question:** Click "Edit" on any row, modify the fields, and click Save.

**Deleting a question:** Click "Delete" on any row.

### Question Structure Requirements

For the survey to work correctly, maintain this structure:

- Phase 1 should have questions with group = TREATMENT and group = CONTROL (typically 10 each)
- Phase 2 should have questions with group = ALL, including exactly one with the Trapped flag
- Phase 3 should have exactly one question with group = ALL and the Bet flag checked

## Tech Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM + SQLite
