/** M89: M87 calendar, current0.79; three physical tasks, no people.
 * Body30/cap100/rate10, delivery90 at9; A importance1/B3/5, seed0.
 * Permitted reading channels at10/12, original gains3/4 and2/3.
 * Identity10 significant/unpressured, identity12 insignificant; Values unlinked.
 * Owner-approved control removes standing only from captured compiler/arbitration
 * operands; no modified operand enters a character. Disabled model rejects. */
import {expect} from 'vitest';
import {record,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {fixture as prior} from './assembledValueProvenance';
import {CONTEXT_REASON_RULES,CONTEXT_REASON_REGISTRY} from '../../assembled/model';
import {IDENTITY_CONTEXT,identityJournal,journalPath,qualificationParts} from '../../assembled/identityEligibility';
import {VALUES_CONTEXT} from '../../assembled/values';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {FORMATION_VERSION,formationPath,formationValue,formationSignals} from '../../assembled/formation';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {changeDefinition} from './assembledCharacter';
import {taskA} from './assembledDecisionRegimes';
import {C} from './campaign2Cognitive';
import {snap,through,state} from './assembledAffectReceiving';
import {capture as priorCapture} from './assembledValueProvenance';
import {decode,items,key,enc,rec,f,uint,q,list,set,text,u,signed,sid,r,definition,projection} from './assembledContextReasons';
import {dataText as txt} from '../../campaign2/canonicalData';
import {choiceAlignment,readQ,qValue,foldIdentityHistory,ZERO} from '../../campaign2/cognitiveMath';
import {ExactRational as Q} from '../../substrate/exactMath';
import {reasonRaw} from '../../campaign3/reasonMath';
import {reasonRecord as rr} from '../../campaign3/reasonCodecs';
import {compile,originalNuclei,originalProjection} from './assembledReasonCorrespondence';
import {descriptionIdentity,compileDescribedReasons} from '../../assembled/reasons';
import {arbitrationOutput} from '../../assembled/arbitration';
export function fixture(enabled=true,pressure=false,hidden=false){
 const b=prior(false,false,hidden),s=changeDefinition({...b.s,rulesVersion:CONTEXT_REASON_RULES,registrySchemaVersion:CONTEXT_REASON_REGISTRY},'definition/task-reason-source',1n,enabled);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const row=[...items(v,'list')],p=[PRIORITY_DISPLAY,IDENTITY_CONTEXT,VALUES_CONTEXT].some(t=>key(t)===key(row[2]))?items(row[3],'list'):[];
  if(key(row[2])===key(PRIORITY_DISPLAY))row[3]=list([p[0],list(items(p[1],'list').map(v=>{const t=[...items(v,'list')];if(key(t[0])===key(taskA)&&items(t[1],'list').length)t[1]=list([q(1,1)]);return list(t);}))]);
  if(key(row[2])===key(IDENTITY_CONTEXT))row[3]=list([p[0],q(key(row[0])===key(signed(10))?1:0,1),q(pressure&&key(row[0])===key(signed(10))?1:0,2),false]);
  if(key(row[2])===key(VALUES_CONTEXT))row[3]=list([p[0],false,p[2]]);
  return list(row);
 });
 return {s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export async function create(enabled=true,pressure=false,hidden=false,at=12n){const b=fixture(enabled,pressure,hidden),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};}
export const fp=formationPath(C),jp=journalPath(r(412,[C,sid(1041,'CommitmentFidelity')]));
export const learned=(run:Parameters<typeof snap>[0])=>({formation:formationValue(state(run).read(fp).value),journal:identityJournal(state(run).read(jp).value),history:state(run).read({...jp,fieldId:1n}).value});
export const standing=(raw:CanonicalValue)=>items(f(rec(raw,403n),3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))===3n);
export const withoutStanding=(raw:CanonicalValue)=>set(items(f(rec(raw,403n),3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))!==3n));
export function capture(run:Parameters<typeof snap>[0],at=12n){
 const p=priorCapture(run,at),traces=items(decode(snap(run).trace),'list').map(v=>rec(v,160n));
 const trace=traces.find(t=>txt(f(t,6n))===FORMATION_VERSION&&key(f(rec(f(t,4n),130n),2n))===key(signed(at))&&uint(f(rec(f(t,4n),130n),3n))===80n)!;expect(trace).toBeDefined();
 const input=items(f(trace,12n),'list'),out=items(f(trace,13n),'list'),meaning=f(rec(input[0],403n),4n);
 if(typeof meaning==='boolean'||meaning.kind!=='map')throw Error('meaning');
 return {...p,trace,input,source:out[0],report:out[1],semantics:new Map(meaning.entries.map(([k,v])=>[key(k),readQ(v)])),traces};
}
export function correspondence(p:{raw:CanonicalValue;ns:readonly CanonicalValue[]},source:{registry:Uint8Array}){
 const rows=items(f(rec(p.raw,403n),6n),'list').filter(v=>!readQ(f(rec(items(v,'list')[2],402n),2n)).equals(ZERO)).map(v=>{
  const d=items(v,'list'),s=rec(d[2],402n),k=rec(f(s,1n),401n);
  return rr(919,[rr(916,[sid(1027,'M89/'+key(descriptionIdentity(v))),f(k,1n),d[1],f(rec(f(k,2n),371n),2n),f(k,3n),q(1,1),set([])]),f(s,2n),f(s,3n),list([])]);
 });
 // The old envelope admits six sources total. Aggregate has no cross-group
 // operation: compile each complete option/motive/referent group, never truncate.
 const groups=new Map<string,typeof rows>();
 for(const row of rows){const d=rec(f(row,1n),916n),k=key(list([f(d,2n),f(d,3n),f(d,4n)]));groups.set(k,[...(groups.get(k)??[]),row]);}
 expect([...groups.values()].reduce((n,g)=>n+g.length,0)).toBe(rows.length);
 const original=[...groups.values()].flatMap(group=>{expect(group.length).toBeLessThanOrEqual(6);return originalNuclei(compile(group,definition(source)));});
 expect(key(set(original.map(originalProjection)))).toBe(key(set(p.ns.map(projection))));
 console.info('M89 ORIGINAL GROUPS '+JSON.stringify({sources:rows.length,groupSizes:[...groups.values()].map(g=>g.length),nativeNuclei:p.ns.length,allSourcesRetained:true}));
}
export function mapping(run:Parameters<typeof snap>[0]){
 const p=capture(run),l=learned(run);expect(l.journal).toHaveLength(1);expect(l.formation.entries).toHaveLength(1);expect(l.formation.P.equals(ZERO)).toBe(false);
 const qualification=qualificationParts(l.journal[0]);expect(qualification.accepted).toBe(true);expect(qualification.at.value).toBe(10n);
 expect(items(l.formation.entries[0],'list')[0]).toEqual(qualification.id);
 expect(l.history).toEqual(r(414,[list([qualification.numeric])]));
 expect(p.input[1]).toEqual(state(run).read(fp).value);const produced=formationSignals(p.input[0],p.input[1]);expect(produced.output).toEqual(p.source);expect(produced.report).toEqual(p.report);
 const signals=standing(p.raw);expect(signals).toHaveLength(2);expect(standing(p.source)).toEqual(signals);
 const originalFold=foldIdentityHistory([qualification.numeric],Q.of(1n,100n)),control:CanonicalValue[]=[];
 for(const s of signals){
  const signal=rec(s,402n),k=rec(f(signal,1n),401n),alignment=choiceAlignment(f(k,1n),p.semantics);
  expect(readQ(f(signal,2n))).toEqual(l.formation.P.multiply(alignment));
  const descriptor=rr(916,[sid(1027,'M89/standing/'+key(k)),f(k,1n),sid(1040,'Commitment'),f(rec(f(k,2n),371n),2n),u(3),qValue(alignment),set([])]);
  const output=reasonRaw(typedIdentifier(1160,u(0)),[descriptor],[],l.history!).output,source=rec(items(f(rec(output,920n),2n),'list')[0],919n);
  expect(f(source,3n)).toEqual(f(signal,3n));expect(f(source,5n)).toEqual(l.history);expect(f(source,2n)).toEqual(qValue(originalFold.strength.multiply(alignment)));
  expect(f(source,2n)).not.toEqual(f(signal,2n));control.push(f(source,2n));
  const empty=reasonRaw(typedIdentifier(1160,u(0)),[descriptor],[],r(414,[list([])])).output;expect(items(f(rec(empty,920n),2n),'list')).toHaveLength(0);expect(items(f(rec(empty,920n),3n),'list')).toHaveLength(1);
 }
 return {...p,...l,qualification,control,originalFold};
}
export {snap,through,state,decode,items,key,enc,rec,f,uint,q,list,set,text,u,signed,sid,r,definition,projection,choiceAlignment,readQ,qValue,Q,formationSignals,formationValue,fp as formationStatePath};

/** Approved M89 comparison only. Derived operands never enter a character. */
export async function ablateStanding(p:ReturnType<typeof capture>,source:{registry:Uint8Array}){
 const descriptions=items(f(p.raw,6n),'list').filter(v=>uint(f(rec(f(rec(items(v,'list')[2],402n),1n),401n),3n))!==3n);
 const raw=r(403,[f(p.raw,1n),f(p.raw,2n),withoutStanding(p.raw),f(p.raw,4n),f(p.raw,5n),list(descriptions)],3);
 for(const field of [1n,2n,4n,5n])expect(f(rec(raw,403n),field)).toEqual(f(p.raw,field));
 const dice=definition(source);
 expect(compileDescribedReasons(p.raw,dice,3,'Jaccard',true).nuclei).toEqual(p.ns);
 const ns=compileDescribedReasons(raw,dice,3,'Jaccard',true).nuclei;
 const context=r(408,[f(p.context,1n),raw,list(ns)]);
 const definitionRow=items(items(decode(source.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/task-arbitration')))!;
 expect(definitionRow).toBeDefined();const arb=f(rec(definitionRow,171n),4n);
 const captured=items(f(p.data,9n),'list').map(v=>rec(v,422n)),used=new Set<string>(),tie=rec(f(p.data,10n),423n);let tieUsed=false;
 const d=rec(await arbitrationOutput(f(p.d,1n),12n,context,arb,{
  async reason(n){
   const nucleus=rec(n,407n),k=key(f(nucleus,1n)),draw=captured.find(v=>key(f(v,1n))===k);
   if(!draw||used.has(k))throw Error('M89 no matching unused native reason draw');
   expect(f(draw,2n)).toEqual(f(nucleus,4n));used.add(k);return f(draw,5n);
  },
  async tie(leaders){
   if(tieUsed||uint(f(tie,1n))!==2n)throw Error('M89 no matching unused native tie draw');
   expect(list(leaders)).toEqual(f(tie,2n));tieUsed=true;return f(tie,3n);
  }
 },3),409n);
 const status=rec(f(d,4n),419n);expect(uint(f(status,1n)),'live captured-input decision').toBe(3n);
 expect(used.size).toBe(captured.length);expect(tieUsed).toBe(uint(f(tie,1n))===2n);
 return {raw:rec(raw,403n),context,ns,d,data:rec(f(status,2n),420n),value:items(f(rec(raw,403n),5n),'set'),usedDraws:used.size+(tieUsed?1:0)};
}
