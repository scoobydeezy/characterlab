import {it,expect} from 'vitest';import {SemWorkbenchRun} from '../workbench/semAdapter';import {semRecordedState} from '../workbench/semRecordedState';import {searchRecordedState} from '../workbench/recordedStateSearch';
import {canonicalDecode,RecordSchemaRegistry,list} from '../substrate/canonicalEncoding';import {identitySchemas} from '../substrate/identity';import {persistenceSchemas} from '../substrate/persistence';import {SEMANTIC_RECORD_SCHEMAS} from '../semanticBinding/semanticSchemaRegistry';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';import {fromHex,exactText} from '../workbench/canonical';import {perceptualStateEntries} from '../semanticBinding/semanticStateAuthority';import * as fixture from './fixtures/phenSem001Run';import {statePathValue} from '../substrate/state';import {exactKey} from '../workbench/canonical';
const state=(run:SemWorkbenchRun)=>f(rec(canonicalDecode(fromHex(run.checkpoint().saveHex),new RecordSchemaRegistry([...Object.values(identitySchemas),...Object.values(persistenceSchemas),...SEMANTIC_RECORD_SCHEMAS])),132n),5n);
it('exposes every registered native leaf and keeps search/replay detached at all prefixes',async()=>{
 const run=await SemWorkbenchRun.create();let max=0;
 for(let prefix=0;prefix<=3;prefix++){
  const checkpoint=run.checkpoint(),value=state(run),before=exactText(value),r=semRecordedState(value),restored=fixture.adapter.restore(value),entries=perceptualStateEntries(restored.continuantFiles,restored.eventFiles);
  expect(r.fields).toEqual(entries.map(e=>({root:String(e.path.rootStateTypeId),path:exactKey(statePathValue(e.path)),exact:exactText(e.value)})));
  const raw=items(value,'list');const count=raw.slice(0,2).reduce((n,v)=>{const root=rec(v,BigInt(v!==true&&typeof v!=='boolean'&&v.kind==='record'?v.schema.typeId:0));const counters=f(root,1n);if(typeof counters==='boolean'||counters.kind!=='map')throw Error('counter map required');return n+counters.entries.length+items(f(root,2n),'set').length;},0);
  expect(r.fields).toHaveLength(count);expect(new Set(r.fields.map(f=>f.path)).size).toBe(count);max=Math.max(max,count);
  for(const field of r.fields)expect(searchRecordedState(r.fields,field.path,field.root)).toEqual([field]);
  expect(searchRecordedState(r.fields,'','243')).toEqual([]);expect(searchRecordedState(r.fields,'not-a-recorded-path')).toEqual([]);
  expect(semRecordedState(state(await SemWorkbenchRun.restore(checkpoint)))).toEqual(r);expect(run.checkpoint()).toEqual(checkpoint);expect(exactText(value)).toBe(before);if(prefix<3)await run.advance();
 }expect(max).toBe(17);
},600000);
it('rejects invalid harness envelopes instead of calling them empty state',async()=>{
 const run=await SemWorkbenchRun.create(),parts=items(state(run),'list');expect(()=>semRecordedState(list([parts[0],parts[1],false]))).toThrow('envelope');expect(()=>semRecordedState(list([parts[1],parts[0],true]))).toThrow();
},600000);
