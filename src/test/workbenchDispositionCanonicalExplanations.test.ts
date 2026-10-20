import {it,expect} from 'vitest';
import {list} from '../substrate/canonicalEncoding';
import {DispositionPagedRun} from '../workbench/dispositionPagedAdapter';
import {explainDispositionFactorSources} from '../workbench/dispositionExplanations';
import {explainDispositionCanonicalFactors} from '../workbench/dispositionCanonicalExplanations';
const loadBuiltin=(name:string)=>import(/* @vite-ignore */ name);
const {default:fs}=await loadBuiltin('node:fs'),{gunzipSync}=await loadBuiltin('node:zlib'),{createHash}=await loadBuiltin('node:crypto');
function frozen(root:string,index:number){const receipt=JSON.parse(fs.readFileSync(root+'/receipt.json','utf8')),name=`program-${index}.json.gz`,bytes=fs.readFileSync(root+'/'+name);expect(createHash('sha256').update(bytes).digest('hex')).toBe(receipt.results.find((r:any)=>r.path===name).sha256);return JSON.parse(gunzipSync(bytes).toString());}
it('preserves all270 retained language reports from independently retained factors',()=>{
 let reports=0,descriptions=0;
 for(let index=0;index<15;index++){
  const language=frozen('docs/planning/workbench-disposition-language-rev2',index),factors=frozen('docs/planning/workbench-disposition-factors-rev1',index);
  for(const expected of language){const source=factors.find((f:any)=>f.eventId===expected.eventId);expect(source).toBeDefined();const actual=explainDispositionFactorSources({id:expected.eventId,instant:expected.instant},expected.seamVersion,'researcher',source);expect(actual).toEqual(expected);reports++;descriptions+=actual.rows.length;}
 }
 expect(reports).toBe(270);expect(descriptions).toBe(750);
});
it('withholds character/player reports without inspecting payloads or revealing source identities',()=>{
 const poison=new Proxy({},{get(){throw Error('Payload accessed');}}) as any;
 for(const audience of ['character','player'] as const){const actual=explainDispositionCanonicalFactors(poison,poison,poison,'disposition-public/0.1-candidate',audience);expect(actual).toEqual({version:'disposition-factor-language/0.2',seamVersion:'disposition-public/0.1-candidate',audience,emitted:false,rows:[],issues:[],scope:'Explanation unavailable: no qualified disclosure contract exists for this audience.'});}
 expect(()=>explainDispositionCanonicalFactors(poison,poison,poison,'unknown','player')).toThrow('seam');expect(()=>explainDispositionCanonicalFactors(poison,poison,poison,'disposition-public/0.1-candidate','unknown' as any)).toThrow('audience');
 expect(explainDispositionCanonicalFactors({id:'18',instant:'1',stage:'reasons',phase:'52'},list([]),list([]),'disposition-public/0.1-candidate','researcher')).toMatchObject({emitted:false,rows:[]});
});
it('dispatches current and restored language with explicit audience selection',async()=>{
 const run=await DispositionPagedRun.create('Plastic/ConstitutionPositive'),expected=frozen('docs/planning/workbench-disposition-language-rev2',13);let first:any;
 for(let prefix=1;prefix<=2;prefix++){
  await run.advance();const summary=run.summary(),checkpoint=run.checkpoint(),event=summary.timeline.filter(e=>e.stage==='reasons').at(-1)!;
  for(const audience of ['researcher','character','player'] as const){const envelope=run.diagnostic(summary.saveHash,{kind:'language',eventId:event.id,audience});expect(envelope.selection).toEqual({kind:'language',eventId:event.id,audience});if(audience==='researcher'){expect(envelope.report).toEqual(expected.find((r:any)=>r.eventId===event.id));if(prefix===1)first={envelope,checkpoint};}else expect(envelope.report).toEqual(explainDispositionFactorSources(event,summary.seamVersion,audience));}
  expect(run.checkpoint()).toEqual(checkpoint);
 }
 expect(()=>run.diagnostic(first.checkpoint.saveHash,first.envelope.selection)).toThrow('Stale');const restored=await DispositionPagedRun.restore(first.checkpoint);expect(restored.diagnostic(first.checkpoint.saveHash,first.envelope.selection)).toEqual(first.envelope);
},600000);
