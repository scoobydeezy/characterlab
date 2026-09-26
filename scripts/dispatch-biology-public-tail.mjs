/** Scheduling only: execute precommitted tail rows while the all-prefix row runs. */
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {pathToFileURL} from 'node:url';import path from 'node:path';
const sha=b=>createHash('sha256').update(b).digest('hex'),plan=JSON.parse(fs.readFileSync('docs/planning/BIOLOGY_PUBLIC_PLAN_REV3.json')),parent='scripts/qualify-biology-public.mjs';
let source=fs.readFileSync(parent,'utf8');assert.equal(sha(source),plan.artifacts.find(a=>a.path===parent).sha256);
const edits=[
 ["from 'vite'",`from ${JSON.stringify(import.meta.resolve('vite'))}`],
 ['outfile=p+`BIOLOGY_PUBLIC_RESULT_PART${part}_REV3.json`',"outfile=p+'BIOLOGY_PUBLIC_AUX_TAIL_REV3.json'"],
 ['for(const [index,row] of runs.entries())if(index%parts===part){','for(const [index,row] of [...runs.entries()].reverse())if(index%parts===3&&index>=31){'],
];
for(const [from,to] of edits){assert.equal(source.split(from).length,2);source=source.replace(from,to);}
const file='docs/planning/biology-public-dispatch-rev1.mjs',manifest='docs/planning/BIOLOGY_PUBLIC_DISPATCH_REV1.json';
const record={status:'SCHEDULING ONLY; SAME FROZEN ROWS AND CHECKS',parent,parentSha256:sha(fs.readFileSync(parent)),planSha256:sha(fs.readFileSync('docs/planning/BIOLOGY_PUBLIC_PLAN_REV3.json')),dispatcherSha256:sha(fs.readFileSync('scripts/dispatch-biology-public-tail.mjs')),generated:file,generatedSha256:sha(source),indices:plan.runs.map((_,i)=>i).filter(i=>i%4===3&&i>=31).reverse(),explanation:'A completed worker takes the final original partition rows in reverse order while its all-prefix main run continues. The exact frozen computation, comparisons and restore checks are unchanged. The original worker reuses completed per-run receipts. No cohort selection or new run.'};
if(!fs.existsSync(file))fs.writeFileSync(file,source,{flag:'wx'});else assert.equal(sha(fs.readFileSync(file)),record.generatedSha256);
if(!fs.existsSync(manifest))fs.writeFileSync(manifest,JSON.stringify(record,null,2)+'\n',{flag:'wx'});else assert.deepEqual(JSON.parse(fs.readFileSync(manifest)),record);
await import(pathToFileURL(path.resolve(file)).href);
