import {it,expect} from 'vitest';
import {DispositionPagedRun} from '../workbench/dispositionPagedAdapter';
import {DispositionPagedPair} from '../workbench/dispositionPagedPair';
import {dispositionCanonicalStoredHistory} from '../workbench/dispositionCanonicalStoredHistory';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex} from '../workbench/canonical';
import {restoreStatePath} from '../substrate/state';
import {record,list} from '../substrate/canonicalEncoding';
const builtin=(name:string)=>import(/* @vite-ignore */ name);
const {default:fs}=await builtin('node:fs'),{gunzipSync}=await builtin('node:zlib'),{createHash}=await builtin('node:crypto');
const root='docs/planning/workbench-disposition-comparison-rev1',receipt=JSON.parse(fs.readFileSync(root+'/receipt.json','utf8'));
function original(index:number,prefix:number){const path=`snapshot-${index}-${prefix}.json.gz`,bytes=fs.readFileSync(root+'/'+path);expect(createHash('sha256').update(bytes).digest('hex')).toBe(receipt.artifacts.find((a:any)=>a.path===path).sha256);return JSON.parse(gunzipSync(bytes).toString());}
it('reconstructs all prior scalar rows from current trace, preserves Refold absence and restores complete compact history',async()=>{
 for(const [program,index,last]of [['Plastic/ConstitutionPositive',13,5],['Refold/Main',2,2]] as const){
  const run=await DispositionPagedRun.create(program),expected:any[]=[];
  for(let prefix=0;prefix<=last;prefix++){
   const s=run.summary(),frozen=original(index,prefix),read=(root:string)=>{const field=frozen.fields.find((f:any)=>f.root===root);if(!field)return null;const exact=JSON.parse(field.exact)['Value [1]'],[n,d]=exact.split('/').map(Number);return {exact,plot:n/d,path:field.path};};
   expected.push({prefix,constitution:read('1457'),plastic:read('1458')});
   const history=run.storedHistory(s.saveHash);expect(history.rows).toEqual(expected);expect(history.source.saveHash).toBe(s.saveHash);expect(history.source.prefix).toBe(prefix);expect(JSON.stringify(history).length).toBeLessThan(20000);
   history.rows.length=0;expect(run.storedHistory(s.saveHash).rows).toEqual(expected);expect(()=>run.storedHistory('stale')).toThrow('Stale');
   if(prefix<last)await run.advance();
  }
  const summary=run.summary(),history=run.storedHistory(summary.saveHash),checkpoint=run.checkpoint(),restored=await DispositionPagedRun.restore(checkpoint);expect(restored.storedHistory(restored.summary().saveHash)).toEqual(history);
  const save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),state=f(save,5n),trace=items(f(save,11n),'list');
  expect(()=>dispositionCanonicalStoredHistory({...summary,timeline:summary.timeline.map((h,i)=>i? h:{...h,id:'wrong'})},state,trace)).toThrow('ordering');
  expect(()=>dispositionCanonicalStoredHistory(summary,state,trace.slice(1))).toThrow('length');
  if(index===13){expect(history.rewoundEvents.length).toBeGreaterThan(0);expect(history.rows.some(r=>r.plastic?.exact!=='0/1')).toBe(true);
   let altered=false;const broken=trace.map(v=>{const r=rec(v,160n),diffs=items(f(r,17n),'list').map(v=>{const d=rec(v,148n);if(altered||restoreStatePath(f(d,1n)).rootStateTypeId!==1458n)return d;altered=true;return record(d.schema,new Map([...d.fields,[5n,false]]));});return record(r.schema,new Map([...r.fields,[17n,list(diffs)]]));});expect(altered).toBe(true);expect(()=>dispositionCanonicalStoredHistory(summary,state,broken)).toThrow('chain');
  }
 }
},600000);
it('publishes branch-specific histories through pair advancement and paired restore',async()=>{
 const pair=await DispositionPagedPair.create('model/0/13');await pair.advance();const view=pair.summary();expect(view.history.a.rows.length).toBe(2);expect(view.history.b.rows.length).toBe(2);
 await pair.advance('a');const unequal=pair.summary();expect(unequal.history.a.rows.length).toBe(3);expect(unequal.history.b.rows.length).toBe(2);expect(unequal.comparison.aligned).toBe(false);expect(unequal.history.a.rows.slice(0,2)).toEqual(view.history.a.rows);
 const restored=await DispositionPagedPair.restore(await pair.checkpoint());expect(restored.summary()).toEqual(unequal);
},300000);
