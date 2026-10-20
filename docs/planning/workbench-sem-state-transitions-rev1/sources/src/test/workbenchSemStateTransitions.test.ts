import {it,expect} from 'vitest';import {SemWorkbenchRun} from '../workbench/semAdapter';import {semStateTransitions} from '../workbench/semStateTransitions';
import {canonicalDecode,RecordSchemaRegistry,list,text} from '../substrate/canonicalEncoding';import {identitySchemas} from '../substrate/identity';import {persistenceSchemas} from '../substrate/persistence';import {SEMANTIC_RECORD_SCHEMAS} from '../semanticBinding/semanticSchemaRegistry';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';import {fromHex,exactText} from '../workbench/canonical';import * as fixture from './fixtures/phenSem001Run';
const decode=(run:SemWorkbenchRun)=>rec(canonicalDecode(fromHex(run.checkpoint().saveHex),new RecordSchemaRegistry([...Object.values(identitySchemas),...Object.values(persistenceSchemas),...SEMANTIC_RECORD_SCHEMAS])),132n);
const initial=()=>fixture.adapter.canonicalValue(fixture.initialState());
it('joins all original committed root snapshots to actual preceding/current native states and exact restore',async()=>{
 const run=await SemWorkbenchRun.create();let previous=items(f(decode(run),5n),'list'),priorEvents:unknown[]=[];
 for(let prefix=0;prefix<=3;prefix++){
  const checkpoint=run.checkpoint(),save=decode(run),trace=items(f(save,11n),'list'),current=f(save,5n),r=semStateTransitions(trace,initial(),current);
  expect(r.events).toHaveLength(prefix);expect(r.events.slice(0,priorEvents.length)).toEqual(priorEvents);
  for(const root of r.roots){expect(root.changedTransitions).toBe(prefix);expect(root.observedReads).toBeNull();expect(root.observedWrites).toBeNull();}
  if(prefix)for(let i=0;i<2;i++){expect(r.events[prefix-1].transitions[i].before).toBe(exactText(previous[i]));expect(r.events[prefix-1].transitions[i].after).toBe(exactText(items(current,'list')[i]));}
  const restored=decode(await SemWorkbenchRun.restore(checkpoint));expect(semStateTransitions(items(f(restored,11n),'list'),initial(),f(restored,5n))).toEqual(r);expect(run.checkpoint()).toEqual(checkpoint);
  previous=items(current,'list');priorEvents=r.events;if(prefix<3)await run.advance();
 }
},600000);
it('rejects mismatched state/trace and malformed roots without treating equal snapshots as no writes',async()=>{
 const run=await SemWorkbenchRun.create();await run.advance();const save=decode(run),trace=items(f(save,11n),'list'),current=f(save,5n),parts=items(trace[0],'list');
 expect(()=>semStateTransitions(trace,initial(),initial())).toThrow('state/trace mismatch');
 expect(()=>semStateTransitions([list([parts[0],parts[2],parts[1],parts[3]])],initial(),current)).toThrow();
 expect(()=>semStateTransitions([list([text('invented'),parts[1],parts[2],parts[3]])],initial(),current)).toThrow('stage outside fixture');
 const equal=semStateTransitions([...trace,...trace],initial(),current);expect(equal.events[1].transitions.every(t=>!t.changed&&t.observedWrites===null)).toBe(true);
},600000);
