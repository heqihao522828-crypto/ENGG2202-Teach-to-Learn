# ENGG2202 · Teach to Learn

An HKU Engineering Active Learning microsite for helping students move from project experience to evidence, explanation, teaching and contribution.

> **Learn it. Use it. Explain it. Teach it forward.**

## What this website contains

- a six-stage ENGG2202 project journey;
- an explanation of the Teach-to-Learn mastery progression;
- links to the staged student guide in Notion;
- Green Technology and SDG context for the current course theme;
- a growing directory of student project repositories;
- the Solar Weather Station as the first instructor exemplar.

Formal class dates, assessment submissions and grades remain on the official HKU course platforms.

## Main pages

- `/` — Teach-to-Learn overview
- `/engg2202` — six-stage Project Journey
- `/guide` — how the staged Notion guide works
- `/gallery` — student project directory
- `/about` — scope and relationship to the wider Active Learning initiative

## Adding a student project

Project cards are currently defined in `app/gallery/page.tsx`. A published card should link to the project’s own repository and should only be added after checking:

- evidence and documentation;
- third-party sources and licence status;
- privacy, location and stakeholder consent;
- safety and reliability claims;
- responsible public-release readiness.

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

