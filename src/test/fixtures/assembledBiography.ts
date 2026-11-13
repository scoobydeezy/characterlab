/** M106 plan384da0c5: native biography; eight fixed early address lanes, no seed search. */
import {expect} from 'vitest';
import {fixture as prior,ablation,enumerate,learned,standing,withoutStanding,rec,f,uint,items,key,decode,enc,list,text,u,signed,q,sid,readQ,ZERO,definition} from './assembledStandingRounding';
import {capture} from './assembledStandingSources';
import {taskA} from './assembledDecisionRegimes';
import {PRIORITY_DISPLAY,PRIORITY_OBS,PRIORITY_ADOPTION_OBS} from '../../assembled/priority';
import {REASON_READING} from '../../assembled/reasonEvidence';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {IDENTITY_CONTEXT,qualificationParts} from '../../assembled/identityEligibility';
import {changeDefinition} from './assembledCharacter';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {comparisonRoles} from '../../assembled/comparison';
import {ComparisonDrawMap,type RandomAddress} from '../../substrate/random';
import {dataIdentity as id,dataText as txt} from '../../campaign2/canonicalData';
import {randomDrawRecord} from '../../assembled/codecs';
import {outputs,signedValue,type Run} from './assembledComparison';
import {snap,through,finish,exact,bytes} from './assembledAffectReceiving';
import type {CanonicalValue} from '../../substrate/canonicalEncoding';
export function fixture(pressure=false,hidden=false){
 const b=prior(true,pressure,hidden,false);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const row=[...items(v,'list')];
  if(key(row[2])===key(PRIORITY_DISPLAY)){
   const p=items(row[3],'list');row[3]=list([p[0],list(items(p[1],'list').map(v=>{const t=[...items(v,'list')];if(key(t[0])===key(taskA)&&items(t[1],'list').length)t[1]=list([q(13,20)]);return list(t);}))]);
  }
  if(key(row[2])===key(POSITION_SOURCE)&&[3,9].some(t=>key(row[0])===key(signed(t)))){
   const p=[...items(row[3],'list')],annex=[...items(p[3],'list')];annex[7]=false;p[3]=list(annex);row[3]=list(p);
  }
  if(key(row[2])===key(REASON_READING)&&[10,12].some(t=>key(row[0])===key(signed(t)))){
   const p=[...items(row[3],'list')];p[0]=q(0,1);p[1]=q(0,1);row[3]=list(p);
  }
  return list(row);
 });
 const s=changeDefinition(changeDefinition(b.s,'definition/protocol-execution',1n,false),'definition/protocol-observation',4n,false);
 return {s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export async function create(b=fixture(),at=12n){const run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};}
export function mapping(run:Run,lane:number){
 expect(Number.isInteger(lane)&&lane>=0&&lane<8).toBe(true);
 // ONLY occurrence, time, candidate and nucleus identities, never chosen data.
 const entries=outputs(snap(run).outputs,409n).filter(d=>[10n,12n].includes(signedValue(f(d,2n)))).flatMap(d=>{
  const at=signedValue(f(d,2n)),root=id(f(d,1n)),ns=items(f(rec(f(d,3n),408n),3n),'list');
  const addresses:RandomAddress[]=ns.flatMap(n0=>{const nk=rec(f(rec(n0,407n),1n),404n),candidate=rec(f(nk,1n),395n),value=nk.schema.schemaVersion===2n;
   return [value?'value-reason-face':'task-reason-face',value?'value-standing-rounding':'task-standing-rounding'].map(purpose=>({causalRootId:root,purposeId:sid(1042,'purpose/'+purpose),drawIndex:0n,subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(candidate,1n))},{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(candidate,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(nk,3n))}]}));
  });
  expect(addresses.length).toBeGreaterThan(0);
  addresses.push({causalRootId:root,purposeId:sid(1042,'purpose/task-decision-tie'),drawIndex:0n,subjectBindings:[addresses[0].subjectBindings[0]]});
  return addresses.map(a=>({localRandomAddress:a,comparisonDrawKey:{keyId:sid(10006,key(list([text(at===10n?'M106/early/'+lane+'/10':'M106/probe/12'),a.purposeId,list(a.subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId])))]))),comparisonRoleId:sid(10005,'assembled/'+txt(a.purposeId.payload).slice(8))}}));
 });
 expect(entries).toHaveLength(10);return new ComparisonDrawMap(entries,comparisonRoles);
}
export function mapped(b:ReturnType<typeof fixture>,map:ComparisonDrawMap){return {...b,d:{...b.d,orderedInputs:enc(list([map.canonicalValue,...items(decode(b.d.orderedInputs),'list')]))}};}
export const fraction=(q:ReturnType<typeof readQ>)=>q.numerator+'/'+q.denominator;
export function transcript(run:Run,at:bigint){return outputs(snap(run).trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===at).flatMap(t=>items(f(t,14n),'list')).map(v=>{const d=randomDrawRecord(v);return list([f(d,2n),f(d,3n),f(d,4n)]);});}
export function evidence(run:Run){
 const early=capture(run,10n),probe=capture(run,12n),l=learned(run);
 for(const p of [early,probe]){expect(p.ns).toHaveLength(2);expect(uint(f(p.data,8n)),'two live rolling alternatives').not.toBe(1n);for(const v of p.ns)expect(uint(f(rec(v,407n),4n))).toBe(4n);}
 expect(standing(early.raw)).toHaveLength(0);expect(l.journal).toHaveLength(1);expect(l.formation.entries).toHaveLength(1);
 const qualification=qualificationParts(l.journal[0]);expect(qualification.accepted).toBe(true);expect(readQ(qualification.contribution).equals(ZERO)).toBe(false);
 expect(qualification.at.value).toBe(10n);expect(items(l.formation.entries[0],'list')[0]).toEqual(qualification.id);
 expect(qualification.resolution).toEqual(early.d);expect(probe.input[1]).toBeDefined();
 expect(readQ(items(probe.report,'list')[1])).toEqual(l.formation.P);expect(items(items(probe.report,'list')[4],'list')).toContainEqual(qualification.id);
 expect(standing(probe.raw)).toHaveLength(2);expect(standing(probe.source)).toEqual(standing(probe.raw));
 for(const v of standing(probe.raw)){
  const signal=rec(v,402n),basis=f(rec(f(signal,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');
  expect(basis.entries.some(([k])=>key(f(rec(k,399n),3n))===key(qualification.id))).toBe(true);
 }
 return {early,probe,...l,qualification};
}
export {ablation,enumerate,capture,learned,standing,withoutStanding,rec,f,uint,items,key,decode,enc,list,text,u,signed,q,sid,readQ,ZERO,definition,outputs,signedValue,snap,through,finish,exact,bytes,qualificationParts};
export type {Run,CanonicalValue};

/** Diagnostic projection with an explicit source correspondence; never a native input.
 * Resolve each differing occurrence to its actual priority observation and producer.
 * Only the allocation identity is projected; time, task, safe values and weights stay. */
export function provenance(run:Run){
 const observations=items(decode(snap(run).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&[PRIORITY_OBS,PRIORITY_ADOPTION_OBS].some(s=>key(v.items[0])===key(text(s))));
 const byId=new Map<string,CanonicalValue>(),semantics=new Set<string>(),traces=outputs(snap(run).trace,160n);
 for(const v of observations){
  const a=items(v,'list'),image=list([a[0],...a.slice(2)]),semantic=key(image);
  expect(byId.has(key(a[1]))).toBe(false);expect(semantics.has(semantic)).toBe(false);
  const producer=traces.find(t=>{if(uint(f(rec(f(t,4n),130n),3n))!==20n||key(f(t,5n))!==key(sid(1036,'seam/assembled-priority')))return false;const out=f(t,13n);return typeof out!=='boolean'&&out.kind==='list'&&out.items.some(o=>key(o)===key(v));});
  expect(producer,'priority evidence must have actual perception producer').toBeDefined();
  const event=rec(f(producer!,4n),130n);expect(signedValue(f(event,2n))).toBe(uint(a[2]));
  expect(items(f(event,8n),'list')).toHaveLength(1);
  byId.set(key(a[1]),image);semantics.add(semantic);
 }
 function project(v:CanonicalValue):CanonicalValue{
  if(typeof v==='boolean')return v;
  if(v.kind==='typedIdentifier'&&v.namespaceId===1164n){const actual=byId.get(key(v));if(!actual)throw Error('M106 unbound priority provenance');return list([text('M106/perceived-priority'),actual]);}
  if(v.kind==='record')return {...v,fields:new Map([...v.fields].map(([k,x])=>[k,project(x)]))};
  if(v.kind==='list'||v.kind==='set')return {...v,items:v.items.map(project)};
  if(v.kind==='map')return {...v,entries:v.entries.map(([k,x])=>[project(k),project(x)] as const)};
  if(v.kind==='typedIdentifier')return {...v,payload:project(v.payload)};
  return v;
 }
 return project;
}

export async function bound(b:ReturnType<typeof fixture>,template:Run,lane:number){
 const initial=mapping(template,lane),first=await create(mapped(b,initial),9n),before=snap(first.run);
 await through(first.run,12n);const actual=mapping(first.run,lane);
 if(key(initial.canonicalValue)===key(actual.canonicalValue))return {...first,before,rebound:false};
 // This pass supplies occurrence identities only. Neither map construction nor the
 // decision to rebind reads a sampled outcome, probability or formation value.
 const corrected=await create(mapped(b,actual),9n);bytes(before.state,snap(corrected.run).state);bytes(before.outputs,snap(corrected.run).outputs);
 await through(corrected.run,12n);expect(key(mapping(corrected.run,lane).canonicalValue)).toBe(key(actual.canonicalValue));
 expect(capture(corrected.run,10n).d).toEqual(capture(first.run,10n).d);
 await finish(first.run);return {...corrected,before,rebound:true};
}
