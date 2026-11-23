/** M233: fixed reference laws/seed7; source-backed goal completion and adoption timing. */
import {fixture as routes,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,type CanonicalValue} from './assembledGoalStrategyCurrent';
import {fixture as fulfillment} from './assembledGoalFulfillmentCurrent';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {PROBE_SOURCE_EVENT} from '../../campaign2/orderedInputs';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {dataRecord as raw} from '../../campaign2/canonicalData';
import {changeDefinition} from './assembledCharacter';
import {PRIORITY,PRIORITY_DISPLAY} from '../../assembled/priority';
import {OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
export const names=['main','noCriterion','simultaneous','noLater','noAdoption'] as const;
export type Case=typeof names[number];
let mainBase:ReturnType<typeof routes>|undefined,adoptionBase:ReturnType<typeof fulfillment>|undefined;
export function fixture(name:Case){
 const main=name==='main'||name==='noCriterion',b=main?(mainBase??(mainBase=routes('switchGap'))):(adoptionBase??(adoptionBase=fulfillment('externalNoRoute2')));
 let s=b.s,inputs=[...items(decode(b.d.orderedInputs),'list')];
 const probe=(t:number)=>list([signed(t),u(110),PROBE_SOURCE_EVENT,r(333,[sid(1027,'definition/regulatory-diagnostic-probe')]),list([])]);
 if(main){
  s=changeDefinition(s,'definition/task-b',3n,q(54,10));s=changeDefinition(s,'definition/task-b',4n,q(55,10));
  inputs.push(...inputs.filter(v=>at(items(v,'list')[0])===7n).map(v=>{const a=[...items(v,'list')];a[0]=signed(9);if(key(a[2])===key(OPPORTUNITY_SOURCE)){const p=items(a[3],'list');a[3]=list([...p.slice(0,2),set(items(p[2],'set').map(v=>{const row=items(v,'list');return list([row[0],b.actions.some(x=>key(x)===key(row[0]))?false:row[1]]);}))]);}return list(a);}));
  if(name==='main')inputs.push(probe(8));
 }else{
  const original=inputs.find(v=>at(items(v,'list')[0])===2n&&key(items(v,'list')[2])===key(PRIORITY_DISPLAY))!,a=items(original,'list'),p=items(a[3],'list'),row=items(items(p[1],'list')[0],'list');
  const empty=list([text(PRIORITY),list([list([row[0],list([]),true,row[3],true])])]);
  inputs=inputs.filter(v=>!(name==='noLater'&&at(items(v,'list')[0])===7n&&key(items(v,'list')[2])===key(PROBE_SOURCE_EVENT))).map(v=>key(v)===key(original)?list([...a.slice(0,3),empty,a[4]]):v);
  inputs.push(list([signed(5),a[1],a[2],name==='noAdoption'?empty:a[3],a[4]]));
 }
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().filter(e=>e.path.rootStateTypeId!==302n));
 // Assert the operands that made M232's naive fixture expectations wrong.
 const defs=items(items(decode(s.registry),'list')[0],'set'),body=(name:string)=>{const v=defs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&v.fields.get(1n)&&key((v.fields.get(1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)===key(text(name)));if(!v||typeof v==='boolean'||v.kind!=='record')throw Error('M233 missing definition '+name);return v.fields.get(4n)!;};
 const reg=raw(body('variable/fixture-regulation'),283n),unit=raw(f(reg,1n),280n),reference=raw(f(reg,2n),282n),chars=f(reference,1n),parameters=f(reference,2n);
 if(typeof chars==='boolean'||chars.kind!=='map'||typeof parameters==='boolean'||parameters.kind!=='map')throw Error('M233 reference maps');
 const anchor=raw(chars.entries.find(([k])=>key(f(raw(k,281n),1n))===key(C))![1],121n),rate=raw(parameters.entries.find(([k])=>key(k)===key(f(anchor,3n)))![1],120n);
 const counts=b.actions.map(v=>{if(typeof v==='boolean'||v.kind!=='typedIdentifier'||typeof v.payload==='boolean'||v.payload.kind!=='text')throw Error('M233 action ID');return uint(f(raw(body(v.payload.value),391n),1n));});
 if(counts.join(',')!=='1,1'||uint(f(unit,1n))!==10n||at(f(anchor,1n))!==50n||uint(f(anchor,2n))!==0n||at(f(rate,2n))!==0n||uint(f(rate,3n))!==1n||at(f(raw(body('rule/fixture-regulatory-displacement'),311n),6n))!==1n)throw Error('M233 frozen source operands changed');
 return {...b,s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(inputs))},main};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export async function through(run:Awaited<ReturnType<typeof start>>['run'],t:bigint){for(let n=0;run.snapshot().clock<t;n++){if(n>=48||!await run.settleNextInstant())throw Error('M233 did not reach '+t);}if(run.snapshot().clock!==t)throw Error('M233 skipped instant');}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid};
export type {CanonicalValue};
