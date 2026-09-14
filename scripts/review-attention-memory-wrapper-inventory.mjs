import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const input='docs/planning/ATTENTION_MEMORY_WRAPPER_INVENTORY_REV1.json';
const output='docs/planning/ATTENTION_MEMORY_WRAPPER_REVIEW_REV1.json';
assert(!fs.existsSync(output),'write once');
const packet=JSON.parse(fs.readFileSync(input));
function review(p){
 let checks=0;const check=(ok,why)=>{assert(ok,why);checks++;};
 const byName=new Map(p.records.map(r=>[r.name,r]));
 check(byName.size===p.records.length,'duplicate record');
 const known=new Set([...byName.keys(),...p.external,...p.primitives,...p.proposedIdentities]);
 const refs=t=>t.kind==='ref'?[t.name]:t.kind==='list'?refs(t.element):t.kind==='optional'?refs(t.value):t.kind==='union'?t.alternatives.flatMap(refs):[];
 function type(t){check(['ref','list','optional','union','enum'].includes(t.kind),'unknown type');
  if(t.kind==='ref')check(known.has(t.name),'unresolved type '+t.name);
  if(t.kind==='list'){check(Number.isInteger(t.min)&&Number.isInteger(t.max)&&t.min>=0&&t.max>=t.min&&t.max<=12,'unbounded list');type(t.element);}
  if(t.kind==='optional')type(t.value);
  if(t.kind==='union'){check(t.alternatives.length>=2&&new Set(t.alternatives.flatMap(refs)).size===t.alternatives.length,'ambiguous union');t.alternatives.forEach(type);}
  if(t.kind==='enum')check(t.values.length>0&&new Set(t.values).size===t.values.length,'invalid enum');
 }
 for(const r of p.records){check(new Set(r.fields.map(f=>f.name)).size===r.fields.length,'duplicate field');r.fields.forEach(f=>type(f.type));check(!('typeId' in r),'unreviewed numeric allocation');}
 const field=(r,f)=>byName.get(r)?.fields.find(v=>v.name===f)?.type;
 const isRef=(r,f,t)=>field(r,f)?.kind==='ref'&&field(r,f)?.name===t;
 for(const {input} of p.stageInputs)check(known.has(input),'unresolved stage input');
 for(const r of p.requiredObserverInputs)check(isRef(r,'ObserverId','ObserverId'),'missing required top-level observer '+r);
 for(const r of ['EncodingJoinInput','FormationInput','RecallJoinInput','BoundRecallInput','ReinforcementInput'])check(p.requiredObserverInputs.includes(r),'omitted admission wrapper');
 check(field('ExtendedObservation','EventDetection')?.kind==='optional'&&field('ExtendedObservation','EventDetection').value.name==='CurrentEventDetectionId','missing conditional existing event detection');
 check(isRef('SelectedSpatialWitness','Detection','CurrentDetectionId'),'missing spatial detection attachment');
 check(isRef('SeriesSceneOriginal','SceneDefinitionId','DefinitionId'),'scene content identity substitution');
 check(field('CueExtractionInput','Source')?.kind==='union'&&refs(field('CueExtractionInput','Source')).join('|')==='PositiveCueSource|EmptyCueSource','cue branch is not explicit');
 check(isRef('PositiveCueSource','Preparation','SpatialPreparation'),'cue bypasses actual frozen source');
 check(field('ReinforcementInput','Recollections')?.min===1&&field('ReinforcementInput','Recollections')?.max===2,'reinforcement output bound');
 check(field('RecallResult','Winners')?.max===2&&field('RecallResult','Scores')?.max===4,'recall bounds');
 check(isRef('RecallWinner','Encoding','RetainedEncoding')&&isRef('RecallWinner','Score','RecallScore'),'winner does not carry retained bytes and score');
 const reach=(name,seen=new Set())=>{if(seen.has(name))return seen;seen.add(name);byName.get(name)?.fields.forEach(f=>refs(f.type).forEach(n=>reach(n,seen)));return seen;};
 for(const s of p.storage){const names=reach(s.value);for(const bad of [...p.characterStorageForbiddenReachability,'WorldEventTruth','SpatialPreparation','RecallResult'])if(s.key==='CharacterId')check(!names.has(bad),'forbidden storage reachability '+bad);}
 const retained=reach('RetainedEncoding');check(!retained.has('ProposedRecollectionOccurrenceId'),'episode gains recollection identity');
 check(!reach('ReinforcementInput').has('EpisodeLedger'),'reinforcement receives whole episode ledger');
 check(!reach('EncodingJoinInput').has('TaskConcern'),'nested upstream concern leak');
 check(!reach('EncodingJoinInput').has('WorldEventTruth'),'encoding truth leak');
 check(p.bindingRules.observation.includes('present iff Detections nonempty'),'missing event detection conditional');
 check(p.bindingRules.selected.includes('biject selected unit keys'),'incomplete selected witness rule');
 check(p.bindingRules.recall.includes('unknown graph file may still have baseline winners'),'unknown cue collapsed into absent cue');
 check(p.bindingRules.subject.includes('every owner reader/writer projects independently'),'copied subject replaces projection');
 check(p.outputRules.remaining.includes('not established'),'premature output closure');
 check(p.status==='DRAFT EXACT WRAPPER FIELD INVENTORY; NOT ALLOCATION INPUT'&&p.pending.length===6,'premature whole acceptance');
 return {checks,records:p.records.length,fields:p.records.reduce((n,r)=>n+r.fields.length,0),stageInputs:p.stageInputs.length};
}
const baseline=review(packet),faults=[];
const record=(p,n)=>p.records.find(r=>r.name===n),field=(p,n,f)=>record(p,n).fields.find(x=>x.name===f);
for(const [name,mutate] of [
 ['missing-event-detection',p=>record(p,'ExtendedObservation').fields=record(p,'ExtendedObservation').fields.filter(f=>f.name!=='EventDetection')],
 ['missing-spatial-detection',p=>record(p,'SelectedSpatialWitness').fields=record(p,'SelectedSpatialWitness').fields.filter(f=>f.name!=='Detection')],
 ['optional-owner-observer',p=>field(p,'FormationInput','ObserverId').type={kind:'optional',value:{kind:'ref',name:'ObserverId'}}],
 ['undefined-wrapper',p=>p.stageInputs[0].input='MissingWrapper'],
 ['retain-full-evaluation',p=>record(p,'RetainedEncoding').fields.push({name:'Evaluation',type:{kind:'ref',name:'EncodingEvaluation'}})],
 ['cue-skips-frozen-scene',p=>field(p,'PositiveCueSource','Preparation').type={kind:'ref',name:'ExtendedObservation'}],
 ['recall-leaks-ledger',p=>field(p,'RecallWinner','Encoding').type={kind:'ref',name:'EpisodeLedger'}],
 ['empty-reinforcement',p=>field(p,'ReinforcementInput','Recollections').type.min=0],
 ['unbounded-winners',p=>field(p,'RecallResult','Winners').type.max=13],
 ['scene-identity-substitution',p=>field(p,'SeriesSceneOriginal','SceneDefinitionId').type.name='GovernedContentDefinitionId'],
 ['truth-in-encoding',p=>record(p,'EncodingJoinInput').fields.push({name:'Truth',type:{kind:'ref',name:'WorldEventTruth'}})],
 ['premature-record-allocation',p=>p.records[0].typeId=9999],
 ['premature-whole-acceptance',p=>p.status='ACCEPTED'],
]){const copy=structuredClone(packet);mutate(copy);let reason;try{review(copy);}catch(e){reason=e.message;}assert(reason,'undetected '+name);faults.push({name,reason,detected:true});}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const preserved=[];
for(const path of ['docs/planning/ATTENTION_MEMORY_SYMBOLIC_REVIEW_REV1.json','docs/planning/ATTENTION_MEMORY_STAGE_REVIEW_REV1.json','docs/planning/TRANSACTIONAL_MARKER_TRACKING_REVIEW_REV1.json']){
 const receipt=JSON.parse(fs.readFileSync(path));for(const source of receipt.sources)assert.equal(fp(source.path).sha256,source.sha256,'changed prior source '+source.path);preserved.push(fp(path));
}
for(const source of packet.inputs)assert.equal(fp(source.path).sha256,source.sha256);
fs.writeFileSync(output,JSON.stringify({status:'WRAPPER FIELD/REFERENCE INVENTORY REVIEWED; WHOLE SHAPE WITHHELD',...baseline,faults,
 sources:[input,'docs/planning/ATTENTION_MEMORY_WRAPPER_REVIEW_REV1.md','scripts/build-attention-memory-wrapper-inventory.mjs','scripts/review-attention-memory-wrapper-inventory.mjs'].map(fp),preserved,
 limits:['Static symbolic field/reference/reachability checks and packet corruptions only. No runtime admission or conditional-value proof.','External accepted record implementations are consumed, not requalified by this graph.','No numeric allocation, output-slot closure, model or corpus qualification.']},null,2)+'\n');
console.log({...baseline,faults:faults.length,preserved:preserved.length});
