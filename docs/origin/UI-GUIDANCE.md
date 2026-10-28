# UI Direction — Higher-Education Working Worlds

## Product framing

This is **not** primarily a trainer tool, a consulting dashboard, or a decision engine.

It is a visually accessible showcase / atlas of fictional university working worlds.

The main idea:

> **Meet the teams. Understand how they work today. Then see how that working world can be translated into a sensible M365 setup.**

Every world has two explicit sides:

1. **Their working world today**
2. **A good M365 working model**

The UI should make the contrast between worlds obvious. A small administrative team, a research group, a mostly-individual academic, a commission, and a teaching team should not feel like the same template with different copy.

---

## Visual target

The page should feel:

- modern and calm;
- recognisably adjacent to Microsoft Teams / Fluent 2 without becoming a Teams clone;
- editorial, human and explanatory;
- suitable for showing directly in a meeting;
- strong enough that screenshots can be reused in slides;
- accessible on desktop and mobile;
- much more polished than the existing toolbox cards.

Avoid:

- generic SaaS dashboard grids;
- excessive rounded cards;
- gradients everywhere;
- giant hero illustrations;
- glassmorphism;
- overdecorated "AI product" aesthetics;
- Fluent components pasted together without an information hierarchy;
- Microsoft product screenshots as the main visual language.

---

## Design reference: Fluent 2, not a Teams clone

Use Microsoft's current Fluent 2 design language as a **reference grammar**:

- typography hierarchy;
- restrained spacing;
- neutral surfaces;
- subtle border and elevation;
- Segoe UI / system fonts;
- accessible focus states;
- compact chips / badges;
- avatars for people;
- tabs / segmented controls where they aid comparison;
- simple iconography;
- Teams-like violet/indigo only as an accent, not as a full-page brand wash.

Primary references:

- Fluent 2 design system: https://fluent2.microsoft.design/
- Fluent 2 web components overview: https://fluent2.microsoft.design/components/web/react
- Microsoft Teams UI guidance: https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/design/design-teams-app-basic-ui-components
- Fluent UI Web Components: https://learn.microsoft.com/en-us/fluent-ui/web-components/

### Important

**Tailwind CSS is not a design system.** It is a utility framework.

If Tailwind is used, it should implement the design direction above rather than define it.

The current repository convention is static HTML / vanilla JS / offline use. Prefer preserving that unless there is a compelling reason to change it.

A good default implementation path is therefore:

- semantic HTML;
- vanilla JS;
- a dedicated local stylesheet;
- CSS custom properties / design tokens;
- system font stack beginning with Segoe UI;
- inline SVG icons or a tiny vendored icon subset;
- no runtime CDN dependency.

If a build tool is introduced, keep the produced static output committed and make the reason explicit.

---

## Color direction

Keep University of Basel identity present, but let the working-world interface lean toward a restrained Teams / Fluent mood.

Suggested semantic palette:

```css
:root {
  /* University identity */
  --unibas-red: #D20537;
  --unibas-mint: #A5D7D2;

  /* Fluent / Teams-adjacent accent */
  --brand-50: #F5F4FF;
  --brand-100: #ECEBFF;
  --brand-300: #C8C6FF;
  --brand-500: #6264A7;
  --brand-600: #5558A6;
  --brand-700: #464775;

  /* neutrals */
  --bg: #F7F7F9;
  --surface: #FFFFFF;
  --surface-subtle: #F3F3F5;
  --text: #242424;
  --text-secondary: #616161;
  --stroke: #E0E0E0;
  --stroke-strong: #C7C7C7;

  /* semantic */
  --danger: #C50F1F;
  --warning: #8A6D1D;
  --success: #0F7B0F;
}
```

Do not slavishly copy these exact values if the visual result is weak. The principle matters more:

- neutral page;
- white or near-white content surfaces;
- restrained indigo for interactive / M365 translation cues;
- red used sparingly for Uni Basel identity or friction / attention;
- mint as a secondary university accent;
- avoid rainbow coding each section.

---

## Typography

Preferred stack:

```css
font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
```

Hierarchy should feel like editorial information design:

- world name: large, compact, confident;
- world descriptor: short, muted;
- section headings: clear but not oversized;
- role labels / metadata: compact;
- body copy: readable, 15–17px;
- long text kept to sensible line lengths.

Do not turn every label into uppercase microcopy.

---

## Core information architecture

### 1. Atlas / home

Purpose: compare all working worlds quickly.

Each world entry should expose:

- name;
- type;
- one-line description;
- team size;
- rhythm / lifecycle;
- collaboration intensity;
- core tension;
- 2–4 visible people / roles;
- current scenario.

This should feel like a **gallery of working worlds**, not a dashboard.

Strong possibilities:

- full-width editorial rows;
- asymmetric cards;
- one large featured world + smaller worlds;
- compact team diagrams inside each card;
- clear visual markers for "mostly shared", "mixed", "mostly individual", "periodic".

Do not use five identical cards with the same 3-column structure unless the typography and visual storytelling make them genuinely distinct.

---

### 2. World detail — Side A: Their working world

This side is descriptive.

It should answer:

#### Who?
- fictional people;
- roles;
- relationships;
- internal vs external collaborators.

#### What?
- recurring work;
- projects;
- meetings;
- decisions;
- knowledge;
- documents;
- tasks.

#### Where does work live today?
Make the technology landscape visible.

Possible current technologies:

- email;
- Outlook calendar;
- Confluence / intranet;
- ITS-managed shared cloud drive / shared storage;
- local device storage;
- OneDrive;
- Excel lists;
- Word / PowerPoint;
- Zoom / Teams meetings;
- personal notes.

Do **not** label all legacy tools as bad. They may have valid roles.

#### Characteristic challenges
Show 3–6 concrete tensions / frictions.

Examples:

- current state is scattered;
- personal ownership becomes a continuity risk;
- temporary projects cut across permanent structures;
- external participants only need part of the workspace;
- research work moves between private and shared states;
- a commission risks being overengineered.

---

### 3. World detail — Side B: A good M365 working model

This is the translation layer.

The guiding question is:

> Given this working world, how should communication, documents, tasks and shared knowledge be organised?

Structure by work pattern first, then map to M365.

Recommended categories:

#### Communication
- durable team conversation;
- temporary / direct coordination;
- formal / external communication;
- meetings.

#### Documents
- personal drafts;
- shared working documents;
- institutional / durable documents;
- large / specialist / governed research data that stays elsewhere.

#### Tasks
- personal reminders;
- shared commitments;
- recurring processes;
- when Planner is unnecessary.

#### Knowledge
- evolving notes;
- stable reference knowledge;
- institutional information that belongs in another system.

#### Attention / calendar
- meetings;
- notifications;
- working hours;
- focus.

Every category should make clear:

- what changes;
- what stays;
- what M365 supports;
- what remains outside M365.

The best setup is not "everything in Teams".

---

## Main interaction pattern

Provide a strong, obvious switch:

```
[ THEIR WORKING WORLD ]   [ M365 WORKING MODEL ]
```

This can be tabs, segmented control, or a split comparison.

The state should be keyboard accessible and preserve context.

A useful optional third view is:

```
[ COMPARE ]
```

for a side-by-side summary, especially on desktop.

On mobile, stack rather than squeeze.

---

## Visual storytelling patterns

Use diagrams where they explain something real.

### People / collaboration map

Simple nodes and lines are useful if they show:

- stable team;
- adjacent internal team;
- temporary project;
- external collaborator;
- individual contributor.

Avoid decorative org charts.

### Personal → shared → institutional

This should be a recurring visual language.

Example:

```
PERSONAL            SHARED WORK            INSTITUTIONAL
OneDrive  ───────▶  Team / SharePoint ───▶ durable reference
draft               co-authoring           owned by organisation
```

### Current tool landscape

Show where work currently lives, perhaps as a compact ecosystem / constellation:

```
Email      Calendar
   \        /
   TEAM / PERSON
   /    |      \
Shared  Local   Intranet
drive   files
```

### Friction → translation

Small before/after pairings are useful:

```
TODAY                         BETTER MODEL
Decision in chat        →      durable channel post
Attachment copies       →      one shared file + link
Excel side-list         →      shared Planner if team visibility matters
```

Do not imply the right-hand side is universally correct; label it as "our pick for this context" where needed.

---

## Components to use

Keep the component vocabulary small.

Useful:

- avatars / avatar groups;
- tabs / segmented control;
- badges / status labels;
- compact metadata rows;
- callout / insight panel;
- timeline / lifecycle strip;
- people map;
- artefact list;
- friction list;
- "our pick" recommendation block;
- "keep outside M365" block;
- breadcrumb / back link;
- optional module strip at the end.

Avoid:

- KPI cards;
- fake charts;
- progress bars with invented scores;
- accordions for everything;
- modal-heavy interaction;
- excessive pill tags.

---

## Iconography

Prefer Microsoft's Fluent System Icons or visually compatible line icons.

Official source:

https://github.com/microsoft/fluentui-system-icons

Use only a small local subset if icons are needed.

Do not pull icons from a CDN at runtime if offline support is preserved.

Never use icons as the only label.

---

## Accessibility

Must include:

- semantic landmarks;
- real headings;
- buttons for state changes, not clickable divs;
- visible focus rings;
- keyboard-operable tabs / toggles;
- sufficient contrast;
- no meaning conveyed by color alone;
- `prefers-reduced-motion`;
- responsive layouts;
- logical reading order;
- readable text at 200% zoom;
- touch targets approximately 40px+;
- print-friendly world profile.

Aim for WCAG 2.2 AA behaviour.

---

## Responsive behaviour

### Desktop

Use width to show relationships and comparison:

- people map next to team description;
- technology landscape beside friction;
- side-by-side current / M365 comparison where helpful.

### Mobile

Prioritise:

1. world identity;
2. core tension;
3. people;
4. challenge;
5. current setup;
6. M365 translation;
7. decisions / details.

Maps can collapse into lists.

Do not preserve desktop diagrams at unreadable scale.

---

## Print / slide reuse

Each world detail should print cleanly to 1–2 pages.

Screenshots should work without browser chrome.

Consider a dedicated `?print=1` or print stylesheet, but keep it simple.

---

## Content hierarchy rule

The primary experience must remain:

```
TEAM / PERSON
→ HOW THEY WORK
→ WHAT THEY USE TODAY
→ WHAT IS HARD
→ M365 TRANSLATION
→ BOUNDARIES
```

Secondary:

- evidence tags;
- module links;
- detailed consulting decision options;
- trainer prompts.

Do not let secondary metadata dominate the page.

---

## Library decision

### Recommended default

**Do not add Tailwind just because the current UI is weak.**

A weak UI is an information-design problem, not a CSS-library problem.

The strongest fit with this repository is:

- custom CSS;
- Fluent 2-inspired tokens and component proportions;
- Fluent System Icons as a small local subset;
- vanilla JS;
- offline static output.

### If Claude strongly prefers Tailwind

Tailwind 4 can be used as a build-time utility layer, but:

- it must compile to committed static CSS;
- no Play CDN;
- the final page must still open without a development server;
- document the build command;
- do not introduce React solely to use Tailwind;
- do not produce generic shadcn-style cards.

Tailwind docs: https://tailwindcss.com/docs/installation/tailwind-cli

### If React is genuinely useful

Use current Fluent UI React v9:

https://fluent2.microsoft.design/get-started/develop

But only if the interaction complexity justifies changing the repo architecture.

For this showcase, it probably does not.

---

## Definition of visual success

The UI succeeds if someone can open it in a meeting and, within 30 seconds, say:

> "Ah — this research group has a very different collaboration problem from Nora or the commission."

and then switch to the M365 side and say:

> "I see why their setup should also be different."

That contrast is the product.
