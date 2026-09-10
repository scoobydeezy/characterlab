// Generated public-run cohort evidence, not a whole Campaign-2 verdict.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {cognitiveDeclarationTools} from './cognitive-model-declarations.mjs';
const output='docs/planning/COGNITIVE_RUNTIME_COHORT_REV1.json';
assert(!fs.existsSync(output),'preserve existing evidence; issue a new revision');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(dir+'/'+e.name):[dir+'/'+e.name]);}
const paths=[...files('src').filter(p=>p.endsWith('.ts')),'scripts/audit-cognitive-runtime.mjs','scripts/cognitive-model-declarations.mjs','docs/planning/campaign2-task-cognitive-model/FREEZE.json'];
const fingerprint=()=>paths.map(path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')})),before=fingerprint();
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const t=await cognitiveDeclarationTools(server),{c,r,id,f}=t,{canonicalEncode:enc,list,set,unsigned:u,signed}=c;
 const {prepareCognitiveModel,createCognitiveRun}=await server.ssrLoadModule('/src/campaign2/cognitiveFactory.ts');
 const {decodeCognitive:decode}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts');
 const {AuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {semanticReferentFromAuthoredContent:referent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts');
 const {governedContentDefinitionId:definition}=await server.ssrLoadModule('/src/substrate/contentDefinitionId.ts');
 const C=referent(definition('character/bridge-subject')),observer=id(1000,'observer/bridge-subject');
 function data(){const initial=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:observer}]},value:r(267,[C])},{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r(294,[C,id(1029,'variable/fixture-regulation')])}]},value:r(299,[signed(-50)])},...['a','b'].flatMap((n,i)=>{const key=r(371,[C,referent(definition('content/task-'+n))]);return [{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key}]},value:r(372,[u(1)])},{path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey',key}]},value:r(390,[id(1027,'definition/task-instruction-'+(i?'two':'one'))])}];})]);return {initialState:enc(initial.canonicalValue()),runSeed:new Uint8Array(32),orderedInputs:enc(list([1,2,3,4,5,6].map(at=>{const probe=at===1||at===5;return list([signed(at),u(probe?110:40),id(1001,probe?'event/regulatory-diagnostic-probe':'event/deliberation-opportunity'),probe?r(333,[id(1027,'definition/regulatory-diagnostic-probe')]):r(377,[observer,id(1027,'definition/task-workspace')]),list([])]);}))) };}
 const results=[];
 for(const recipe of t.recipes){
  const run=await createCognitiveRun(await prepareCognitiveModel(t.source(recipe)),data());let instants=0;while(await run.settleNextInstant())instants++;
  const s=run.snapshot(),trace=decode(s.trace).items,outputs=decode(s.outputs).items;
  const resolutions=outputs.filter(v=>v.schema?.typeId===409n),qualifications=outputs.filter(v=>v.schema?.typeId===429n),counts=outputs.filter(v=>v.schema?.typeId===433n).map(v=>Number(f(v,3).value));
  const draws=trace.flatMap(v=>f(v,14).items),history=decode(s.state).items.map(v=>f(v,2)).filter(v=>v.schema?.typeId===414n).flatMap(v=>f(v,1).items);
  const result={recipe,instants,traceRows:trace.length,outputCount:outputs.length,resolutionTags:resolutions.map(v=>Number(f(f(v,4),1).value)),qualificationTags:qualifications.map(v=>Number(f(f(v,3),1).value)),completedCounts:counts,drawCount:draws.length,identityEntries:history.length,saveDigest:createHash('sha256').update(run.save()).digest('hex')};
  assert(instants>0);if(recipe==='baseline'){assert.equal(resolutions.length,4);assert(draws.length>0);assert(history.length>0);}if(recipe==='execution-blocked')assert(counts.every(n=>n===0));if(recipe==='workspace-zero')assert.equal(draws.length,0);
  results.push(result);console.log(JSON.stringify(result));
 }
 assert.deepEqual(fingerprint(),before);
 fs.writeFileSync(output,JSON.stringify({status:'21 FROZEN RECIPES EXECUTED THROUGH PUBLIC FACTORY',results,sourceFingerprints:before,limits:['Finite six-original-event cohort only.','No whole vector qualification or reduction verdict follows from successful execution.','History-boundary recipe does not yet test its 64-entry boundary.','Additional PERSIST-I adversarial controls remain open.']},null,2)+'\n');
}finally{await server.close();}
