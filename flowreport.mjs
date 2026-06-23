#!/usr/bin/env node
// flowreport.mjs — per-flow diagnostic for the deep (Phase 2) apps.
// For one app it prints every stitched flow with its completeness and the
// hops the walker resolved, so we can correlate "complete" vs
// "function-only"/"partial" with the dispatch pattern each feature uses.
//
//   node flowreport.mjs 21-deepshop-ts
//   node flowreport.mjs 21-deepshop-ts --json
import { analyze } from '../adorable/packages/cli/dist/index.js';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = process.argv[2];
const asJson = process.argv.includes('--json');
if (!app) { console.error('usage: node flowreport.mjs <app-dir> [--json]'); process.exit(1); }

const r = await analyze({ rootDir: path.join(__dirname, app), repoName: app });

const rows = r.flows.map((f) => ({
  completeness: f.completeness,
  process: f.startProcess ? `${f.startProcess.kind}:${f.startProcess.name}` : null,
  startFn: f.startFunction?.name ?? null,
  caller: f.caller ? `${f.caller.httpMethod ?? '?'} ${f.caller.urlLiteral ?? '?'}` : null,
  callerFw: f.caller?.framework ?? null,
  endpoint: f.endpoint ? `${f.endpoint.httpMethod} ${f.endpoint.routePattern}` : null,
  endpointFw: f.endpoint?.framework ?? null,
  matchedBy: f.matchedBy ?? null,
  matchConfidence: f.matchConfidence ?? null,
  serviceHops: (f.serviceHops || []).length,
  databaseHops: (f.databaseHops || []).length,
  dbOps: (f.databaseHops || []).map((h) => `${h.orm ?? h.operation ?? '?'}`).join(','),
}));

const tally = {};
for (const row of rows) tally[row.completeness] = (tally[row.completeness] || 0) + 1;

if (asJson) {
  console.log(JSON.stringify({ app, detectedPlugins: r.detectedPlugins,
    completeFlowCount: r.completeFlowCount, partialFlowCount: r.partialFlowCount,
    tally, flows: rows }, null, 2));
} else {
  console.log(`\n## ${app}`);
  console.log(`endpoints=${r.store.findNodes('APIEndpoint').length} callers=${r.store.findNodes('ClientSideAPICaller').length} complete=${r.completeFlowCount} partial=${r.partialFlowCount}`);
  console.log('completeness tally:', JSON.stringify(tally));
  console.log('');
  console.log('| completeness | process | caller | endpoint | match | svcHops | dbHops |');
  console.log('|---|---|---|---|---|---|---|');
  for (const x of rows) {
    console.log(`| ${x.completeness} | ${x.process ?? '—'} | ${x.caller ?? '—'} | ${x.endpoint ?? '—'} | ${x.matchedBy ?? '—'} | ${x.serviceHops} | ${x.databaseHops} |`);
  }
}
