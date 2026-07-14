# Skills

A **skill** is a task procedure LibreAgents can follow. Skills use the
[agentskills.io](https://agentskills.io) open standard — a single `SKILL.md`
with YAML frontmatter — so they drop into LibreAgents unchanged.

> Skills use the agentskills.io format (no separate `manifest.json`). MCPs,
> agents, and workflows use the registry's `manifest.json` schema.

## Folder layout

Skills nest by **category**, then skill name:

```
skills/<category>/<name>/
├── SKILL.md          # required — frontmatter + instructions
├── references/       # optional — supporting docs
├── scripts/          # optional — executable helpers
├── templates/        # optional — output examples
├── assets/           # optional — other files
└── icon.svg          # optional — SVG or 512×512 PNG
```

Categories in this registry: `software-development`, `github`, `research`,
`productivity`, … (create a new category folder if yours doesn't fit).

## SKILL.md frontmatter

```yaml
---
name: plan
description: "Plan mode: write markdown plan to .libreagents/plans/, no exec."
version: 1.0.0
author: Your Name
license: MIT
platforms: [linux, macos, windows]
prerequisites:                       # optional
  env_vars: [SOME_API_KEY]
  commands: [curl]
metadata:
  libreagents:
    tags: [planning, workflow]
    category: software-development
    runtime_mode: standalone
    related_skills: [writing-plans]
    # --- registry extensions (optional) ---
    compatibility: { libreagents: "*", client: "*" }
    funding: { address: "0x…", token: "HD", chain: "base" }
---

# Plan Mode

Use this skill when the user wants a plan instead of execution.

## Core behavior
…
```

### Fields

| Field | Required | Notes |
|-------|----------|-------|
| `name` | ✅ | Unique within its category |
| `description` | ✅ | One line; when/what the skill does |
| `version` | ✅ | Semver |
| `author` | ✅ | Name or org |
| `license` | ✅ | SPDX id (e.g. `MIT`) |
| `platforms` | ✅ | Any of `linux`, `macos`, `windows` |
| `prerequisites` | optional | `env_vars`, `commands` the skill needs |
| `metadata.libreagents.tags` | recommended | For search/browse |
| `metadata.libreagents.category` | recommended | Matches the folder |
| `metadata.libreagents.related_skills` | optional | Cross-links |
| `metadata.libreagents.runtime_mode` | required | One of `standalone`, `team`, or `dual` |
| `metadata.libreagents.compatibility` | optional | Registry extension — `{ libreagents, client }` semver ranges |
| `metadata.libreagents.funding` | optional | Registry extension — tip-jar wallet `{ address, token, chain }` |

The registry's `compatibility` and `funding` live under `metadata.libreagents` so the
file stays a valid agentskills.io skill. `build_index.py` reads the frontmatter
(not a manifest) to build `index.json`.

## Body

After the frontmatter, write the actual procedure — what the skill does, when to
use it, and the step-by-step instructions. Reference files in `references/`,
`scripts/`, or `templates/` as needed.

## Checklist

- [ ] Under the right `category/` folder; folder name is the skill `name`
- [ ] `SKILL.md` has valid frontmatter (`python scripts/validate.py`)
- [ ] `license` is exactly `MIT` or `Apache-2.0`
- [ ] `prerequisites` honest — no secrets committed
- [ ] `version` bumped (semver)
- [ ] Icon optional, but if present: SVG or 512×512 PNG

## Attribution

Imported skills retain their original `author`, `source`, and `license`
frontmatter plus any bundled license or notice files. The registry accepts only
skills that explicitly declare `MIT` or `Apache-2.0`; other or ambiguous terms
are omitted.
