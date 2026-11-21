/** M206: unchanged historical fixtures; only version declarations differ.
 * Nonsocial tasks, original body/skill settings and permitted channels, seed0.
 * No new source, calibration, hidden belief or causal consumer. */
import {expect} from 'vitest';
import {fixture as repeated} from './assembledRepeatedStakeholder';
import {fixture as passive} from './assembledStakeholderKnowledge';
import {competence,executionOpportunity} from './assembledAgencyCurrent';
import {decode,items,key,enc,list,text,u,q,rec,f,uint,outputs,bytes,type Run,type CanonicalValue} from './assembledRepeatedStakeholder';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../../assembled/character';
import {compileCharacterModel,INTERFERENCE_ACQUISITION_RULES,INTERFERENCE_ACQUISITION_REGISTRY} from '../../assembled/model';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {INTERFERENCE,INTERFERENCE_ACQUISITION,INTERFERENCE_APPRAISAL,INTERFERENCE_QUERY} from '../../assembled/interferenceExpectation';
import {SKILL_ACTUAL} from '../../assembled/skill';
import {PERFORMANCE_OBS} from '../../assembled/performance';
import {stakeholderPath,stakeholderJournal,stakeholderBeliefs} from '../../assembled/stakeholderKnowledge';
import {EXTENDED_TIME_LIMIT} from '../../assembled/timeDomain';
import {admitAgencyEvidence,foldAgencyEvidence,type Observation} from '../../campaign3/agencyInterferenceSource';
export {items,key,enc,list,text,u,q,rec,f,uint,outputs,bytes};
export type {Run,CanonicalValue};
export type Case='repeated'|'passive'|'trainedFree'|'untrainedBlocked'|'available'|'lost';
export const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
export const tagged=(v:CanonicalValue,t:string)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&eq(v.items[0],text(t));
export function fixture(name:Case){return name==='repeated'?repeated():name==='passive'?passive():name==='trainedFree'?competence(true,false):name==='untrainedBlocked'?competence(false,true):executionOpportunity(name==='available');}
const cache=new WeakMap<Run,ReturnType<typeof inspect>>();
function inspect(r:Run){const s=r.snapshot();return {s,state:restoreAuthoritativeState(decode(s.state)),out:items(decode(s.outputs),'list'),trace:outputs(s.trace,160n)};}
export function view(r:Run){let v=cache.get(r);if(!v){v=inspect(r);cache.set(r,v);}return v;}
export async function next(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
export const labels=(r:Run,t:string)=>view(r).out.filter(v=>tagged(v,t)).map(v=>items(v,'list'));
const supports=(rows:readonly CanonicalValue[])=>rows.filter(v=>!tagged(v,INTERFERENCE_ACQUISITION));
function stateProjection(r:Run){return new AuthoritativeState(view(r).state.entries().flatMap(e=>{
 if(e.path.rootStateTypeId!==1000n||e.path.fieldId!==7n)return [e];
 const a=items(e.value,'list');expect(a[0]).toEqual(text(INTERFERENCE));const rows=supports(items(a[1],'list'));
 return rows.length?[{...e,value:list([a[0],list(rows)])}]:[];
})).canonicalValue();}
function eventCoordinates(r:Run,id:CanonicalValue){
 const events=view(r).trace.map(t=>rec(f(t,4n),130n)).filter(e=>eq(f(e,1n),id));
 expect(events.length,'event binding').toBeGreaterThan(0);
 const coordinates=events.map(e=>list([f(e,2n),f(e,3n),f(e,5n),f(e,6n),f(e,7n)]));
 expect(new Set(coordinates.map(key)).size,'unique event').toBe(1);return coordinates[0];
}
function outputProjection(r:Run){return list(supports(view(r).out).map(v=>{
 if(tagged(v,SKILL_ACTUAL)){const a=[...items(v,'list')];a[1]=eventCoordinates(r,a[1]);return list(a);}
 if(tagged(v,'assembled-regulatory-stress/0.1/applied')){
  const a=[...items(v,'list')],packet=[...items(a[2],'list')],id=packet[3];
  const trace=view(r).trace.find(t=>eq(f(rec(f(t,4n),130n),1n),id)&&eq(f(t,13n),packet[4]));
  expect(trace,'stress appraisal producer').toBeDefined();expect(f(rec(f(trace!,4n),130n),3n)).toEqual(u(50));
  packet[3]=eventCoordinates(r,id);a[2]=list(packet);return list(a);
 }
 if(!tagged(v,INTERFERENCE_APPRAISAL))return v;const a=[...items(v,'list')];a[8]=list(supports(items(a[8],'list')));return list(a);
}));}
const draws=(r:Run)=>list(view(r).trace.flatMap(t=>items(f(t,14n),'list')));
export function exact(a:Run,b:Run){const x=view(a).s,y=view(b).s,{state:xs,outputs:xo,trace:xt,...xm}=x,{state:ys,outputs:yo,trace:yt,...ym}=y;expect(xm).toEqual(ym);bytes(xs,ys);bytes(xo,yo);bytes(xt,yt);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
export async function pair(name:Case,continuation=false){
 const b=fixture(name),s={...b.s,rulesVersion:INTERFERENCE_ACQUISITION_RULES,registrySchemaVersion:INTERFERENCE_ACQUISITION_REGISTRY};
 bytes(b.s.registry,s.registry);expect(b.s.rulesVersion).not.toBe(s.rulesVersion);
 const old=await createCharacterRun(await prepareCharacterModel(b.s),b.d),current=await createCharacterRun(await prepareCharacterModel(s),b.d),model=await compileCharacterModel(s);
 let restored:Run|undefined,instants=0;
 for(;;){
  const at=view(old).s.clock;expect(view(current).s.clock).toBe(at);
  expect(key(stateProjection(current)),name+' state at'+at).toBe(key(stateProjection(old)));
  const currentRows=items(outputProjection(current),'list'),oldRows=items(outputProjection(old),'list');expect(currentRows.length).toBe(oldRows.length);
  currentRows.forEach((row,i)=>{if(!eq(row,oldRows[i]))throw Error(name+' outputs at'+at+' row'+i+' old='+key(oldRows[i])+' new='+key(row));});
  bytes(old.decisionHistory(),current.decisionHistory());bytes(old.decisionPresentation(),current.decisionPresentation());
  expect(draws(current),name+' addressed draws at'+at).toEqual(draws(old));
  if(continuation&&at===11n&&!restored){restored=await restoreCharacterRun(s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:current.save()});exact(current,restored);}
  if(restored)exact(current,restored);
  expect(instants++).toBeLessThan(64);const more=await next(old);expect(await next(current)).toBe(more);if(restored)expect(await next(restored)).toBe(more);if(!more)break;
 }
 expect(view(current).s.clock).toBe(101n);if(continuation)expect(restored).toBeDefined();
 const acq=labels(current,INTERFERENCE_ACQUISITION),observations=labels(current,PERFORMANCE_OBS),inputs=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list'));
 expect(acq.length).toBeGreaterThan(0);
 for(const a of acq){
  expect(observations).toContainEqual(items(a[3],'list'));expect(a[2]).toEqual(items(a[3],'list')[3]);expect(a[1]).toEqual(items(a[3],'list')[2]);
  const at=uint(a[1]),context=inputs.filter(v=>(v[0] as {value:bigint}).value===at&&tagged(v[3],INTERFERENCE_QUERY)).map(v=>items(v[3],'list')).find(v=>eq(v[1],a[2]));
  expect(a[4]).toEqual(context?context[2]:list([]));
 }
 if(name==='repeated'||name==='passive'||name==='available'||name==='lost')expect(items(draws(current),'list').length).toBeGreaterThan(0);
 for(const o of model.socialWitness!.observers){
  const journal=stakeholderJournal(view(current).state.read(stakeholderPath(o)).value,o,EXTENDED_TIME_LIMIT);
  const native:Observation[]=journal.map(v=>{const a=items(v,'list'),common={observer:'A' as const,episode:'episode/'+uint(a[4])},kind=uint(a[5]);if(kind===0n)return {...common,kind:'outcome',success:a[7]===true};if(kind===2n)return {...common,kind:'report',source:'receipt/'+uint(a[6]),positive:a[7]===true};return {...common,kind:'obstruction',actor:key(items(a[8],'list')[0]),source:common.episode+'/cause'};});
  const fold=foldAgencyEvidence(admitAgencyEvidence('A',native),'GroupedMean');
  expect(stakeholderBeliefs(journal)).toEqual(list([...fold].map(([e,g])=>list([u(BigInt(e.split('/')[1])),u(g.numerator),u(g.denominator)]))));
 }
 console.info('M206 CARRY',name,'settled',instants,'acquisitions',acq.length,'draws',items(draws(current),'list').length,'exact restore',!!restored);
 return {old,current,model,b};
}
