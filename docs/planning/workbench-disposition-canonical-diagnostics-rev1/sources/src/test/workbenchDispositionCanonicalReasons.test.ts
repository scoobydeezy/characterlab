import {it,expect} from 'vitest';
import {list,record,text} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {fromHex} from '../workbench/canonical';
import {inspectDispositionReasons} from '../workbench/dispositionReasonDiagnostics';
import {inspectDispositionCanonicalReasons} from '../workbench/dispositionCanonicalReasons';
it('preserves qualified reason results and rejects malformed lineage using native canonical output',async()=>{
 for(const program of ['Plastic/Main','Plastic/ConstitutionPositive','Refold/Main','Plastic/InactiveProbes']){
  const run=await DispositionWorkbenchRun.create(program);for(let prefix=1;prefix<=2;prefix++){
   await run.advance();const checkpoint=run.checkpoint(),s=run.snapshot(),save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),trace=items(f(save,11n),'list');
   for(let i=0;i<s.timeline.length;i++){const event=s.timeline[i];if(event.stage!=='reasons')continue;const output=f(rec(trace[i],160n),13n),got=inspectDispositionCanonicalReasons(event,output);expect(got).toEqual(inspectDispositionReasons(event));
    expect(inspectDispositionCanonicalReasons(event,list([]))).toEqual(inspectDispositionReasons({...event,output:'[]'}));expect(()=>inspectDispositionCanonicalReasons({...event,phase:'60'},output)).toThrow('reasons-stage');
    if(got.emitted){const values=items(output,'list'),operands=rec(values[0],1455n),fields=new Map(operands.fields);fields.set(3n,text('not rational'));expect(()=>inspectDispositionCanonicalReasons(event,list([record(operands.schema,fields),values[1]]))).toThrow('rational');fields.set(8n,list([]));expect(()=>inspectDispositionCanonicalReasons(event,list([record(operands.schema,fields),values[1]]))).toThrow('lineage');}
   }expect(run.checkpoint()).toEqual(checkpoint);
  }
 }
},600000);
