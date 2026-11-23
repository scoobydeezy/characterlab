import {it,expect} from 'vitest';
import {start,fixture,blocked,through,rec,f,uint,items,key,decode,enc,list,text,signed,u,at,type Case} from './fixtures/assembledRewardOutcomeBoundaries';
import {capture,learned,hash,exact,finish} from './assembledRewardReportSet.test';
import {start as priorStart} from './fixtures/assembledRewardReportSet';
import {safe} from './assembledIntoxicationCohort.test';
import {ACTION_REWARD,REWARD_PAIRED_SENSING,compileReward,rewardSource} from '../assembled/rewardExperience';
import {createSubstitutionRun} from '../campaign3/dependenceSubstitutes';
import {substitutionCases} from './substitutionFixtures';
import {createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence compression.
import {deflateSync,inflateSync} from 'node:zlib';
const file='docs/planning/ASSEMBLED_CHARACTER_M229_EVIDENCE.json';
const saved=()=>JSON.parse(readFileSync(file,'utf8'));
const put=(name:string,value:unknown)=>{const d=existsSync(file)?saved():{};expect(d[name]).toBeUndefined();d[name]=value;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
type X=Awaited<ReturnType<typeof start>>;
function receipt(x:X,t:number){return items(decode(x.run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length===9&&key(v.items[0])===key(text(ACTION_REWARD+'/receipt'))&&at(v.items[2])===BigInt(t)).map(v=>{const a=items(v,'list');return {id:key(a[1]),gain:items(a[6],'list').map(v=>String(uint(v))),attempts:items(a[7],'list').map(key),actions:items(a[8],'list').map(v=>x.b.actions.findIndex(a=>key(a)===key(v)))};});}
function expression(x:X,t:number){const e=items(decode(x.run.snapshot().outputs),'list').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===426n&&at(f(rec(f(rec(f(v,2n),425n),2n),409n),2n))===BigInt(t));expect(e).toBeDefined();return hash(enc(e!));}
async function original(name:Case,law:'MeanHistory'|'LatestHistory'){const r=createSubstitutionRun(law,substitutionCases()[name],0);while(await r.step()){}const s=r.snapshot();return {observer:hash(new TextEncoder().encode(JSON.stringify(r.observerView()))),terminal:hash(r.save()),rows:s.rows.map(v=>({at:v.at,belief:v.beliefBefore,habit:v.habitBefore,admitted:v.admitted,values:v.values,chosen:v.intent,receipt:v.receipt,expression:v.expression?hash(new TextEncoder().encode(v.expression)):null}))};}
async function check(name:Case){
 const x=await start(name);await through(x.run,7n);const acquired=learned(x),training=[4,5,6,7].map(t=>({...capture(x,t),receipts:receipt(x,t)}));
 expect(acquired.map(v=>({count:v.count,mean:v.mean}))).toEqual([{count:2,mean:'1000'},{count:2,mean:'1000'}]);expect(training.map(p=>p.chosen)).toEqual([0,1,0,1]);
 for(const p of training){expect(p.effects).toEqual([{action:p.chosen,status:blocked(name,p.at)?'Blocked':'Applied'}]);expect(p.receipts.map(r=>r.gain)).toEqual([['1000']]);}
 await through(x.run,11n);const probes=[9,10,11].map(t=>({...capture(x,t),receipts:receipt(x,t),expression:expression(x,t)})),denied=['deniedFeedback','hiddenBlocked'].includes(name);
 expect(probes.map(p=>p.chosen)).toEqual([1,1,1]);
 for(const [i,p]of probes.entries()){
  expect(p.effects).toEqual([{action:1,status:blocked(name,p.at)?'Blocked':'Applied'}]);
  expect(p.receipts).toHaveLength(1);expect(p.receipts[0].gain).toEqual(denied?[]:[name==='failure'&&i===0?'0':'1000']);expect(p.receipts[0].actions).toEqual([1]);expect(p.receipts[0].attempts).toHaveLength(1);
  expect(p.beliefs).toEqual(['1000',name==='failure'?['1000','667','750'][i]:'1000']);
  const bases=p.signals.filter(v=>v.role===1);expect(bases.map(v=>[v.action,v.value])).toEqual([[1,name==='failure'?['1/1','667/1000','3/4'][i]:'1/1']]);
  const supports=[...acquired[1].supports,...(denied?[]:probes.slice(0,i).map(v=>v.receipts[0].id))];expect(bases[0].supports.slice().sort()).toEqual(supports.sort());
 }
 const controls={MeanHistory:await original(name,'MeanHistory'),LatestHistory:await original(name,'LatestHistory')};
 for(const [i,p]of probes.entries()){const o=controls.MeanHistory.rows[i+5];expect(p.admitted).toEqual(o.admitted);expect(p.habit).toEqual(o.habit);expect(p.chosen).toBe(o.chosen);expect(o.belief).toEqual(['1/1',name==='failure'?['1/1','2/3','3/4'][i]:'1/1']);}
 if(name==='failure')expect(controls.LatestHistory.rows.slice(5).map(v=>v.chosen)).toEqual([1,-1,-1]);
 const final=learned(x);if(denied)expect(final).toEqual(acquired);await finish(x);const observer=safe(x.run,items(decode(x.run.snapshot().outputs),'list'));
 put(name,{acquired,training,probes,final,controls,observer:{hash:hash(observer),bytes:observer.length,deflate:deflateSync(observer).toString('base64')},initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),inputs:hash(x.b.d.orderedInputs),terminal:hash(x.run.save())});console.info('M229 PASS',name,JSON.stringify({means:probes.map(p=>p.beliefs[1]),effects:probes.map(p=>p.effects[0].status),observerBytes:observer.length}));
}
for(const name of ['diversified','falseTraining','deniedFeedback','hiddenBlocked']as const)it('outcomes229 A '+name,()=>check(name),200000);
for(const name of ['falseSuccess','trueSuccess','failure']as const)it('outcomes229 B '+name,()=>check(name),200000);
it('outcomes229 whole safe views and pre-outcome meaning',()=>{
 const d=saved(),pairs=[['diversified','falseTraining'],['deniedFeedback','hiddenBlocked'],['falseSuccess','trueSuccess']];
 for(const field of ['registry','initial'])expect(new Set(['diversified','falseTraining','deniedFeedback','hiddenBlocked','falseSuccess','trueSuccess','failure'].map(name=>d[name][field])).size).toBe(1);
 for(const [a,b]of pairs){expect(d[a].registry).toBe(d[b].registry);expect(d[a].initial).toBe(d[b].initial);const ab=inflateSync(Uint8Array.from(atob(d[a].observer.deflate),c=>c.charCodeAt(0))),bb=inflateSync(Uint8Array.from(atob(d[b].observer.deflate),c=>c.charCodeAt(0)));expect(ab.length===bb.length&&ab.every((v:number,i:number)=>v===bb[i])).toBe(true);for(const law of ['MeanHistory','LatestHistory'])expect(d[a].controls[law].observer).toBe(d[b].controls[law].observer);}
 const a=d.diversified.probes[0],b=d.failure.probes[0];for(const field of ['expression','raw','probabilities','chosen','signals'])expect(b[field]).toEqual(a[field]);expect(d.diversified.controls.MeanHistory.rows[5].expression).toBe(d.failure.controls.MeanHistory.rows[5].expression);
 put('comparisons',{fullSafePairs:pairs,preOutcomeMeaning:true,quantization:'MeanHistory2/3 -> integer667/1000; B-only probability remains1'});
});
it('outcomes229 failed delivery repeat and restore',async()=>{
 const x=await start('failure'),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));await through(x.run,9n);await through(repeat,9n);exact(x.run,repeat);console.info('M229 repeated9');const save=x.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));exact(x.run,restored);console.info('M229 restored9');
 let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);expect(r.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[11n,101n].includes(x.run.snapshot().clock))exact(x.run,r);}if(!more){done=true;break;}}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(hash(x.run.save())).toBe(saved().failure.terminal);put('continuation',{checkpoint:hash(save),terminal:hash(x.run.save())});
},350000);
it('outcomes229 closed sensing and exact earlier model',async()=>{
 const b=fixture('diversified'),slot=items(decode(b.s.registry),'list')[57],d=compileReward(slot,true,true,true,true,true),source=(bias:any)=>list([text(REWARD_PAIRED_SENSING),true,bias,true,list([]),list([])]);
 expect(()=>compileReward(slot,true,true,true,true)).toThrow('declaration');
 for(const bias of [signed(0),list([]),list([signed(0)]),list([signed(0),signed(0),signed(0)]),list([signed(-1001),signed(0)]),list([signed(0),signed(1001)]),list([u(0),signed(0)])])expect(()=>rewardSource(source(bias),d)).toThrow();
 expect(rewardSource(source(list([signed(-1000),signed(1000)])),d)).toMatchObject({bias:-1000,consequenceBias:1000});
 const x=await priorStart();await finish(x);expect(hash(x.run.save())).toBe(JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M227_EVIDENCE.json','utf8')).primary.diversified.terminal);put('compatibility',{closedAdmission:true,terminal:hash(x.run.save())});
},200000);
