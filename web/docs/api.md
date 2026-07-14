# HTTP API

The registry web application exposes read-oriented catalog endpoints:

- `GET /api/entries`
- `GET /api/entries/:type/:id`
- `GET /api/entries/:type/:id/download`
- `POST /api/entries/:type/:id/download`

The generated bootstrap catalog is also available as `index.json` from the
repository and raw-content endpoint. Clients must verify checksums and obtain
capability approval before activation.

Publishing and administrative mutation APIs are not part of this public
read-only contract.
