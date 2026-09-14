import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const input='docs/planning/GA_ACQUISITION_RECALL_STAGE_CLOSURE_REV1.json',output='docs/planning/GA_ACQUISITION_RECALL_STAGE_REVIEW_REV1.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(input));
function validate(p){
 assert.equal(p.records.length,3);assert.equal(p.stages.length,21);assert.deepEqual(p.newIdentityFamilies,[]);assert.deepEqual(p.numericAllocations,[]);
 for(const [name,field,type]of [['VisualAcquisitionEvidenceInput','Candidate','PositiveVisualCandidate'],['EventRecallInput','Cue','CueEvidence'],['GeneralFormationOwnerInput','Evidence','AcquisitionFormationEvidence']])assert.deepEqual(p.records.find(r=>r.name===name)?.fields,[{name:'ObserverId',type:{kind:'ref',name:'ObserverId'}},{name:field,type:{kind:'ref',name:type}}]);
 const byName=new Map(p.stages.map(s=>[s.name,s]));assert.equal(byName.size,21);
 for(const s of p.stages){assert.equal(s.projection,'Required PRJ/IDN via field1 ObserverId after actual producer admission');for(const target of s.next){assert(byName.has(target));assert(byName.get(target).phase>=s.phase);}assert(!s.reads.includes('FormationGovernanceState'));if(s.phase!==140)assert.deepEqual(s.writes,[]);else{assert.deepEqual(s.outputs,[]);assert.deepEqual(s.next,[]);assert.equal(s.allocation,'None');assert(s.batch.includes('no sibling reads'));}assert.deepEqual(s.route,s.phase===140||s.name.endsWith('-acquisition-evidence')?['route/character-learning']:[]);}
 for(const [lane,phase]of [['current',40],['consequence',130]]){
  for(const suffix of ['visual-selection','visual-encoding','body-selection','visual-cue','body-cue','event-rank','body-rank','recollection'])assert.equal(byName.get(lane+'-'+suffix).phase,phase);
  for(const kind of ['body','visual']){assert.equal(byName.get(lane+'-'+kind+'-selection').allocation,'One SelectionOccurrenceId/1143');assert.equal(byName.get(lane+'-'+kind+'-cue').allocation,'None');}
  const e=byName.get(lane+'-event-rank'),b=byName.get(lane+'-body-rank');assert.deepEqual(e.reads,['GeneralEpisodeState','GeneralAssociationState','GeneralPresentationState']);assert.equal(e.readGate,'AvailableCue');assert.deepEqual(b.reads,['GeneralEpisodeState']);assert.equal(b.readGate,'PresentCue');
  assert.deepEqual(byName.get(lane+'-visual-cue').next,[lane+'-event-rank']);assert.deepEqual(byName.get(lane+'-body-cue').next,[lane+'-body-rank']);assert.deepEqual(byName.get(lane+'-recollection').next,[]);
 }
 for(const kind of ['body','visual']){const s=byName.get(kind+'-acquisition-evidence');assert.equal(s.phase,130);assert.equal(s.allocation,'One AcquisitionOccurrenceId iff positive; otherwise zero');assert.deepEqual(s.outputs,['AcquisitionFormationEvidence']);}
 assert.deepEqual(byName.get('body-acquisition-evidence').next,['ordinary-memory-formation']);assert.deepEqual(byName.get('visual-acquisition-evidence').next,['ordinary-memory-formation','event-association-formation','event-presentation-formation']);
 for(const [name,root]of [['ordinary-memory-formation','GeneralEpisodeState'],['event-association-formation','GeneralAssociationState'],['event-presentation-formation','GeneralPresentationState']]){const s=byName.get(name);assert.deepEqual(s.reads,[root]);assert.deepEqual(s.writes,[root]);assert.equal(s.contentGate,name==='ordinary-memory-formation'?'Either acquisition kind':'EventContinuant only');}
 // Count maximal positive dispatch branches by traversal; shared owner registrations are distinct invocations.
 function work(name,seen=new Set()){assert(!seen.has(name),'cycle');const next=new Set([...seen,name]);return 1+byName.get(name).next.reduce((n,t)=>n+work(t,next),0);}
 for(const lane of ['current','consequence']){const subtotal=['body-selection','visual-selection','body-cue','visual-cue'].reduce((n,k)=>n+work(lane+'-'+k),0);assert.equal(subtotal,15);assert.equal(p.sliceEventSubtotal,subtotal);assert.equal(p.withSourceEventSubtotal,8+subtotal);}
 assert.equal(p.protocolHooks.eventCount,0);assert.deepEqual(p.protocolHooks.route,[]);
}
validate(original);const stage=(p,n)=>p.stages.find(s=>s.name===n);
const faults=[
 ['encoder-physical-read',p=>stage(p,'current-visual-encoding').writes=['LocalReserveState']],
 ['early-evidence',p=>stage(p,'visual-acquisition-evidence').phase=40],
 ['allocate-empty-acquisition',p=>stage(p,'body-acquisition-evidence').allocation='Always one'],
 ['owner-reallocates-acquisition',p=>stage(p,'ordinary-memory-formation').allocation='One AcquisitionOccurrenceId'],
 ['terminal-emits',p=>stage(p,'event-association-formation').next=['event-presentation-formation']],
 ['body-graph-write',p=>stage(p,'body-acquisition-evidence').next.push('event-association-formation')],
 ['unavailable-cue-read',p=>stage(p,'current-event-rank').readGate='Always'],
 ['cue-requires-selection',p=>stage(p,'current-body-cue').next=['current-body-selection']],
 ['recall-presents-automatically',p=>stage(p,'current-recollection').next=['event-presentation-formation']],
 ['unprojected-owner',p=>stage(p,'ordinary-memory-formation').projection='Copied CharacterId'],
 ['cognitive-protocol-read',p=>stage(p,'current-event-rank').reads.push('FormationGovernanceState')],
 ['understated-work',p=>p.withSourceEventSubtotal=22],
 ['second-evidence-identity',p=>p.newIdentityFamilies.push('FormationEvidenceId')],
];for(const [name,mutate]of faults){const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),name);}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC ACQUISITION/RECALL SLICE REVIEW PASS',records:3,registrations:21,maximalSliceEvents:15,withSourceEvents:23,faults:faults.map(([name])=>({name,rejected:true})),sources:[input,'scripts/review-ga-acquisition-recall-stage-closure.mjs'].map(fp),limits:['Partial graph, not whole model work or acceptance.','Paths, actual joins, consumer branches, codecs and whole barrier closure remain open.']},null,2)+'\n');
