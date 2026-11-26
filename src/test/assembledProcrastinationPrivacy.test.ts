import {it,expect,afterEach} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {inflateSync,deflateSync} from 'node:zlib';
// @ts-expect-error Hash.
import {createHash} from 'node:crypto';
import {fixture,start,finish,procrastinationCases,rec,f,uint,items,key,decode,enc,list,text,signed,sid,taskA,countPath,countProgress,countWorld,cachedMemory,restorePreparedCharacterRun,type CanonicalValue,type Run} from './fixtures/assembledProcrastinationOriginal';
import {STRESS_APPLY} from '../assembled/regulatoryStress';
import {BODY_OWNER} from '../assembled/bodyIdentifiers';
import {COUNT_SOURCE} from '../assembled/countedGoal';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue,restoreStatePath} from '../substrate/state';
const file='docs/planning/ASSEMBLED_CHARACTER_M282_EVIDENCE.json',hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b,{level:9}).toString('base64')});
const prior={...JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M280_EVIDENCE.json','utf8')),...JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M281_EVIDENCE.json','utf8'))};
const unzip=(v:{deflate:string;hash:string;bytes:number})=>{const b=new Uint8Array(inflateSync(Uint8Array.from(atob(v.deflate),c=>c.charCodeAt(0))));expect(hash(b)).toBe(v.hash);expect(b.length).toBe(v.bytes);return b;};
const saved=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
function put(k:string,v:unknown){const d=saved();if(d[k])expect(d[k]).toEqual(v);else{d[k]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');}}
const state=(save:CanonicalValue)=>restoreAuthoritativeState(f(rec(save,132n),5n));
const stateBytes=(s:AuthoritativeState,exclude:readonly bigint[])=>enc(new AuthoritativeState(s.entries().filter(e=>!exclude.includes(e.path.rootStateTypeId))).canonicalValue());
const records=(vs:readonly CanonicalValue[],type:bigint)=>vs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
let active:Run|undefined;afterEach(ctx=>{if(ctx.task.result?.state==='fail'&&active)put('failed-native-'+Object.keys(saved()).length,{test:ctx.task.name,save:zip(active.save())});active=undefined;});
it('privacy282 physically matched private unit and full continuation',async()=>{
 const frames=procrastinationCases().deniedExecution,b=fixture(frames.map(v=>({...v,reward:false}))),x=await start(b);active=x.r;
 const a=items(decode(unzip(prior['1/deniedExecution'].source)),'list'),c=items(decode(b.d.orderedInputs),'list');expect(c.length).toBe(a.length);let changed=0;
 for(let i=0;i<a.length;i++){if(key(a[i])===key(c[i]))continue;const before=items(a[i],'list'),after=items(c[i],'list');expect(before.slice(0,3)).toEqual(after.slice(0,3));expect(before[4]).toEqual(after[4]);expect(key(before[2])).toBe(key(COUNT_SOURCE));const bp=items(before[3],'list'),cp=items(after[3],'list');expect(bp[0]).toEqual(cp[0]);const br=items(items(bp[1],'list')[0],'list'),cr=items(items(cp[1],'list')[0],'list');expect(br[1]).toBe(true);expect(cr[1]).toBe(false);expect([br[0],...br.slice(2)]).toEqual([cr[0],...cr.slice(2)]);changed++;}
 expect(changed).toBe(8);await finish(x.r);const save=x.r.save(),old=decode(unzip(prior['1/deniedExecution'].save)),now=decode(save),os=state(old),ns=state(now);
 put('matched-hidden-unit',{source:zip(b.d.orderedInputs),original:zip(b.original),save:zip(save),onlyEightPrivatePositiveBits:changed});
 expect(hash(stateBytes(ns,[1611n])),'all state including physical/procedural learning').toBe(hash(stateBytes(os,[1611n])));
 expect(hash(enc(f(rec(now,132n),12n))),'ALL runtime outputs').toBe(hash(enc(f(rec(old,132n),12n))));
 expect(countWorld(ns.read(countPath(taskA,true)).value).count).toBe(0n);expect(countWorld(os.read(countPath(taskA,true)).value).count).toBe(3n);
 expect(countProgress(ns.read(countPath(taskA)).value).count).toBe(0n);expect(countProgress(os.read(countPath(taskA)).value).count).toBe(0n);
 const restored=await restorePreparedCharacterRun(x.m,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});expect(hash(restored.save())).toBe(hash(save));
 put('matched-proof',{allOtherState:hash(stateBytes(ns,[1611n])),allOutputs:hash(enc(f(rec(now,132n),12n))),physical:[3,0],received:[0,0],terminalRestore:hash(restored.save())});
},590000);
const physical=[302n,455n,1600n,1611n],embodied=[...physical,785n];
const traces=(s:CanonicalValue)=>items(f(rec(s,132n),11n),'list').map(v=>rec(v,160n));
const readRoots=(t:CanonicalValue)=>items(f(rec(t,160n),11n),'list').map(v=>restoreStatePath(f(rec(v,147n),2n)).rootStateTypeId);
function observer(s:CanonicalValue){
 const selected:CanonicalValue[]=[],omitted:{event:string;phase:string;reads:string[];output:string}[]=[];
 for(const t of traces(s)){const e=rec(f(t,4n),130n),phase=uint(f(e,3n)),roots=readRoots(t),physicalLearning=phase===140n&&roots.some(r=>embodied.includes(r));
  if((phase>=20n&&phase<=100n||phase>=120n&&phase<=140n)&&!physicalLearning)selected.push(list([f(e,2n),f(e,3n),f(e,5n),f(t,5n),f(t,13n)]));
  else omitted.push({event:key(f(e,5n)),phase:String(phase),reads:roots.map(String),output:hash(enc(f(t,13n)))});
 }
 return {bytes:enc(list(selected)),selected:selected.length,omitted};
}
it('privacy282 classify embodied interaction and complete semantic gates',()=>{
 const a=decode(unzip(prior['1/deniedExecution'].save)),b=decode(unzip(prior['1/hiddenPhysical'].save)),sa=state(a),sb=state(b),pa=observer(a),pb=observer(b);
 const changes=[...new Set([...sa.entries(),...sb.entries()].map(e=>key(statePathValue(e.path))))].flatMap(k=>{const x=sa.entries().find(e=>key(statePathValue(e.path))===k),y=sb.entries().find(e=>key(statePathValue(e.path))===k);if(x&&y&&key(x.value)===key(y.value))return [];const p=(x??y)!.path;expect(embodied).toContain(p.rootStateTypeId);return [{root:String(p.rootStateTypeId),path:key(statePathValue(p)),a:x?key(x.value):null,b:y?key(y.value):null}];});
 expect(changes).toHaveLength(9);expect(changes.some(v=>v.root==='785')).toBe(true);
 expect(hash(stateBytes(sa,embodied)),'all remaining epistemic/goal/memory state').toBe(hash(stateBytes(sb,embodied)));
 put('original-interaction',{changes,observerA:hash(pa.bytes),observerB:hash(pb.bytes),selected:[pa.selected,pb.selected],omittedA:pa.omitted,omittedB:pb.omitted});
 expect(hash(pa.bytes),'complete declared observer projection').toBe(hash(pb.bytes));
 const writes:unknown[]=[];let cognitiveReads=0,physicalFeedbackReads=0;
 for(const [arm,s]of [['engaged',a],['blocked',b]] as const)for(const t of traces(s)){
  const e=rec(f(t,4n),130n),phase=uint(f(e,3n)),rootReads=readRoots(t);
  if(phase>=40n&&phase<=90n){if(rootReads.some(r=>embodied.includes(r))){expect(f(e,5n)).toEqual(STRESS_APPLY);expect(phase).toBe(52n);expect(f(t,5n)).toEqual(sid(1036,'seam/assembled-regulatory-stress'));expect(rootReads).toEqual([455n]);for(const r of items(f(t,11n),'list'))expect(restoreStatePath(f(rec(r,147n),2n)).fieldId).toBe(2n);for(const d of items(f(t,17n),'list')){const diff=rec(d,148n),path=restoreStatePath(f(diff,1n));expect([path.rootStateTypeId,path.fieldId]).toEqual([455n,2n]);expect(f(diff,6n)).toEqual(BODY_OWNER);}physicalFeedbackReads++;}else cognitiveReads+=rootReads.length;}
  for(const v of items(f(t,17n),'list')){const diff=rec(v,148n),path=restoreStatePath(f(diff,1n));if(embodied.includes(path.rootStateTypeId))writes.push({arm,at:key(f(e,2n)),event:key(f(e,5n)),root:String(path.rootStateTypeId),owner:key(f(diff,6n)),old:key(f(diff,3n)),next:key(f(diff,5n)),input:hash(enc(f(t,12n))),trace:hash(enc(t))});}
 }
 expect(cognitiveReads).toBeGreaterThan(0);expect(physicalFeedbackReads).toBe(12);put('owners-and-read-boundaries',{writes,cognitiveReads,physicalFeedbackReads,directHiddenCognitiveReads:0});
 const safe=(name:string)=>{const s=decode(unzip(prior[name].save));return {state:hash(stateBytes(state(s),[1611n])),outputs:hash(enc(f(rec(s,132n),12n)))};};
 expect(safe('1/unknown'),'denied versus absent forecast').toEqual(safe('1/denied'));
 const get=(name:string)=>prior[name].ticks as any[];
 expect(get('1/falseUnitOutcome').at(-1).after).toMatchObject({status:'Fulfilled',progress:3,physical:0});
 for(const name of ['1/deniedExecution','1/hiddenPhysical'])expect(get(name).at(-1).after).toMatchObject({status:'DeadlineMissed',progress:0});
 for(const t of get('1/unavailableNow').filter(t=>t.step<6))expect(t.decisions[0]?.choice).not.toBe(0);
 expect(get('1/noGoal').every(t=>t.after.status==='Absent')).toBe(true);expect(get('1/cancelled').slice(2).every(t=>t.after.status==='Cancelled')).toBe(true);
 expect(get('1/falseForecast').at(-1).after.status).toBe('DeadlineMissed');
 const value=(name:string,t:number)=>get(name)[t-1].horizon.find((v:{task:number})=>v.task===0)?.value;
 expect(value('1/corrected',3)).toBe('1/4');expect(value('1/corrected',4)).toBe('1/1');expect(value('3/unknown',2)).toBe('1/4');expect(value('1/unknown',2)).toBe('1/1');
 expect(prior['classified-findings'].ticks).toBe(160);expect(prior['classified-findings'].remaining).toBe('none');
 put('semantic-gates',{original20:true,deniedForecast:true,falseReceipt:true,hiddenNoCompletion:true,absence:true,cancellation:true,wrongForecast:true,correction:true,presentFocused:true,classifiedTicks:160});
},590000);

it('privacy282 identify physical reader',()=>{
 const rows:unknown[]=[];const label=(v:CanonicalValue):string=>typeof v==='boolean'?String(v):v.kind==='text'?v.value:v.kind==='typedIdentifier'?label(v.payload):key(v);
 for(const name of ['1/deniedExecution','1/hiddenPhysical'])for(const t of traces(decode(unzip(prior[name].save)))){const e=rec(f(t,4n),130n),phase=uint(f(e,3n)),roots=readRoots(t);if(phase>=40n&&phase<=90n&&roots.some(r=>embodied.includes(r)))rows.push({name,phase:String(phase),event:label(f(e,5n)),seam:label(f(t,5n)),version:label(f(t,6n)),roots:roots.map(String),trace:hash(enc(t))});}
 expect(rows.length).toBeGreaterThan(0);put('physical-reader-diagnosis',rows);console.info(JSON.stringify(rows));
});
