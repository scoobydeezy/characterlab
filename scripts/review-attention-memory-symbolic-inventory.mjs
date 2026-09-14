import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const input='docs/planning/ATTENTION_MEMORY_SYMBOLIC_INVENTORY_REV1.json',output='docs/planning/ATTENTION_MEMORY_SYMBOLIC_REVIEW_REV1.json';assert(!fs.existsSync(output));
const p=JSON.parse(fs.readFileSync(input));
function review(p){let checks=0;const check=(v,s)=>{assert(v,s);checks++;};
 const names=p.records.map(r=>r.name),known=new Set([...names,...p.external,...p.primitives,...p.proposedIdentities]);check(new Set(names).size===names.length,'duplicate record');check(known.size===names.length+p.external.length+p.primitives.length+p.proposedIdentities.length,'symbol collision');
 const refs=t=>{if(t.kind==='ref'){check(known.has(t.name),'unresolved reference');return[t.name];}if(t.kind==='list'){check(Number.isInteger(t.min)&&Number.isInteger(t.max)&&t.min>=0&&t.max>=t.min,'invalid bound');return refs(t.element);}if(t.kind==='optional')return refs(t.value);if(t.kind==='union'){check(t.alternatives.length>1,'empty union');return t.alternatives.flatMap(refs);}check(t.kind==='enum'&&new Set(t.values).size===t.values.length&&t.values.length>0,'enum shape');return[];};
 const edges=new Map();for(const r of p.records){check(new Set(r.fields.map(f=>f.name)).size===r.fields.length,'duplicate field');edges.set(r.name,r.fields.flatMap(f=>refs(f.type)));}
 const get=n=>p.records.find(r=>r.name===n),field=(n,f)=>get(n).fields.find(x=>x.name===f).type;
 for(const s of p.storage){check(known.has(s.value),'unknown storage value');check(s.key===(s.family==='perception'?'ObserverId':'CharacterId'),'wrong storage subject');check(p.storage.filter(x=>x.value===s.value).length===1,'multiple storage writers');
  if(s.family!=='perception'){const pending=[s.value],seen=new Set();while(pending.length){const n=pending.pop();if(seen.has(n))continue;seen.add(n);check(!p.characterStorageForbiddenReachability.includes(n),'forbidden retained source '+n);pending.push(...edges.get(n)??[]);}}
 }
 check(field('RetainedEncodingUnit','Strength').name==='PositiveUnitRational','nonpositive retention');check(field('RetainedEncoding','Units').min===1,'empty retained encoding');check(field('EpisodeLedger','Entries').max===4,'episode horizon');check(field('AssociationGraph','Nodes').max===12&&field('AssociationGraph','Rows').max===12&&field('AssociationMassRow','Masses').max===12,'graph dimensions');check(field('PresentationEntry','Times').max===5,'presentation horizon');
 check(JSON.stringify(p.proposedIdentities)===JSON.stringify(['ProposedRecollectionOccurrenceId']),'duplicate occurrence family');check(!get('EpisodeEntry').fields.some(f=>f.name==='EpisodeId'),'duplicate episode identity');
 check(p.retention.empty==='no episode, association or presentation write'&&p.retention.unknown==='excluded'&&p.retention.knownZero==='excluded','empty/unknown retention');check(p.status==='DRAFT DOMAIN INVENTORY; NOT ALLOCATION INPUT'&&p.pending.length===7,'premature closure');
 return {checks,records:names.length,fields:p.records.reduce((n,r)=>n+r.fields.length,0)};
}
const baseline=review(p),faults=[];
for(const [name,mutate] of [
 ['retain-full-selected',p=>p.records.find(r=>r.name==='RetainedEncoding').fields.push({name:'Archive',type:{kind:'ref',name:'ExtendedSelected'}})],
 ['retain-nested-forecast-carrier',p=>p.records.find(r=>r.name==='RetainedEncodingUnit').fields.push({name:'Concern',type:{kind:'ref',name:'ActualConcernCarry'}})],
 ['zero-strength-retention',p=>p.records.find(r=>r.name==='RetainedEncodingUnit').fields.find(f=>f.name==='Strength').type.name='UnitRational'],
 ['empty-episode',p=>p.records.find(r=>r.name==='RetainedEncoding').fields.find(f=>f.name==='Units').type.min=0],
 ['observer-as-owner',p=>p.storage[1].key='ObserverId'],
 ['second-presentation-writer',p=>p.storage.push({...p.storage[3],owner:'attention-episode-formation'})],
 ['episode-counter',p=>p.proposedIdentities.push('EpisodeOccurrenceId')],
 ['unknown-type',p=>p.records[0].fields[0].type.name='UnallocatedGridIdentity'],
 ['promote-partial-packet',p=>p.status='SHAPE ACCEPTED'],
]){const candidate=structuredClone(p);mutate(candidate);let reason;try{review(candidate);}catch(e){reason=String(e.message);}assert(reason,'undetected '+name);faults.push({name,reason,detected:true});}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),prior=JSON.parse(fs.readFileSync('docs/planning/GENERAL_ATTENTION_COMPONENT_QUALIFICATION_REV1.json'));for(const source of prior.sources)assert.equal(fp(source.path).sha256,source.sha256);
fs.writeFileSync(output,JSON.stringify({status:'DOMAIN INVENTORY STRUCTURE REVIEWED; WHOLE SHAPE WITHHELD',...baseline,faults,sources:[input,'docs/planning/ATTENTION_MEMORY_RETENTION_REVIEW_REV1.md','scripts/build-attention-memory-symbolic-inventory.mjs','scripts/review-attention-memory-symbolic-inventory.mjs'].map(fp),preserved:fp('docs/planning/GENERAL_ATTENTION_COMPONENT_QUALIFICATION_REV1.json'),limits:['Reference/storage-reachability review only; not canonical codecs or executed memory/feedback.','Conditional fields, complete stage registrations, admitted-input roles, model work bounds and public proof remain pending.']},null,2)+'\n');console.log({...baseline,faults:faults.length,status:'WHOLE SHAPE WITHHELD'});
