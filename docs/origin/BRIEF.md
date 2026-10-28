# Brief — Higher Education Team Personas

## Context

Repository: `blackmath88/m365-toolbox`

The repository contains small M365 training tools and a Deep Dive workstream for the University of Basel.

The Deep Dive series is being developed together with an external M365 consulting partner. The partner provides product expertise and M365 best practice; the University of Basel contributes real university work contexts, adoption framing, and realistic scenarios.

The current training material is technically sound, but much of it is still close to product explanation. For this workstream we want to make the consulting/adoption layer explicit.

### Three quality levels

**Level 1 — Feature training**

What can the tool do? Where do I click? What views exist?

**Level 2 — Best-practice training**

When should I use which feature? What general rules help?

**Level 3 — Consulting / adoption guidance**

How should this specific work situation be organised? What do we recommend, why, what are the trade-offs, what are the anti-patterns, and what reusable working pattern can the team adopt?

**The Deep Dives should aim for Level 3.**

Basic product functionality is already accessible through Microsoft Learn, Microsoft Support, and Copilot. The distinctive value of a professional M365 sparring partner should be translating product capability into good working practices and decision logic for real university situations.

## Purpose of this subfolder

Build a small, fictional higher-education universe that gives the training team realistic contexts to work with.

These are not marketing personas. They are recurring **forms of work** with named fictional people, concrete artefacts, decisions, friction, and collaboration patterns.

The surface should help a trainer or consultant answer questions such as:

- What does this team actually do?
- Who works with whom?
- What is personal and what is shared?
- What information must remain durable?
- What does a bad current state look like?
- What would a better M365-supported working model look like?
- Where are the real decisions and trade-offs?
- What should a consultant recommend?
- What should *not* be recommended?

## Training context

The broader Deep Dive series currently includes:

1. **Teams Basics** — orientation, teams/channels, finding information and files, personal setup
2. **Communication in Teams** — chat vs channel, durable communication, conventions
3. **Collaborative document work** — OneDrive vs Teams/SharePoint, links instead of copies, coauthoring, comments, version history, access
4. **Loop / shared evolving knowledge** — collaborative notes and lightweight shared knowledge
5. **Planner & To Do** — shared commitments vs personal tasks, board structure, responsibility, due dates, status
6. **Digital Balance** — attention, notifications, availability, focus, digital working rules

The personas should be reusable across all six rather than tied to one feature.

## Core content principle

Do not demonstrate features in isolation.

Prefer a recurring pattern:

```
real work situation
→ friction / bad state
→ working principle
→ M365-supported model
→ visible example
→ recommendation
→ boundary / anti-pattern
→ next action
```

The persona surface itself does not need to teach all of this. It should expose enough context that training modules can derive this sequence from the same fictional world.

## Persona universe

The seed data defines four worlds:

1. **Administrative team / decentral administration**
2. **Research group**
3. **Individual knowledge worker / minimal team use**
4. **University commission / committee**

The first three are primary personas. The commission is especially useful as a minimalism / anti-overengineering case.

All names, units, projects, and artefacts are fictional. They should feel plausible in a Swiss higher-education context without impersonating a real University of Basel unit or person.

## Design / product direction

Create a browsable persona experience, not a long report.

Possible information layers include:

- team / person identity
- members and roles
- "how we work"
- collaboration map
- current scenario
- recurring artefacts
- friction points
- personal vs shared work
- suggested M365 working context
- consulting questions
- examples for each training module
- anti-pattern / boundary

This is deliberately **not** a fixed page specification.

The implementation should explore a strong way to make the working worlds understandable at a glance and useful when preparing training material.

### Important UI freedom

Do **not** treat this brief as a deterministic visual specification.

The user will provide separate UI direction later.

You may choose:
- static HTML
- progressive enhancement
- a small React/Vite surface
- another lightweight implementation

Choose based on simplicity, clarity, maintainability, and fit with the existing toolbox.

Avoid unnecessary backend work. This is a content-rich training / design surface, not an application requiring server state.

## Relationship to existing `team-personas/`

The existing `team-personas/index.html` is a useful earlier artefact that describes six generic team types and suggested standard setups.

Do not overwrite it.

This higher-education work should live under:

`team-personas/higher-education/`

It can reuse ideas from the existing tool, but its role is different:

- existing tool = generic team types / setup guidance
- higher-education personas = realistic fictional working worlds / scenario engine for Deep Dives

## Content expectations

The implementation should make the following obvious:

### Administrative team
A small stable unit, close collaboration with another internal team, recurring operational work, temporary cross-unit projects, and occasional external collaborators.

### Research group
A group with shared infrastructure / administration / projects but also substantial individual research work. The personal-vs-shared boundary matters.

### Individual knowledge worker
A researcher / lecturer / PhD who is mostly working individually and is only selectively collaborative. M365 should support this person without forcing everything into Teams.

### University commission
A periodic governance body with documents, decisions, meetings, and actions. This persona should help show that not every team needs the maximum amount of M365 structure.

## Acceptance for the first implementation

A first version is useful when:

- all four persona worlds are represented;
- the fictional people, roles, scenarios, artefacts and friction are easy to understand;
- there is a clear distinction between personal and shared work where relevant;
- each persona exposes consulting questions rather than only tool mappings;
- the same persona can plausibly be reused in Teams, Documents, Planner, Loop and Digital Balance;
- the result works well on desktop and mobile;
- the content is easy to edit without rewriting the application;
- no backend is required;
- no real University of Basel people or confidential data are used;
- the design leaves room for a later visual-direction pass.

## Non-goals

Do not:

- build a full M365 simulator;
- copy Microsoft UI pixel-for-pixel;
- turn the page into generic product documentation;
- prescribe that every person should use every M365 product;
- recommend creating Teams purely as storage containers;
- imply that more structure is always better;
- use real employee names or real internal data.

## Product thesis

The persona universe should help shift the training from:

> "This is how Microsoft 365 works."

toward:

> **"This is how good digital collaboration can look in higher education — and this is how Microsoft 365 can support that way of working."**
