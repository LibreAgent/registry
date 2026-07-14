# Licensing and public publication policy

This policy defines the license gate for the public LibreAgents Registry.

## Registry license

LibreAgents-owned registry tooling, schemas, and documentation are licensed
under the repository's [MIT License](LICENSE), unless a file says otherwise.
The MIT License does not replace an imported artifact's item-level license and
does not grant rights in LibreAgents Corp. trademarks. See
[TRADEMARKS.md](TRADEMARKS.md) and
[THIRD_PARTY_LICENSE_NOTICES.md](THIRD_PARTY_LICENSE_NOTICES.md).

## Imported catalog inventory

The imported skill catalog was audited against source revision
`9eac45a2beba230414b9bcf2041b5ff407d3c935`. Of 349 skill cards, 292 declared
an accepted license. Six runtime-specific cards were then omitted rather than
being relabeled as LibreAgents-compatible, leaving 286 published skills:

| Declared skill license | Retained |
|---|---:|
| MIT | 195 |
| Apache-2.0 | 91 |

The other 57 license-ineligible skill entries were omitted: 17 proprietary,
16 missing a license, 10 unspecified, 8 under developer-specific terms, 4
referring to other terms, 1 proprietary entry with separate terms, and 1 ISC
entry.

The published catalog also contains 17 MIT agents, 11 MIT workflows, 30 MIT
MCP definitions, and 4 Apache-2.0 MCP definitions. Twenty-one MCP definitions
without a declared license and the unlicensed model-provider catalog were
omitted. The resulting catalog contains 348 entries: 253 MIT and 95
Apache-2.0.

These values are declarations in imported metadata. A declaration of `MIT` is
not, by itself, proof that the contributor had the right to license every file,
dependency, model, image, or other asset in that entry.

## Public PAR gate

The LibreAgents PAR publishes only entries on a reviewed
allowlist. An entry is eligible only when all of the following are verified:

1. Its declared license is MIT or Apache-2.0.
2. The corresponding license text or authoritative upstream license is
   recorded.
3. Source, author, and imported provenance metadata are complete.
4. Bundled files, dependencies, models, media, and other assets do not add
   incompatible or ambiguous terms.
5. Required attribution and notices are preserved.
6. The entry passes schema, capability, compatibility, supply-chain, and
   LibreAgents runtime checks.

Entries that are missing evidence, use a different license, or carry ambiguous
terms are excluded from the public catalog and public artifacts until
separately reviewed and approved.

Registry CI must build the public catalog from the reviewed allowlist. It must
not publish an entry solely because `index.json` contains an accepted license
identifier.
