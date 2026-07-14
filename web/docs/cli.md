# LibreAgents CLI target interface

The planned registry workflow is:

```bash
libreagents appcard create
libreagents appcard validate
libreagents appcard test --mode standalone
libreagents appcard test --mode team
libreagents appcard build
libreagents appcard pack
libreagents appcard publish
```

These commands describe the target interface. Until the publishing CLI is
released, submissions use pull requests and clients consume the generated
catalog endpoints directly.
