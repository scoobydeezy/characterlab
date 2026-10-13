import {expect,it} from 'vitest';
import catalog from '../workbench/workCatalog.json';
import {WORK_CONTRASTS,compareWork} from '../workbench/workComparison';
import {WorkWorkbenchRun} from '../workbench/workAdapter';
it('declares119 exact ordered comparisons with identical seeds and model-only calendars',()=>{
 expect(WORK_CONTRASTS).toHaveLength(119);expect(new Set(WORK_CONTRASTS.map(c=>c.id)).size).toBe(119);
 for(const c of WORK_CONTRASTS){const a=catalog.programs.find(r=>r.name===c.a)!,b=catalog.programs.find(r=>r.name===c.b)!;expect(a).toBeDefined();expect(b).toBeDefined();expect(a.seed).toBe(b.seed);if(c.kind==='model'){expect(a.orderedInputs).toBe(b.orderedInputs);const ma=catalog.models.find(m=>m.name===a.model)!,mb=catalog.models.find(m=>m.name===b.model)!;expect(Object.keys(ma.settings).filter(k=>ma.settings[k as keyof typeof ma.settings]!==mb.settings[k as keyof typeof mb.settings])).toHaveLength(1);}else expect(a.model).toBe(b.model);}
});
it('withholds unequal horizons and distinguishes output equality from cache-state equality',async()=>{
 const a=await WorkWorkbenchRun.create('c1-k1-s1'),b=await WorkWorkbenchRun.create('c2-k1-s1');await a.advance();expect(compareWork('candidate/2/1/1',a.snapshot(),b.snapshot()).outputsEqual).toBeNull();await b.advance();const r=compareWork('candidate/2/1/1',a.snapshot(),b.snapshot());expect(r.outputsEqual).toBe(true);expect(r.stateEqual).toBe(false);expect(r.saveEqual).toBe(false);expect(()=>compareWork('candidate/2/1/1',b.snapshot(),a.snapshot())).toThrow('ordered pair');
},600000);
