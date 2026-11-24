import {it,expect,vi} from 'vitest';
import {start,fixture,through,rec,f,uint,items,key,decode,enc,list,text,q,at,sid,type Options,type CanonicalValue} from './fixtures/assembledNeedCurrent';
import {NEED,NEED_MOTIVE,NEED_CRITERION} from '../assembled/need';
import * as needProducer from '../assembled/need';
import {readQ} from '../campaign2/cognitiveMath';
import {restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {validateDecisionView} from '../assembled/decisionView';
import {ITEM_EXECUTION_RULES} from '../assembled/model';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Exact evidence hashes.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
type X=Awaited<ReturnType<typeof start>>;
const file='docs/planning/ASSEMBLED_CHARACTER_M245_EVIDENCE.json';
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')});
const put=(name:string,v:unknown)=>{const data=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};expect(data[name]).toBeUndefined();data[name]=v;writeFileSync(file,JSON.stringify(data,null,2)+'\n');};
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:X['run'],b:X['run'])=>{const x=a.snapshot(),y=b.snapshot();expect(y.clock).toBe(x.clock);expect(y.status).toBe(x.status);for(const k of ['state','outputs','trace']as const)bytes(x[k],y[k]);bytes(a.save(),b.save());};
const records=(xs:readonly CanonicalValue[],n:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n).map(v=>rec(v,n));
function captureOutputs(os:readonly CanonicalValue[],t=2n){
 const report=items(os.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(NEED))&&at(v.items[1])===t)!,'list');
 const d=records(os,409n).find(v=>at(f(v,2n))===t)!;expect(d,'live actual decision').toBeDefined();
 const context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list'),status=rec(f(d,4n),419n);
 const actual=records(os,433n).find(v=>{const attempt=rec(f(v,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return key(f(intent,2n))===key(d);});
 const prob=uint(f(status,1n))===3n?items(f(rec(f(status,2n),420n),2n),'list').map(v=>f(rec(v,421n),2n)):[];
 return {os,report,d,raw,ns,status,actual,prob,need:items(f(raw,7n),'list'),tasks:items(f(raw,3n),'set')};
}
function capture(x:X,t=2n){return captureOutputs(items(decode(x.run.snapshot().outputs),'list'),t);}
function persist(name:string,x:X,extra:object={}){const s=x.run.snapshot();put(name,{rules:x.b.s.rulesVersion,options:x.b.options,registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),clock:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(x.run.save()),...extra});}
async function witness(name:string,o:Options,t:bigint,check:(x:X,p:ReturnType<typeof capture>)=>void){const x=await start(o);try{await through(x.run,t);const p=capture(x,t);check(x,p);validateDecisionView(decode(x.run.decisionHistory()));validateDecisionView(decode(x.run.decisionPresentation()));persist(name,x,{prob:p.prob.map(key),need:p.need.length,tasks:p.tasks.length});return {x,p};}catch(e){persist(name+'-failure',x,{error:String(e)});throw e;}}
function positive(p:ReturnType<typeof capture>,count:number){expect(p.report[2]).toEqual(text('Positive'));expect(p.report[3]).toEqual(q(49,60));expect(p.need).toHaveLength(count);const ns=p.ns.filter(v=>key(f(rec(f(rec(v,407n),1n),404n),2n))===key(NEED_MOTIVE));expect(ns).toHaveLength(count);for(const n of ns){const k=rec(f(rec(n,407n),1n),404n);expect(f(k,3n)).toEqual(NEED_CRITERION);expect(readQ(f(rec(f(rec(n,407n),2n),406n),1n)).numerator).toBeGreaterThan(0n);}}
it('need245 primary current Need acts without task adoption',async()=>{
 await witness('primary',{},2n,(x,p)=>{expect(x.b.s.rulesVersion).toBe(ITEM_EXECUTION_RULES);positive(p,2);expect(p.tasks).toHaveLength(0);expect(p.ns).toHaveLength(2);expect(p.prob).toEqual([q(1,2),q(1,2)]);expect(p.actual).toBeDefined();});
 console.info('M245 PRIMARY PASS current0.154; pressure49/60; two Need reasons/options; no task; P1/2 each; actual execution');
},590000);
it('need245 joint independent sources change actual decision probabilities',async()=>{
 const a=await witness('joint',{goals:true},3n,(_x,p)=>{positive(p,2);expect(p.tasks.length,'live Commitment before comparison').toBeGreaterThan(0);expect(p.actual).toBeDefined();});
 const b=await witness('commitment',{goals:true,responses:0},3n,(_x,p)=>{expect(p.tasks.length,'live Commitment control').toBeGreaterThan(0);expect(p.need).toHaveLength(0);expect(p.actual).toBeDefined();});
 compareJoint(a.p,b.p);
 console.info('M245 JOINT PASS same task source, same action with independent Need/Commitment grounds, changed exact production probabilities');
},590000);
// Source ordinals are runtime identities, not cross-run psychological evidence.
// Every differing reference must resolve to the actual producer with identical payload.
function taskMeaning(p:ReturnType<typeof capture>){return p.tasks.map(v=>{
 const row=rec(v,402n),basis=f(rec(f(row,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('M245 basis map');
 const sources=basis.entries.map(([atom,weight])=>{const a=rec(atom,399n);expect(uint(f(a,1n))).toBe(1n);const ref=rec(f(a,2n),237n);expect(uint(f(ref,1n))).toBe(1n);const id=f(ref,2n);if(typeof id==='boolean'||id.kind!=='typedIdentifier')throw Error('M245 observation identity');
  let payload:CanonicalValue;
  if(id.namespaceId===1164n){const rows=p.os.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>=6&&key(v.items[1])===key(id)).map(v=>items(v,'list'));expect(rows).toHaveLength(1);expect(['assembled-priority-observation/0.1','assembled-priority-observation/0.2'].some(tag=>key(rows[0][0])===key(text(tag)))).toBe(true);payload=list([rows[0][0],...rows[0].slice(2)]);}
  else {expect(id.namespaceId).toBe(1115n);const rows=[...records(p.os,203n),...records(p.os,461n)].filter(v=>key(f(v,1n))===key(id));expect(rows).toHaveLength(1);const row=rows[0];payload=list([text('perceived/'+row.schema.typeId+'/'+row.schema.schemaVersion),...Array.from(row.fields).filter(([n])=>n!==1n).map(([,v])=>v)]);}
  return key(list([payload,weight]));
 }).sort();return {key:key(f(row,1n)),strength:key(f(row,2n)),sources};
}).sort((a,b)=>a.key.localeCompare(b.key));}
function compareJoint(a:ReturnType<typeof capture>,b:ReturnType<typeof capture>){
 positive(a,2);expect(a.tasks.length).toBeGreaterThan(0);expect(b.tasks.length).toBeGreaterThan(0);expect(b.need).toHaveLength(0);expect(a.actual).toBeDefined();expect(b.actual).toBeDefined();
 const keys=a.ns.map(v=>rec(f(rec(v,407n),1n),404n)),body=keys.filter(k=>key(f(k,2n))===key(NEED_MOTIVE)),psych=keys.filter(k=>key(f(k,2n))!==key(NEED_MOTIVE));expect(body.some(n=>psych.some(p=>key(f(n,1n))===key(f(p,1n))&&key(f(n,3n))!==key(f(p,3n))))).toBe(true);
 const left=taskMeaning(a),right=taskMeaning(b);expect(left).toEqual(right);expect(a.prob).not.toEqual(b.prob);
 return {joint:a.prob.map(key),commitment:b.prob.map(key),taskMeaning:left,distinctGrounds:true,sampledWinnerClaim:false};
}
it('need245 correspondence resolves retained joint evidence identities',()=>{
 const d=JSON.parse(readFileSync(file,'utf8')),read=(name:string)=>{const x=d[name],out=new Uint8Array(inflateSync(Uint8Array.from(atob(x.outputs.deflate),c=>c.charCodeAt(0))));expect(hash(out)).toBe(x.outputs.hash);expect(x.rules).toBe(ITEM_EXECUTION_RULES);return captureOutputs(items(decode(out),'list'),3n);};
 try{put('joint-correspondence-resolved',compareJoint(read('joint'),read('commitment')));}catch(e){put('joint-correspondence-resolved-failure',{error:String(e)});throw e;}
 console.info('M245 CORRESPONDENCE PASS saved native outputs; each source resolved; full task meaning equal; probabilities377/432,55/432 versus1');
});
it('need245 response zero unknown boundaries',async()=>{
 for(const [name,o,status,count]of [['one',{responses:1},'Positive',1],['noResponse',{responses:0},'Positive',0],['zero',{reserve:100},'KnownZero',0],['unknown',{permitted:false},'Unavailable',0]]as const){await witness(name,o,2n,(_x,p)=>{expect(p.report[2]).toEqual(text(status));expect(p.need).toHaveLength(count);expect(p.ns).toHaveLength(count);expect(p.tasks).toHaveLength(0);if(count){expect(p.prob).toEqual([q(1,1)]);expect(p.actual).toBeDefined();}else expect(uint(f(p.status,1n))).not.toBe(3n);});}
 console.info('M245 BOUNDARY PASS one response vs positive/no-response vs known zero vs unknown; no surrogate task');
},590000);
it('need245 hidden bodily truth aliases',async()=>{
 const a=await witness('alias11',{reserve:11,width:10},2n,(_x,p)=>expect(p.need).toHaveLength(2)),b=await witness('alias19',{reserve:19,width:10},2n,(_x,p)=>expect(p.need).toHaveLength(2));
 try{for(const k of ['report','need','ns','prob']as const)expect(a.p[k]).toEqual(b.p[k]);put('privacy',{sameReportNeedNucleiProbability:true});}catch(e){put('privacy-failure',{error:String(e)});throw e;}
 console.info('M245 PRIVACY PASS physical11/19, same selected bin, same Need/reason/probability');
},590000);
it('need245 exact repeat restore rollback and current physical perception',async()=>{
 const a=await start({goals:true}),b=await start({goals:true});await through(a.run,1n);await through(b.run,1n);exact(a.run,b.run);const checkpoint=a.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(a.m,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:checkpoint}));exact(a.run,restored);
 const before=b.run.snapshot(),save=b.run.save(),raw=needProducer.needRaw;let hit=false;const spy=vi.spyOn(needProducer,'needRaw').mockImplementation((...args)=>{raw(...args);hit=true;throw Error('M245 injected after Need receiving');});
 try{await expect(b.run.settleNextInstant()).rejects.toThrow('M245 injected');expect(hit).toBe(true);const after=b.run.snapshot();expect(after.clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(before[k],after[k]);expect(()=>b.run.save()).toThrow('only an active quiescent run');put('rollback',{checkpoint:zip(save),before:{clock:String(before.clock),state:zip(before.state),outputs:zip(before.outputs),trace:zip(before.trace)},after:{clock:String(after.clock),state:zip(after.state),outputs:zip(after.outputs),trace:zip(after.trace)},faultedSaveRejected:true});}finally{spy.mockRestore();}
 const repeat=await start({goals:true});await through(repeat.run,1n);exact(a.run,repeat.run);
 let done=false,prefixes=0;try{for(let n=0;n<48;n++){const more=await a.run.settleNextInstant();expect(await restored.settleNextInstant()).toBe(more);expect(await repeat.run.settleNextInstant()).toBe(more);exact(a.run,restored);exact(a.run,repeat.run);prefixes++;if(!more){done=true;break;}}expect(done).toBe(true);
 const ts=items(decode(a.run.snapshot().trace),'list').map(v=>rec(v,160n));expect(ts.some(v=>key(f(v,5n))===key(sid(1036,'seam/item-location')))).toBe(true);expect(ts.some(v=>{const e=rec(f(v,4n),130n);return key(f(e,5n))===key(sid(1001,'event/regulatory-diagnostic-probe'))&&uint(f(e,3n))===120n;})).toBe(true);
 validateDecisionView(decode(a.run.decisionHistory()));validateDecisionView(decode(a.run.decisionPresentation()));persist('continuation',a,{checkpoint:zip(checkpoint),prefixes,repeat:true,rollback:true,restored:true});}catch(e){persist('continuation-failure',a,{error:String(e)});throw e;}
 console.info('M245 CONTINUATION PASS repeat/restore exact at every remaining instant; atomic receiving rollback; current movement and probe120',prefixes);
},590000);
