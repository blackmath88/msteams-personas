# Scenario backlog: recognisable M365 teaching patterns

Updated 2026-10-29 (v3 build). Each candidate names:
- the everyday problem;
- the learning objective;
- the screens that tell it;
- the principle;
- a boundary (when the recommended setup is *not* right).

Sources are listed at the end. Status: **implemented** means a browser-tested sequence exists in `LIB.sequences` (`src/scenes-v3.js`). **Partly** means the screens exist without a dedicated sequence.

| # | Pattern | Learning objective | Moments (screens) | Principle | Boundary / alternative | Context | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Mail attachment copies → shared document | Show why attachments create "which version counts?", and how a link to one file solves it | Outlook (attachment) → Explorer (copies, "(1)") → Teams post → SharePoint library → Prinzip | Persönlicher Entwurf oder gemeinsames Dokument? | External people without team access still need sharing or an attachment | Higher ed (Leadership Forum) + business (Kundenportal) | **implemented** (`dateiversion`) |
| 2 | A decision disappears in chat | Recognise which decisions others must find later, and post the result in the channel | Teams 1:1 chat → To Do of the person working on the old basis → channel post with the result in the title → Prinzip | Chat oder Kanal? | Technical detail can stay in chat as long as the result lands in the channel | Business (Kundenportal) | **implemented** (`entscheid-chat`) |
| 3 | Project coordination: Planner vs personal To Do | Make shared commitments visible in the plan; keep personal to-dos personal | Planner board → To Do («Zugewiesen an mich» + own tasks) → channel rule → Prinzip | Persönliche oder gemeinsame Verantwortung? | Not every small item needs a plan task; small teams may manage with a list in the channel | Higher ed (Leadership Forum) | **implemented** (`planner-todo`) |
| 4 | Employee onboarding | Keep knowledge, documents and responsibilities for the *next* new person | Channel welcome + buddy → chat where knowledge gets stuck → Planner checklist → new person's To Do → Prinzip | Gemeinsame Verantwortung | Contract, pay and probation go through HR. With rare onboarding, a checklist without a channel is enough | Business (new world: Kundendienst, Brunner Haustechnik AG) | **implemented** (`einarbeitung`) |
| 5 | Handover / absence | Share specific files before an absence instead of opening everything or mailing copies | OneDrive (private vs shared) → To Do → Prinzip | Persönlicher Entwurf oder gemeinsames Dokument? | Research notes stay private; appointments live in the calendar | Higher ed (Nora Keller) | **implemented** (`abwesenheit`) |
| 6 | AI meeting follow-up with human review | AI suggestions become commitments only after a person reviews them | Meeting recap with AI notes and suggestions (simulation) → Planner with reviewed tasks → Prinzip | Verantwortung bleibt beim Team | Simulation only; suggestions can be wrong; licensing (Teams Premium or Microsoft 365 Copilot) and transcription required | Business (Kundenportal) | **implemented** (`ki-besprechung`) |
| 7 | Recurring meeting: preparation → notes → follow-up | Agenda and notes in one place per meeting series; follow-ups as tasks | Channel post with agenda → meeting recap (non-AI notes) → Planner → To Do | Chat oder Kanal? / Verantwortung | Confidential committee items need a private channel or a different place | Higher ed (Kommission) | partly (commission scenes, no sequence) |
| 8 | Semester handover in a teaching team | The next team finds the material and decisions | Files tab → SharePoint → posts | Gemeinsames Dokument | Student data stays in the LMS | Higher ed (Lehrteam) | partly |
| 9 | External agency works on shared files | Clarify what externals see without inviting them into the whole team | SharePoint sharing dialog → Teams shared channel (planned) | Gemeinsames Dokument | Guest access policy is decided by IT; the image shows an assumption | Business (Kundenportal) | backlog |
| 10 | Shift/field team: mobile updates from technicians | Field staff report via Teams mobile; dispatch sees one status | Teams mobile (planned renderer) → Planner | Verantwortung | Customer data stays in the ticket system | Business (Kundendienst) | backlog (needs mobile renderer) |

## Why these patterns

- **Patterns 1, 2 and 3** follow Microsoft's own guidance:
  - files are shared as links, and their versions are held in SharePoint;
  - channel conversations use the Posts layout, where replies stay with the post;
  - Planner tasks show up in To Do under «Zugewiesen an mich». To Do is described as the personal list and Planner as the team tool ("To Do vs. Planner").
- **Pattern 4** is a common adoption scenario: onboarding checklists in Planner and a welcome channel. It was implemented with a business team rather than renamed university characters.
- **Pattern 6** follows Microsoft's description of intelligent recap: AI notes and AI-suggested follow-up tasks, which require Teams Premium or a Microsoft 365 Copilot license and transcription. The search found **no official documentation** that recap tasks go into Planner automatically, so the simulation shows a person transferring the reviewed tasks.

## Sources (accessed 2026-10-29)

- Microsoft Support, *To Do vs. Planner*: https://support.microsoft.com/en-us/todo/to-do-vs-planner
- Microsoft Support, *See Planner tasks in Microsoft To Do*: https://support.microsoft.com/en-us/office/see-planner-tasks-in-microsoft-to-do-4cac0115-4e4c-44f7-80ae-d1e25ec0527e
- Microsoft Support, *Manage your tasks with My Tasks and My Day*: https://support.microsoft.com/en-us/planner/training/manage-your-tasks-with-my-tasks-and-my-day
- Microsoft Support, *Flag your tasks with labels* (labels, buckets, progress, dates, assignments on the board): https://support.microsoft.com/en-us/planner/flag-your-tasks-with-labels
- Microsoft Support, *Manage your Team's plans with Planner in Teams* (Board grouped by bucket, progress, due date, priority, labels): https://support.microsoft.com/en-us/planner/teams/manage-your-team-s-plans-with-planner-in-teams
- Microsoft Support, *Recap in Microsoft Teams*: https://support.microsoft.com/en-us/teams/meetings/recap-in-microsoft-teams
- Microsoft Learn, *Intelligent recap for Teams calls, meetings, and events* (licensing: Teams Premium or Microsoft 365 Copilot): https://learn.microsoft.com/en-us/microsoftteams/intelligent-recap-calls-meetings
- Microsoft Support, *Catch up on meetings with Microsoft Copilot in Teams*: https://support.microsoft.com/en-us/office/use-copilot-in-microsoft-teams-meetings-0bf9dd3c-96f7-44e2-8bb8-790bedf066b1
- Microsoft Support (de-DE), *Ansichten auf der OneDrive-Website ändern* (Meine Dateien, Zuletzt verwendet, Geteilt, Papierkorb; sorting by Name, Geändert, Freigabe): https://support.microsoft.com/de-de/onedrive/change-views-on-the-onedrive-website
- Microsoft Support, *Open, save, and edit attachments received in Outlook*: https://support.microsoft.com/en-us/outlook/mail/open-save-and-edit-attachments-received-in-outlook
- Microsoft Support (de-DE), Teams channel experience and channel layout (see REFERENCE-PROFILES.md).

Practitioner material was **not** independently verified in this run. The patterns above are grounded in the Microsoft documentation and in the existing curated atlas content.
