import {expect,it} from 'vitest';
import {createAffectInspection,restoreAffectInspection} from '../workbench/affectSession';
import {AFFECT_CONTRASTS,AFFECT_OPTIONS,compareAffect} from '../workbench/affectComparison';
it('routes every declared control and preserves model/input distinctions',async()=>{
 expect(AFFECT_OPTIONS).toHaveLength(105);expect(new Set(AFFECT_OPTIONS).size).toBe(105);expect(AFFECT_CONTRASTS).toHaveLength(8);
 for(const c of AFFECT_CONTRASTS){const a=await createAffectInspection(c.a),b=await createAffectInspection(c.b),report=compareAffect(a.snapshot(),b.snapshot());expect(report.aligned).toBe(true);expect(report.contrast.id).toBe(c.id);expect(report.outputsEqual).toBe(true);expect(report.stateEqual).toBe(true);expect(report.models[0].modelIdentity===report.models[1].modelIdentity).toBe(c.kind==='input');expect(compareAffect(b.snapshot(),a.snapshot()).contrast).toEqual(c);}
 const a=await createAffectInspection('interior/candidate-3-feedback-true');await a.advance();const restored=await restoreAffectInspection(a.checkpoint());expect(restored.checkpoint()).toEqual(a.checkpoint());
},600000);
