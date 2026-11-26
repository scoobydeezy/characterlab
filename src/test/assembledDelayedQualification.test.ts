import {it,expect,afterEach,vi} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Hashing.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
import {fixture as base,start,through,finish,rec,f,uint,items,key,decode,enc,list,text,u,q,signed,sid,taskA,restorePreparedCharacterRun,cachedMemory,type Run,type CanonicalValue} from './fixtures/assembledDelayedBenefit';
import {BENEFIT,BENEFIT_SOURCE,benefitPath,benefitPlan,benefitKnowledge,benefitWorld} from '../assembled/delayedBenefit';
import {compileCharacterModel} from '../assembled/model';
import {restoreAuthoritativeState} from '../substrate/state';
import {decodeDelayed} from '../campaign3/delayedCodecs';
import {dataRecord as oldrec,dataText,dataIdentity} from '../campaign2/canonicalData';
import {createCharacterRun} from '../assembled/character';
import {DeterministicScheduler} from '../substrate/scheduler';
type Name=Parameters<typeof base>[0];
const file='docs/planning/ASSEMBLED_CHARACTER_M275_EVIDENCE.json',plan=JSON.parse(readFileSync('docs/planning/DELAYED_PUBLIC_PLAN_REV1.json','utf8')) as {runs:{name:Name;law:number;orderedInputs:string}[];artifacts:{path:string;sha256:string}[]};
const oldViews=new Map(JSON.parse(readFileSync('docs/planning/DELAYED_PUBLIC_VIEWS_REV1.json','utf8')).views as [string,{outputs:string}][]);
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')}),hex=(s:string)=>Uint8Array.from(s.match(/../g)!.map(v=>parseInt(v,16))),saved=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
function put(k:string,v:unknown){const d=saved();if(d[k])expect(d[k]).toEqual(v);else{d[k]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');}}
function scenario(name:Name,law=1){const b=base(name,law),rows=items(decode(b.d.orderedInputs),'list'),context=rows.map(v=>items(v,'list')).filter(a=>key(a[0])===key(signed(2))&&key(a[2])!==key(BENEFIT_SOURCE));expect(context.length).toBeGreaterThan(0);b.d={...b.d,orderedInputs:enc(list([...rows,...context.map(a=>list([signed(8),...a.slice(1)]))]))};return b;}
const records=(v:CanonicalValue,type:bigint)=>items(v,'list').filter(x=>typeof x!=='boolean'&&x.kind==='record'&&x.schema.typeId===type).map(x=>oldrec(x,type));
const tags=(r:Run,tag:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
let active:Run|undefined;
afterEach(ctx=>{if(ctx.task.result?.state==='fail'&&active)put('failure-'+Object.keys(saved()).filter(k=>k.startsWith('failure')).length,{test:ctx.task.name,save:active.snapshot().status==='Active'?zip(active.save()):undefined,state:zip(active.snapshot().state),outputs:zip(active.snapshot().outputs),trace:zip(active.snapshot().trace)});active=undefined;vi.restoreAllMocks();});
async function qualify(index:number){
 const original=plan.runs[index],b=scenario(original.name,original.law);expect(enc(list(b.originals))).toEqual(hex(original.orderedInputs));const x=await start(b);active=x.r;
 const model=await compileCharacterModel(b.s),s=model.benefit!,prefixes=[x.r.save()];
 for(let at=1;at<=8;at++){await through(x.r,at);prefixes.push(x.r.save());}
 const app2=tags(x.r,BENEFIT+'/appraisal').find(a=>uint(a[1])===2n)!,app8=tags(x.r,BENEFIT+'/appraisal').find(a=>uint(a[1])===8n)!;expect(app2).toBeDefined();expect(app8).toBeDefined();
 const observed=restoreAuthoritativeState(decode(x.r.snapshot().state)),k=benefitKnowledge(observed.read(benefitPath(s,'knowledge')).value),pv=observed.read(benefitPath(s,'plan')).value,p=pv?benefitPlan(pv,s):undefined,wv=observed.read(benefitPath(s,'world')).value,w=wv?benefitWorld(wv):undefined;
 expect(app8[4]).toEqual(list(k.receipt));const outputs=decode(x.r.snapshot().outputs),d=records(outputs,409n).find(d=>key(f(d,2n))===key(signed(2)))!,compiled=rec(f(d,3n),408n),raw=rec(f(compiled,2n),403n),status=rec(f(d,4n),419n);
 const oldOutputs=decodeDelayed(hex(oldViews.get(original.law+'/'+original.name)!.outputs)),oldApp=records(oldOutputs,1386n).find(a=>key(f(a,2n))===key(signed(2)))!,oldDecision=records(oldOutputs,1390n).find(a=>key(f(a,2n))===key(signed(2)))!,oldAction=dataText(dataIdentity(f(oldrec(f(oldDecision,7n),395n),2n)).payload).split('/').at(-1)!;
 const nativeValues=items(app2[5],'list');expect(nativeValues.length?nativeValues:[q(0,1),q(0,1)]).toEqual([f(oldApp,5n),f(oldApp,6n)]);
 const oldLearn=records(oldOutputs,1400n).at(-1)!,oldKnowledge=oldrec(f(oldLearn,3n),1384n),oldOffers=items(f(oldKnowledge,1n),'list'),oldReceipts=items(f(oldKnowledge,2n),'list');
 expect(!!k.offer.length).toBe(!!oldOffers.length);expect(!!k.receipt.length).toBe(!!oldReceipts.length);
 if(k.offer.length)expect(k.offer[0]).toEqual(list([...oldrec(f(oldrec(oldOffers[0],1382n),4n),1380n).fields.values()]));
 const currentAction=p?(p.selected===1n?'now':'later'):'wait';
 if(currentAction===oldAction&&k.receipt.length){const receipt=oldrec(oldReceipts[0],1383n);expect(k.receipt[3]).toEqual(f(receipt,5n));expect(uint(k.receipt[1])).toBe((f(receipt,3n) as {value:bigint}).value);}
 if(p){expect(w?.settled).toBe(true);expect(w!.at).toBe(p.due);expect(records(outputs,431n)).toHaveLength(1);expect(records(outputs,432n)).toHaveLength(1);expect(records(outputs,433n)).toHaveLength(1);}
 const appTrace=records(decode(x.r.snapshot().trace),160n).find(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(8))&&key(f(e,5n))===key(sid(1001,'event/task-appraisal'))&&key(f(t,5n))===key(sid(1036,'seam/assembled-delayed-benefit'));})!;
 expect(appTrace,'actual later appraisal consumer').toBeDefined();const assessmentRows=items(f(rec(items(f(appTrace,13n),'list')[0],384n),3n),'list'),assessment=rec(f(rec(assessmentRows.find(v=>key(f(rec(v,383n),1n))===key(taskA))!,383n),2n),382n);
 expect(uint(f(assessment,1n))===1n).toBe(!k.receipt.length);
 const suffix:Uint8Array[]=[];for(let n=0;n<128;n++){if(!await x.r.settleNextInstant())break;suffix.push(x.r.save());if(n===127)throw Error('M275 terminal cap');}const terminal=x.r.save();
 const prefixHashes=[];for(let i=0;i<9;i++){const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:prefixes[i]}));expect(restored.save()).toEqual(prefixes[i]);if(i<8){expect(await restored.settleNextInstant()).toBe(true);expect(restored.save()).toEqual(prefixes[i+1]);}else{for(const next of suffix){expect(await restored.settleNextInstant()).toBe(true);expect(restored.save()).toEqual(next);}expect(await restored.settleNextInstant()).toBe(false);expect(restored.save()).toEqual(terminal);}prefixHashes.push(hash(prefixes[i]));}
 const final=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:terminal}));expect(final.save()).toEqual(terminal);expect(await final.settleNextInstant()).toBe(false);
 const nativeChoice=uint(f(status,1n))===3n?rec(f(status,2n),420n):undefined;
 put(original.law+'/'+original.name,{index,law:original.law,name:original.name,originalSource:hash(hex(original.orderedInputs)),nativeInputs:zip(b.d.orderedInputs),registry:hash(b.s.registry),parameters:hash(b.s.parameters),seed:hash(b.d.runSeed),initial:hash(b.d.initialState),originalValues:[key(f(oldApp,5n)),key(f(oldApp,6n))],currentValues:nativeValues.map(key),originalChoice:oldAction,currentChoice:currentAction,originalProbability:key(f(oldDecision,4n)),currentProbability:nativeChoice?key(f(nativeChoice,2n)):null,originalNuclei:zip(enc(f(oldrec(f(oldDecision,3n),1389n),3n))),currentNuclei:zip(enc(f(compiled,3n))),raw:zip(enc(raw)),laterAppraisal:zip(enc(list([list(app8),assessment]))),receipt:key(list(k.receipt)),originalReceipt:oldReceipts.length?key(f(oldrec(oldReceipts[0],1383n),5n)):null,plan:pv?key(pv):null,delivery:wv?key(wv):null,prefixHashes,nativeSuffix:suffix.map(hash),terminal:zip(terminal),prefixes:9,nativeTerminalRestores:1,choiceDisposition:currentAction===oldAction?'Sampled option agrees; source/ground values agree.':'Different sampled option under shared reference receiving/address grammar; retain original and native nuclei/probabilities, no cross-model shared-dice claim.'});
 console.info('M275',index+1,original.law,original.name,'prefixes10',oldAction,'->',currentAction);
}
for(let index=0;index<26;index++)it('benefit275 original '+String(index+1).padStart(2,'0'),()=>qualify(index),590000);
