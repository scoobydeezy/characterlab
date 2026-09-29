import {beforeAll,it,expect} from 'vitest';
import {createChosenReappraisalRun,restoreChosenReappraisalRun,type Law} from '../campaign3/chosenReappraisal';
import {chosenFrames,type Scenario} from './chosenReappraisalFixtures';
type Run=Awaited<ReturnType<typeof createChosenReappraisalRun>>;
const runs=new Map<string,Run>(),get=(s:Scenario,l:Law='BenefitRelative',seed=0,p=1)=>runs.get([s,l,seed,p].join('/'))!;
async function full(s:Scenario,l:Law='BenefitRelative',seed=0,p=1){const run=await createChosenReappraisalRun(l,chosenFrames(s),seed,p);while(await run.step()){}return run;}
beforeAll(async()=>{
 for(let seed=0;seed<8;seed++)runs.set(['Balanced','BenefitRelative',seed,1].join('/'),await full('Balanced','BenefitRelative',seed));
 for(const s of ['SafetyOnly','WorkOnly','NoGoals','NoOpportunity','Interrupted','Unknown','SameInstant','EmptyCatalogue','DeniedCatalogue','AbsentCatalogue','Ineffective','Harmful','HiddenTruth','Mixed'] as Scenario[])runs.set([s,'BenefitRelative',0,1].join('/'),await full(s));
 for(const s of ['SafetyOnly','Ineffective','Harmful'] as Scenario[])for(const l of ['KnowledgeOnly','NoReappraisal'] as Law[])runs.set([s,l,0,1].join('/'),await full(s,l));
 runs.set(['SafetyOnly','BenefitRelative',0,2].join('/'),await full('SafetyOnly','BenefitRelative',0,2));
},120000);
it('balanced strategy contest uses actual inherited dice and preserves every seed result',()=>{
 const choices=Array.from({length:8},(_,seed)=>get('Balanced','BenefitRelative',seed).snapshot().rows[3]);
 for(const r of choices){expect(r.probabilities).toEqual(['1/2','1/2']);expect(r.intent).not.toBeNull();expect(r.expression).not.toBeNull();expect(r.plan).not.toBeNull();expect(r.attempt).not.toBeNull();}
 expect(new Set(choices.map(r=>r.chosen))).toEqual(new Set([0,1]));
});
it('goal-only intervention changes chosen strategy at equal beliefs',()=>{
 const a=get('SafetyOnly').snapshot().rows,b=get('WorkOnly').snapshot().rows;expect(a[3].chosen).toBe(0);expect(b[3].chosen).toBe(1);expect(a[3].knowledgeBefore).toBe(b[3].knowledgeBefore);expect(a[4].affect).toEqual(['0/1']);expect(b[4].affect).toEqual(['1/1']);
});
it('successful frame application changes only a later affect, without altering evidence',()=>{
 const r=get('SafetyOnly').snapshot().rows;expect(r[3].affect).toEqual(['1/1']);expect(r[3].frameBefore).toBeNull();expect(r[3].frameAfter).not.toBeNull();expect(r[4].affect).toEqual(['0/1']);for(const row of r.slice(2)){expect(row.knowledgeAfter).toBe(r[2].knowledgeBefore);expect(row.means).toEqual(['1/1','0/1']);}
});
it('interruption preserves intent/expression but prevents application and later relief',()=>{
 const a=get('SafetyOnly').snapshot().rows[3],b=get('Interrupted').snapshot().rows[3];for(const k of ['intent','expression','plan','attempt','resolution'] as const)expect(a[k]).toBe(b[k]);expect(b.completion).toBe(false);expect(b.frameAfter).toBeNull();expect(get('Interrupted').snapshot().rows[4].affect).toEqual(['1/1']);
});
it('NoReappraisal retains successful chosen operation but removes the frame-effect edge',()=>{
 const a=get('SafetyOnly').snapshot().rows[3],b=get('SafetyOnly','NoReappraisal').snapshot().rows[3];expect(a.resolution).toBe(b.resolution);expect(b.completion).toBe(true);expect(b.frameAfter).toBeNull();expect(get('SafetyOnly','NoReappraisal').snapshot().rows[4].affect).toEqual(['1/1']);
});
it('zero goals and unavailable opportunity produce no chosen action',()=>{for(const s of ['NoGoals','NoOpportunity'] as const){const r=get(s).snapshot().rows[3];expect(r.chosen).toBe(-1);expect(r.expression).toBeNull();expect(r.frameAfter).toBeNull();}});
it('unknown knowledge and missing/empty catalogue cannot enable a reframe',()=>{for(const s of ['Unknown','SameInstant','EmptyCatalogue','DeniedCatalogue','AbsentCatalogue'] as const){const r=get(s).snapshot().rows[3];expect(r.eligible).toBe(false);expect(r.chosen).toBe(1);expect(r.frameAfter).toBeNull();}expect(get('SameInstant').snapshot().rows[4].eligible).toBe(true);});
it('ineffective and harmful frames distinguish benefit-relative choice from mere knowledge',()=>{
 for(const s of ['Ineffective','Harmful'] as const){expect(get(s).snapshot().rows[3].chosen).toBe(-1);expect(get(s,'KnowledgeOnly').snapshot().rows[3].chosen).toBe(0);}
 expect(get('Ineffective','KnowledgeOnly').snapshot().rows[4].affect).toEqual(['1/1']);expect(get('Harmful','KnowledgeOnly').snapshot().rows[3].affect).toEqual(['0/1']);expect(get('Harmful','KnowledgeOnly').snapshot().rows[4].affect).toEqual(['1/1']);
});
it('mixed observations retain exact conditional means and graded expected benefit',()=>{const r=get('Mixed').snapshot().rows[3];expect(r.means).toEqual(['1/1','1/2']);expect(r.values).toEqual(['1/2','1/1']);});
it('two-coordinate affect projection remains separate',()=>{const r=get('SafetyOnly','BenefitRelative',0,2).snapshot().rows;expect(r[3].affect).toEqual(['1/1','1/1']);expect(r[4].affect).toEqual(['0/1','0/1']);});
it('hidden truth and unreceived versus absent catalogue preserve whole safe histories',()=>{expect(get('HiddenTruth').observerView()).toEqual(get('Balanced').observerView());expect(get('DeniedCatalogue').observerView()).toEqual(get('AbsentCatalogue').observerView());});
it('faults and concurrent reads preserve atomic component state and RNG',async()=>{
 const run=await createChosenReappraisalRun('BenefitRelative',chosenFrames());for(let i=0;i<3;i++)await run.step();const before=run.save();
 for(const fault of ['before-decision','after-decision','after-application','before-commit'] as const){await expect(run.step(fault)).rejects.toThrow('INJECTED');expect(run.save()).toEqual(before);}
 const pending=run.step();expect(()=>run.save()).toThrow('BUSY');expect(()=>run.snapshot()).toThrow('BUSY');expect(()=>run.observerView()).toThrow('BUSY');await expect(run.step()).rejects.toThrow('BUSY');await pending;
 const restored=await restoreChosenReappraisalRun('BenefitRelative',chosenFrames(),before);await restored.step();expect(restored.save()).toEqual(run.save());
});
it('all component prefixes replay and altered sources or saves reject',async()=>{
 const run=await createChosenReappraisalRun('BenefitRelative',chosenFrames('SafetyOnly'));
 for(let at=0;at<=8;at++){const save=run.save(),copy=await restoreChosenReappraisalRun('BenefitRelative',chosenFrames('SafetyOnly'),save);expect(copy.save()).toEqual(save);expect(await copy.step()).toBe(at<8);expect(await run.step()).toBe(at<8);expect(copy.save()).toEqual(run.save());}
 await expect(restoreChosenReappraisalRun('NoReappraisal',chosenFrames('SafetyOnly'),run.save())).rejects.toThrow('MISMATCH');
 const corrupted=run.save();corrupted[corrupted.length-2]^=1;await expect(restoreChosenReappraisalRun('BenefitRelative',chosenFrames('SafetyOnly'),corrupted)).rejects.toThrow();
});
