import {expect,it} from 'vitest';
import {DIAGNOSTIC_SEARCH_LIMITS,indexDiagnosticState,searchDiagnosticFields,compareDiagnosticIndexes,filterDiagnosticChanges} from '../workbench/diagnosticSearch';
import {SubstitutionWorkbenchRun} from '../workbench/substitutionAdapter';
it('preserves exact leaf values, escaped paths, null and empty containers without mutation',()=>{
 const value={'a/b':{'~key':null},empty:[],zero:0,known:false,large:'9007199254740993123',fraction:{n:'1',d:'3'}};
 const before=JSON.stringify(value),index=indexDiagnosticState(value);
 expect(index.error).toBeUndefined();expect(index.fields.find(f=>f.path==='/a~1b/~0key')).toEqual({path:'/a~1b/~0key',kind:'null',exact:'null'});
 expect(searchDiagnosticFields(index,'9007199254740993123').matches[0].exact).toBe('"9007199254740993123"');
 expect(searchDiagnosticFields(index,'/fraction/d').matches[0].exact).toBe('"3"');
 expect(index.fields.find(f=>f.path==='/empty')?.exact).toBe('Array (0 entries)');expect(JSON.stringify(value)).toBe(before);
});
it('reports full match counts and explicit limits; rejected indexes expose no partial results',()=>{
 const index=indexDiagnosticState(Array.from({length:101},(_,i)=>i));
 const result=searchDiagnosticFields(index,'');expect(result.total).toBe(102);expect(result.matches).toHaveLength(100);expect(result.limited).toBe(true);
 expect(searchDiagnosticFields(index,'missing')).toEqual({matches:[],total:0,limited:false});
 for(const value of [Array(DIAGNOSTIC_SEARCH_LIMITS.nodes).fill(0),'x'.repeat(DIAGNOSTIC_SEARCH_LIMITS.text+1)]){
  const rejected=indexDiagnosticState(value);expect(rejected.error).toMatch(/limit exceeded/);expect(rejected.fields).toEqual([]);
 }
});
it('rejects non-JSON diagnostics instead of converting them to plausible values',()=>{
 const cyclic:unknown[]=[];cyclic.push(cyclic);
 for(const value of [undefined,NaN,Infinity,1n,new Date(),cyclic]){const result=indexDiagnosticState(value);expect(result.error).toBeTruthy();expect(result.fields).toEqual([]);}
});
it('indexes every field of a committed component state and leaves continuation unchanged',async()=>{
 const a=await SubstitutionWorkbenchRun.create(),b=await SubstitutionWorkbenchRun.create();
 for(let i=0;i<8;i++){
  const state=a.snapshot().state,index=indexDiagnosticState(state);expect(index.error).toBeUndefined();
  const count=(v:unknown):number=>1+(v!==null&&typeof v==='object'?Object.values(v).reduce<number>((n,x)=>n+count(x),0):0);
  expect(index.fields.length).toBe(count(state));expect(new Set(index.fields.map(f=>f.path)).size).toBe(index.fields.length);
  await a.advance();await b.advance();expect(a.checkpoint()).toEqual(b.checkpoint());
 }
 const index=indexDiagnosticState(a.snapshot().state);expect(searchDiagnosticFields(index,'/rows/7/at').matches[0].exact).toBe('8');
},600000);
it('distinguishes absent fields from null and marks equal-sized changed containers',()=>{
 const before=indexDiagnosticState({group:{old:null},same:0}),after=indexDiagnosticState({group:{next:null},same:0});
 const rows=compareDiagnosticIndexes(after,before),byPath=new Map(rows.map(r=>[r.path,r]));
 expect(byPath.get('/group/old')?.status).toBe('removed');expect(byPath.get('/group/old')?.before?.exact).toBe('null');expect(byPath.get('/group/old')?.after).toBeUndefined();
 expect(byPath.get('/group/next')?.status).toBe('added');expect(byPath.get('/group')?.status).toBe('changed');expect(byPath.get('')?.status).toBe('changed');expect(byPath.get('/same')?.status).toBe('unchanged');
 expect(compareDiagnosticIndexes(before,after).find(r=>r.path==='/group/next')?.status).toBe('removed');
 expect(filterDiagnosticChanges(compareDiagnosticIndexes(before,before),'','',true).total).toBe(0);
});
it('combines section, previous-value search and changed filters before limiting',()=>{
 const before=indexDiagnosticState({a:{x:'previous',y:1},ab:{x:2}}),after=indexDiagnosticState({a:{x:'current',y:1},ab:{x:3}});
 const rows=compareDiagnosticIndexes(after,before),result=filterDiagnosticChanges(rows,'previous','/a',true);
 expect(result.matches.map(r=>r.path)).toEqual(['/a/x']);expect(result.matches[0].after?.exact).toBe('"current"');
 expect(filterDiagnosticChanges(rows,'','/a',true).matches.map(r=>r.path)).toEqual(['/a','/a/x']);
 const many=compareDiagnosticIndexes(indexDiagnosticState(Array(110).fill(1)),indexDiagnosticState(Array(110).fill(0)));
 expect(filterDiagnosticChanges(many,'','',true)).toMatchObject({total:111,limited:true});
 expect(()=>compareDiagnosticIndexes({fields:[],error:'incomplete'},before)).toThrow('incomplete');
});
