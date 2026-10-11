import fs from 'node:fs';
import assert from 'node:assert/strict';
import {fp} from './replay-history-ga-stage-helpers.mjs';
const packetPath='docs/planning/GA_ACQUISITION_RECALL_STAGE_CLOSURE_REV1.json';
const original=JSON.parse(fs.readFileSync(packetPath)),rows=[];
for(const suffix of ['', '-rev2']){
 const path='scripts/review-ga-acquisition-recall-stage-closure'+suffix+'.mjs';
 const source=fs.readFileSync(path,'utf8');
 const start=source.indexOf('function validate(p){'),end=source.indexOf('\nvalidate(original);');
 assert(start>=0&&end>start);
 const validate=Function('assert',source.slice(start,end)+'\nreturn validate;')(assert);
 validate(original);
 for(const field of ['reads','writes']){
  const p=structuredClone(original);p.stages.find(s=>s.name==='current-visual-encoding')[field]=['LocalReserveState'];
  let rejected=false;try{validate(p);}catch{rejected=true;}
  assert.equal(rejected,field==='writes'||suffix==='-rev2');
  rows.push({reviewer:path,field,rejected});
 }
 assert(source.includes("['encoder-physical-read',p=>stage(p,'current-visual-encoding')."+(suffix?'reads':'writes')+"=['LocalReserveState']]"));
}
const result={status:'PASS; HISTORICAL VALIDATOR COVERAGE CORRECTION REPRODUCED',packet:fp(packetPath),reviewers:['scripts/review-ga-acquisition-recall-stage-closure.mjs','scripts/review-ga-acquisition-recall-stage-closure-rev2.mjs'].map(fp),checker:fp('scripts/probe-history-ga-stage-read-guard.mjs'),rows,finding:'The REV1 fault label says read but mutates writes. A real encoder physical read passes REV1 and is rejected by REV2. Both reject writes. This is a symbolic validator coverage gap, not evidence that the runtime allowed physical reads.',limits:['No historical receipt rewritten. Identical fault names and PASS status do not imply identical exercised boundaries.']};
const out='docs/planning/campaign3-history-ga-stages-rev1/read-guard-witness.json';
if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.rows));
