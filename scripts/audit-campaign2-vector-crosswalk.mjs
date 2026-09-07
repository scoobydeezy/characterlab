import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),read=path=>fs.readFileSync(new URL(path,root),'utf8'),hash=text=>crypto.createHash('sha256').update(text).digest('hex');
const sources=['docs/planning/EVID_001_DRAFT_RESOLUTION.md','docs/planning/REG_001_DRAFT_RESOLUTION.md','docs/planning/ADAPT_001_RULE_INTERPRETER_DRAFT.md'];
const pattern=/^\| (EVID-[A-T]|REG-[A-R]|AD-E\d+) \|/gm;
const frozen=sources.flatMap(path=>[...read(path).matchAll(pattern)].map(m=>({id:m[1],source:path})));
const path='docs/planning/CAMPAIGN2_INHERITED_VECTOR_CROSSWALK.md',document=read(path),mapped=[...document.matchAll(pattern)].map(m=>m[1]);
assert.equal(frozen.length,51);assert.equal(mapped.length,51);assert.equal(new Set(mapped).size,51);
assert.deepEqual([...mapped].sort(),frozen.map(v=>v.id).sort());
const tests=[...document.matchAll(/`(campaign2[A-Za-z]+\.test\.ts)`/g)].map(m=>'src/test/'+m[1]);
const reports=[...document.matchAll(/`(CAMPAIGN2_[A-Z_]+\.json)`/g)].map(m=>'docs/planning/'+m[1]);
const evidence=[...new Set([...tests,...reports])];for(const p of evidence)assert(fs.existsSync(new URL(p,root)),p);
const report={status:'INVENTORY AUDIT PASS',runtimeVerdict:'NONE',vectors:51,coverageScope:'EVID-A..T, REG-A..R, AD-E1..13 only',
 sourceFingerprints:sources.map(path=>({path,sha256:hash(read(path))})),crosswalk:{path,sha256:hash(document)},evidenceFiles: evidence,
 rows:frozen.map(v=>({...v,disposition:'QUALIFICATION OPEN'})),limitations:['Checks exact ID coverage and evidence-file existence only.','Does not execute or pass any vector.','ADAPT A-D, packaging and complete PRJ/IDN/OBS/SEM inventory remain outside this audit.']};
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_VECTOR_CROSSWALK_AUDIT.json',root),JSON.stringify(report,null,2)+'\n');
console.log(`Inventory audit PASS: ${frozen.length} unique vectors, ${evidence.length} evidence files; no runtime verdict.`);
