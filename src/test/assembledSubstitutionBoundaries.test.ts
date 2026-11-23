import {it,expect} from 'vitest';
import {start,through,rec,f,uint,items,key,decode,at,type Case} from './fixtures/assembledSubstitutionBoundaries';
import {capture,learned,hash,exact,finish,original,fullProbability} from './assembledRewardReportSet.test';
import {ACTION_REWARD} from '../assembled/rewardExperience';
import {createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
const file='docs/planning/ASSEMBLED_CHARACTER_M228_EVIDENCE.json';
const put=(name:string,value:unknown)=>{const d=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};expect(d[name]).toBeUndefined();d[name]=value;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const saved=()=>JSON.parse(readFileSync(file,'utf8'));
type X=Awaited<ReturnType<typeof start>>;
function receipt(x:X,t:number){return items(decode(x.run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length===9&&typeof v.items[0]!=='boolean'&&v.items[0].kind==='text'&&v.items[0].value===ACTION_REWARD+'/receipt'&&at(v.items[2])===BigInt(t)).map(v=>{const a=items(v,'list');return {gain:items(a[6],'list').map(v=>String(uint(v))),action:items(a[8],'list').map(v=>x.b.actions.findIndex(a=>key(a)===key(v)))};});}
async function check(name:Case){
 const x=await start(name);await through(x.run,7n);const acquired=learned(x),training=[4,5,6,7].map(t=>({...capture(x,t),receipts:receipt(x,t)})),empty=['unseenTraining','withheldLearning'].includes(name),concentrated=name==='restoredA';
 expect(acquired.map(v=>v.count)).toEqual(empty?[0,0]:concentrated?[4,0]:[2,2]);expect(acquired.map(v=>v.mean)).toEqual(empty?[null,null]:concentrated?['1000',null]:['1000','1000']);
 expect(training.map(v=>v.chosen)).toEqual(concentrated?[0,0,0,0]:[0,1,0,1]);for(const p of training){expect(p.effects).toEqual([{action:p.chosen,status:'Applied'}]);expect(p.receipts).toEqual([{gain:name==='unseenTraining'?[]:['1000'],action:[p.chosen]}]);}
 await through(x.run,11n);const probes=[9,10,11].map(t=>({...capture(x,t,name!=='noDemand'),receipts:receipt(x,t)}));
 const expected=name==='diversified'?[1,1,1]:name==='restoredA'?[-1,-1,0]:name==='bothAvailable'?undefined:[-1,-1,-1];
 if(expected)expect(probes.map(p=>p.chosen)).toEqual(expected);
 if(name==='noDemand')expect(probes.map(p=>p.motive)).toEqual(['0/1','0/1','0/1']);
 for(const p of probes){if(p.chosen>=0){expect(p.effects).toEqual([{action:p.chosen,status:'Applied'}]);expect(p.receipts).toEqual([{gain:['1000'],action:[p.chosen]}]);}else expect(p.effects).toEqual([]);}
 const controls:any={};
 if(name==='withheldLearning')controls.NoLearning=await original('diversified','NoLearning');else for(const law of ['MeanHistory','LatestHistory']as const)controls[law]=await original(name,law);
 const reference=controls.MeanHistory??controls.NoLearning;
 for(const [i,p]of probes.entries()){
  const row=reference.rows[i+5];expect(p.beliefs.map(v=>v===null?null:v==='1000'?'1/1':v)).toEqual(row.belief);expect(p.admitted).toEqual(row.admitted);
  if(name!=='bothAvailable')expect(p.chosen).toBe(row.chosen);
 }
 if(name==='bothAvailable'){expect(fullProbability(probes[0].probabilities)).toEqual(['1/2','1/2']);expect(fullProbability(probes[0].probabilities)).toEqual(fullProbability(reference.rows[5].probabilities));expect(probes.every(p=>p.chosen>=0)).toBe(true);}
 const draws=items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n)).filter(v=>at(f(rec(f(v,4n),130n),2n))>=9n).flatMap(v=>items(f(v,14n),'list').map(d=>({event:key(f(v,4n)),draw:key(d)})));
 if(name==='bothAvailable')expect(draws.length).toBeGreaterThan(0);
 const final=learned(x);if(!['diversified','bothAvailable','restoredA'].includes(name))expect(final).toEqual(acquired);
 await finish(x);put(name,{acquired,training,probes,final,draws,controls,initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),inputs:hash(x.b.d.orderedInputs),terminal:hash(x.run.save())});console.info('M228 PASS',name,JSON.stringify({acquired:acquired.map(v=>({count:v.count,mean:v.mean})),choices:probes.map(v=>v.chosen),draws:draws.length}));
}
it('boundaries228 availability and competing alternatives',async()=>{for(const name of ['diversified','unavailable','restoredA','bothAvailable']as const)await check(name);},410000);
it('boundaries228 inactive motive and unlearned practice',async()=>{for(const name of ['noDemand','unseenTraining','withheldLearning']as const)await check(name);},350000);
it('boundaries228 restored opportunity repeats and continues',async()=>{
 const x=await start('restoredA'),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));await through(x.run,10n);await through(repeat,10n);exact(x.run,repeat);console.info('M228 repeated10');
 const save=x.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));exact(x.run,restored);console.info('M228 restored10');
 let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);expect(r.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[11n,101n].includes(x.run.snapshot().clock))exact(x.run,r);}if(!more){done=true;break;}}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(hash(x.run.save())).toBe(saved().restoredA.terminal);put('continuation',{checkpoint:hash(save),terminal:hash(x.run.save())});
},350000);
