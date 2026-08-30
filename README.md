# ENGG2202 · Teach to Learn

An HKU Engineering Active Learning microsite for helping students move from project experience to evidence, explanation, teaching and contribution.

> **Learn it. Use it. Explain it. Leave something others can build on.**

## What this website contains

- a six-stage ENGG2202 project journey;
- an explanation of the Teach-to-Learn mastery progression;
- a visible six-Gate Student Guide route with detailed Notion resources;
- Green Technology and SDG context for the current course theme;
- a growing directory of student project repositories;
- the Solar Weather Station as the first instructor exemplar.

Formal class dates, assessment submissions and grades remain on the official HKU course platforms.

## Main pages

- `/` — Teach-to-Learn overview
- `/engg2202` — six-stage Project Journey
- `/sdgs` — Green Technology and the complete UN SDG overview
- `/guide` — the six-Gate route and detailed Notion Student Guide
- `/gallery` — student project directory
- `/about` — scope and relationship to the wider Active Learning initiative

## Adding a student project

Project cards are currently defined in `app/gallery/page.tsx`. A published card should link to the project’s public GitHub repository and should only be added after checking:

- evidence and documentation;
- third-party sources and licence status;
- privacy, location and stakeholder consent;
- safety and reliability claims;
- responsible public-release readiness.

Every project in this gallery already sits within the course Green Technology
theme, so cards do not repeat a generic Green Technology label. Instead, each
card displays one or more official SDG icons selected for that project. Before a
new project is added:

- name the relevant SDG goal **and target**, where possible;
- explain the connection in the project repository;
- keep evidence for any environmental or social impact claim;
- do not treat an SDG icon, a solar panel or a sustainability label as proof of impact;
- use official UN icons and follow the UN communication guidelines.

## Local development

```bash
npm ci
npm run dev
```

The site uses Next.js static export. Run the full checks before publishing:

```bash
npm run lint
npm run build
```

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes the static export through GitHub Actions. In repository **Settings → Pages**, select **GitHub Actions** as the source.

## Relationship to the parent project

This repository is adapted from [`hkuenggal/activelearning-web`](https://github.com/hkuenggal/activelearning-web). It preserves the parent site’s Next.js foundation and HKU Engineering connection while developing the ENGG2202 Teach-to-Learn strand as a focused microsite.

## Licence status

The parent repository currently does not include a licence file. A new open-source licence should only be added after the Active Learning team confirms that the inherited code and assets may be relicensed. Until then, contributions and reuse require explicit permission from the rights holders.
