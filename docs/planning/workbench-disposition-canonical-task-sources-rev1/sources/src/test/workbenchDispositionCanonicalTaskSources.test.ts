import {it,expect} from 'vitest';
import {list} from '../substrate/canonicalEncoding';
import {DispositionPagedRun} from '../workbench/dispositionPagedAdapter';
import {dispositionCanonicalTaskSources} from '../workbench/dispositionCanonicalTaskSources';
import {dispositionTaskSources,dispositionTaskSourcesFromOperands} from '../workbench/dispositionTaskSources';
import {dispositionFactorSources} from '../workbench/dispositionFactorSources';
import {nativeTimeline} from '../workbench/nativeTimeline';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex} from '../workbench/canonical';
const loadBuiltin=(name:string)=>import(/* @vite-ignore */ name);
const {default:fs}=await loadBuiltin('node:fs'),{gunzipSync}=await loadBuiltin('node:zlib'),{createHash}=await loadBuiltin('node:crypto');
function frozen(index:number){const root='docs/planning/workbench-disposition-task-sources-rev1',receipt=JSON.parse(fs.readFileSync(root+'/receipt.json','utf8')),name=`program-${index}.json.gz`,bytes=fs.readFileSync(root+'/'+name);expect(createHash('sha256').update(bytes).digest('hex')).toBe(receipt.results.find((r:any)=>r.path===name).sha256);return JSON.parse(gunzipSync(bytes).toString());}
it('joins canonical task operands to the retained native reports through paged dispatch',async()=>{
 let observations=0;
 for(const [program,index]of [['Plastic/Main',0],['Plastic/Pressure',8],['Plastic/ConstitutionPositive',13]] as const){
  const expected=frozen(index),run=await DispositionPagedRun.create(program);let first:any;
  for(let prefix=1;prefix<=2;prefix++){
   await run.advance();const s=run.summary(),checkpoint=run.checkpoint(),save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),trace=items(f(save,11n),'list'),i=s.timeline.map(e=>e.stage).lastIndexOf('reasons'),row=rec(trace[i],160n),event=nativeTimeline([row])[0];
   const report=dispositionCanonicalTaskSources(event,f(row,13n),f(row,11n),s.seamVersion),envelope=run.diagnostic(s.saveHash,{kind:'taskSources',eventId:event.id});
   expect(report).toEqual(expected.find((r:any)=>r.eventId===event.id));expect(dispositionTaskSources(event,s.seamVersion)).toEqual(report);expect(envelope.report).toEqual(report);expect(run.checkpoint()).toEqual(checkpoint);observations++;
   if(prefix===1)first={envelope,checkpoint};else{expect(()=>run.diagnostic(first.checkpoint.saveHash,first.envelope.selection)).toThrow('Stale');const restored=await DispositionPagedRun.restore(first.checkpoint);expect(restored.diagnostic(first.checkpoint.saveHash,first.envelope.selection)).toEqual(first.envelope);}
   if(program==='Plastic/Main'&&prefix===1){
    const factors=dispositionFactorSources(event),raw=JSON.parse(event.output)[1]['Raw [4]'],options=structuredClone(raw['CandidateOptions [2]']),motive=options['MotiveContext [2]'],responses=motive['Concern [2]']['Responses [3]'];
    responses[0]['Response [2]']={record:'TaskConcernResponse#386/1','VariantTag [1]':'2','Intensity [2]':'0/1'};
    const zero=dispositionTaskSourcesFromOperands(event,s.seamVersion,factors,raw,options);expect((zero.rows[0] as any).responseState).toBe('scalar');expect((zero.rows[0] as any).responseIntensity).toBe('0/1');expect(zero.meanings).toEqual(report.meanings);
    motive['Motives [3]'][0]['RawPressure [2]']='2/1';expect(()=>dispositionTaskSourcesFromOperands(event,s.seamVersion,factors,raw,options)).toThrow('strength');
   }
  }
 }
 expect(observations).toBe(6);
},600000);
it('preserves absent task output and rejects unsupported contexts',()=>{
 const event={id:'18',instant:'1',stage:'reasons',phase:'52'},empty=list([]);
 expect(dispositionCanonicalTaskSources(event,empty,empty,'disposition-public/0.1-candidate')).toMatchObject({emitted:false,rows:[],meanings:[]});
 expect(()=>dispositionCanonicalTaskSources(event,empty,empty,'unknown')).toThrow('profile');
 expect(()=>dispositionCanonicalTaskSources({...event,stage:'decision'},empty,empty,'disposition-public/0.1-candidate')).toThrow('reasons-stage');
});
