import {it,expect} from 'vitest';
import original from '../../docs/planning/workbench-general-cohort-rev1/model-00.json';
import {GeneralWorkbenchRun} from '../workbench/generalAdapter';
import {inspectNativeReadSources} from '../workbench/nativeReadSources';
it('preserves original General commitments and exposes the actual derived recall source separately from its delivered value',async()=>{
 const run=await GeneralWorkbenchRun.create('baseline','0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20');
 for(let p=0;p<=7;p++){const {nativeReadMetadata,...legacy}=run.snapshot();for(const key of ['modelHash','runHash','stateHash','saveHash'] as const)expect(legacy[key]).toBe(original.prefixes[p][key]);expect(nativeReadMetadata?.length).toBe(legacy.timeline.length);if(p<7)await run.advance();}
 const s=run.snapshot(),before=run.checkpoint(),report=inspectNativeReadSources(s.timeline,s.nativeReadMetadata!,'102'),read=report.reads[1];
 expect(read.kind).toBe('derived');expect(read.transformation).toContain('body-recall-evidence');expect(read.sources).toHaveLength(1);
 expect(read.deliveredValueHistory.relation).toBe('value-mismatch');expect(read.sourceHistory[0].relation).toBe('exact-value-match');expect(read.sourceHistory[0].priorMutation?.event.id).toBe('89');expect(read.sources[0].exact).not.toBe(read.exact);
 expect(run.checkpoint()).toEqual(before);
 const changed=structuredClone(s.nativeReadMetadata!);changed.find(m=>m.id==='102')!.reads[1].exact='forged';expect(()=>inspectNativeReadSources(s.timeline,changed,'102')).toThrow('value alignment');
 expect(()=>inspectNativeReadSources(s.timeline,s.nativeReadMetadata!.slice(1),'102')).toThrow('length');
 const wrongEvent=structuredClone(s.nativeReadMetadata!);wrongEvent[0].id='wrong';expect(()=>inspectNativeReadSources(s.timeline,wrongEvent,'102')).toThrow('event alignment');
 await run.advance();const later=run.snapshot();expect(inspectNativeReadSources(later.timeline,later.nativeReadMetadata!,'102')).toEqual(report);
},600000);
