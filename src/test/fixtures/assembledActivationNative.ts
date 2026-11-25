/** M267 test-only native replay; source inputs are retained, never authored cognition. */
import {expect} from 'vitest';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless artifacts.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Hashes.
import {createHash} from 'node:crypto';
import {fixture as acquired} from './assembledMultiSensor';
import {fixture as priority} from './assembledPriorityCurrent';
import {candidate248,replay248} from './assembledPriorityReplay';
import {changeDefinition} from './assembledCharacter';
import {POSITIVE_ACTIVATION_RULES,POSITIVE_ACTIVATION_REGISTRY,ATTEMPT_RECEIPT_RULES,ATTEMPT_RECEIPT_REGISTRY} from '../../assembled/model';
import {INTENTION_MEMORY} from '../../assembled/intentionMemory';
import {prepareCharacterModel,createCharacterRun,restorePreparedCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
import {compileDescribedReasons} from '../../assembled/reasons';
import {definition,analyze,rows} from './assembledMultiComparison';
import {receivingRecord as rec,decodeCognitive as decode} from '../../assembled/codecs';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../../campaign2/canonicalData';
import {canonicalEncode as enc,list,text,rational as q,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
export {acquired,priority,rec,decode,f,items,key,uint,enc,list,text,q,signed,definition,analyze,rows};
export type {CanonicalValue};
export const file='docs/planning/ASSEMBLED_CHARACTER_M267_EVIDENCE.json';
export const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
export const zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')});
export const unpack=(v:{hash?:string;sha256?:string;bytes:number;deflate:string})=>{const b=new Uint8Array(inflateSync(Uint8Array.from(atob(v.deflate),c=>c.charCodeAt(0))));expect(hash(b)).toBe(v.hash??v.sha256);expect(b.length).toBe(v.bytes);return b;};
export const saved=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
export function put(name:string,v:unknown){v=JSON.parse(JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x));const data=saved();if(data[name])expect(data[name]).toEqual(v);else{data[name]=v;writeFileSync(file,JSON.stringify(data,null,2)+'\n');}}
type Source=ReturnType<typeof acquired>;
export function lift<T extends {s:Source['s'];d:Source['d']}>(base:T,positive=true){
 const slots=items(decode(base.s.registry),'list');expect(slots).toHaveLength(60);
 const upgraded={...base.s,rulesVersion:positive?POSITIVE_ACTIVATION_RULES:ATTEMPT_RECEIPT_RULES,registrySchemaVersion:positive?POSITIVE_ACTIVATION_REGISTRY:ATTEMPT_RECEIPT_REGISTRY,registry:enc(list([...slots,list([text(INTENTION_MEMORY),list([])])]))};
 const s=positive?changeDefinition(upgraded,'definition/task-reason-dice',2n,q(0,1)):upgraded;
 const restored=changeDefinition(s,'definition/task-reason-dice',2n,q(37,100));
 expect(enc(list(items(decode(restored.registry),'list').slice(0,60)))).toEqual(base.s.registry);
 return {...base,s,prior:base.s,mapping:{priorRules:base.s.rulesVersion,priorRegistry:hash(base.s.registry),registry:hash(s.registry),parameters:hash(s.parameters),initial:hash(base.d.initialState),inputs:hash(base.d.orderedInputs),seed:hash(base.d.runSeed),delta:'empty intention binding and version; activation '+(positive?'0':'37/100')}};
}
export function priorityFixture(o:Parameters<typeof priority>[0]={}){return lift(candidate248(priority(o),true));}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start<T extends {s:Source['s'];d:Source['d']}>(b:T){const k=hash(b.s.registry)+'/'+hash(b.s.parameters)+'/'+b.s.rulesVersion;let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;const x={b,m,r:cachedMemory(await createCharacterRun(m,b.d))};active=x.r;return x;}
export type Run=Awaited<ReturnType<typeof start>>['r'];
export let active:Run|undefined;
export function failure(name:string){if(active)put('failure-'+Object.keys(saved()).filter(k=>k.startsWith('failure-')).length,{test:name,...capture(active)});active=undefined;}
export async function through(r:Run,at:number){for(let n=0;r.snapshot().clock<BigInt(at);n++)if(n>=96||!await r.settleNextInstant())throw Error('M267 missing instant '+at);expect(r.snapshot().clock).toBe(BigInt(at));}
export async function finish(r:Run){for(let n=0;n<128;n++)if(!await r.settleNextInstant())return;throw Error('M267 queue cap');}
export function capture(r:Run){const s=r.snapshot();return {clock:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(r.save())};}
export function exact(a:Run,b:Run){expect(b.snapshot().clock).toBe(a.snapshot().clock);for(const k of ['state','outputs','trace'] as const)expect(hash(b.snapshot()[k])).toBe(hash(a.snapshot()[k]));expect(hash(b.save())).toBe(hash(a.save()));}
export const restore=async(x:Awaited<ReturnType<typeof start>>)=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()}));
export const records=(os:readonly CanonicalValue[],n:bigint)=>os.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n).map(v=>rec(v,n));
export const tags=(os:readonly CanonicalValue[],tag:string)=>os.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
export function gate(bytes:Uint8Array,s:Source['s'],at:number,requireExecution=true){
 const os=items(decode(bytes),'list'),d=records(os,409n).find(v=>key(f(v,2n))===key(signed(at)));expect(d,'live actual decision'+at).toBeDefined();
 const ctx=rec(f(d!,3n),408n),raw=f(ctx,2n),ns=items(f(ctx,3n),'list'),status=rec(f(d!,4n),419n),compiled=compileDescribedReasons(raw,definition(s),5,'SourceCoverage',true,true);
 expect(compiled.nuclei,'actual received sources').toEqual(ns);
 const result=uint(f(status,1n))===3n?rec(f(status,2n),420n):undefined,prob=result?items(f(result,2n),'list').map(v=>f(rec(v,421n),2n)):[];
 if(result){expect(prob).toEqual(analyze(raw,ns,s).probabilities.map(v=>q(v.probability.numerator,v.probability.denominator)));if(requireExecution)expect(records(os,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d!)),'actual intent/attempt/execution').toBe(true);}
 const old=compileDescribedReasons(raw,definition(changeDefinition(s,'definition/task-reason-dice',2n,q(37,100))),5,'SourceCoverage',true,true);
 return {os,d:d!,raw,ns,compiled,status,prob,result,oldNuclei:old.nuclei.length,oldProb:old.nuclei.length?analyze(raw,old.nuclei,s).probabilities.map(v=>q(v.probability.numerator,v.probability.denominator)):[]};
}
export function semantic(raw:CanonicalValue){return rows(raw).map(r=>[key(r.d[0]),r.family,r.ground,String(r.role),String(r.strength.numerator),String(r.strength.denominator),r.basis.size]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));}
export function original(milestone:number,name:string){const path='docs/planning/ASSEMBLED_CHARACTER_M'+milestone+'_EVIDENCE.json',bytes=readFileSync(path),v=JSON.parse(bytes.toString())[name];expect(v,'original record '+name).toBeDefined();return {record:v,outputs:unpack(v.outputs),source:{path,hash:hash(bytes)}};}
export function summary(p:ReturnType<typeof gate>){return {kind:String(uint(f(p.status,1n))),prob:p.prob.map(key),nuclei:p.ns.length,oldNuclei:p.oldNuclei,oldProb:p.oldProb.map(key),sources:semantic(p.raw)};}
