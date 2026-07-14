# LibreAgents Public Agent Registry

The LibreAgents Public Agent Registry provides portable agents, AppCards, skills, and workflows tested for the LibreAgents runtime. It provides a stable way to discover, inspect, install, and publish agents across standalone and Team environments.

The registry is designed to support local-first use without requiring a Team server. A user can select an AppCard from the public catalog and clone it into a local LibreAgents registry. The same catalog can also distribute agents intended for Team deployments.

LibreAgents is an independent platform with its own schemas, compatibility contract, runtime modes, validation policy, branding, and release process. Third-party entries retain required attribution in the dedicated license notices file, but inclusion does not imply affiliation, sponsorship, or endorsement.

## Registry endpoints

- Repository: <https://github.com/LibreAgent/registry>
- Catalog website: <https://registry.libreagents.com/>
- Product website: <https://www.libreagents.com/registry>
- Machine-readable catalog: <https://registry.libreagents.com/v1/appcards/index.json>
- Raw bootstrap catalog: <https://raw.githubusercontent.com/LibreAgent/registry/main/index.json>

Published source entries are limited to the approved MIT and Apache-2.0 set. Former-runtime-specific entries, entries without a declared license, and the unlicensed model-provider catalog are omitted. Required source attribution is consolidated in [THIRD_PARTY_LICENSE_NOTICES.md](THIRD_PARTY_LICENSE_NOTICES.md), with item-level license and notice files preserved beside their entries.

## Registry website and edge API

The public website is a dependency-free static Agent Hub under [`public/`](public/).
It uses the AirVeo Blue Glass design tokens and reads the same generated
`index.json` used by clients. Search, type filters, paging, license metadata,
runtime modes, and source links are rendered in the browser without a separate
application server.

[`worker/worker.js`](worker/worker.js) is the Cloudflare Worker source for
`registry.libreagents.com`. It serves the static website, health route, and
machine-readable catalog from this repository with restricted paths, explicit
content types, CORS, caching, and browser security headers.

## AppCards

An AppCard is the portable, machine-readable description of an agent. It tells a person or client application what the agent does, which runtime modes it supports, what capabilities it requests, where its source artifact came from, and how to verify the installable bundle.

The canonical LibreAgents AppCard is the public registry contract. Other supported agent formats are import inputs; adapters normalize them into this contract before publication.

```yaml
apiVersion: appcards.libreagents.com/v1alpha1
kind: AppCard

metadata:
  id: research-assistant
  version: 1.0.0
  name: Research Assistant
  description: Collects sources and produces an attributed research brief.
  publisher: example-publisher
  license: MIT

spec:
  source:
    format: libreagents
    path: source/agent.yaml

  runtime:
    engine: libreagents
    mode: dual
    entrypoint: dist/agent.bundle

  compatibility:
    libreagents: ">=1.0.0"
    client: ">=1.0.0"

  capabilities:
    - network.read
    - files.workspace.write

  artifact:
    url: https://registry.libreagents.com/v1/appcards/research-assistant/1.0.0/agent.bundle
    sha256: REPLACE_WITH_RELEASE_DIGEST
```

The schema is versioned. Clients must reject unsupported major schema versions and must not silently infer missing permissions or runtime requirements.

## Runtime modes

Every AppCard declares exactly one `spec.runtime.mode` value so compatibility is visible before installation.

| Mode | Meaning |
|---|---|
| `standalone` | Runs on an individual device without required LibreAgents Team services. |
| `team` | Requires LibreAgents Team services for one or more capabilities such as shared state, centralized scheduling, governed credentials, or organization policy. |
| `dual` | The same immutable agent bundle supports both environments. Deployment-specific grants, credentials, storage, and scheduling are supplied by the selected runtime. |

An AppCard may also declare optional features per environment, but it must not label itself `dual` when its core function fails in either mode.

## Source-format compatibility

LibreAgents should not maintain multiple runtime implementations for multiple source formats. Instead, registry tooling uses import adapters and a canonical intermediate representation:

```text
source document
  -> format adapter
  -> canonical LibreAgents representation
  -> schema and policy validation
  -> deterministic compiler
  -> immutable agent bundle
  -> standalone/team runtime tests
  -> signed catalog entry
```

The planned adapter identifiers are:

| Identifier | Purpose |
|---|---|
| `libreagents` | Native LibreAgents AppCard and agent source. |
| `legacy-agent-json` | Import compatible legacy agent JSON documents. |
| `native-agent-manifest` | Import compatible manifest-based agent JSON or TOML documents. |
| `visual-flow-json` | Import compatible visual agent-flow JSON documents. |

Each adapter must:

1. Validate its source document against a pinned input schema.
2. Preserve the original source and provenance metadata.
3. Normalize capabilities, tools, prompts, models, memory, and entrypoints.
4. Fail on unsupported behavior rather than silently dropping it.
5. Emit the same canonical LibreAgents representation.
6. Pass the runtime-mode test matrix declared by the AppCard.

This keeps the catalog compatible with established formats while giving LibreAgents one stable installation and execution contract. New source formats can be added as adapters without changing existing AppCards or runtimes.

## Target entry layout

```text
agents/<appcard-id>/
  appcard.yaml
  README.md
  LICENSE
  source/
    ...original or native source...
  dist/
    agent.bundle
  tests/
    ...adapter and runtime fixtures...
```

Published versions are immutable. A changed agent is released under a new semantic version and receives a new artifact digest.

## Discover and install

A LibreAgents client will:

1. Fetch the signed catalog index.
2. Display AppCard metadata, license, requested capabilities, publisher, and runtime mode.
3. Download the selected immutable bundle.
4. Verify its digest and, when available, publisher signature.
5. Ask the user or Team administrator to approve capabilities.
6. Clone the AppCard into the selected local or Team registry.
7. Activate it using environment-specific grants and credentials.

Catalog discovery never activates an agent automatically.

## Develop and publish an agent

A publishable agent should contain complete metadata, documentation, an explicit license, capability declarations, a versioned entrypoint, and tests. Authors should validate and run an agent locally before submitting it to the public catalog.

The planned LibreAgents CLI workflow is:

```bash
libreagents appcard create
libreagents appcard validate
libreagents appcard test --mode standalone
libreagents appcard test --mode team
libreagents appcard build
libreagents appcard pack
libreagents appcard publish
```

These commands describe the target interface and are not yet a promise that every command is implemented. Until publishing automation is available, submissions use a pull request containing the AppCard, source, documentation, license, tests, and generated lock metadata.

Registry validation will check:

- AppCard and source schema validity
- globally unique ID and semantic version
- supported runtime mode and successful declared-mode tests
- capability and secret declarations
- acceptable license metadata and required notices
- deterministic bundle output and SHA-256 digest
- adapter compatibility without discarded required behavior
- prohibited secrets, unsafe paths, and undeclared network access
- publisher identity and signature when signing is enabled

## Importing existing agents

Compatible MIT- or Apache-2.0-licensed agents may be imported when their license, copyright notice, source URL, source revision, and transformation history are preserved. An imported agent becomes a LibreAgents AppCard and bundle, but its provenance remains available for audit.

Every imported entry should record at least:

```yaml
provenance:
  sourceUrl: https://example.invalid/source
  sourceRevision: immutable-revision
  importedAt: 2026-01-01T00:00:00Z
  adapter: legacy-agent-json
  adapterVersion: 1.0.0
  modifications:
    - Normalized metadata into the LibreAgents AppCard schema.
```

Imported entries must satisfy the same validation, security, licensing, and runtime-mode requirements as native entries.

## License and trademark

The LibreAgents registry software, schemas, and documentation are licensed under the [MIT License](LICENSE). Individual AppCards, agent sources, and bundled dependencies may have their own licenses; each entry must identify them clearly.

**LibreAgents™** is a trademark of LibreAgents Corp. The MIT License grants rights to software and documentation, not rights to use LibreAgents trademarks. See [TRADEMARKS.md](TRADEMARKS.md).

## Security

Treat every registry entry as untrusted until validation and user approval are complete. Never commit API keys, access tokens, private credentials, personal data, or production secrets. Report suspected security issues privately to the repository maintainers rather than opening a public issue containing exploit details.
