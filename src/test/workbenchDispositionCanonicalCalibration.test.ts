import {it,expect} from 'vitest';
const loadBuiltin=(name:string)=>import(/* @vite-ignore */ name);
const {default:fs}=await loadBuiltin('node:fs'),{gunzipSync}=await loadBuiltin('node:zlib'),{createHash}=await loadBuiltin('node:crypto');
import {record,list} from '../substrate/canonicalEncoding';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {dispositionCalibration,dispositionCalibrationFromFactors} from '../workbench/dispositionCalibration';
import {dispositionCanonicalCalibration} from '../workbench/dispositionCanonicalCalibration';
import {dispositionCanonicalInspection} from '../workbench/dispositionCanonicalInspection';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex} from '../workbench/canonical';
import type {DispositionInspectionSummary} from '../workbench/dispositionPagedAdapter';
function frozen(root:string,index:number){const receipt=JSON.parse(fs.readFileSync(root+'/receipt.json','utf8')),name=`program-${index}.json.gz`,bytes=fs.readFileSync(root+'/'+name);expect(createHash('sha256').update(bytes).digest('hex')).toBe(receipt.results.find((r:any)=>r.path===name).sha256);return JSON.parse(gunzipSync(bytes).toString());}
it('preserves all270 frozen calibration calculations from independently retained factor reports',()=>{
 let count=0;
 for(let index=0;index<15;index++){
  const expected=frozen('docs/planning/workbench-disposition-calibration-rev1',index),factors=frozen('docs/planning/workbench-disposition-factors-rev1',index);
  for(const report of expected){const factor=factors.find((r:any)=>r.eventId===report.eventId);expect(factor).toBeDefined();expect(dispositionCalibrationFromFactors({id:report.eventId,instant:report.instant},report.seamVersion,factor,report.learning??false)).toEqual(report);count++;}
 }
 expect(count).toBe(270);
},600000);
it('joins canonical evaluation context and returns the frozen calibration through the revision dispatcher',async()=>{
 for(const [program,index]of [['Plastic/Main',0],['Refold/Main',2],['Plastic/InactiveProbes',11]] as const){
  const expected=frozen('docs/planning/workbench-disposition-calibration-rev1',index),run=await DispositionWorkbenchRun.create(program);
  for(let prefix=1;prefix<=2;prefix++){
   await run.advance();const s=run.snapshot(),checkpoint=run.checkpoint(),save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),trace=items(f(save,11n),'list');
   const summary:DispositionInspectionSummary={...s,version:'disposition-paged-inspection/0.1',fields:s.fields.map(({root,path})=>({root,path})),timeline:s.timeline.map(({id,instant,phase,stage,parents})=>({id,instant,phase,stage,parents}))};
   for(const [i,event]of s.timeline.entries())if(event.stage==='reasons'){
    const row=rec(trace[i],160n),input=f(row,12n),output=f(row,13n),reads=f(row,11n),report=expected.find((r:any)=>r.eventId===event.id),actual=dispositionCanonicalCalibration(event,input,output,reads,s.seamVersion);
    expect(actual).toEqual(report);expect(dispositionCalibration(event,s.seamVersion)).toEqual(report);
    const envelope=dispositionCanonicalInspection(summary,f(save,5n),trace,s.saveHash,{kind:'calibration',eventId:event.id});expect(envelope.report).toEqual(report);expect(envelope.identity.saveHash).toBe(checkpoint.saveHash);
    expect(()=>dispositionCanonicalCalibration(event,input,output,reads,'unknown')).toThrow('version');
    if(actual.emitted){const values=[...items(input,'list')],context=rec(values[0],1429n),fields=new Map(context.fields);fields.set(6n,!f(context,6n));values[0]=record(context.schema,fields);expect(()=>dispositionCanonicalCalibration(event,list(values),output,reads,s.seamVersion)).toThrow('lineage');}
   }
   expect(run.checkpoint()).toEqual(checkpoint);
  }
 }
},600000);
