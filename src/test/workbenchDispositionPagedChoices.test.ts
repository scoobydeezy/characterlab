import {it,expect} from 'vitest';
import {dispositionChoiceComparison,dispositionChoiceComparisonFromRows} from '../workbench/dispositionChoiceComparison';
import {DispositionPagedPair} from '../workbench/dispositionPagedPair';
import {DispositionPagedRun} from '../workbench/dispositionPagedAdapter';
const builtin=(name:string)=>import(/* @vite-ignore */ name);
const {default:fs}=await builtin('node:fs'),{gunzipSync}=await builtin('node:zlib'),{createHash}=await builtin('node:crypto');
const root='docs/planning/workbench-disposition-choice-rev2',receipt=JSON.parse(fs.readFileSync(root+'/receipt.json','utf8')),bytes=fs.readFileSync(root+'/reports.json.gz');
expect(createHash('sha256').update(bytes).digest('hex')).toBe(receipt.artifact.sha256);
const reports=JSON.parse(gunzipSync(bytes).toString());
const identity=(s:any)=>({...s,seamVersion:'disposition-public/0.1-candidate',clock:String(s.prefix),timeline:Array(s.prefix*10).fill(null)});
it('preserves all570 frozen report bodies and serialized ordering through shared joined-row comparison',()=>{
 expect(reports.length).toBe(570);
 for(const r of reports){const actual=dispositionChoiceComparisonFromRows(r.comparison,identity(r.a),identity(r.b),r.rows.map((row:any)=>row.a),r.rows.map((row:any)=>row.b));expect(actual).toEqual(r);expect(JSON.stringify(actual)).toBe(JSON.stringify(r));}
 const r=reports.find((r:any)=>r.comparison==='model/0/13'&&r.a.prefix===2),a=identity(r.a),b=identity(r.b),x=r.rows.map((row:any)=>row.a),y=r.rows.map((row:any)=>row.b);
 expect(()=>dispositionChoiceComparisonFromRows(r.comparison,b,a,y,x)).toThrow('ordered');expect(()=>dispositionChoiceComparisonFromRows(r.comparison,a,b,x.slice(1),y)).toThrow('Complete');
 expect(()=>dispositionChoiceComparisonFromRows(r.comparison,a,b,[{...x[0],candidate:null},x[1]],y)).toThrow('Invalid');
 const unequal=dispositionChoiceComparisonFromRows(r.comparison,a,{...b,prefix:0,clock:'0',timeline:[]},x,[]);expect(unequal.rows.map(row=>row.outcome)).toEqual(['unaligned','unaligned']);expect(unequal.firstDifference).toBe(null);
});
it('preserves the original full-snapshot wrapper at bounded frozen prefixes',()=>{
 const prior='docs/planning/workbench-disposition-comparison-rev1',receipt=JSON.parse(fs.readFileSync(prior+'/receipt.json','utf8'));
 const load=(i:number,p:number)=>{const path=`snapshot-${i}-${p}.json.gz`,bytes=fs.readFileSync(prior+'/'+path);expect(createHash('sha256').update(bytes).digest('hex')).toBe(receipt.artifacts.find((a:any)=>a.path===path).sha256);return JSON.parse(gunzipSync(bytes).toString());};
 for(const p of [0,1]){const a=load(0,p),b=load(13,p);expect(dispositionChoiceComparison('model/0/13',a,b)).toEqual(reports.find((r:any)=>r.comparison==='model/0/13'&&r.a.prefix===p));}
});
it('joins original canonical choices in paged pairs and preserves them through unequal horizons and restore',async()=>{
 for(const id of ['model/0/13','model/0/2','input/Seed0','input/InactiveProbes']){
  const pair=await DispositionPagedPair.create(id);let prior:any[]=[];
  for(let prefix=0;prefix<=2;prefix++){const report=pair.summary().choices;expect(report).toEqual(reports.find((r:any)=>r.comparison===id&&r.a.prefix===prefix));expect(report.rows.slice(0,prior.length)).toEqual(prior);prior=structuredClone(report.rows);if(prefix<2)await pair.advance();}
  const restored=await DispositionPagedPair.restore(await pair.checkpoint());expect(restored.summary().choices).toEqual(pair.summary().choices);
 }
 const run=await DispositionPagedRun.create();expect(()=>run.choiceRows('stale')).toThrow('Stale');
 const pair=await DispositionPagedPair.create('model/0/13');await pair.advance('a');expect(pair.summary().choices.rows[0].outcome).toBe('unaligned');expect(pair.summary().choices.firstDifference).toBe(null);
},600000);
