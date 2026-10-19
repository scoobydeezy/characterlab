import {expect,it} from 'vitest';
import {DIAGNOSTIC_SEARCH_LIMITS,indexDiagnosticState,searchDiagnosticFields} from '../workbench/diagnosticSearch';
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
