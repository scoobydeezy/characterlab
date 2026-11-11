/** M88: three physical tasks, no people/social dependencies. Seed0.
 * Body30/cap100/rate10; delivery90 at9; A/B importance3/5, urgency1, threat1/2.
 * Two permitted reading channels at10; only channel1 differs1/0, gain-1/4,
 * role4 on taskA/action-one. Denied/hidden controls alter their named field only.
 * Test-only compiler/presentation operands never enter a character run. */
import {expect} from 'vitest';
import {typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {CONTEXT_REASON_RULES,CONTEXT_REASON_REGISTRY,VALUE_PROVENANCE_RULES,VALUE_PROVENANCE_REGISTRY} from '../../assembled/model';
import {CONTEXT_EVIDENCE,CONTEXT_REASON_VERSION,REASON_EVIDENCE,REASON_PRODUCED} from '../../assembled/reasonEvidence';
import {descriptionIdentity} from '../../assembled/reasons';
import {fixture as prior,snap,through,decode,items,key,enc,rec,f,uint,q,list,set,text,u,signed,sid} from './assembledReasonEvidence';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {taskA} from './assembledDecisionRegimes';
import {outputs,signedValue,type Run} from './assembledComparison';
import {definition,compile,originalNuclei,originalProjection,nativeProjection} from './assembledReasonCorrespondence';
import {reasonRecord as rr} from '../../campaign3/reasonCodecs';
import {reasonRaw} from '../../campaign3/reasonMath';
import {readQ,ZERO} from '../../campaign2/cognitiveMath';
export function fixture(zero=false,hidden=false,permitted=true,legacy=false){
 const b=prior(0,[permitted,true],hidden,false,false),slots=items(decode(b.s.registry),'list');
 const descriptor=list([text('context'),sid(1027,'definition/protocol-contact-one'),taskA,q(-1,4),set([u(1)]),u(4)]);
 const declaration=list([text(legacy?REASON_EVIDENCE:CONTEXT_EVIDENCE),list(legacy?[]:[descriptor])]);
 const s={...b.s,rulesVersion:legacy?VALUE_PROVENANCE_RULES:CONTEXT_REASON_RULES,registrySchemaVersion:legacy?VALUE_PROVENANCE_REGISTRY:CONTEXT_REASON_REGISTRY,registry:enc(list(slots.map((v,i)=>i===45?declaration:v)))};
 // Change only channel1; the unrelated channel2 remains 1 in both arms.
 const rows=items(decode(b.d.orderedInputs),'list'),event=items(b.event,'list'),payload=items(event[3],'list');
 const reading=list(event.map((v,i)=>i===3?list(payload.map((x,j)=>j===0?q(zero?0:1,1):x)):v));
 const d={...b.d,orderedInputs:enc(list(rows.map(v=>key(v)===key(b.event)?reading:v)))};
 return {s,d,descriptor,declaration};
}
export async function create(zero=false,hidden=false,permitted=true,legacy=false,at=10n){
 const b=fixture(zero,hidden,permitted,legacy),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};
}
export function capture(run:Run){
 const all=items(decode(snap(run).outputs),'list'),d=outputs(snap(run).outputs,409n).find(v=>signedValue(f(v,2n))===10n)!;expect(d).toBeDefined();
 const status=rec(f(d,4n),419n);expect(uint(f(status,1n)),'live decision').toBe(3n);
 const data=rec(f(status,2n),420n),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list');
 expect(items(f(rec(f(raw,2n),398n),3n),'list')).toHaveLength(2);expect(ns).toHaveLength(2);
 expect(outputs(snap(run).outputs,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d)),'actual execution').toBe(true);
 const report=all.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(REASON_PRODUCED))&&key(v.items[1])===key(signed(10)))!;
 const p=items(report,'list'),produced=items(p[3],'list'),rejected=items(p[4],'list'),frozen=items(p[2],'list'),samples=items(frozen[2],'list');
 return {d,data,context,raw,ns,report,produced,rejected,frozen,samples};
}
export function projection(value:CanonicalValue){
 const n=rec(value,407n);if(n.schema.schemaVersion===1n)return nativeProjection(n);
 const old=items(nativeProjection(n),'list'),roles=rec(f(n,2n),406n);return list(old.map((v,i)=>i===4?f(roles,5n):i===9?f(n,8n):v));
}
export function correspondence(raw:CanonicalValue,ns:readonly CanonicalValue[],source:{registry:Uint8Array}){
 const actual=items(f(rec(raw,403n),6n),'list').filter(v=>!readQ(f(rec(items(v,'list')[2],402n),2n)).equals(ZERO)).map(v=>{
  const d=items(v,'list'),signal=rec(d[2],402n),k=rec(f(signal,1n),401n),task=rec(f(k,2n),371n);
  return rr(919,[rr(916,[sid(1027,'M88/'+key(descriptionIdentity(v))),f(k,1n),d[1],f(task,2n),f(k,3n),q(1,1),set([])]),f(signal,2n),f(signal,3n),list([])]);
 });
 const original=compile(actual,definition(source));
 expect(key(set(originalNuclei(original).map(originalProjection)))).toBe(key(set(ns.map(projection))));
 return original;
}
export function sourceCorrespondence(p:ReturnType<typeof capture>){
 expect(p.produced).toHaveLength(1);const row=items(p.produced[0],'list'),d=items(row[0],'list'),signal=rec(items(row[1],'list')[2],402n);
 const descriptors=[rr(916,[sid(1027,'M88/context'),r(395,[f(rec(d[2],371n),1n),d[1]]),sid(1040,'Commitment'),f(rec(d[2],371n),2n),d[5],d[3],d[4]])];
 const convert=(v:CanonicalValue)=>{const s=items(v,'list');return rr(917,[s[1],s[2],s[3],s[4],s[5]]);};
 const raw=reasonRaw(typedIdentifier(1160,u(0)),descriptors,p.samples.map(convert),r(414,[list([])])).output;
 const original=rec(items(f(rec(raw,920n),2n),'list')[0],919n);
 expect(f(signal,2n)).toEqual(q(-1,4));expect(f(original,2n)).toEqual(f(signal,2n));expect(f(original,3n)).toEqual(f(signal,3n));
 expect(f(original,4n)).toEqual(list(items(row[2],'list').map(convert)));
 expect(typeof p.frozen[3]!=='boolean'&&p.frozen[3].kind==='record').toBe(true);
 expect(items(f(p.raw,6n),'list')).toContainEqual(row[1]);
}
export function traces(run:Run,p:ReturnType<typeof capture>){
 const ts=outputs(snap(run).trace,160n),version=text(CONTEXT_REASON_VERSION);
 expect(ts.some(t=>key(f(t,6n))===key(version)&&key(f(t,13n))===key(p.raw)&&typeof f(t,12n)!=='boolean'&&(f(t,12n) as {kind:string}).kind==='list'&&items(f(t,12n),'list').some(v=>key(v)===key(p.report)))).toBe(true);
 expect(ts.some(t=>key(f(t,6n))===key(version)&&key(f(t,12n))===key(p.raw))).toBe(true);
 expect(ts.some(t=>key(f(t,6n))===key(version)&&key(f(t,13n))===key(p.d))).toBe(true);
}
export {snap,through,decode,items,key,enc,rec,f,uint,q,list,set,text,u,signed,sid,r,definition};
