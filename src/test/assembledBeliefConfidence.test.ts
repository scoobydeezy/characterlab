import {it,expect} from 'vitest';
// @ts-expect-error Node-only evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Node-only hashing.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless Node-only evidence.
import {deflateSync} from 'node:zlib';
import {restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {personConfidence,personMean,personPath,BELIEF_CONFIDENCE} from '../assembled/social';
import {restoreAuthoritativeState} from '../substrate/state';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {start,fixture,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,sid,type CanonicalValue} from './fixtures/assembledBeliefConfidence';
const file='docs/planning/ASSEMBLED_CHARACTER_M253_EVIDENCE.json',hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex'),zip=(v:Uint8Array)=>({hash:hash(v),bytes:v.length,deflate:deflateSync(v).toString('base64')});
const put=(k:string,v:unknown)=>{const old=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};if(old[k]!==undefined){expect(old[k]).toEqual(v);return;}old[k]=v;writeFileSync(file,JSON.stringify(old,null,2)+'\n');};
type Run=Awaited<ReturnType<typeof start>>['run'];
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
function exact(a:Run,b:Run){const x=a.snapshot(),y=b.snapshot();expect(x.clock).toBe(y.clock);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());}
async function finish(run:Run,peers:Run[]=[]){for(let i=0;i<160;i++){const more=await run.settleNextInstant();for(const p of peers){expect(await p.settleNextInstant()).toBe(more);exact(run,p);}if(!more)return;}throw Error('M253 queue cap');}
function capture(run:Run){const s=run.snapshot();return {clock:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(run.save())};}
function probes(run:Run){return items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text('assembled-social-people/0.1/appraisal'))).map(v=>items(v,'list'));}
function probe(x:Awaited<ReturnType<typeof start>>,at:number,mean:CanonicalValue|undefined,n:number){
 const groups=probes(x.run),outer=groups.find(g=>g.slice(1).some(v=>key(items(v,'list')[1])===key(signed(at))))!;expect(outer,'live social appraisal').toBeDefined();
 const row=outer.slice(1).map(v=>items(v,'list')).find(a=>items(a[5],'list').some(v=>key(items(v,'list')[0])===key(x.b.taskA)))!;expect(row,'live target').toBeDefined();
 const confidence=items(row.at(-1)!,'list');expect(confidence[0]).toEqual(text(BELIEF_CONFIDENCE));expect(confidence[1]).toEqual(list(mean?[mean]:[]));expect(uint(confidence[2])).toBe(BigInt(n));expect(confidence[3]).toEqual(list(n?[q(n,n+1)]:[]));expect(items(confidence[4],'list')).toHaveLength(n);expect(row[4]).toEqual(confidence[1]);
 const os=items(decode(x.run.snapshot().outputs),'list'),joint=os.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text('assembled-body-appraisal/0.1'))&&v.items[6]&&key(v.items[6])===key(list(outer)));
 expect(joint,'actual joint consumer includes confidence').toBeDefined();return {at,mean:mean?key(mean):'unknown',support:n,confidence:n?key(q(n,n+1)):'unknown'};
}
it('confidence253 primary: native confidence stays separate from truth and correction',async()=>{
 const x=await start();await through(x.run,8n);const before=capture(x.run);await through(x.run,18n);
 const rows=[probe(x,9,q(1,1),8),probe(x,10,q(8,9),9),probe(x,18,q(8,17),17)];
 const os=items(decode(x.run.snapshot().outputs),'list');const choices=outputs(x.run.snapshot().outputs,409n).filter(v=>key(f(v,2n))===key(signed(18)));expect(choices).toHaveLength(1);
 const raw=rec(f(rec(f(choices[0],3n),408n),2n),403n);expect(items(f(raw,3n),'set').length).toBeGreaterThan(0);
 expect(outputs(x.run.snapshot().outputs,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(choices[0])),'decision reaches execution').toBe(true);
 put('primary',{before,probe:capture(x.run),rows,actualDecisionExecution:true});await finish(x.run);put('primary-terminal',capture(x.run));
 console.info('M253 PRIMARY 1/C8/9 ->8/9/C9/10 ->8/17/C17/18; actual joint appraisal, reasons and execution; complete queue');
},590000);
it('confidence253 boundaries: accurate uncertainty, denied and unknown',async()=>{
 for(const mode of ['accurate','denied','unknown','no-opportunity'] as const){const x=await start(mode);await through(x.run,18n);const row=probe(x,18,mode==='accurate'?q(0,1):mode==='unknown'?undefined:q(1,1),mode==='accurate'?1:mode==='unknown'?0:8);put(mode,{...capture(x.run),row});await finish(x.run);put(mode+'-terminal',{save:hash(x.run.save())});}
 console.info('M253 BOUNDARIES mean0/C1/2 accurate; denial/no-opportunity retain1/C8/9; unknown remains absent');
},590000);
it('confidence253 privacy and continuation',async()=>{
 const x=await start(),hidden=await start('hidden');await through(x.run,8n);await through(hidden.run,8n);bytes(x.run.snapshot().state,hidden.run.snapshot().state);bytes(x.run.snapshot().outputs,hidden.run.snapshot().outputs);
 const saved=x.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:saved})),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));await through(repeat,8n);exact(x.run,repeat);exact(x.run,restored);
 for(let i=0;i<160;i++){const more=await x.run.settleNextInstant();for(const p of [restored,repeat]){expect(await p.settleNextInstant()).toBe(more);exact(x.run,p);}expect(await hidden.run.settleNextInstant()).toBe(more);bytes(x.run.snapshot().state,hidden.run.snapshot().state);bytes(x.run.snapshot().outputs,hidden.run.snapshot().outputs);if(!more){put('continuation',{checkpoint:hash(saved),terminal:hash(x.run.save()),exactRepeatRestore:true,wholeStateOutputsHiddenInvariant:true});return;}}
 throw Error('M253 continuation cap');
},590000);
it('confidence253 old version and formula boundaries',async()=>{
 const x=await start('accurate',true);await through(x.run,18n);for(const g of probes(x.run))for(const v of g.slice(1))expect(items(v,'list')).toHaveLength(7);put('old155',{...capture(x.run),oldShapeRetained:true});await finish(x.run);
 const evidence=JSON.parse(readFileSync(file,'utf8')),state=restoreAuthoritativeState(decode(requireInflate(evidence.primary.probe.state)));
 const path=state.entries().find(e=>e.path.rootStateTypeId===810n)!.value,history=items(items(path,'list')[1],'list');
 for(let n=1;n<=history.length;n++){const v=list([text('assembled-social/0.1'),list(history.slice(0,n))]),r=items(personConfidence(v),'list');const control=beliefRecord(739,[qValue(personMean(v)!),u(n),set(history.slice(0,n).map(o=>items(o,'list')[0]))]);expect(r[3]).toEqual(list([beliefAppraisal(control,q(1,1))!.confidence]));expect(r[1]).toEqual(list([qValue(personMean(v)!)]));}
 const empty=[...items(history[0],'list')];empty[6]=list([]);const filtered=items(personConfidence(list([text('assembled-social/0.1'),list([list(empty)])])),'list');expect(filtered[2]).toEqual(u(0));expect(filtered[3]).toEqual(list([]));expect(()=>personConfidence(list([text('assembled-social/0.1'),list([history[0],history[0]])]))).toThrow('duplicate confidence support');
 put('formula',{prefixes:history.length,nonBinaryExcluded:true,duplicateRejected:true,unknownAbsent:true});
},590000);
// @ts-expect-error Lossless Node-only evidence.
import {inflateSync} from 'node:zlib';
import {qValue} from '../campaign2/cognitiveMath';
import {beliefAppraisal} from '../campaign3/beliefMath';
import {beliefRecord} from '../campaign3/beliefCodecs';
import {set} from '../substrate/canonicalEncoding';
// @ts-expect-error Node-only evidence buffer.
import {Buffer} from 'node:buffer';
const requireInflate=(v:{deflate:string})=>inflateSync(Buffer.from(v.deflate,'base64'));
