# Publishing

A publishable entry must include:

- a globally unique ID and semantic version;
- an exact `MIT` or `Apache-2.0` license declaration;
- original author and source attribution;
- `compatibility.libreagents` and `compatibility.client` ranges;
- `runtimeMode: standalone | team | dual`;
- complete permission, prerequisite, dependency, and secret-reference metadata;
- an entry document and any required tests or bundled license files.

Skills use `SKILL.md` with registry extensions under
`metadata.libreagents`. Agents, MCP definitions, and workflows use the
LibreAgents manifest schemas under `schemas/`.

Run `python scripts/validate.py` and `python scripts/build_index.py` before
submitting a pull request. Generated catalogs must not be edited by hand.
