# Registry contract

The LibreAgents Public Agent Registry contains four source entry types:

| Type | Folder | Source contract |
|---|---|---|
| Skill | `skills/` | `SKILL.md` plus `metadata.libreagents` |
| MCP definition | `mcp/` | `manifest.json` |
| Agent | `agents/` | `manifest.json` plus `AGENT.md` |
| Workflow | `workflows/` | `manifest.json` plus `workflow.json` |

`index.json` is the machine-readable catalog. `categories.json` is its derived
taxonomy. Both files are generated from source entries and include content
checksums.

Every entry declares exactly one runtime mode:

- `standalone`: no required Team service;
- `team`: requires LibreAgents Team services;
- `dual`: the same immutable source supports both environments.

The public catalog contains only approved MIT or Apache-2.0 entries. Attribution
and source provenance are recorded in `THIRD_PARTY_LICENSE_NOTICES.md`.
