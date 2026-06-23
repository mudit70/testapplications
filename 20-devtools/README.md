# 20-devtools

Two small standalone developer tools that exercise adorable's `rustcli` and
`mcp-server` framework plugins.

## Tools

### `cli/` — Rust command-line tool (clap)
A `clap`-derived CLI (`devtool`) with three subcommands:
- `analyze` — analyze a project directory
- `report` — render a report from the latest analysis
- `clean` — remove generated artifacts

Detected by the **rustcli** plugin: `clap` in `Cargo.toml` plus `use clap::...`
and a `fn main()` entry point emit a `ClientSideProcess` (`script_entry`).

### `mcp/` — MCP server (TypeScript)
An MCP server (`devtool-mcp`) built on `@modelcontextprotocol/sdk` exposing
three tools via `server.tool(name, description, schema, handler)`:
- `analyze_project`
- `render_report`
- `clean_artifacts`

Detected by the **mcp-server** plugin: `@modelcontextprotocol/sdk` in
`package.json` dependencies; each `.tool(...)` call is emitted as an
`APIEndpoint` with `httpMethod: 'TOOL'` and `routePattern: 'mcp:<tool>'`.

## Stack

| Component | Language | Framework / SDK            | adorable plugin |
|-----------|----------|----------------------------|-----------------|
| `cli/`    | Rust     | clap (derive)              | rustcli         |
| `mcp/`    | TypeScript | @modelcontextprotocol/sdk | mcp-server      |
