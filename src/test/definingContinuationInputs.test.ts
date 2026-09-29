import {describe,it,expect} from 'vitest';
import receipt from '../../docs/planning/DEFINING_MEMORY_TRAINING_REV1.json';
import {definingMeaningCases,meaningTraining,runDefiningMeaning} from '../campaign3/definingMeaning';
import {admitDefiningContinuationProgram as admit,definingContinuationCalendar as calendar,definingContinuationSpec as spec,definingInterpretationInputs,definingContinuationProgramBytes as bytes,definingAdmitsInheritedEvent as inherits,type DefiningContinuationProgram} from '../campaign3/definingContinuationProgram';
import {initialDefiningInterpretation as initial,adoptDefiningInterpretation as adopt,receiveDefiningReport as receive,readDefiningInterpretation as read,assessDefiningHistory as historical,assessDefiningCurrent as current} from '../campaign3/definingInterpretationOwner';
import {projectGoalQualification as project} from '../campaign3/goalOutcomeQualification';
const rows=definingMeaningCases(),base=rows[0];
const unhex=(s:string)=>Uint8Array.from(s.match(/../g)!.map(x=>parseInt(x,16)));
const training=meaningTraining(unhex(receipt.snapshots[0].state),unhex(receipt.snapshots[0].outputs));
describe('defining continuation inputs and interpretation owner development',()=>{
 it('admits all68 cases with independent exact parameter/calendar commitments',()=>{
  const commitments=new Set(rows.map(row=>{const p=admit(row);expect(spec(p)).toEqual(row);expect(bytes(admit({...row}))).toEqual(bytes(p));return Array.from(bytes(p)).join(',');}));expect(commitments.size).toBe(68);
 });
 it('rejects forged tokens, extra fields, getters, inherited data and invalid domains',()=>{
  expect(()=>spec({kind:'DefiningContinuationProgram'} as DefiningContinuationProgram)).toThrow('NOT_ADMITTED');
  for(const value of [null,[],{...base,truth:30},{...base,capacity:'1'},{...base,now:5001},{...base,goal:'Training'},Object.create(base)])expect(()=>admit(value)).toThrow();
  let readGetter=false;const getter={...base};Object.defineProperty(getter,'goal',{enumerable:true,get(){readGetter=true;return 'High';}});expect(()=>admit(getter)).toThrow();expect(readGetter).toBe(false);
 });
 it('copies input and returned bytes so caller mutation cannot rewrite the program',()=>{
  const input={...base},p=admit(input),before=bytes(p);input.goal='Absent';const published=bytes(p);published.fill(0);expect(spec(p).goal).toBe(base.goal);expect(bytes(p)).toEqual(before);expect(Object.isFrozen(spec(p))).toBe(true);
 });
 it('orders terminal adoption before later appraisal and declares actual terminal use/presentation/loss work',()=>{
  for(const row of rows){const p=admit(row),events=calendar(p);expect(events[0]).toEqual({at:37n,phase:140n,stage:'adopt'});expect(events[1]).toEqual({at:38n,phase:130n,stage:'historical'});
   for(let i=1;i<events.length;i++)expect(events[i].at>events[i-1].at||events[i].at===events[i-1].at&&events[i].phase>=events[i-1].phase).toBe(true);
   expect(events.filter(e=>e.stage==='use')).toHaveLength(row.rehearsals);expect(events.find(e=>e.stage==='retain')).toEqual({at:42n,phase:140n,stage:'retain'});expect(events.at(-1)).toEqual({at:BigInt(row.now),phase:140n,stage:'final-presentations'});
  }
 });
 it('keeps inherited task/goal deadlines within the horizon while replacing old credit/retention events',()=>{
  for(const now of [50,400,4000] as const){const p=admit({...base,now});for(const stage of ['event/task-deadline','goal-deadline-owner'])expect(inherits(p,stage,100n)).toBe(now>=100);for(const stage of ['significance-opportunity','retention-original','attribution-result-delivery','goal-qualification-delivery'])expect(inherits(p,stage,38n)).toBe(false);expect(inherits(p,'world',37n)).toBe(true);expect(inherits(p,'world',38n)).toBe(false);expect(inherits(p,'goal-deadline-owner',5001n)).toBe(false);}
 });
 it('matches all68 component qualification projections with explicit native goal identity and adoption timing',()=>{
  for(const row of rows){const p=admit(row),s0=initial(p),adopted=adopt(s0,37n),reported=receive(adopted,43n),component=runDefiningMeaning(training,row);
   expect(project(historical(adopted,training.before,training.after,38n))).toEqual(project(component.view.historical));expect(project(current(reported,training.before,43n))).toEqual(project(component.view.current));
   for(const goal of read(adopted).goals){expect(goal.goal).toBe('defining-interpretation');expect(goal.adoptedAt).toBe(37n);expect(goal.activeFrom).toBe(38n);expect(goal.expiresAt).toBe(5001n);}
   expect(read(s0).adopted).toBe(false);expect(read(adopted).report.kind).toBe('NotObserved');expect(read(reported).goals).toEqual(read(adopted).goals);
  }
 });
 it('keeps hidden truth out of report/assessment and keeps missing evidence distinct from contrary evidence',()=>{
  expect(Object.keys(definingInterpretationInputs(admit(base)))).toEqual(['goal','report']);
  const results=([20,30] as const).map(worldAfter=>{const state=receive(adopt(initial(admit({...base,worldAfter})),37n),43n);return {state:read(state),current:current(state,training.before,43n)};});expect(results[0]).toEqual(results[1]);
  const contrary=receive(adopt(initial(admit({...base,report:'contrary'})),37n),43n),missing=receive(adopt(initial(admit({...base,report:'missing'})),37n),43n);
  expect(project(current(contrary,training.before,43n))).toEqual({kind:'QualificationUnavailable',reason:'IndeterminateRelation'});expect(project(current(missing,training.before,43n))).toEqual({kind:'QualificationUnavailable',reason:'AssessmentUnavailable',cause:'MissingEvidence'});
 });
 it('rejects duplicate, premature and retroactive transitions without mutating earlier owner state',()=>{
  const s0=initial(admit(base));expect(()=>adopt(s0,38n)).toThrow();expect(()=>receive(s0,43n)).toThrow();expect(()=>historical(s0,training.before,training.after,38n)).toThrow();
  const s1=adopt(s0,37n);expect(()=>adopt(s1,37n)).toThrow();expect(()=>receive(s1,42n)).toThrow();expect(()=>current(s1,training.before,43n)).toThrow();
  const s2=receive(s1,43n);expect(()=>receive(s2,43n)).toThrow();expect(()=>historical(s2,training.before,training.after,38n)).toThrow();expect(read(s1).report.kind).toBe('NotObserved');expect(read(s0).goals).toEqual([]);expect(Object.isFrozen(read(s2).goals)).toBe(true);
 });
});
