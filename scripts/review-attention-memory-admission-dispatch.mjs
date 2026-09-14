import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const out='docs/planning/ATTENTION_MEMORY_ADMISSION_DISPATCH_REV1.json';assert(!fs.existsSync(out),'write once');
const graph=JSON.parse(fs.readFileSync('docs/planning/ATTENTION_MEMORY_BARRIER_WORK_REVIEW_REV1.json'));
const wrappers=JSON.parse(fs.readFileSync('docs/planning/ATTENTION_MEMORY_WRAPPER_INVENTORY_REV1.json'));
const output=JSON.parse(fs.readFileSync('docs/planning/ATTENTION_MEMORY_OUTPUT_INVENTORY_REV1.json'));
const records=new Map(wrappers.records.map(r=>[r.name,r]));
const rows=graph.stages.map(s=>({stage:s.name,phase:s.phase,input:s.input,
 directParents:graph.stages.filter(p=>p.next.includes(s.name)).map(p=>p.name),
 admission:s.name==='world'?'ExactOriginal':s.name==='delivery'?'ActualEarlierConcernGeneratedDelivery':'ExactExpectedGeneratedPayload',
 additionalParents:s.additionalCompletedParent?[s.additionalCompletedParent]:[],
 inputObserverEquality:s.reads.includes('IDN')?'required ObserverId equals carried actual observer before projection':'source-specific observer/support checks',
 projection:s.reads.includes('IDN')?{inputField:'ObserverId',algorithm:'accepted PRJ/IDN required roster projection',before:'all character owner-leaf reads',copiedSubject:'must equal actual projection when present'}:null,
 readLeaves:s.reads,writeLeaves:s.writes,authority:s.authority??null,route:s.route,
 outputCardinalities:output.stages.find(r=>r.name===s.name).outputs,
 freshSlots:output.stages.find(r=>r.name===s.name).slots,
 terminal:s.phase===140,admissionBeforeReads:true}));
const batches=[
 {name:'source-measurement',members:['measurement-episode-formation','measurement-prediction-application','task-measurement-settlement'],parent:'actual M1',payload:'same exact M1 bytes',instant:'probe',authority:'existing composed source barrier'},
 {name:'source-padding',members:['measurement-episode-formation-padding','measurement-prediction-application-padding','task-measurement-settlement-padding'],parent:'actual M1 padding',payload:'exact empty list',instant:'probe',authority:'existing composed source barrier'},
 {name:'attention-formation',members:['form','associate','seed-presentation'],parent:'retain',payload:'same exact FormationInput',instant:'formation',authority:'separate three owners, disjoint candidate patches'},
 {name:'attention-reinforcement',members:['reinforce'],parent:'recollect',payload:'actual emitted recollections only',instant:'cue',authority:'attention-presentation-update'},
 {name:'task-deadline',members:['task-deadline'],parent:'accepted parentless deadline association',payload:'exact committed task key',instant:'deadline',authority:'existing prospective-commitments'}
];
const preflight=['match exact committed event type/phase/profile and original or generated association','validate canonical payload and identity roles','check observer/source/target/parent equality and once-only association','perform required PRJ/IDN projection','read only declared qualified owner leaves from B0','evaluate sole-owner candidates without publication','validate disjoint patches and combined cross-leaf invariants','publish after successful complete-instant settlement'];
const packet={status:'DRAFT FINITE ADMISSION AND DISPATCH; NOT CANONICAL REGISTRATION ACCEPTANCE',rows,batches,preflight,
 batchRules:{membership:'exact multiset; reject missing, duplicate, mixed, extra and mixed-padding members',parents:'same actual authenticated M1 or retention parent for triples; no time-only grouping',B0:'all required source/subject/target preflight before candidate evaluation',emissions:'none from phase140 members',merge:'validate each patch under its sole owner and qualified target; reject overlapping target paths; compose all onto B0',failure:'discard candidate patches, pending consumption and tracking proposal on any failed instant',commit:'complete combined state and pending queue validated before publishing'},
 identityRoles:{ObserverId:'reuse existing ObserverId role; required scalar in projected input',CharacterId:'reuse accepted character-content domain role; never narrow/replace it by raw namespace alone',stateMapKeys:'ObserverId for perception; actual qualified CharacterId for the three attention memory leaves',transport:'copied identity fields grant neither occurrence production nor resolver authority'},
 prohibited:['AutomaticAdaptationInput on attention routes','state iterator or generic archive resolver','phase140 child emission','copied Subject replacing required projection','whole-source barrier bypass','old cognitive adapter silently stopped after concern'],
 pending:['numeric field/state-path/accessor roles and fixed registration members','source registration dependency closure and terminal-at-concern wrapper','complete canonical declaration codecs/content/model cohort','public admission, batch ownership, rollback, restore and work execution']};
function review(p){let checks=0;const check=(v,m)=>{assert(v,m);checks++;};const by=new Map(p.rows.map(r=>[r.stage,r]));check(by.size===22&&p.rows.length===22,'row coverage');
 for(const r of p.rows){check(r.admissionBeforeReads,'read before admission');check(r.phase!==150,'domain phase150');
  if(r.readLeaves.includes('IDN')){check(r.projection?.inputField==='ObserverId','missing actual projection');check(records.get(r.input)?.fields.some(f=>f.name==='ObserverId'&&f.type.kind==='ref'&&f.type.name==='ObserverId'),'projection field not required scalar');}
  for(const leaf of r.writeLeaves){check(r.readLeaves.includes(leaf),'missing expected-old read');check(r.authority!==null,'missing sole owner');if(['EpisodeLedger','AssociationGraph','PresentationLedger'].includes(leaf)){check(r.readLeaves.includes('IDN'),'character writer missing IDN');check(r.route.includes('route/character-learning'),'learning route missing');}}
  if(r.terminal)check(r.phase===140&&Object.keys(r.freshSlots).length===0,'terminal new writer gains slot');
  if(r.additionalParents.length)check(r.additionalParents.join() ==='delivery'&&r.projection!==null,'invalid join additional parent');
 }
 check(by.get('form').writeLeaves.join()==='EpisodeLedger'&&by.get('associate').writeLeaves.join()==='AssociationGraph','ownership conflation');
 check(by.get('seed-presentation').authority===by.get('reinforce').authority,'duplicate presentation authority');
 for(const n of ['form','associate','seed-presentation'])check(by.get(n).directParents.join()==='retain','wrong writer parent');
 for(const n of ['rank','recollect','evaluate','retain'])check(by.get(n).writeLeaves.length===0,'read/evidence stage writes');
 check(p.preflight.indexOf('perform required PRJ/IDN projection')<p.preflight.indexOf('read only declared qualified owner leaves from B0'),'owner read before projection');
 check(p.batches.length===5,'missing dispatch variant');
 const classify=members=>p.batches.filter(b=>[...b.members].sort().join('|')===[...members].sort().join('|'));
 for(const b of p.batches){check(classify(b.members).length===1,'ambiguous exact dispatch');check(classify([...b.members,b.members[0]]).length===0,'duplicate batch accepted');}
 for(let i=0;i<p.batches.length;i++)for(let j=i+1;j<p.batches.length;j++)check(classify([...p.batches[i].members,...p.batches[j].members]).length===0,'mixed batch accepted');
 const formation=p.batches.find(b=>b.name==='attention-formation');check(formation.members.join()==='form,associate,seed-presentation'&&formation.parent==='retain','formation membership/parent');
 check(p.batchRules.emissions==='none from phase140 members','barrier emission permitted');check(p.status.startsWith('DRAFT')&&p.pending.length===4,'premature closure');return {checks,rows:p.rows.length,batches:p.batches.length};}
const baseline=review(packet),faults=[];const row=(p,n)=>p.rows.find(r=>r.stage===n);
for(const [name,mutate] of [['remove-projection',p=>row(p,'form').projection=null],['read-before-admission',p=>row(p,'rank').admissionBeforeReads=false],['copied-subject-only',p=>row(p,'associate').readLeaves=['AssociationGraph']],['mixed-write-owner',p=>row(p,'form').writeLeaves.push('AssociationGraph')],['wrong-sibling-parent',p=>row(p,'associate').directParents=['form']],['rank-writes',p=>row(p,'rank').writeLeaves=['EpisodeLedger']],['drop-source-padding',p=>p.batches.splice(1,1)],['allow-barrier-child',p=>p.batchRules.emissions='allowed'],['overlapping-dispatch',p=>p.batches[1].members=[...p.batches[0].members]],['projection-after-read',p=>{const a=p.preflight.indexOf('perform required PRJ/IDN projection'),b=a+1;[p.preflight[a],p.preflight[b]]=[p.preflight[b],p.preflight[a]];}]]){const copy=structuredClone(packet);mutate(copy);let reason;try{review(copy);}catch(e){reason=e.message;}assert(reason,'undetected '+name);faults.push({name,reason,detected:true});}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(out,JSON.stringify({...packet,review:baseline,faults,sources:['docs/planning/ATTENTION_MEMORY_ADMISSION_DISPATCH_REV1.md','scripts/review-attention-memory-admission-dispatch.mjs','docs/planning/ATTENTION_MEMORY_BARRIER_WORK_REVIEW_REV1.json','docs/planning/ATTENTION_MEMORY_WRAPPER_INVENTORY_REV1.json','docs/planning/ATTENTION_MEMORY_OUTPUT_INVENTORY_REV1.json'].map(fp),limits:['Symbolic admission/dispatch checks only; no production registration, actual projected reads or batch authority validation executed.']},null,2)+'\n');console.log({...baseline,faults:faults.length});
