import {it,expect} from 'vitest';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {inspectDispositionReasons} from '../workbench/dispositionReasonDiagnostics';
it('reads exact native operands and compiled roles without merging constitution with learned state',async()=>{
 for(const [program,constitution] of [['Plastic/Main','0/1'],['Plastic/ConstitutionPositive','1/8']]){
  const run=await DispositionWorkbenchRun.create(program);await run.advance();const view=run.snapshot(),event=view.timeline.find(e=>e.stage==='reasons')!,diagnostic=inspectDispositionReasons(event);
  expect(diagnostic.emitted).toBe(true);if(!diagnostic.emitted)throw Error('missing operands');
  expect(diagnostic.constitution).toBe(constitution);expect(diagnostic.plastic).toBe('0/1');expect(diagnostic.standing).toBe('0/1');expect(diagnostic.effective).toBe(constitution);expect(diagnostic.qualifiedEntries).toBe(0);expect(diagnostic.nuclei).toHaveLength(2);
  const native=JSON.parse(event.output)[1]['Reasons [5]']['ActiveNuclei [3]'];diagnostic.nuclei.forEach((n,i)=>{expect(n.relevance).toBe(native[i]['Relevance [3]']);expect(n.baseNet).toBe(native[i]['RoleSummary [2]']['BaseNet [1]']);expect(n.distribution).toBe(JSON.stringify(native[i]['Distribution [7]'],null,2));});
  expect(run.snapshot()).toEqual(view);
  expect(inspectDispositionReasons({...event,output:'[]'}).emitted).toBe(false);
  expect(()=>inspectDispositionReasons({...event,phase:'60'})).toThrow('reasons-stage');
  const forged=JSON.parse(event.output);forged[0]['Plastic [3]']=0.125;expect(()=>inspectDispositionReasons({...event,output:JSON.stringify(forged)})).toThrow('rational');
  const mismatched=JSON.parse(event.output);mismatched[1]['Context [2]']=null;expect(()=>inspectDispositionReasons({...event,output:JSON.stringify(mismatched)})).toThrow('lineage');
 }
},600000);
