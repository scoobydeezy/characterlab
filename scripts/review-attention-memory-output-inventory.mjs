import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const input='docs/planning/ATTENTION_MEMORY_OUTPUT_INVENTORY_REV1.json',output='docs/planning/ATTENTION_MEMORY_OUTPUT_REVIEW_REV1.json';assert(!fs.existsSync(output),'write once');
const packet=JSON.parse(fs.readFileSync(input));
function review(p){
 let checks=0,cases=0;const check=(ok,why)=>{assert(ok,why);checks++;};
 const by=new Map(p.stages.map(s=>[s.name,s]));check(by.size===22&&p.stages.length===22,'stage closure');
 const wrapper=JSON.parse(fs.readFileSync('docs/planning/ATTENTION_MEMORY_WRAPPER_INVENTORY_REV1.json'));
 const known=new Set([...wrapper.records.map(r=>r.name),...wrapper.external]);
 for(const s of p.stages)for(const name of Object.keys(s.outputs))check(known.has(name),'unresolved output '+name);
 check(Object.keys(by.get('track').slots).length===0,'tracking allocated shared slots');
 check(Object.keys(by.get('freeze').slots).length===0,'experience allocated twice');
 for(const s of ['form','associate','seed-presentation','reinforce','classify'])check(Object.keys(by.get(s).slots).length===0,'unearned void slot');
 check(by.get('observe').slots.ReservedExperienceId==='positive','unconditional experience reservation');
 check(by.get('observe').slots.EventDetectionOccurrenceId==='positive','event detection branch mismatch');
 for(const s of ['select','empty-select'])check(JSON.stringify(by.get(s).slots)===JSON.stringify({SelectionOccurrenceId:1}),'duplicate selected identity');
 check(JSON.stringify(by.get('recollect').slots)===JSON.stringify({ProposedRecollectionOccurrenceId:'w'}),'recollection allocation not per winner');
 check(Object.keys(by.get('delivery').slots).length===0,'duplicate concern occurrence');
 const bounds={};const examples={};
 for(const purpose of ['formation','cue'])for(let n=0;n<=3;n++)for(let q=0;q<=n;q++)for(let newTracks=0;newTracks<=n;newTracks++)for(let retains=0;retains<=(purpose==='formation'&&q>0?1:0);retains++)for(let w=0;w<=(purpose==='cue'&&n>0?2:0);w++){
  const c={n,q,newTracks,positive:Number(n>0),retains,w};
  const conditions={always:true,positive:n>0,positiveFormation:purpose==='formation'&&n>0,emptyFormation:purpose==='formation'&&n===0,formation:purpose==='formation',retainedFormation:purpose==='formation'&&retains===1,cue:purpose==='cue',winningCue:purpose==='cue'&&w>0};
  const value=v=>{check(Number.isInteger(v)||Object.hasOwn(c,v),'unknown cardinality');return Number.isInteger(v)?v:c[v];};
  const totals={events:0,outputs:0,runtimeSlots:0};let tracks=0,events=0;
  for(const s of p.stages){check(Object.hasOwn(conditions,s.when),'unknown branch');if(!conditions[s.when])continue;totals.events++;totals.outputs+=Object.values(s.outputs).reduce((a,v)=>a+value(v),0);totals.runtimeSlots+=Object.values(s.slots).reduce((a,v)=>a+value(v),0);tracks+=value(s.fileCounters.ObserverTrackSequence??0);events+=value(s.fileCounters.ObserverEventSequence??0);}
  check(tracks===newTracks&&events===c.positive,'observer counters conflated with shared allocator');
  const expected=purpose==='formation'?{events:n?13+3*retains:7,outputs:n?10+2*n+q+retains:7,runtimeSlots:n?8+2*n+q:6}:{events:n?13+Number(w>0):7,outputs:n?9+2*n+q+w:6,runtimeSlots:n?7+2*n+q+w:5};
  for(const k of Object.keys(expected))check(totals[k]===expected[k],'branch '+purpose+' '+k+' mismatch');
  const key=(n?'positive':'empty')+(purpose==='formation'?'Formation':'Cue');bounds[key]??={events:0,outputs:0,runtimeSlots:0};
  for(const k of Object.keys(totals))bounds[key][k]=Math.max(bounds[key][k],totals[k]);
  if(n===3&&q===3&&newTracks===3&&(purpose==='formation'?retains===1:w===2))examples[key]={operands:c,...totals};cases++;
 }
 for(const [branch,b] of Object.entries(bounds))for(const [key,value] of Object.entries(b))check(p.maxima[branch]?.[key]===value,'incorrect maximum '+branch+'/'+key);
 check(p.status==='DRAFT LOCAL OUTPUT AND SLOT INVENTORY; NOT RUNTIME QUALIFICATION'&&p.pending.length===4,'premature runtime qualification');
 return {checks,cases,maxima:bounds,examples};
}
const baseline=review(packet),faults=[];const s=(p,n)=>p.stages.find(s=>s.name===n);
for(const [name,mutate] of [
 ['double-experience',p=>s(p,'freeze').slots.ExperienceId=1],
 ['denied-event-reservation',p=>s(p,'observe').slots.ReservedExperienceId=1],
 ['tracking-shared-allocator',p=>s(p,'track').slots.TrackId='n'],
 ['duplicate-selected-identity',p=>s(p,'select').slots.ViewId=1],
 ['patch-void-slot',p=>s(p,'form').slots.VoidId=1],
 ['recollect-per-candidate',p=>s(p,'recollect').slots.ProposedRecollectionOccurrenceId=4],
 ['concern-reallocation',p=>s(p,'delivery').slots.ConcernOccurrenceId=1],
 ['skip-zero-winner-recollect',p=>s(p,'recollect').when='winningCue'],
 ['omit-transport-output',p=>delete s(p,'select').outputs.ExtendedSelected],
 ['retention-unconditional',p=>s(p,'retain').outputs.RetainedEncoding=1],
 ['drop-file-counter',p=>s(p,'track').fileCounters={}],
 ['understate-runtime-bound',p=>p.maxima.positiveCue.runtimeSlots=17],
]){const copy=structuredClone(packet);mutate(copy);let reason;try{review(copy);}catch(e){reason=e.message;}assert(reason,'undetected '+name);faults.push({name,reason,detected:true});}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});for(const source of packet.inputs)assert.equal(fp(source.path).sha256,source.sha256);
const prior='docs/planning/ATTENTION_MEMORY_WRAPPER_REVIEW_REV1.json';for(const source of JSON.parse(fs.readFileSync(prior)).sources)assert.equal(fp(source.path).sha256,source.sha256);
fs.writeFileSync(output,JSON.stringify({status:'LOCAL OUTPUT/SLOT ACCOUNTING REVIEWED; WHOLE PROFILE OPEN',...baseline,faults,sources:[input,'docs/planning/ATTENTION_MEMORY_OUTPUT_REVIEW_REV1.md','scripts/build-attention-memory-output-inventory.mjs','scripts/review-attention-memory-output-inventory.mjs'].map(fp),preserved:fp(prior),limits:['Finite symbolic branch envelope, not reachable model executions or runtime mutants.','Local stage counts exclude upstream concern production; not MaxSettlementWork or whole-run allocation proof.','New finite declarations and numeric/model gates remain open.']},null,2)+'\n');console.log({...baseline,examples:undefined,faults:faults.length});
