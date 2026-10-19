import {it,expect} from 'vitest';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {participationReport} from '../workbench/participation';
it('links immutable constitutional reads to native events and preserves Refold ownership',async()=>{
 for(const program of ['Plastic/Main','Refold/Main']){
  const run=await DispositionWorkbenchRun.create(program);await run.advance();const view=run.snapshot(),report=participationReport(view,view.timeline,view.fields);
  const constitution=report.rows.find(r=>r.root==='1457')!;expect(constitution.reads).toBe(1);expect(constitution.mutations).toBe(0);expect(constitution.changes).toBe(0);expect(constitution.presentAtRevision).toBe(true);
  expect(constitution.events).toHaveLength(1);const reason=view.timeline.find(e=>e.id===constitution.events[0].id)!;expect(reason.phase).toBe('52');expect(reason.reads.some(r=>r.path===constitution.path)).toBe(true);
  const plastic=report.rows.find(r=>r.root==='1458');expect(!!plastic).toBe(program==='Plastic/Main');
  if(plastic){expect(plastic.reads).toBe(2);expect(plastic.mutations).toBe(1);}
  const execution=report.rows.find(r=>r.root==='1441')!;expect(execution.reads).toBe(1);expect(execution.mutations).toBe(1);
  expect(report.identity.saveHash).toBe(view.saveHash);expect(run.snapshot()).toEqual(view);
 }
},600000);
