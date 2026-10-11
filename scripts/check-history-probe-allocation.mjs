// Replay the original specification checker against its declared historical scope.
// This does not assert that its old directory inventory covers today's repository.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const path='scripts/audit-regulatory-probe-allocation.mjs';
let source=fs.readFileSync(path,'utf8');
function replaceOnce(from,to){assert.equal(source.split(from).length,2,from);source=source.replace(from,to);}
replaceOnce("new URL('../',import.meta.url)",JSON.stringify(new URL('../',import.meta.url).href));
replaceOnce('const raw=p=>fs.readFileSync(new URL(p,root));',`const raw=p=>fs.readFileSync(new URL(p==='docs/formal/CANONICAL_RECORD_REGISTRY.md'?'docs/planning/campaign3-history-allocation-corrections-rev1/CANONICAL_RECORD_REGISTRY.historical.md':p==='docs/formal/REGULATORY_DIAGNOSTIC_PROBE.md'?'docs/planning/campaign3-history-base-allocation-rev1/REGULATORY_DIAGNOSTIC_PROBE.historical.md':p,root));`);
replaceOnce('const all=fs.readdirSync(new URL(prefix,root));',"const all=t.preservedSources.map(s=>s.path.slice(prefix.length));");
replaceOnce("fs.writeFileSync(new URL(prefix+'REGULATORY_PROBE_ALLOCATION_AUDIT.json',root),JSON.stringify(report,null,2)+'\\n');","assert.deepEqual(report,JSON.parse(read(prefix+'REGULATORY_PROBE_ALLOCATION_AUDIT.json')),'exact historical report equality');");
assert(!source.includes('writeFileSync'));
try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));}catch(e){console.error(e.message);process.exitCode=1;}
