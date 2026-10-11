import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex'),references=[];
function read(path){const b=fs.readFileSync(path);references.push({path,sha256:sha(b)});return b;}
const planPath='docs/planning/AFFECT_PUBLIC_EXPERIMENT_PLAN_REV1.json',plan=JSON.parse(read(planPath)),freezeBytes=read('docs/planning/campaign3-affect-model-rev1/FREEZE.json');assert.equal(sha(freezeBytes),plan.modelFreezeSha256);
const freeze=JSON.parse(freezeBytes),models=freeze.models.map(m=>{let initialState;for(const file of m.files){const b=read(file.path);assert.equal(sha(b),file.sha256);if(file.path.endsWith('/initial-state.cenc.hex'))initialState=b.toString().trim();}assert(initialState);return {name:m.name,settings:m.settings,modelIdentity:m.modelIdentity,initialState};});
const retained=[];for(let part=0;part<4;part++){const p=JSON.parse(read(`docs/planning/AFFECT_PUBLIC_EXPERIMENT_REV1_PART${part}.json`));assert.equal(p.part,part);assert.equal(p.parts,4);assert.equal(p.planSha256,sha(fs.readFileSync(planPath)));retained.push(...p.runs);}
assert.equal(retained.length,plan.runs.length);assert.equal(new Set(retained.map(r=>r.name)).size,plan.runs.length);
const runs=plan.runs.map(r=>{const old=retained.find(x=>x.name===r.name);assert(old);assert.equal(old.model,r.model);assert.equal(old.seed,r.seed);assert(models.some(m=>m.name===r.model));return {name:r.name,runIdentity:old.runIdentity};});
const output=JSON.stringify({version:'affect-workbench-fixtures/0.1',references,models,runs},null,2)+'\n',target='src/workbench/affectFixtures.json';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(target,'utf8'),output);else fs.writeFileSync(target,output,{flag:'wx'});
console.log(`PASS AFFECT fixtures: ${models.length} models/${runs.length} programs`);
