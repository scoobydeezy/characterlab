/** M222: nonsocial tasks, seed0, body10/cap100/rate0/grid1/T60.
 * Importance is observed at1; six ordinary opportunities2..7. Two fixed Need
 * responses supply a common competitor; no learned S0 or authored reason. */
import {fixture as prior,decode,items,key,enc,list,text,u,signed,C,rec,f,at,q,type CanonicalValue} from './assembledNeed';
import {dataUnsigned as uint} from '../../campaign2/canonicalData';
import {PRIORITY,PRIORITY_DISPLAY,PRIORITY_MOTIVE,importancePath} from '../../assembled/priority';
import {DISPLAY} from '../../assembled/strategy';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
import {restoreAuthoritativeState} from '../../substrate/state';
import {candidate248,consumed248} from './assembledPriorityReplay';
export type Options={importance?:number|null;initialUrgency?:number;adoptionVisible?:boolean;urgencyVisible?:boolean;omitAt?:number};
export function fixture(o:Options={}){
 const b=prior({goals:true}),original=items(decode(b.d.orderedInputs),'list'),adopt=items(original.find(v=>key(items(v,'list')[2])===key(PRIORITY_DISPLAY))!,'list'),ps=items(items(adopt[3],'list')[1],'list'),task=items(ps[0],'list')[0];
 const frame=original.filter(v=>at(items(v,'list')[0])===2n&&![PRIORITY_DISPLAY,DISPLAY].some(s=>key(s)===key(items(v,'list')[2])));
 const rows=original.filter(v=>at(items(v,'list')[0])===1n&&key(items(v,'list')[2])!==key(PRIORITY_DISPLAY)||key(items(v,'list')[2])===key(DISPLAY)).map(v=>{
  const a=[...items(v,'list')];if(key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(r[3]===true)r[5]=u(8);return list(r);}))]);}return list(a);
 });
 const importance=o.importance===undefined?1000:o.importance,urgencies=[o.initialUrgency??1000,0,null,1000,0,0];
 const optional=(n:number|null)=>n===null?list([]):list([q(n,1000)]);
 rows.push(list([signed(1),adopt[1],PRIORITY_DISPLAY,list([text(PRIORITY),list(ps.map(v=>{const r=[...items(v,'list')];r[1]=optional(key(r[0])===key(task)?importance:1000);r[2]=o.adoptionVisible!==false;r[3]=list([]);return list(r);}))]),adopt[4]]));
 for(let i=0;i<6;i++){
  const t=i+2;for(const v of frame){const a=[...items(v,'list')];a[0]=signed(t);rows.push(list(a));}
  if(o.omitAt!==t)rows.push(list([signed(t),adopt[1],PRIORITY_DISPLAY,list([text(PRIORITY),list(ps.map(v=>{const r=[...items(v,'list')];r[1]=list([]);r[3]=optional(key(r[0])===key(task)?urgencies[i]:0);r[4]=o.urgencyVisible!==false;return list(r);}))]),adopt[4]]));
 }
 return {...b,task,importance,urgencies,d:{...b.d,orderedInputs:enc(list(rows))}};
}
let prepared:ReturnType<typeof prepareCharacterModel>|undefined;
export async function start(o:Options={}){const b=candidate248(fixture(o)),m=await(prepared??(prepared=prepareCharacterModel(b.s)));return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export type Run=Awaited<ReturnType<typeof start>>['run'];
export async function through(run:Run,t:bigint){for(let n=0;run.snapshot().clock<t;n++){if(n>=40||!await run.settleNextInstant())throw Error('M222 did not reach '+t);}if(run.snapshot().clock!==t)throw Error('M222 skipped instant');}
export function capture(run:Run,task:CanonicalValue,t:number){
 const os=items(decode(run.snapshot().outputs),'list'),report=os.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(PRIORITY_MOTIVE))&&uint(v.items[1])===BigInt(t));
 if(!report)throw Error('M222 missing live motive report '+t);
 const operand=items(items(items(report,'list')[2],'list').find(v=>key(items(v,'list')[0])===key(task))!,'list');
 const d=rec(os.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&at(f(v,2n))===BigInt(t))!,409n),ctx=rec(f(d,3n),408n),raw=rec(f(ctx,2n),403n),ns=items(f(ctx,3n),'list'),status=rec(f(d,4n),419n);
 const prob=uint(f(status,1n))===3n?items(f(rec(f(status,2n),420n),2n),'list').map(v=>f(rec(v,421n),2n)):[];
 consumed248({d,os});
 return {operand,d,raw,ns,prob,state:restoreAuthoritativeState(decode(run.snapshot().state)).read(importancePath(task)),os};
}
export {decode,items,key,enc,list,text,u,signed,C,rec,f,at,q};
