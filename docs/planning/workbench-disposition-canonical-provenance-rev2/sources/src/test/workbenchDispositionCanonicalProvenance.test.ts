import {it,expect} from 'vitest';
import {record,list} from '../substrate/canonicalEncoding';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {DispositionPagedRun} from '../workbench/dispositionPagedAdapter';
import {dispositionProvenance} from '../workbench/dispositionProvenance';
import {dispositionCanonicalProvenance} from '../workbench/dispositionCanonicalProvenance';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex} from '../workbench/canonical';
const loadBuiltin=(name:string)=>import(/* @vite-ignore */ name);
const {default:fs}=await loadBuiltin('node:fs'),{gunzipSync}=await loadBuiltin('node:zlib'),{createHash}=await loadBuiltin('node:crypto');
function frozen(index:number){const root='docs/planning/workbench-disposition-provenance-rev1',receipt=JSON.parse(fs.readFileSync(root+'/receipt.json','utf8')),name=`program-${index}.json.gz`,bytes=fs.readFileSync(root+'/'+name);expect(createHash('sha256').update(bytes).digest('hex')).toBe(receipt.results.find((r:any)=>r.path===name).sha256);return JSON.parse(gunzipSync(bytes).toString());}
it('preserves recorded owned-read provenance across seven laws, constitution controls and a complete batch',async()=>{
 let observations=0,batches=0;
 for(const [program,index,horizon]of [['Plastic/Main',0,5],['Leaky/Main',1,2],['Refold/Main',2,2],['StandingOnly/Main',3,2],['Neither/Main',4,2],['JointMax/Main',5,2],['JointAdd/Main',6,2],['Plastic/ConstitutionPositive',13,2],['Plastic/ConstitutionNegative',14,2],['Plastic/InactiveProbes',11,2]] as const){
  const expected=frozen(index),run=await DispositionWorkbenchRun.create(program);
  for(let prefix=1;prefix<=horizon;prefix++){
   await run.advance();const s=run.snapshot(),checkpoint=run.checkpoint(),save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),trace=items(f(save,11n),'list');
   const i=s.timeline.map(e=>e.stage).lastIndexOf('reasons'),event=s.timeline[i],row=rec(trace[i],160n),output=f(row,13n),reads=f(row,11n),report=dispositionCanonicalProvenance(event,output,reads,s.law,s.seamVersion);
   expect(report).toEqual(expected.find((r:any)=>r.eventId===event.id));expect(dispositionProvenance(event,s.law,s.seamVersion)).toEqual(report);observations++;
   if(report.emitted){batches+=report.batches.length;
    expect(()=>dispositionCanonicalProvenance(event,output,list([]),s.law,s.seamVersion)).toThrow('owned-state');
    const values=[...items(reads,'list')],first=rec(values[0],147n),fields=new Map(first.fields);fields.set(3n,false);values[0]=record(first.schema,fields);
    expect(()=>dispositionCanonicalProvenance(event,output,list(values),s.law,s.seamVersion)).toThrow('present');
   }
   expect(()=>dispositionCanonicalProvenance(event,output,reads,'Unknown',s.seamVersion)).toThrow('profile');expect(run.checkpoint()).toEqual(checkpoint);
  }
 }
 expect(observations).toBe(23);expect(batches).toBeGreaterThan(0);
},600000);
it('dispatches provenance from paged native state and restores its source revision',async()=>{
 const run=await DispositionPagedRun.create('Plastic/ConstitutionPositive');await run.advance();const summary=run.summary(),checkpoint=run.checkpoint(),selection={kind:'provenance' as const,eventId:'18'},report=run.diagnostic(summary.saveHash,selection);
 expect(report.report).toEqual(frozen(13)[0]);expect(report.identity.saveHash).toBe(checkpoint.saveHash);expect(run.checkpoint()).toEqual(checkpoint);
 await run.advance();expect(()=>run.diagnostic(summary.saveHash,selection)).toThrow('Stale');const restored=await DispositionPagedRun.restore(checkpoint);expect(restored.diagnostic(summary.saveHash,selection)).toEqual(report);
},600000);
