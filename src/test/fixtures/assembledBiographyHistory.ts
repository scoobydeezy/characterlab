/** M107 plan888a5cc9. Fixed natural seeds0..7; repeated admitted M106 frames.
 * No map, seed search, authored biography, production change or alternate runtime. */
import {expect} from 'vitest';
import {changeDefinition} from './assembledCharacter';
import {restoreAuthoritativeState} from '../../substrate/state';
import {fixture as prior,learned as oldLearned,standing,ablation,rec,f,uint,items,key,decode,enc,list,text,signed,q,readQ,ZERO,outputs,signedValue,snap,through,finish,exact,bytes,qualificationParts,fraction,type Run,type CanonicalValue} from './assembledBiography';
import {capture,fp,jp} from './assembledStandingSources';
import {taskA} from './assembledDecisionRegimes';
import {IDENTITY_CONTEXT,qualifyIdentity,frozenIdentityExpression,identityJournal} from '../../assembled/identityEligibility';
import {BODY_SAMPLE} from '../../assembled/body';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {appendFormation,formationValue,formationSignals} from '../../assembled/formation';
import {expressionOutput,intentOutput} from '../../assembled/choice';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {record} from '../../substrate/canonicalEncoding';
import {ExactRational as Q} from '../../substrate/exactMath';
import {arbitrationOutput} from '../../assembled/arbitration';
import {arbitrationDefinition,token} from './assembledStandingRounding';
import {ROUNDING_SPAN} from '../../assembled/standingRounding';
export const learning=[10n,12n,14n,16n,18n,20n,22n,24n],probe=26n;
export const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('M107 record');return record(v.schema,new Map([...v.fields].map(([k,y])=>[k,k===n?x:y])));};
const bases=new Map<boolean,ReturnType<typeof prior>>(),fixtures=new Map<string,ReturnType<typeof prior>>();
export function fixture(seed=0,pressure=false,hidden=false){
 const cached=fixtures.get(pressure+'/'+hidden);if(cached)return {...cached,d:{...cached.d,runSeed:new Uint8Array(32).fill(seed)}};
 let b=bases.get(hidden);if(!b){b=prior(false,hidden);bases.set(hidden,b);}
 const rows=[...items(decode(b.d.orderedInputs),'list')],template=rows.filter(v=>signedValue(items(v,'list')[0])===12n&&key(items(v,'list')[2])!==key(BODY_SAMPLE));
 expect(template.some(v=>key(items(v,'list')[2])===key(IDENTITY_CONTEXT))).toBe(true);
 for(const at of [...learning.slice(2),probe])for(const v of template){
  const x=[...items(v,'list')];x[0]=signed(at);const i=rows.findIndex(v=>{const r=items(v,'list');return key(r[0])===key(x[0])&&key(r[2])===key(x[2]);});
  if(i<0)rows.push(list(x));else rows[i]=list(x);
 }
 const next=rows.map(v=>{const x=[...items(v,'list')],at=signedValue(x[0]);
  if(key(x[2])===key(IDENTITY_CONTEXT)){const p=items(x[3],'list');x[3]=list([p[0],q(learning.includes(at)?1:0,1),q(pressure&&learning.includes(at)?1:0,2),false]);}
  if(at===probe&&key(x[2])===key(PRIORITY_DISPLAY)){const p=items(x[3],'list');x[3]=list([p[0],list(items(p[1],'list').map(v=>{const t=[...items(v,'list')];if(key(t[0])===key(taskA))t[3]=list([q(5,6)]);return list(t);}))]);}
  return list(x);
 });
 // The repeated opportunity calendar must precede task expiry, like the existing garden.
 let s=b.s;for(const n of ['definition/task-a','definition/task-b'])s=changeDefinition(s,n,6n,signed(40));
 const result={s,d:{...b.d,orderedInputs:enc(list(next))}};fixtures.set(pressure+'/'+hidden,result);return {...result,d:{...result.d,runSeed:new Uint8Array(32).fill(seed)}};
}
const prepared=new WeakMap<object,ReturnType<typeof prepareCharacterModel>>();
export async function create(b=fixture(),at=9n){let model=prepared.get(b.s);if(!model){model=prepareCharacterModel(b.s);prepared.set(b.s,model);}const run=await createCharacterRun(await model,b.d);await through(run,at);return {b,run};}
const learnedCache=new WeakMap<ReturnType<typeof snap>,ReturnType<typeof oldLearned>>();
export function learned(run:Run){const snapshot=snap(run),cached=learnedCache.get(snapshot);if(cached)return cached;
 const state=restoreAuthoritativeState(decode(snapshot.state)),value={formation:formationValue(state.read(fp).value),journal:identityJournal(state.read(jp).value),history:state.read({...jp,fieldId:1n}).value};learnedCache.set(snapshot,value);return value;
}
export function live(run:Run,at:bigint,streams?:{outputs:CanonicalValue;trace:CanonicalValue}){
 let p:ReturnType<typeof capture>;try{p=capture(run,at,streams);}catch(error){const d=outputs(snap(run).outputs,409n).find(v=>signedValue(f(v,2n))===at),states=restoreAuthoritativeState(decode(snap(run).state)).entries().filter(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===1n);console.info('M107 LIVENESS FAILURE '+JSON.stringify({at:String(at),status:d?String(uint(f(rec(f(d,4n),419n),1n))):'absent',tasks:states},(_,v)=>typeof v==='bigint'?String(v):v));throw error;}
 expect(p.ns).toHaveLength(2);expect(uint(f(p.data,8n))).not.toBe(1n);for(const n of p.ns)expect(uint(f(rec(n,407n),4n))).toBe(4n);return p;
}
export function refold(run:Run){
 const l=learned(run);expect(l.journal.length).toBe(l.formation.entries.length);let value:CanonicalValue|undefined;
 for(const [i,v]of l.journal.entries()){
  const qual=qualificationParts(v),entry=items(l.formation.entries[i],'list');expect(entry[0]).toEqual(qual.id);expect(entry[1]).toEqual({kind:'unsigned',value:qual.at.value});expect(entry[2]).toEqual(qual.contribution);
  // The repeated admitted practice frame retains event-time phase0; do not infer age from count.
  expect(uint(entry[3])).toBe(0n);value=appendFormation(value,qual.id,qual.at.value,readQ(qual.contribution),0).value;
 }
 expect(formationValue(value)).toEqual(l.formation);return {...l,value};
}
export function reinterpret(run:Run,current:ReturnType<typeof live>){
 const l=refold(run),meaning=f(current.raw,4n);let wrong:CanonicalValue|undefined;
 for(const [i,v]of l.journal.entries()){
  const qual=qualificationParts(v),old=qual.resolution,ctx=rec(f(old,3n),408n),raw=rec(f(ctx,2n),403n),intent=rec(f(qual.expression,2n),425n),envelope=items(items(v,'list')[2],'list');
  const replaced=replace(old,3n,replace(ctx,2n,replace(raw,4n,meaning)));
  const expression=expressionOutput(f(qual.expression,1n),intentOutput(f(intent,1n),replaced));
  const revised=qualifyIdentity(qual.id,frozenIdentityExpression(expression,uint(envelope[2]),envelope[3]));
  expect(key(expression)).not.toBe(key(qual.expression));const next=qualificationParts(revised);expect(next.accepted).toBe(true);
  expect(readQ(next.contribution).compare(ZERO)).toBe(-readQ(qual.contribution).compare(ZERO));
  wrong=appendFormation(wrong,qual.id,qual.at.value,readQ(next.contribution),Number(uint(items(l.formation.entries[i],'list')[3]))).value;
 }
 expect(formationValue(wrong).P.equals(l.formation.P)).toBe(false);return formationValue(wrong).P;
}
export async function enumerate(p:ReturnType<typeof live>,source:ReturnType<typeof fixture>['s'],context:CanonicalValue=p.context){
 const ns=items(f(rec(context,408n),3n),'list').map(v=>rec(v,407n)),templates=items(f(p.data,9n),'list').map(v=>rec(v,422n));expect(ns).toHaveLength(2);expect(templates).toHaveLength(2);
 const levels=ns.map(n=>{const t=uint(f(n,10n));return t?[[t,Q.of(1n).subtract(Q.of(t,ROUNDING_SPAN))],[0n,Q.of(t,ROUNDING_SPAN)]] as const:[[undefined,Q.of(1n)]] as const;});
 const definition=arbitrationDefinition(source),sum=new Map<string,Q>();let total=ZERO,cases=0;
 for(let a=0n;a<4n;a++)for(let b=0n;b<4n;b++)for(const [wa,pa]of levels[0])for(const [wb,pb]of levels[1])for(let tie=0n;tie<2n;tie++){
  const index=(v:CanonicalValue)=>{const i=ns.findIndex(n=>key(n)===key(v));expect(i).toBeGreaterThanOrEqual(0);return i;};
  const d=await arbitrationOutput(f(p.d,1n),signedValue(f(p.d,2n)),context,definition,{
   async reason(n){const i=index(n);return token(f(templates[i],5n),i===0?a:b);},
   async rounding(n){const i=index(n);return token(f(templates[i],5n),(i===0?wa:wb)!,ROUNDING_SPAN);},
   async tie(){return token(f(templates[0],5n),tie,2n);}
  },3),data=rec(f(rec(f(rec(d,409n),4n),419n),2n),420n),winner=key(f(data,1n)),weight=pa.multiply(pb).divide(Q.of(32n));
  sum.set(winner,(sum.get(winner)??ZERO).add(weight));total=total.add(weight);cases++;
 }
 expect(total).toEqual(Q.of(1n));return {sum,cases};
}
export {capture,standing,ablation,rec,f,uint,items,key,decode,enc,list,text,signed,q,readQ,ZERO,outputs,signedValue,snap,through,finish,exact,bytes,qualificationParts,fraction,Q,formationSignals};
export type {Run,CanonicalValue};
