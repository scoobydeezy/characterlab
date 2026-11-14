/** M87 fixed two-stage learning: M86 first-two readings, Jaccard, seed0.
 * Three physical tasks/no people, body30/cap100/rate10, delivery90 at9.
 * Permitted success report10; linked vs unlinked acquisition, common linked probe12.
 * No initial learned state, source/strength injection or scenario dispatch. */
import {expect} from 'vitest';
import {fixture as prior} from './assembledReasonEvidence';
import {VALUE_PROVENANCE_RULES,VALUE_PROVENANCE_REGISTRY} from '../../assembled/model';
import {VALUES,VALUES_CONTEXT} from '../../assembled/values';
import {VALUE_MOTIVE_PROVENANCE,VALUE_PROVENANCE} from '../../assembled/valueReceiving';
import {PERFORMANCE,PERFORMANCE_SETTING,PERFORMANCE_OBS} from '../../assembled/performance';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {DISPLAY} from '../../assembled/strategy';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {taskA,taskB} from './assembledDecisionRegimes';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {snap,through} from './assembledAffectReceiving';
import {outputs,signedValue,type Run} from './assembledComparison';
import {list,text,unsigned as u,signed,rational as q,set,canonicalEncode as enc,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {receivingRecord as rec,decodeCognitive as decode} from '../../assembled/codecs';
import {dataItems as items,dataField as f,dataKey as key,dataUnsigned as uint} from '../../campaign2/canonicalData';
import {sid} from '../../assembled/skill';
export function fixture(linked=true,permitted=true,hidden=false,legacy=false){
 const b=prior(2,[true,true],hidden,false,false),slots=[...items(decode(b.s.registry),'list')];
 slots[25]=list([text(VALUES),taskA,u(0)]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const x=[...items(v,'list')];
  if(key(x[2])===key(DISPLAY)){const p=items(x[3],'list');x[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[5]=u(100);return list(r);}))]);}
  if(key(x[0])===key(signed(10))&&key(x[2])===key(VALUES_CONTEXT))x[3]=list([text(VALUES),linked,signed(1)]);
  return list(x);
 });
 const probe=rows.filter(v=>{const x=items(v,'list');return key(x[0])===key(signed(10))&&key(x[2])!==key(SOCIAL_SOURCE);}).map(v=>{
  const x=[...items(v,'list')];x[0]=signed(12);if(key(x[2])===key(VALUES_CONTEXT))x[3]=list([text(VALUES),true,signed(1)]);return list(x);
 }).filter(v=>{const x=items(v,'list'),existing=rows.find(r=>{const a=items(r,'list');return key(a[0])===key(x[0])&&key(a[2])===key(x[2]);});if(!existing)return true;
  if(key(x[2])===key(PRIORITY_DISPLAY)){
   const old=[...items(existing,'list')],p=items(old[3],'list');
   old[3]=list([p[0],list(items(p[1],'list').map(v=>{const row=[...items(v,'list')];if(![taskA,taskB].some(t=>key(t)===key(row[0]))){expect(row[3]).toEqual(list([q(1,1)]));row[3]=list([q(0,1)]);}return list(row);}))]);
   expect(list(old),'only garden urgency differs from predeclared frame10').toEqual(v);rows[rows.indexOf(existing)]=v;
  }else expect(existing,'existing identical calendar frame').toEqual(v);
  return false;});
 expect(probe.some(v=>key(items(v,'list')[2])===key(sid(1001,'event/deliberation-opportunity')))).toBe(true);
 rows.push(list([signed(10),u(30),PERFORMANCE_SETTING,list([text(PERFORMANCE),list([list([taskA,permitted,u(2)])])]),list([])]),...probe);
 return {s:{...b.s,...(!legacy?{rulesVersion:VALUE_PROVENANCE_RULES,registrySchemaVersion:VALUE_PROVENANCE_REGISTRY}:{}),registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export async function create(linked=true,permitted=true,hidden=false,legacy=false,at=12n){const b=fixture(linked,permitted,hidden,legacy),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};}
export const reports=(run:Run,label:string)=>items(decode(snap(run).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
export function capture(run:Run,at=12n,decodedOutputs?:CanonicalValue){
 const output=decodedOutputs??snap(run).outputs;
 const d=outputs(output,409n).find(v=>signedValue(f(v,2n))===at)!;expect(d,'actual decision').toBeDefined();
 const status=rec(f(d,4n),419n);expect(uint(f(status,1n)),'live choice').toBe(3n);
 const data=rec(f(status,2n),420n),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list'),value=items(f(raw,5n),'set');
 expect(outputs(output,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d)),'actual decision execution').toBe(true);
 return {d,data,context,raw,ns,value,probabilities:items(f(data,2n),'list').map(v=>f(rec(v,421n),2n))};
}
export function citation(run:Run){
 const p=capture(run),m=reports(run,VALUE_MOTIVE_PROVENANCE).find(v=>uint(items(v[7],'list')[2])===12n)!;expect(m).toBeDefined();expect(m[4]).toEqual(q(1,2));expect(m[6]).toEqual(q(1,2));
 const receipts=items(m[8],'list');expect(receipts).toHaveLength(1);const observation=items(items(receipts[0],'list')[0],'list');expect(observation[2]).toEqual(u(10));expect(observation[6]).toBe(true);
 expect(reports(run,PERFORMANCE_OBS).map(list)).toContainEqual(list(observation));expect(p.value).toHaveLength(1);
 const signal=rec(p.value[0],402n),basis=f(rec(f(signal,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');
 expect(basis.entries).toHaveLength(1);const [atom,weight]=basis.entries[0];if(typeof atom==='boolean'||atom.kind!=='record')throw Error('atom');
 expect([atom.schema.typeId,atom.schema.schemaVersion]).toEqual([399n,2n]);expect(atom.fields.get(1n)).toEqual(u(3));expect(atom.fields.get(2n)).toEqual(observation[1]);expect(weight).toEqual(q(1,1));
 const traces=outputs(snap(run).trace,160n),receiver=traces.find(t=>key(f(t,6n))===key(text(VALUE_PROVENANCE))&&key(f(t,13n))===key(p.raw));expect(receiver).toBeDefined();expect(items(f(receiver!,12n),'list')[1]).toEqual(list(m));
 expect(traces.some(t=>key(f(t,12n))===key(p.raw)&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as {kind:string}).kind==='list'),'compiler consumes cited raw').toBe(true);
 return {...p,m,receipts,atom};
}
export {snap,through,decode,items,key,enc,rec,f,uint,q,list,set,text,u,signed,sid};
