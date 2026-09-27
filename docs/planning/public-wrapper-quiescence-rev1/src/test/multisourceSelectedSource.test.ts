import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {createLocalReserveSource,replenishLocalReserve} from '../campaign3/localReserveSource';
import {observeLocalReserveOpportunity} from '../campaign3/localReserveObservation';
import {selectLocalReserveSignals,type SignalSelectedView} from '../campaign3/interoceptiveSignalSelection';
import {produceMultisourceSelectedSource as produce,type SelectedSourceInput} from '../campaign3/multisourceSelectedSource';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {taskSource,taskKey,O,id} from './receivingFixtures';
import {compareMultisourceCoverage,type ComparisonSignal} from '../campaign3/multisourceComparison';
import {readQ} from '../campaign2/cognitiveMath';
const q=(n:number,d=1)=>Q.of(BigInt(n),BigInt(d));
const signal=(k:string)=>'interoceptive-signal/'+k;
function source(amount=20,available=true,permitted=true){return createLocalReserveSource(['A','B','C'].map(k=>({key:'local-reserve/'+k,capacity:q(100),rate:q(0),amount:q(amount),anchoredAt:0n})),['A','B','C'].map(k=>({channel:'channel/'+k,physical:'local-reserve/'+k,signal:signal(k),width:q(10),available,permitted})));}
function view(s=source(),capacity=3){let n=0n;return selectLocalReserveSignals(observeLocalReserveOpportunity(s,O,45n,['channel/A','channel/B','channel/C'],'Current',()=>n++),{maxSignals:3,maxViewsPerSignal:1,maxBytesPerSignal:4096,capacity}).view;}
function input(base=true,adopted=true):SelectedSourceInput {const task=taskSource('two',adopted,base);return {observer:O,taskRaw:task.raw,taskKey,option:f(rec(items(f(rec(taskSource().candidates,398n),3n),'list')[0],397n),1n),body:{signal:signal('A'),threshold:q(60)},task:{signal:signal('A'),threshold:q(60),direction:'FavorBelow'}};}
const known=(v:ReturnType<typeof produce>['body'])=>{if(v.kind!=='Known')throw Error('expected known');return v;};
it('produces two interpretations of one actual selected observation and preserves commitment Base',()=>{
 const i=input(),prior=enc(i.taskRaw),out=produce(view(),i);
 expect(known(out.body).strength).toEqual(q(1,2));expect(known(out.task).strength).toEqual(q(1,2));
 expect(enc(known(out.body).sample)).toEqual(enc(known(out.task).sample));expect(enc(known(out.body).basis)).toEqual(enc(known(out.task).basis));
 expect(out.taskBase).not.toBeNull();expect(enc(i.taskRaw)).toEqual(prior);
 const bases=items(f(rec(i.taskRaw,403n),3n),'set');expect(bases.map(b=>Array.from(enc(b)))).toContainEqual(Array.from(enc(out.taskBase!)));
});
it('independent physical intervention changes task B without changing body A',()=>{
 const s=source(),i=input();const independent={...i,task:{...i.task,signal:signal('B')}};
 const before=produce(view(s),independent),after=produce(view(replenishLocalReserve(s,'local-reserve/B',45n,q(20))),independent);
 expect(known(before.body)).toEqual(known(after.body));expect(known(before.task).strength).toEqual(q(1,2));expect(known(after.task).strength).toEqual(q(1,6));
 expect(enc(known(before.task).basis)).not.toEqual(enc(known(before.body).basis));
});
it('independent task threshold and suitability polarity do not change body response',()=>{
 const i=input(),a=produce(view(),i),b=produce(view(),{...i,task:{...i.task,threshold:q(40),direction:'DisfavorBelow'}});
 expect(known(a.body)).toEqual(known(b.body));expect(known(b.task).strength).toEqual(q(-1,4));
});
it('retains a real selected task modifier with Base disabled without manufacturing motive',()=>{
 const out=produce(view(),input(false));expect(out.taskBase).toBeNull();expect(known(out.task).strength).toEqual(q(1,2));
});
it('rejects inactive/unadopted task and foreign holder',()=>{
 expect(()=>produce(view(),input(true,false))).toThrow('SELECTED_TASK');
 const i=input();const t=rec(taskKey,371n);expect(()=>produce(view(),{...i,taskKey:{...t,fields:new Map(t.fields).set(1n,id(1003,'foreign'))}})).toThrow();
});
it('distinguishes known zero from unavailable or permission-denied evidence',()=>{
 const zero=produce(view(source(70)),input());expect(known(zero.body).strength).toEqual(q(0));
 for(const s of[source(20,false),source(20,true,false)]){const out=produce(view(s),input());expect(out.body.kind).toBe('Unavailable');expect(out.task.kind).toBe('Unavailable');}
});
it('selection exclusion cannot supply an otherwise available task signal',()=>{
 const i=input(),out=produce(view(source(),1),{...i,task:{...i.task,signal:signal('B')}});
 expect(out.body.kind).toBe('Known');expect(out.task.kind).toBe('Unavailable');
});
it('rejects counterfeit, consumed and foreign-observer capabilities',()=>{
 expect(()=>produce({kind:'SignalSelectedView'} as SignalSelectedView,input())).toThrow();
 const v=view();produce(v,input());expect(()=>produce(v,input())).toThrow();
 expect(()=>produce(view(),{...input(),observer:id(1000,'observer/other')})).toThrow('OBSERVER');
});
it('hidden movement inside one observation bin leaves all character outputs identical',()=>{
 expect(produce(view(source(21)),input())).toEqual(produce(view(source(29)),input()));
});
it('returned samples are detached between families and from later production',()=>{
 const out=produce(view(),input());(rec(known(out.body).sample,461n).fields as Map<bigint,CanonicalValue>).clear();
 expect(rec(known(out.task).sample,461n).fields.size).toBe(6);expect(known(produce(view(),input()).body).strength).toEqual(q(1,2));
});
it('rejects nonpositive thresholds and invalid direction',()=>{
 const i=input();expect(()=>produce(view(),{...i,body:{...i.body,threshold:q(0)}})).toThrow('CRITERION');
 expect(()=>produce(view(),{...i,task:{...i.task,direction:'invented' as 'FavorBelow'}})).toThrow('DIRECTION');
});
// Equality labels below are assigned from actual canonical observation identities;
// neither their ordinal nor the hidden physical-source key becomes a magnitude.
function comparison(out:ReturnType<typeof produce>){
 const atoms=new Map<string,string>(),rows:ComparisonSignal[]=[];
 const add=(source:string,ground:string,family:'Task'|'Body',role:'Base'|'Situation',strength:Q,basis:string[])=>{if(!strength.equals(q(0)))rows.push({source,ground,family,role,strength,basis:basis.map(k=>[k,q(1)])});};
 if(out.taskBase)add('task-base','task','Task','Base',readQ(f(rec(out.taskBase,402n),2n)),[]);
 for(const [name,assessment] of [['body',out.body],['task',out.task]] as const){
  if(assessment.kind==='Unavailable')continue;
  const key=Array.from(enc(f(rec(assessment.sample,461n),1n))).join('-');
  if(!atoms.has(key))atoms.set(key,'fact-'+atoms.size);
  add(name,name,name==='body'?'Body':'Task',name==='body'?'Base':'Situation',assessment.strength,[atoms.get(key)!]);
 }
 return rows;
}
it('actual selected-source orphan preserves body baseline and reproduces the rejected normalization effect',()=>{
 const rows=comparison(produce(view(),input(false))),bodyOnly=rows.filter(s=>s.family==='Body');
 const body=(r:ReturnType<typeof compareMultisourceCoverage>)=>r.totals.find(t=>t.family==='Body')!.base;
 expect(body(compareMultisourceCoverage(rows,'GroundAggregate'))).toEqual(body(compareMultisourceCoverage(bodyOnly,'GroundAggregate')));
 expect(body(compareMultisourceCoverage(rows,'GroundAggregate'))).toEqual(q(1,3));
 expect(body(compareMultisourceCoverage(rows,'FamilyNormalized'))).toEqual(q(1,5));
 expect(body(compareMultisourceCoverage(bodyOnly,'FamilyNormalized'))).toEqual(q(1,3));
});
it('actual independent fact bases remove cross-family normalization coupling without merging motives',()=>{
 const i=input(),rows=comparison(produce(view(),{...i,task:{...i.task,signal:signal('B')}}));
 const baseline=compareMultisourceCoverage(rows,'GroundAggregate');
 expect(baseline.totals).toHaveLength(2);expect(baseline.totals.every(t=>t.base.compare(q(0))>0)).toBe(true);
 expect(compareMultisourceCoverage(rows,'FamilyNormalized').totals).toEqual(baseline.totals);
});
