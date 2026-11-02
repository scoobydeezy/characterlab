import {it,expect} from 'vitest';
import {list,text,unsigned,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {createCausalExecution,CAUSAL_CONTEXT,CAUSAL_APPRAISAL,CAUSAL_AVAILABILITY,CAUSAL_OPPORTUNITIES_VERSION,causalPath} from '../assembled/causalAttribution';
import {INTERFERENCE_CONTEXT,INTERFERENCE_SOURCE,INTERFERENCE_LEARN,INTERFERENCE_APPRAISAL,INTERFERENCE_OBS,interferencePath,interferenceJournal,interferenceObservation} from '../assembled/interferenceExpectation';
import {outcomePath} from '../assembled/performance';
import {BODY_DELIVERY} from '../assembled/body';
import {sid} from '../assembled/skill';
import {receivingRecord as rec,randomDrawRecord} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {source,data,task,decode,items,key,enc,type Mode} from './fixtures/assembledCausalOpportunities';
import {source as oldSource} from './fixtures/assembledInterference';
import {mapIdentities} from './fixtures/assembledValueReceiving';
import {outputs,through,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
import {workLimit} from './fixtures/assembledCharacter';
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const outcome=(v:CanonicalValue)=>{const a=items(v,'list');return a.length?list([a[0],...a.slice(2)]):v;};
const observation=(v:CanonicalValue)=>{const a=items(v,'list');return list([...a.slice(0,6),outcome(a[6])]);};
const appraisal=(a:readonly CanonicalValue[])=>key(a[0])===key(text(CAUSAL_APPRAISAL))?list([...a.slice(0,9),outcome(a[9]),a[10]]):list([...a.slice(0,8),list(items(a[8],'list').map(observation))]);
const decisions=(r:Run)=>outputs(r.snapshot().outputs,409n).map(v=>{
 const status=rec(f(v,4n),419n);expect(uint(f(status,1n))).toBe(3n);const chosen=rec(f(status,2n),420n);
 return list([f(v,2n),...([1n,2n,3n,4n,8n].map(n=>f(chosen,n)))]);
});
const draws=(r:Run)=>outputs(r.snapshot().trace,160n).flatMap(v=>items(f(v,14n),'list')).map(randomDrawRecord);
it('connection: independent late queries consume the same acquired evidence with coupled decisions',async()=>{
 const m=await prepareCharacterModel(source()),modes:Mode[]=['full','late','latent','route','none'],runs:Run[]=[];
 for(const mode of modes){
  const setup=await createCharacterRun(m,data(mode));await through(setup,7n);
  const map=mapIdentities(setup),run=await createCharacterRun(m,data(mode,map));await through(run,7n);runs.push(run);
 }
 const baseline=runs[0],evidence=(r:Run)=>interferenceJournal(state(r).read(interferencePath(task())).value,task());
 const known=reports(baseline,INTERFERENCE_APPRAISAL);expect(known.map(a=>a[6])).toEqual([list([]),q(1,1),q(1,2)]);
 expect(known.at(-1)![5]).toEqual(unsigned(2));let matched=0;
 for(const [i,r]of runs.entries()){
  expect(decisions(r)).toEqual(decisions(baseline));
  expect(evidence(r).map(observation)).toEqual(evidence(baseline).map(observation));
  expect(state(r).read(causalPath(task()))).toEqual(state(baseline).read(causalPath(task())));
  const originals=items(items(state(r).read(outcomePath(task())).value!,'list')[1],'list');
  expect(evidence(r)).toHaveLength(2);
  for(const v of evidence(r)){const o=interferenceObservation(v,task());expect(o.outcome).toBeDefined();expect(originals).toContainEqual(o.outcome);expect(o.route).toBe(0n);}
  for(const label of [CAUSAL_APPRAISAL,INTERFERENCE_APPRAISAL])for(const a of reports(r,label)){
   const old=reports(baseline,label).find(b=>key(b[1])===key(a[1]))!;expect(appraisal(a)).toEqual(appraisal(old));
  }
  const expectedLatent=modes[i]==='full'?3:['late','latent'].includes(modes[i])?1:0,expectedRoute=modes[i]==='full'?3:['late','route'].includes(modes[i])?1:0;
  expect(reports(r,CAUSAL_APPRAISAL)).toHaveLength(expectedLatent);expect(reports(r,INTERFERENCE_APPRAISAL)).toHaveLength(expectedRoute);
  const availability=reports(r,CAUSAL_AVAILABILITY);expect(availability).toHaveLength(3);
  expect(availability.map(a=>a.slice(2))).toEqual([3,5,7].map(at=>[modes[i]==='full'||at===7&&['late','latent'].includes(modes[i]),modes[i]==='full'||at===7&&['late','route'].includes(modes[i])]));
  const traces=outputs(r.snapshot().trace,160n).filter(v=>key(f(v,6n))===key(text(CAUSAL_OPPORTUNITIES_VERSION)));
  expect(traces).toHaveLength(3);for(const t of traces){expect(f(t,11n)).toEqual(list([]));expect(f(t,14n)).toEqual(list([]));const input=items(f(t,12n),'list'),a=items(f(t,13n),'list');expect(input.map(v=>items(v,'list').length>0)).toEqual(a.slice(2));}
  if(i){const other=new Map(draws(r).map(v=>[key(f(v,2n)),v]));expect(other.size).toBe(draws(r).length);expect(other.size).toBe(draws(baseline).length);
   for(const x of draws(baseline)){const y=other.get(key(f(x,2n)));expect(y).toBeDefined();expect(rec(f(x,2n),113n).schema.typeId).toBe(113n);for(const n of [2n,3n,4n,7n])expect(f(y!,n)).toEqual(f(x,n));matched++;}
  }
  console.info('M37 '+modes[i]+' evidence='+evidence(r).length+' latent='+expectedLatent+' route='+expectedRoute+' actual draws='+draws(r).length);
 }
 expect(reports(runs[1],INTERFERENCE_APPRAISAL)[0][6]).toEqual(q(1,2));
 expect(reports(baseline,CAUSAL_APPRAISAL)[0][5]).toEqual(text('Unknown'));
 console.info('M37 five fixed configurations retain identical decision probabilities/choices and evidence meaning; matched actual draws='+matched+'; absent is not unknown');
},560000);
it('controls: absence clears context and denied changed reports never supply evidence',async()=>{
 const m=await prepareCharacterModel(source()),early=await createCharacterRun(m,data('early'));await through(early,7n);
 expect(reports(early,CAUSAL_APPRAISAL)).toHaveLength(1);expect(reports(early,INTERFERENCE_APPRAISAL)).toHaveLength(1);expect(reports(early,CAUSAL_AVAILABILITY).map(a=>a.slice(2))).toEqual([[true,true],[false,false],[false,false]]);expect(interferenceJournal(state(early).read(interferencePath(task())).value,task())).toHaveLength(2);
 const a=await createCharacterRun(m,data('route',undefined,{denied:true})),b=await createCharacterRun(m,data('route',undefined,{denied:true,changed:true,positive:true}));
 for(const r of [a,b]){await through(r,7n);expect(reports(r,INTERFERENCE_OBS)).toEqual([]);expect(state(r).read(interferencePath(task())).presence).toBe(false);expect(reports(r,INTERFERENCE_APPRAISAL)[0][6]).toEqual(list([]));}
 expect(reports(a,INTERFERENCE_APPRAISAL)).toEqual(reports(b,INTERFERENCE_APPRAISAL));
 console.info('M37 earlier contexts expire; learning continues without queries; denied polarity changes remain unavailable');
},300000);
it('persistence: sparse prefix repeat and restore6 through10 are byte exact',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,6n);await through(b,6n);exact(a,b);
 expect(reports(a,INTERFERENCE_APPRAISAL)).toEqual([]);expect(interferenceJournal(state(a).read(interferencePath(task())).value,task())).toHaveLength(2);
 const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);
 while(a.snapshot().clock<10n){expect(await a.settleNextInstant()).toBe(await restored.settleNextInstant());exact(a,restored);}
 expect(await a.settleNextInstant()).toBe(false);expect(await restored.settleNextInstant()).toBe(false);exact(a,restored);expect(reports(a,INTERFERENCE_APPRAISAL)[0][6]).toEqual(q(1,2));
 console.info('M37 exact repeat6; restore6..10 retains pre-query evidence and actual later appraisal');
},300000);
it('rollback: late shared failure preserves acquired evidence and the entire prior instant',async()=>{
 const s=source(),d=data(),fault={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...Array.from({length:16},()=>list([signed(7),unsigned(110),BODY_DELIVERY,list([C,q(0,1)]),list([])]))]))},oracle=await createCharacterRun(await prepareCharacterModel(s),fault);await through(oracle,7n);
 const counts=new Map<bigint,Set<string>>();for(const t of outputs(oracle.snapshot().trace,160n)){const e=rec(f(t,4n),130n),at=signedValue(f(e,2n)),ids=counts.get(at)??new Set<string>();ids.add(key(f(e,1n)));counts.set(at,ids);}const n=counts.get(7n)!.size;
 expect(Math.max(...[...counts].filter(([t])=>t<7n).map(([,x])=>x.size))).toBeLessThan(n);
 const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(n-1))),fault);await through(failed,6n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(reports(failed,INTERFERENCE_APPRAISAL)).toEqual([]);
 console.info('M37 late7 atomic rollback cap'+(n-1)+'/'+n+'; evidence remains, no partial query publication');
},240000);
it('admission: optional does not weaken phase, scope, duplicate, version or generated-child checks',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),rows=items(decode(d.orderedInputs),'list'),query=rows.find(v=>key(items(v,'list')[2])===key(INTERFERENCE_CONTEXT))!;
 const replace=(fn:(a:CanonicalValue[])=>CanonicalValue[])=>({...d,orderedInputs:enc(list(rows.map(v=>v===query?list(fn([...items(v,'list')])):v)))});
 for(const bad of [replace(a=>{a[0]=signed(6);return a;}),replace(a=>{a[1]=unsigned(10);return a;}),replace(a=>{const p=[...items(a[3],'list')];p[1]=sid(1027,'foreign-task');a[3]=list(p);return a;}),{...d,orderedInputs:enc(list([...rows,query]))}])await expect(createCharacterRun(m,bad)).rejects.toThrow();
 await expect(prepareCharacterModel({...s,registrySchemaVersion:oldSource().registrySchemaVersion})).rejects.toThrow('version bundle');
 await expect(createCharacterRun(await prepareCharacterModel(oldSource()),d)).rejects.toThrow('context missing');
 const compiled=await compileCharacterModel(s),component=await compileCharacterState(compiled),initial=component.initialState(d.initialState),handler=createCausalExecution(C,compiled.strategy!,component.stateModel,[],compiled.modelIdentity.value,compiled.modelIdentity.value,true,true),e={dueAt:7n as never,phase:50n,eventTypeId:sid(1001,'event/task-appraisal'),payload:list([]),dependencies:list([]),eventId:999n,eventSequence:999n,causalParentEventIds:[]};
 handler.begin(7n);expect(handler.appraise(e,initial).map(a=>a.report)).toEqual([list([text(CAUSAL_AVAILABILITY),unsigned(7),false,false])]);expect(()=>handler.appraise(e,initial)).toThrow('lifecycle');handler.prepareCommit();handler.close();
 handler.begin(7n);expect(()=>handler.execute({event:{...e,phase:30n,eventTypeId:CAUSAL_CONTEXT,payload:items(query,'list')[3]},state:initial} as never)).toThrow('unbound source');expect(()=>handler.prepare([{...e,phase:140n,eventTypeId:INTERFERENCE_LEARN}],initial)).toThrow('unbound generated');handler.close();
 console.info('M37 phase/duplicate/opportunity/task/version, predecessor completeness, one-appraisal lifecycle and private generated association guards');
},120000);
