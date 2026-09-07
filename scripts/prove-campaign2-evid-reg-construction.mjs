import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const reg='src/campaign2/regulatoryReference.ts',admission='src/campaign2/transitionAdmissionV04.ts',ingress='src/campaign2/transitionIngressV04.ts';
const groups={evid:{test:'src/test/campaign2TransitionAdmission.test.ts',count:15},reg:{test:'src/test/campaign2RegulatoryReference.test.ts',pattern:'REG-M:',count:1},gate:{test:'src/test/campaign2FrozenGateOrder.test.ts',count:1}};
const mutants=[
 {group:'evid',name:'omit-payload-admission-equality',file:ingress,from:'||key(event.payload)!==key(expected.payload)',to:''},
 {group:'evid',name:'allow-patch-before-output-validation',file:ingress,from:'if(patch.operations.length!==0||',to:'if(false||'},
 {group:'evid',name:'allow-state-replacement-before-output-validation',file:ingress,from:"if(patch.operations.length!==0||(originalState===undefined)!==(returnedState===undefined)\n        ||(originalState!==undefined&&returnedState!==undefined&&key(originalState)!==key(returnedState)))",to:'if(patch.operations.length!==0)'},
 {group:'evid',name:'erase-nonempty-event-classifications',file:ingress,from:'payload:decodeCampaign2(canonicalEncode(value.event.payload)) as CanonicalValue',to:"payload:(()=>{const p=decodeCampaign2(canonicalEncode(value.event.payload));if(typeof p!=='boolean'&&p.kind==='record'&&p.schema.typeId===227n)return {...p,fields:new Map([...p.fields,[7n,{kind:'set',items:[]}]])};return p;})() as CanonicalValue"},
 {group:'gate',name:'gate-reads-earlier-staged-write',file:'src/campaign2/adaptationEvaluation.ts',from:'countStepWithBaselineGate(u(f(execution.basis,3n)),step.value,p,g)',to:"countStepWithBaselineGate(u(f(execution.basis,3n)),step.value,p,gatePath?(()=>{const op=operations.find(o=>key(statePathValue(o.path))===key(statePathValue(gatePath)));return op?.kind==='set'?magnitude(op.newValue):g;})():g)"},
 {group:'evid',name:'omit-output-cardinality',file:admission,from:"if(schemas.length!==r.outputs.length)throw Error('missing required domain output');",to:'void schemas;'},
 {group:'evid',name:'extract-wrong-occurrence-field',file:'src/campaign2/occurrenceIdentity.ts',from:'const identity=f(value,rule.fieldId);',to:'const identity=f(value,2n);'},
 {group:'evid',name:'generate-zero-ingress-children',file:ingress,from:'emissions:()=>plans.map(p=>structuredClone(p.emission))',to:'emissions:()=>[]'},
 {group:'evid',name:'generate-two-ingress-children',file:ingress,from:'emissions:()=>plans.map(p=>structuredClone(p.emission))',to:'emissions:()=>plans.flatMap(p=>[structuredClone(p.emission),structuredClone(p.emission)])'},
 ...[
  ['key-identity',"if(k!==key(p.parameterIdentity))invalidModel('parameter key/identity mismatch');"],
  ['local-resolution',"if(!v.parameters.has(key(governing)))invalidModel('unresolved local parameter');"],
  ['parameter-closure',"if(used.size!==v.parameters.size)invalidModel('unused REG parameter');"],
  ['bound-agreement',"if(p.valueMinimum!==v.minimum||p.valueMaximum!==v.maximum)invalidModel('parameter/variable bounds differ');"],
  ['character-totality',"if(JSON.stringify([...v.anchors.keys()].sort())!==JSON.stringify(characters))invalidModel('REG character set is not exact committed content image');"],
  ['parameter-ownership',"if(owners.has(k))invalidModel('REG parameter has multiple variable owners');"],
  ['rate-normal-form',"if((p.rate===0n&&p.scale!==1n)||(p.rate!==0n&&gcd(p.rate,p.scale)!==1n))invalidModel('noncanonical REG rate');"],
  ['anchor-normal-form',"if(a.anchorInstant!==0n||a.exactBoundedRemainder!==0n)invalidModel('REG authored anchor must start at zero with zero remainder');"],
  ['endpoint-totality','materializeLinear(a,simInstant(INT64_MAX),v.registry!);'],
 ].map(([name,from])=>({group:'reg',name:'omit-'+name,file:reg,from,to:'void 0;'})),
];
const sources=[...new Set([...mutants.map(m=>m.file),...Object.values(groups).map(g=>g.test)])].map(path=>({path,sha256:hash(fs.readFileSync(new URL(path,root)))}));
async function execute(group,mutant){
 let transformed=0;const g=groups[group],priorListeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[g.test],{run:true,watch:false,maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}],...(g.pattern?{testNamePattern:g.pattern}:{})},
 {plugins:mutant?[{name:'evid-reg-construction-mutant',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+mutant.file))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});
 assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  function walk(t){if(t.type==='test'&&['pass','fail'].includes(t.result?.state))tests.push({name:t.name,state:t.result.state,errors:t.result.errors?.map(e=>e.message)});for(const child of t.tasks??[])walk(child);}
  for(const f of ctx.state.getFiles())walk(f);assert.equal(tests.length,g.count);
  const failed=tests.filter(t=>t.state==='fail');if(mutant){assert.equal(transformed,1);assert(failed.length>0,'mutant distinguished');}else assert.equal(failed.length,0);
  return {group,name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',tests};
 }finally{await ctx.close();for(const listener of process.listeners('unhandledRejection'))if(!priorListeners.has(listener))process.removeListener('unhandledRejection',listener);}
}
const baselines=[];for(const group of Object.keys(groups)){baselines.push(await execute(group));console.log(group+': baseline PASS');}
const mutations=[];for(const m of mutants){mutations.push({...await execute(m.group,m),source:m.file,from:m.from,to:m.to});console.log(m.name+': DETECTED');}
for(const s of sources)assert.equal(hash(fs.readFileSync(new URL(s.path,root))),s.sha256);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_EVID_REG_CONSTRUCTION_PROOF.json',root),JSON.stringify({status:'COMPONENT PASS',sourceFingerprints:sources,baselines,mutations,
 limitations:['Inherited assertion-based controls, not independent general EVID/REG interpreters.',
 'REG diagnostic messages locate the implementation check; only INVALID_CONFIGURATION is claimed as the public carrier. No new normative message wording.',
 'REG namespace-family mutation and remaining construction-domain/role checks are separate pending controls.',
 'Exact AD-E5 order witness distinguishes a staged-write gate from the accepted frozen snapshot.',
 'No complete EVID-S, REG-M, FCT-6 or release verdict.']},null,2)+'\n');
process.exitCode=0;
