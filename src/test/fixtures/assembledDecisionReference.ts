/** M105 plan13ae0ca5. Reference-only adapter of existing M80/M81/M82 fixtures.
 * Source slots44/45 empty; no native input, gain, threshold or psychological-state edits. */
import {expect} from 'vitest';
import {fixture as history} from './assembledDecisionHistory';
import {fixture as significance} from './assembledDecisionSignificance';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {ROUNDING_RULES,ROUNDING_REGISTRY} from '../../assembled/model';
import {REASON_SOURCES} from '../../assembled/reasons';
import {CONTEXT_EVIDENCE} from '../../assembled/reasonEvidence';
import {SHARED_AFFECT_APPRAISAL} from '../../assembled/reappraisal';
import {receivingRecord as rec,decodeCognitive as decode,randomDrawRecord,cognitiveRecord as sr} from '../../assembled/codecs';
import {cognitiveRecord as cr} from '../../campaign2/cognitiveCodecs';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../../campaign2/canonicalData';
import {list,set,record,text,unsigned as u,signed,rational as q,canonicalEncode as enc,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {ComparisonDrawMap,type RandomAddress} from '../../substrate/random';
import {comparisonRoles} from '../../assembled/comparison';
import {sid} from '../../assembled/skill';
import {snap,through,finish,exact,bytes} from './assembledAffectReceiving';
import {outputs,signedValue,type Run} from './assembledComparison';
const replace=(v:CanonicalValue,n:bigint,next:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('M105 record required');return record(v.schema,new Map([...v.fields].map(([i,x])=>[i,i===n?next:x])));};
import type {Regime} from './assembledDecisionRegimes';
export function reference(b:ReturnType<typeof history>|ReturnType<typeof significance>){
 const slots=items(decode(b.s.registry),'list');expect(slots).toHaveLength(44);
 return {...b,s:{...b.s,rulesVersion:ROUNDING_RULES,registrySchemaVersion:ROUNDING_REGISTRY,registry:enc(list([...slots,list([text(REASON_SOURCES),list([])]),list([text(CONTEXT_EVIDENCE),list([])])]))}};
}
export const fixture=(physical=true,observed=true,regime:Regime='quiet',hidden=false)=>reference(history(physical,observed,regime,hidden));
export const significant=(low=true,mapping?:ComparisonDrawMap)=>reference(significance(low,false,mapping));
export async function create(b=fixture(),at=10n){const run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};}
export function capture(run:Run){
 const d=outputs(snap(run).outputs,409n).find(v=>signedValue(f(v,2n))===10n)!;expect(d).toBeDefined();
 const status=rec(f(d,4n),419n);expect(uint(f(status,1n))).toBe(3n);
 const context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),data=rec(f(status,2n),420n),ns=items(f(context,3n),'list').map(v=>rec(v,407n));
 expect(ns).toHaveLength(2);
 const os=items(decode(snap(run).outputs),'list'),traces=outputs(snap(run).trace,160n);
 const appraisal=os.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(SHARED_AFFECT_APPRAISAL))).map(v=>items(v,'list')).find(v=>uint(v[1])===10n);
 expect(appraisal).toBeDefined();expect(txt(appraisal![5])).toBe('Known');
 const receiving=traces.find(t=>key(f(t,5n))===key(sid(1036,'seam/assembled-reason-sources'))&&key(f(t,13n))===key(raw))!;
 expect(receiving).toBeDefined();const input=items(f(receiving,12n),'list'),prior=rec(input[0],403n);
 expect(items(input[2],'list')[0]).toEqual(text('assembled-priority-motive/0.1'));
 const before=items(f(prior,3n),'set').map(v=>rec(v,402n));
 for(const v of items(f(raw,3n),'set')){const s=rec(v,402n),old=before.find(x=>key(f(x,1n))===key(f(s,1n)));expect(old).toBeDefined();expect(f(s,2n)).toEqual(f(old!,2n));if(uint(f(rec(f(s,1n),401n),3n))!==1n)expect(s).toEqual(old);}
 for(const n of ns){expect(n.schema.schemaVersion).toBe(3n);expect(f(n,4n)).toEqual(u(4));expect(f(rec(f(n,2n),406n),1n)).toEqual(q(3,8));expect(uint(f(n,10n))).toBe(0n);}
 const intent=outputs(snap(run).outputs,425n).find(v=>key(f(v,2n))===key(d))!;
 const expression=outputs(snap(run).outputs,426n).find(v=>key(f(v,2n))===key(intent))!;
 expect(intent).toBeDefined();expect(expression).toBeDefined();
 const execution=outputs(snap(run).outputs,433n).find(o=>{const attempt=rec(f(o,2n),432n),plan=rec(f(attempt,2n),431n);return key(f(plan,2n))===key(intent);});
 expect(execution,'actual decision->intent->execution').toBeDefined();
 const trace=traces.find(t=>key(f(t,13n))===key(d))!;expect(trace).toBeDefined();
 const ds=items(f(data,9n),'list').map(v=>rec(v,422n));
 for(const roll of ds){expect(items(f(roll,9n),'list')).toHaveLength(0);expect(f(roll,10n)).toEqual(f(roll,3n));}
 const transcript=ds.map(v=>f(v,5n)),tie=rec(f(data,10n),423n);if(uint(f(tie,1n))===2n)transcript.push(f(tie,3n));
 expect(items(f(trace,14n),'list')).toEqual(transcript);
 return {d,context,raw,data,ns,ds,intent,expression,execution,appraisal,transcript,receiving};
}
export function definition(s:ReturnType<typeof fixture>['s']){
 const v=items(items(decode(s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/task-arbitration')))!;
 return f(rec(v,171n),4n);
}
/** Bounded reversible compatibility image; metadata sidecar stays in the test.
 * No nonzero context/rounding, nonempty Values or nonprimary descriptors permitted. */
export function legacy(context:CanonicalValue){
 const c=rec(context,408n),raw=rec(f(c,2n),403n),nuclei=items(f(c,3n),'list').map(v=>rec(v,407n));
 if(items(f(raw,5n),'set').length)throw Error('M105 nonempty Values');
 const descriptions=items(f(raw,6n),'list');
 for(const d of descriptions)if(key(items(d,'list')[0])!==key(text('primary')))throw Error('M105 nonprimary descriptor');
 expect(set(descriptions.map(d=>items(d,'list')[2]))).toEqual(f(raw,3n));
 const oldRaw=cr(403,[f(raw,1n),f(raw,2n),f(raw,3n),f(raw,4n)]);
 const oldNs=nuclei.map(n=>{
  const roles=rec(f(n,2n),406n);
  if(key(f(roles,5n))!==key(q(0,1))||key(f(n,8n))!==key(signed(0))||uint(f(n,10n))!==0n||key(f(n,9n))!==key(f(n,5n)))throw Error('M105 nonzero receiver extension');
  const oldRoles=cr(406,[f(roles,1n),f(roles,2n),f(roles,3n),f(roles,4n)]);
  return cr(407,[f(n,1n),oldRoles,...[3n,4n,5n,6n,7n].map(i=>f(n,i))]);
 });
 const image=cr(408,[f(c,1n),oldRaw,list(oldNs)]);
 const rebuiltRaw=sr(403,[...Array.from({length:4},(_,i)=>f(rec(oldRaw,403n),BigInt(i+1))),f(raw,5n),f(raw,6n)],3);
 const rebuiltNs=oldNs.map((v,i)=>{const n=rec(v,407n),roles=rec(f(n,2n),406n),original=nuclei[i];return sr(407,[f(n,1n),sr(406,[...[1n,2n,3n,4n].map(k=>f(roles,k)),f(rec(f(original,2n),406n),5n)],2),...[3n,4n,5n,6n,7n].map(k=>f(n,k)),f(original,8n),f(original,9n),f(original,10n)],3);});
 expect(sr(408,[f(c,1n),rebuiltRaw,list(rebuiltNs)])).toEqual(context);
 return {image,oldNs};
}
export function oldData(data:CanonicalValue){
 const d=rec(data,420n),rolls=items(f(d,9n),'list').map(v=>{const r=rec(v,422n);expect(f(r,8n)).toEqual(signed(0));expect(items(f(r,9n),'list')).toHaveLength(0);expect(f(r,10n)).toEqual(f(r,3n));return cr(422,[1n,2n,3n,4n,5n,6n,7n].map(i=>f(r,i)));});
 return list(Array.from({length:10},(_,i)=>i===8?list(rolls):f(d,BigInt(i+1))));
}
export function coupling(p:ReturnType<typeof capture>){
 const addresses:RandomAddress[]=p.ns.map(n=>{const k=rec(f(n,1n),404n),a=rec(f(k,1n),395n);return {causalRootId:id(f(p.d,1n)),purposeId:sid(1042,'purpose/task-reason-face'),drawIndex:0n,subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(a,1n))},{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(a,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(k,3n))}]};});
 addresses.push({causalRootId:addresses[0].causalRootId,purposeId:sid(1042,'purpose/task-decision-tie'),drawIndex:0n,subjectBindings:[addresses[0].subjectBindings[0]]});
 return new ComparisonDrawMap(addresses.map(a=>({localRandomAddress:a,comparisonDrawKey:{keyId:sid(10006,key(list([text('M105/significance10'),a.purposeId,list(a.subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId])))]))),comparisonRoleId:sid(10005,'assembled/'+txt(a.purposeId.payload).slice(8))}})),comparisonRoles);
}
export const drawSemantic=(v:CanonicalValue)=>{const d=randomDrawRecord(v);return list([f(d,2n),f(d,3n),f(d,4n)]);};
export {snap,through,finish,exact,bytes,outputs,signedValue,rec,decode,randomDrawRecord,f,items,key,uint,list,set,record,text,u,signed,q,enc,replace,sid};
export type {Run,Regime,CanonicalValue};
