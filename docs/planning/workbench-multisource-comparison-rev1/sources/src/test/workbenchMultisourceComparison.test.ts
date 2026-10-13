import {it,expect} from 'vitest';
import {MULTISOURCE_CONTRASTS,compareMultisource} from '../workbench/multisourceComparison';
import {MultisourceWorkbenchRun} from '../workbench/multisourceAdapter';
import catalog from '../workbench/multisourceCatalog.json';
it('preserves all96 declared comparisons with explicit model, initial-state and input distinctions',()=>{
 expect(MULTISOURCE_CONTRASTS).toHaveLength(96);expect(new Set(MULTISOURCE_CONTRASTS.map(c=>c.id)).size).toBe(96);
 for(const c of MULTISOURCE_CONTRASTS){const [a,b]=[c.a,c.b].map(n=>catalog.programs.find(p=>p.name===n)!);expect(a).toBeDefined();expect(b).toBeDefined();expect(a.runSeed).toBe(b.runSeed);const [ma,mb]=[a,b].map(p=>catalog.models.find(m=>m.name===p.model)!);if(c.kind!=='model')expect(ma.modelIdentity).toBe(mb.modelIdentity);else expect(ma.modelIdentity).not.toBe(mb.modelIdentity);if(c.kind==='input')expect(a.initialState).toBe(b.initialState);else expect(a.orderedInputs).toBe(b.orderedInputs);}
});
it('keeps hidden initial state distinct and refuses unequal-prefix equality',async()=>{
 const a=await MultisourceWorkbenchRun.create('hidden-21'),b=await MultisourceWorkbenchRun.create('hidden-29');let r=compareMultisource('hidden-reserve',a.snapshot(),b.snapshot());expect(r.contrast.kind).toBe('initial-state');expect(r.changed.model).toBe(false);expect(r.stateEqual).toBe(false);await a.advance();expect(compareMultisource('hidden-reserve',a.snapshot(),b.snapshot()).outputsEqual).toBeNull();await b.advance();r=compareMultisource('hidden-reserve',a.snapshot(),b.snapshot());expect(r.outputsEqual).toBe(true);expect(r.rawRecordsEqual).toBe(true);expect(r.rawRecords[0]).not.toHaveLength(0);expect(()=>compareMultisource('hidden-reserve',b.snapshot(),a.snapshot())).toThrow('ordered pair');
},600000);
