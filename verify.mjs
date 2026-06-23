#!/usr/bin/env node
// verify.mjs — run adorable's analyzer over the polyglot test applications in
// this folder and print a per-app coverage report: detected plugins, node
// counts by type, stitch outcomes, and end-to-end flow shape.
//
// Assumes the `adorable` repo is a sibling of this folder:
//   projects/adorable
//   projects/testapplications   <- you are here
//
// Build adorable once (`pnpm --filter @adorable/cli build` in the adorable
// repo), then run:
//   node verify.mjs            # all apps
//   node verify.mjs 06-collab-board 09-recipe-share   # a subset
import { analyze } from '../adorable/packages/cli/dist/index.js';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Each app declares the plugins it is built to exercise. `verify` asserts
// every one of these shows up in adorable's detectedPlugins.
const APPS = [
  { id: '06-collab-board',  expect: ['angular', 'express', 'typeorm', 'bullmq', 'aws-s3-ts', 'ws-ts', 'redirects'] },
  { id: '07-dev-forum',     expect: ['remix', 'state-mgmt', 'fastify', 'drizzle', 'memcache-ts', 'kafkajs', 'elastic-ts'] },
  { id: '08-knowledge-base',expect: ['react-router', 'koa', 'hono', 'hapi', 'sequelize', 'mikroorm', 'knex', 'mongoose', 'amqplib', 'azure-blob-ts', 'gcs-ts', 'supabase', 'grpc-node', 'graphql', 'trpc'] },
  { id: '09-recipe-share',  expect: ['react', 'flask', 'sqlmodel', 'memcache-py', 'celery', 'gcs-py', 'httpx'] },
  { id: '10-live-polls',    expect: ['vue', 'aiohttp', 'tortoise', 'ws-py', 'pika', 'elastic-py'] },
  { id: '11-sensor-hub',    expect: ['react-native', 'tornado', 'peewee', 'pymongo', 'kafkapy', 'azure-blob-py', 'grpcio'] },
  { id: '12-ride-share',    expect: ['vue', 'echo', 'gorm', 'goredis', 'asynq', 'awsgo-s3', 'ws-go'] },
  { id: '13-warehouse',     expect: ['react', 'fiber', 'ent', 'kafkago', 'elastic-go', 'gcs-go', 'memcache-go'] },
  { id: '14-alerting',      expect: ['svelte', 'chi', 'gosqlx', 'amqp091-go', 'azure-blob-go', 'grpcgo'] },
  { id: '15-metrics-dash',  expect: ['svelte', 'actix', 'diesel', 'redisrs', 'lapin', 'gcs-rs'] },
  { id: '16-auth-svc',      expect: ['react', 'warp', 'seaorm', 'reqwest', 'memcache-rs', 'azure-blob-rs', 'ws-rs'] },
  { id: '17-search-svc',    expect: ['vue', 'rocket', 'poem', 'sqlx', 'kafkars', 'elastic-rs', 'mongorust', 'tonic'] },
  { id: '18-banking',       expect: ['react', 'spring', 'jpa'] },
  { id: '19-blog',          expect: ['vue', 'laravel'] },
  { id: '20-devtools',      expect: ['rustcli', 'mcp-server'] },
  { id: '21-deepshop-ts',   expect: ['react', 'express', 'prisma', 'fetch'] },
  { id: '22-deepdesk-py',   expect: ['react', 'fastapi', 'sqlalchemy', 'fetch'] },
  { id: '23-deepfleet-go',  expect: ['react', 'gin', 'gorm', 'fetch'] },
];

const COUNTED = ['APIEndpoint', 'ClientSideAPICaller', 'DatabaseInteraction',
  'DatabaseTable', 'DatabaseSystem', 'FunctionDefinition', 'SourceFile',
  'ClientSideProcess', 'Screen', 'StateStore', 'EnvironmentVariable'];

function counts(store) {
  const out = {};
  for (const t of COUNTED) { const n = store.findNodes(t).length; if (n) out[t] = n; }
  return out;
}

async function runApp(app) {
  const rootDir = path.join(__dirname, app.id);
  if (!fs.existsSync(rootDir)) return { app: app.id, skipped: true };
  const { store, detectedPlugins, sourceFileCount, stitchSummary,
    completeFlowCount, partialFlowCount, schemaSummary } = await analyze({ rootDir, repoName: app.id });
  const missing = (app.expect || []).filter((p) => !detectedPlugins.includes(p));
  return {
    app: app.id, sourceFileCount, detectedPlugins,
    missing, schemaSummary, stitchSummary,
    completeFlowCount, partialFlowCount, nodeCounts: counts(store),
  };
}

(async () => {
  const filter = process.argv.slice(2);
  const apps = filter.length ? APPS.filter((a) => filter.includes(a.id)) : APPS;
  const reports = [];
  for (const app of apps) {
    process.stdout.write(`Analyzing ${app.id}... `);
    try { const r = await runApp(app); reports.push(r);
      process.stdout.write(r.skipped ? 'skipped (not built yet)\n' : (r.missing.length ? `MISSING ${r.missing.join(',')}\n` : 'ok\n'));
    } catch (err) { reports.push({ app: app.id, error: String(err.stack || err) }); process.stdout.write('ERROR\n'); }
  }

  console.log('\n| App | Files | Detected | Missing | Endpoints | Callers | DB ops | Complete | Partial |');
  console.log('|-----|-------|----------|---------|-----------|---------|--------|----------|---------|');
  for (const r of reports) {
    if (r.skipped) { console.log(`| ${r.app} | — | — | — | — | — | — | — | — |`); continue; }
    if (r.error) { console.log(`| ${r.app} | ERROR | | | | | | | |`); continue; }
    const c = r.nodeCounts;
    console.log(`| ${r.app} | ${r.sourceFileCount} | ${r.detectedPlugins.length} | ${r.missing.length ? r.missing.join(',') : '—'} | ${c.APIEndpoint || 0} | ${c.ClientSideAPICaller || 0} | ${c.DatabaseInteraction || 0} | ${r.completeFlowCount} | ${r.partialFlowCount} |`);
  }
  for (const r of reports) {
    if (r.error) console.log(`\n### ${r.app} ERROR\n${r.error}`);
  }
  fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(reports, null, 2));
})();
