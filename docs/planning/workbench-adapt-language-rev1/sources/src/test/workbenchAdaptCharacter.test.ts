import {it,expect} from 'vitest';import {AdaptWorkbenchRun} from '../workbench/adaptAdapter';import {adaptInspection} from '../workbench/adaptInspection';
import {projectAdaptCharacter} from '../workbench/adaptCharacter';
import {decodeMemory} from '../campaign2/memoryCodecs';
import {fromHex} from '../workbench/canonical';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {text,list,record} from '../substrate/canonicalEncoding';
it('rejects another observer and measurement records carrying extra evidence',async()=>{
 const run=await AdaptWorkbenchRun.create('count-0');await run.advance();await run.advance();
 const outputs=items(f(rec(decodeMemory(fromHex(run.checkpoint().saveHex)),132n),12n),'list');
 const source=rec(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)!,337n),observation=rec(f(source,2n),203n),observer=f(observation,2n);
 expect(()=>projectAdaptCharacter(outputs,text('another observer'))).toThrow('observer mismatch');
 const fields=new Map(observation.fields);fields.set(9n,list([text('private evidence')]));
 const carriage=new Map(source.fields);carriage.set(2n,record(observation.schema,fields));
 expect(()=>projectAdaptCharacter([record(source.schema,carriage)],observer)).toThrow('admitted diagnostic measurement shape');
},600000);
it('keeps physical adaptation hidden until measurement and preserves observed evidence during recall',async()=>{const a=await AdaptWorkbenchRun.create('count-0'),b=await AdaptWorkbenchRun.create('count-1');await a.advance();await b.advance();expect(adaptInspection(a).character).toEqual(adaptInspection(b).character);expect(adaptInspection(a).character.entries).toEqual([]);expect(a.snapshot().stateHash).not.toBe(b.snapshot().stateHash);await a.advance();await b.advance();const av=adaptInspection(a),bv=adaptInspection(b),save=a.checkpoint();expect(av.character.entries[0].human).toContain('5/1');expect(bv.character.entries[0].human).toContain('51/10');expect(a.checkpoint()).toEqual(save);const restored=await AdaptWorkbenchRun.restore(save);expect(adaptInspection(restored)).toEqual(av);await a.advance();const recalled=adaptInspection(a).character.entries;expect(recalled[0]).toEqual(av.character.entries[0]);expect(recalled[1].kind).toBe('Recalled measurement');expect(recalled[1].observedAt).toBe('4');expect(recalled[1].human).toContain('not a new measurement');},600000);
