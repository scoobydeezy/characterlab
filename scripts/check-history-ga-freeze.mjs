// Preserve all original image checks, replacing only one-shot publication with equality.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const script='scripts/review-general-attention-models.mjs',sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
let source=fs.readFileSync(script,'utf8');
function replaceOnce(from,to){assert.equal(source.split(from).length,2);source=source.replace(from,to);}
replaceOnce("from 'vite'","from "+JSON.stringify(import.meta.resolve('vite')));
replaceOnce('assert(!fs.existsSync(out));','assert(fs.existsSync(out));');
replaceOnce("fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\\n');","assert.deepEqual(receipt,JSON.parse(fs.readFileSync(out)),'complete historical image review equality');");
assert(!source.includes('writeFileSync'));
try{
 await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const file='docs/planning/campaign3-general-attention-model-rev2/FREEZE.json',freeze=JSON.parse(fs.readFileSync(file)),proposal=JSON.parse(fs.readFileSync(freeze.proposal.path)),review=JSON.parse(fs.readFileSync(freeze.review.path));
 for(const ref of [freeze.proposal,freeze.review,freeze.script,...freeze.sources])assert.equal(sha(ref.path),ref.sha256);
 const old='docs/planning/general-attention-model-review-rev3',now='docs/planning/campaign3-general-attention-model-rev2',copied=x=>JSON.parse(JSON.stringify(x).replaceAll(old,now));
 assert.deepEqual(freeze.models,copied(proposal.models));assert.deepEqual(freeze.shared,copied(proposal.shared));assert.deepEqual(freeze.budget,proposal.budget);assert.deepEqual(freeze.preservation,review.preservation);assert.deepEqual(freeze.versions,proposal.versions);assert.equal(freeze.seed,proposal.seed);
 for(const f of [...Object.values(freeze.shared),...freeze.models.flatMap(m=>Object.values(m.files))])assert.equal(sha(f.path),f.sha256);
 const result={status:'43 GA MODELS/RUNS;129 NEGATIVE CONTROLS;EXACT FREEZE COPY VERIFIED',models:43,negativeControls:129,preservedModels:35,preservedFiles:247,freeze:{path:file,sha256:sha(file)},historicalReview:freeze.review,scope:'Fresh original image/identity/S0/calendar/declaration-control checks and complete historical receipt equality;no public runtime replay or corpus qualification.',checkerSha256:sha('scripts/check-history-ga-freeze.mjs')};
 const out='docs/planning/campaign3-history-ga-freeze-rev1/';fs.mkdirSync(out,{recursive:true});const dest=out+'canonical-check.json';if(fs.existsSync(dest))assert.deepEqual(JSON.parse(fs.readFileSync(dest)),result);else fs.writeFileSync(dest,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(result.status);
}catch(e){console.error(e.message);process.exitCode=1;}
