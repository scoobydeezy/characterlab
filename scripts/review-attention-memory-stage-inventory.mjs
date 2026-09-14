import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const input='docs/planning/ATTENTION_MEMORY_STAGE_INVENTORY_REV1.json',output='docs/planning/ATTENTION_MEMORY_STAGE_REVIEW_REV1.json';assert(!fs.existsSync(output));const packet=JSON.parse(fs.readFileSync(input));
function review(p){let checks=0;const check=(ok,message)=>{assert(ok,message);checks++;},byName=new Map(p.stages.map(s=>[s.name,s]));check(byName.size===p.stages.length,'duplicate stage');
 const owners={EpisodeLedger:'attention-episode-formation',AssociationGraph:'attention-association-update',PresentationLedger:'attention-presentation-update',ContinuantState:'perception',EventFileState:'perception',TrackingWindow:'perception'};
 for(const s of p.stages){check([0,10,11,12,13,14,15,40,130,140].includes(s.phase),'invalid phase');check(s.input!=='AutomaticAdaptationInput','automatic adaptation input');
  for(const n of s.next){check(byName.has(n),'undefined child');check(byName.get(n).phase>=s.phase,'phase reversal');}
  for(const w of s.writes){check(owners[w]===s.authority,'wrong write owner');check(s.reads.includes(w),'missing expected-old read');if(p.invariants.charWrites.includes(w)){check(s.reads.includes('IDN')&&s.projection==='required ObserverId -> qualified CharacterId','writer missing actual projection');check(s.route.includes('route/character-learning'),'writer omitted learning route');}}
  if(s.additionalCompletedParent){check(s.additionalCompletedParent==='delivery'&&s.phase===40,'invalid second parent');check(s.reads.includes('IDN')&&s.target==='exact receiving original event + instant','unbound join subject/target');}
 }
 for(const name of ['evaluate','retain','rank','recollect'])check(byName.get(name).writes.length===0,'read/evidence stage writes');
 check(byName.get('rank').reads.join('|')==='IDN|EpisodeLedger|AssociationGraph|PresentationLedger','incomplete rank read domain');
 check(byName.get('form').writes.join('|')==='EpisodeLedger'&&byName.get('associate').writes.join('|')==='AssociationGraph','formation ownership collapse');
 check(byName.get('seed-presentation').authority===byName.get('reinforce').authority,'two presentation owners');
 check(byName.get('retain').route.includes('route/character-learning'),'retention route absent');
 check(byName.get('observe').next.includes('empty-select')&&byName.get('observe').next.includes('cue'),'missing no-detection branches');
 const longest=(name,target,visited=[])=>{check(!visited.includes(name),'cycle');if(name===target)return 1;const options=byName.get(name).next.map(n=>longest(n,target,[...visited,name])).filter(n=>n>0);return options.length?1+Math.max(...options):0;};
 const formation=longest('world','seed-presentation')+1,cue=longest('world','reinforce')+1;check(formation===p.bounds.positiveFormationStages&&cue===p.bounds.positiveCueStages,'incorrect local event bound');
 check(p.bounds.includesDelivery&&p.bounds.excludesEarlierConcernAcquisition&&p.bounds.notRuntimeWorkQualification,'local count promoted to runtime work');
 check(p.status==='REVIEWABLE STAGE INVENTORY; NOT CANONICAL DECLARATIONS'&&p.unresolved.length===5,'premature canonical acceptance');
 return {checks,stages:p.stages.length,wrappers:Object.keys(p.wrappers).length,formation,cue};
}
const baseline=review(packet),faults=[];
for(const [name,change] of [
 ['rank-writes-memory',p=>p.stages.find(s=>s.name==='rank').writes.push('EpisodeLedger')],
 ['episode-writer-updates-graph',p=>p.stages.find(s=>s.name==='form').writes.push('AssociationGraph')],
 ['drop-roster-projection',p=>p.stages.find(s=>s.name==='associate').reads=['AssociationGraph']],
 ['omit-presentation-candidates',p=>p.stages.find(s=>s.name==='rank').reads.pop()],
 ['erase-second-parent-binding',p=>p.stages.find(s=>s.name==='encoding-join').target='same time only'],
 ['phase150-domain-work',p=>p.stages.find(s=>s.name==='retain').phase=150],
 ['admit-automatic-input',p=>p.stages.find(s=>s.name==='form').input='AutomaticAdaptationInput'],
 ['omit-learning-route',p=>p.stages.find(s=>s.name==='retain').route=[]],
 ['count-as-runtime-proof',p=>p.bounds.notRuntimeWorkQualification=false],
 ['extra-work-cycle',p=>p.stages.find(s=>s.name==='seed-presentation').next=['associate']],
]){const copy=structuredClone(packet);change(copy);let reason;try{review(copy);}catch(e){reason=e.message;}assert(reason,'undetected '+name);faults.push({name,reason,detected:true});}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const prior='docs/planning/ATTENTION_MEMORY_SYMBOLIC_REVIEW_REV1.json';for(const source of JSON.parse(fs.readFileSync(prior)).sources)assert.equal(fp(source.path).sha256,source.sha256);
fs.writeFileSync(output,JSON.stringify({status:'STAGE/AUTHORITY INVENTORY REVIEWED; WHOLE CANONICAL DECLARATIONS WITHHELD',...baseline,faults,sources:[input,'docs/planning/ATTENTION_MEMORY_DECLARATION_REVIEW_REV1.md','scripts/build-attention-memory-stage-inventory.mjs','scripts/review-attention-memory-stage-inventory.mjs'].map(fp),preserved:fp(prior),limits:['Static graph/authority checks only; no production admission, state writer, output allocator or runtime work proof.','Exact wrapper schemas and upstream concern acquisition remain open. Tracking component rehydration requires explicit disposition.']},null,2)+'\n');console.log({...baseline,faults:faults.length});
