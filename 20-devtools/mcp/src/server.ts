import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

/**
 * devtool-mcp — a small MCP server that exposes project maintenance
 * helpers as MCP tools. Each `server.tool(...)` registration is
 * surfaced by adorable's mcp-server plugin as an APIEndpoint with
 * httpMethod 'TOOL'.
 */
const server = new McpServer({
  name: 'devtool-mcp',
  version: '0.1.0',
});

server.tool(
  'analyze_project',
  'Analyze a project directory and return discovered issues.',
  { path: z.string() },
  async ({ path }) => ({
    content: [{ type: 'text', text: `Analyzed ${path}` }],
  }),
);

server.tool(
  'render_report',
  'Render the most recent analysis as a formatted report.',
  { format: z.enum(['text', 'json']) },
  async ({ format }) => ({
    content: [{ type: 'text', text: `Report rendered as ${format}` }],
  }),
);

server.tool(
  'clean_artifacts',
  'Remove generated build artifacts and optional caches.',
  { all: z.boolean() },
  async ({ all }) => ({
    content: [{ type: 'text', text: all ? 'Cleaned everything' : 'Cleaned artifacts' }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
