import {it,expect} from 'vitest';
import {LongWorkbenchRun} from '../workbench/longAdapter';
import {explainLongObserver} from '../workbench/longExplanations';
import {decodeLongitudinal,longitudinalRecord} from '../campaign3/longitudinalCodecs';
import {canonicalEncode,record,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {dataRecord} from '../campaign2/canonicalData';
import {fromHex} from '../workbench/canonical';
it('describes only closed observer data and keeps absent, false, zero and detail presence separate',async()=>{
 const full=await LongWorkbenchRun.create('representation-1-law-1'),compact=await LongWorkbenchRun.create('representation-2-law-1'),before=full.checkpoint(),raw=fromHex(full.snapshot().observerHex),a=await explainLongObserver(raw),b=await explainLongObserver(fromHex(compact.snapshot().observerHex));
 expect(await explainLongObserver(raw)).toEqual(a);expect(a.observerHash).toBe(full.snapshot().observerHash);expect(full.checkpoint()).toEqual(before);expect(a.rows).toHaveLength(6);expect(a.rows.find(r=>r.id==='identity')?.text).toContain('0/1');expect(a.rows.find(r=>r.id==='person')?.present).toBe(false);expect(a.rows.find(r=>r.id==='detail')?.present).toBe(true);expect(b.rows.find(r=>r.id==='detail')?.present).toBe(false);
 const view=dataRecord(decodeLongitudinal(raw),881n),fields=new Map(view.fields);fields.set(6n,longitudinalRecord(869,[false]));const falseDescription=await explainLongObserver(canonicalEncode(record(view.schema,fields)));expect(falseDescription.rows.find(r=>r.id==='person')?.present).toBe(true);expect(falseDescription.rows.find(r=>r.id==='person')?.text).toContain('records false');
 fields.set(1n,typedIdentifier(1000n,text('observer/wrong')));await expect(explainLongObserver(canonicalEncode(record(view.schema,fields)))).rejects.toThrow('observer');
},600000);
