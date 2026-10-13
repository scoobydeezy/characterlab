import {it,expect} from 'vitest';
import {runSemAxesControls} from '../workbench/semAxesControls';
it('varies three explicit axes while retaining originals and distinguishing new-track correction',async()=>{
 const r=await runSemAxesControls();expect(await runSemAxesControls()).toEqual(r);expect(r.cases).toHaveLength(24);expect(r.comparisons).toHaveLength(72);
 for(const p of r.comparisons){expect(p.equal.truth).toBe(true);expect(p.equal.initial).toBe(true);expect(p.equal.classification).toBe(p.changedAxis!=='appearance');expect(p.equal.tracking).toBe(p.changedAxis!=='trackMode');expect(p.equal.recognition).toBe(p.changedAxis!=='recognitionMode');expect(p.equal.experience).toBe(p.changedAxis==='recognitionMode');}
 for(const c of r.cases){expect(c.views.classification.length).toBe(c.appearance==='no-assertion'?0:c.appearance==='discrete'?1:2);if(c.recognitionMode==='corrected'){const h=c.views.recognition.history;expect(h).toHaveLength(2);expect(h[1].revises!==null).toBe(c.trackMode==='continued');expect(h[1].track===h[0].track).toBe(c.trackMode==='continued');}if(c.recognitionMode==='unresolved')expect(c.views.recognition.candidate).toBeNull();}
});
