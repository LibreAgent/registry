# Getting started

Browse the catalog website or fetch the generated `index.json` to discover
LibreAgents entries. Each catalog row includes a stable ID, version, license,
runtime mode, compatibility declaration, path, and content checksum.

Before installing an entry:

1. Confirm its `runtimeMode` supports `standalone`, `team`, or both (`dual`).
2. Review its requested permissions, prerequisites, and external services.
3. Verify the downloaded folder against the catalog checksum.
4. Review the entry's MIT or Apache-2.0 license and third-party notices.
5. Approve capabilities before activation.

Catalog discovery never activates an entry automatically. A local LibreAgents
client may clone an approved entry without requiring a Team server.
