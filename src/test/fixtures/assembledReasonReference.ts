/** M94: version-only promotion of existing physical, seed0 fixtures.
 * No source, calibration, calendar or psychological-state edits in promotion. */
import {expect} from 'vitest';
import {record,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {REASON_REFERENCE_RULES,REASON_REFERENCE_REGISTRY} from '../../assembled/model';
import {compileDescribedReasons,REASON_REFERENCE_VERSION} from '../../assembled/reasons';
import {REASON_PRODUCED} from '../../assembled/reasonEvidence';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {reasonRaw} from '../../campaign3/reasonMath';
import {reasonRecord as rr} from '../../campaign3/reasonCodecs';
import {capture as decision} from './assembledValueProvenance';
import {fixture as evidence} from './assembledReasonEvidence';
import {fixture as standing} from './assembledStandingSources';
import {taskB} from './assembledDecisionRegimes';
import {snap,through,decode,enc,items,key,rec,r,f,uint,q,list,set,text,u,signed,sid,definition} from './assembledContextReasons';
export function promote<T extends {s:ReturnType<typeof evidence>['s'];d:ReturnType<typeof evidence>['d']}>(b:T){
 return {...b,s:{...b.s,rulesVersion:REASON_REFERENCE_RULES,registrySchemaVersion:REASON_REFERENCE_REGISTRY}};
}
export async function create(b:ReturnType<typeof promote>,at=10n){
 const run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};
}
export function standingProbe(pressure=false,hidden=false){
 const b=standing(true,pressure,hidden);let changed=0;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const row=[...items(v,'list')];if(key(row[0])===key(signed(12))&&key(row[2])===key(PRIORITY_DISPLAY)){
   const p=items(row[3],'list');row[3]=list([p[0],list(items(p[1],'list').map(v=>{
    const t=[...items(v,'list')];if(key(t[0])===key(taskB)){expect(t[3]).toEqual(list([q(1,1)]));t[3]=list([q(19,20)]);changed++;}return list(t);
   }))]);
  }return list(row);
 });expect(changed).toBe(1);return promote({...b,d:{...b.d,orderedInputs:enc(list(rows))}});
}
export function capture(run:Parameters<typeof snap>[0],source:{registry:Uint8Array},at=10n){
 const p=decision(run,at),compiled=compileDescribedReasons(p.raw,definition(source),3,'SourceCoverage',true);
 expect(compiled.nuclei).toEqual(p.ns);expect(items(compiled.report,'list')[3]).toEqual(text('SourceCoverage'));
 const all=items(decode(snap(run).outputs),'list'),traces=items(decode(snap(run).trace),'list').map(v=>rec(v,160n));
 const report=all.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(REASON_PRODUCED))&&key(v.items[1])===key(signed(at)))!;
 expect(report).toBeDefined();const rows=items(report,'list'),frozen=items(rows[2],'list'),samples=items(frozen[2],'list'),produced=items(rows[3],'list'),rejected=items(rows[4],'list');
 for(const output of [p.raw,list([p.context,compiled.report]),p.d])expect(traces.some(t=>key(f(t,6n))===key(text(REASON_REFERENCE_VERSION))&&key(f(t,13n))===key(output)),'versioned raw/compile/decision trace').toBe(true);
 expect(traces.some(t=>key(f(t,12n))===key(p.raw)&&key(f(t,13n))===key(list([p.context,compiled.report])))).toBe(true);
 return {...p,compiled,groups:items(items(compiled.report,'list')[1],'list').map(v=>items(v,'list')),report,frozen,samples,produced,rejected};
}
export function sourceCorrespondence(p:ReturnType<typeof capture>){
 const descriptors=p.produced.map(v=>{const d=items(items(v,'list')[0],'list');return rr(916,[sid(1027,'reference/'+key(d[0])),r(395,[f(rec(d[2],371n),1n),d[1]]),sid(1040,'Commitment'),f(rec(d[2],371n),2n),d[5]??u(1),d[3],d[4]]);});
 const convert=(v:CanonicalValue)=>{const x=items(v,'list');return rr(917,[x[1],x[2],x[3],x[4],x[5]]);};
 const raw=reasonRaw(typedIdentifier(1160,u(0)),descriptors,p.samples.map(convert),r(414,[list([])])).output,sources=items(f(rec(raw,920n),2n),'list');
 expect(sources).toHaveLength(p.produced.length);
 p.produced.forEach((v,i)=>{const row=items(v,'list'),signal=rec(items(row[1],'list')[2],402n),original=rec(sources[i],919n);
  expect(f(original,2n)).toEqual(f(signal,2n));expect(f(original,3n)).toEqual(f(signal,3n));expect(f(original,4n)).toEqual(list(items(row[2],'list').map(convert)));
  expect(items(f(p.raw,6n),'list')).toContainEqual(row[1]);for(const sample of items(row[2],'list'))expect(p.samples).toContainEqual(sample);
 });
}
export function replace(v:CanonicalValue,n:bigint,next:CanonicalValue){if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields].map(([k,x])=>[k,k===n?next:x])));}
export {snap,through,decode,enc,items,key,rec,r,f,uint,q,list,set,text,u,signed,sid,definition};
