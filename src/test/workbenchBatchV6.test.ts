import {expect,it} from 'vitest';
import {BatchSession} from '../workbench/batchSession';
import {createBatchRun,type BatchJob} from '../workbench/experimentRegistry';
import {batchReport} from '../workbench/BatchWorkbench';
import catalog from '../workbench/batchCatalogV6.json';
import old from '../workbench/batchCatalogV5.json';
import skill from '../workbench/skillCatalog.json';
import habit from '../workbench/habitCatalog.json';
const jobs=['skill/physical-0','habit/candidate-1-law-1'].map(id=>catalog.jobs.find(j=>j.id===id)! as BatchJob);
it('runs SKILL/HABIT through shared execution and retains exact replay originals',async()=>{
 expect(catalog.jobs.slice(0,766)).toEqual(old.jobs);
 const batch=new BatchSession(jobs);await batch.run();const s=batch.snapshot();expect(s.status).toBe('complete');expect(s.results.every(r=>r.prefixes.every(p=>p.matchesFrozenSave))).toBe(true);
 const report=batchReport(s);for(const [n,c] of [['skill',skill],['habit',habit]] as const){expect(report.originals[n].programs).toEqual(c.programs.filter(r=>jobs.some(j=>j.experimentId===n&&j.name===r.name)));expect(report.originals[n].models).toEqual(c.models.filter(m=>report.originals[n].programs.some(r=>r.model===m.name)));expect(report.originals[n].runSeed).toBe('00'.repeat(32));}
},600000);
it('rejects changed SKILL/HABIT declarations before execution',async()=>{
 for(const job of jobs)for(const change of [{seed:1},{law:'invented'},{name:'invented'},{experimentId:'work' as const},{expectedSaveHashes:job.expectedSaveHashes.map(()=> '0'.repeat(64))}])await expect(createBatchRun({...job,...change})).rejects.toThrow('frozen');
});

it('retains the empty HABIT control as an initial terminal prefix',async()=>{const job=catalog.jobs.find(j=>j.id==='habit/empty')! as BatchJob;const batch=new BatchSession([job]);await batch.run();const s=batch.snapshot();expect(s.status).toBe('complete');expect(s.results[0].prefixes).toHaveLength(1);expect(s.results[0].prefixes[0]).toMatchObject({prefix:0,total:0,complete:true,matchesFrozenSave:true});});
