import {it,expect} from 'vitest';
import {SemWorkbenchRun} from '../workbench/semAdapter';
import * as h from './fixtures/phenSem001Run';
import {canonicalEncode,list} from '../substrate/canonicalEncoding';
import {createCanonicalSave} from '../substrate/persistence';
import {simInstant} from '../substrate/time';
import {digest} from '../workbench/canonical';
it('preserves every integrated SEM prefix and all three observers across native save/load',async()=>{
 const run=await SemWorkbenchRun.create(),state=h.initialState(),identity=await h.identities(state),native=h.scheduler(state,new Map([[h.handlerKey(h.OBSERVE),h.observeHandler()]]));
 for(let prefix=0;prefix<=h.SCHEDULE.length;prefix++){
  const before=run.checkpoint(),view=run.snapshot(),save=createCanonicalSave({scheduler:native,stateAdapter:h.adapter,...identity,continuingRunInputs:list([])});
  expect(view.saveHash).toBe(await digest(save));expect(view.stateHash).toBe(await digest(canonicalEncode(h.adapter.canonicalValue(native.getState()))));expect(view.outputsHash).toBe(await digest(canonicalEncode(list(native.getOutputs()))));expect(view.traceHash).toBe(await digest(canonicalEncode(list(native.getCommittedTrace()))));
  const restored=await SemWorkbenchRun.restore(before);const restoredView=restored.snapshot();expect(Object.keys(view).filter(k=>JSON.stringify(view[k as keyof typeof view])!==JSON.stringify(restoredView[k as keyof typeof view]))).toEqual([]);expect(run.checkpoint()).toEqual(before);const detached=run.snapshot();detached.traceEntries.length=0;expect(run.snapshot()).toEqual(view);
  if(prefix===h.SCHEDULE.length){expect(view.complete).toBe(true);expect(await run.advance()).toBe(false);break;}
  const [observer,at,experience]=h.SCHEDULE[prefix];native.schedule({dueAt:simInstant(at),phase:10n,eventTypeId:h.OBSERVE,payload:h.observerPayload(observer,experience),dependencies:list([])});await native.settleNextInstant();await run.advance();await restored.advance();expect(restored.checkpoint()).toEqual(run.checkpoint());
 }
 const c=run.checkpoint();await expect(SemWorkbenchRun.restore({...c,fixtureDigest:'0'.repeat(64)})).rejects.toThrow('Invalid');await expect(SemWorkbenchRun.restore({...c,prefix:2})).rejects.toThrow('prefix mismatch');
},600000);
