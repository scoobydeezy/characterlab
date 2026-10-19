import {it,expect} from 'vitest';
import {record,list,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {stateSchemas,statePathValue} from '../substrate/state';
import {traceSchemas} from '../substrate/trace';
import {persistenceSchemas} from '../substrate/persistence';
import {nativeReadSources} from '../workbench/nativeReadSources';
const path=statePathValue({rootStateTypeId:630n,fieldId:1n,selectors:[]}),id=typedIdentifier(1028n,text('test-accessor'));
function fixture(changes:Map<bigint,CanonicalValue>=new Map()){
 const fields=new Map<bigint,CanonicalValue>([[1n,id],[2n,path],[3n,true],[4n,unsigned(1n)],[5n,list([])],[6n,false]]);for(const [k,v] of changes)fields.set(k,v);
 const read=record(stateSchemas.actualReadRecord,fields),event=record(persistenceSchemas.scheduledEvent,new Map(persistenceSchemas.scheduledEvent.fields.map(f=>[f.id,f.id===1n?unsigned(9n):false])));
 return record(traceSchemas.traceRecord,new Map(traceSchemas.traceRecord.fields.map(f=>[f.id,f.id===4n?event:f.id===11n?list([read]):false])));
}
it('preserves direct/derived source identities and distinguishes absent from present false',()=>{
 const direct=nativeReadSources([fixture()])[0].reads[0];expect(direct.transformation).toBeNull();expect(direct.sources).toEqual([]);
 const derived=nativeReadSources([fixture(new Map([[5n,list([list([path,false,false])])],[6n,id]]))])[0].reads[0];expect(derived.transformation).toContain('test-accessor');expect(derived.sources[0].exact).toBe('Absent');
 const presentFalse=nativeReadSources([fixture(new Map([[4n,false]]))])[0].reads[0];expect(presentFalse.presence).toBe(true);expect(presentFalse.exact).toBe('false');
});
it('rejects malformed presence, identity, tuples, missing transformation and duplicates',()=>{
 expect(()=>nativeReadSources([fixture(new Map([[3n,unsigned(0n)]]))])).toThrow('presence');
 expect(()=>nativeReadSources([fixture(new Map([[3n,false]]))])).toThrow('Absent');
 expect(()=>nativeReadSources([fixture(new Map([[1n,false]]))])).toThrow('identifier');
 expect(()=>nativeReadSources([fixture(new Map([[5n,list([list([path,true])])],[6n,id]]))])).toThrow('three');
 expect(()=>nativeReadSources([fixture(new Map([[5n,list([list([path,true,unsigned(2n)])])]]))])).toThrow('transformation');
 expect(()=>nativeReadSources([fixture(),fixture()])).toThrow('Duplicate');
 expect(()=>nativeReadSources(Array.from({length:10001},()=>fixture()))).toThrow('limit');
});
