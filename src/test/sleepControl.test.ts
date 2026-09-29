import {beforeAll,describe,it,expect} from 'vitest';
import {sleepCase,type SleepScenario} from './sleepControlFixtures';
import {sleepSummary} from './sleepControlAnalysis';
import {runtime} from './identityPublicFixtures';
import type {IntegrationLaw} from '../campaign3/biologicalIntegration';
import {canonicalEncode,list} from '../substrate/canonicalEncoding';
describe('sleep-control-experiment/0.1-candidate: native causal discrimination',()=>{
 const results=new Map<string,{rows:ReturnType<typeof sleepSummary>;safe:Uint8Array}>();
 const get=(s:SleepScenario,l:IntegrationLaw='Full')=>results.get(s+'/'+l)!;
 beforeAll(async()=>{
  for(const law of ['Full','NoControl'] as const)for(const scenario of (law==='Full'?['Rested','Deprived','Recovered','BlindRested','BlindDeprived','FalseRested','FailedExecution','Unmaintained']:['Rested','Deprived','Recovered']) as SleepScenario[]){
   const {runtime:run}=await runtime(sleepCase(scenario,law));while(await run.settle()){}
   const outputs=run.snapshot().outputs,safe=canonicalEncode(list(outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1409n,1410n,1411n,1412n,1413n,1414n,1415n,1416n,1417n,1419n,1420n,1429n,1430n,1431n,1432n,1433n,1434n,1437n,1438n,1442n].includes(v.schema.typeId))));
   results.set(scenario+'/'+law,{rows:sleepSummary(outputs),safe});
  }
 },240000);
 it('earns nonzero common identity from an actual contested choice before perturbation',()=>{
  const r=get('Rested').rows[1];expect(r.status).toBe(1);expect(r.qualificationCount).toBe(1);expect(r.identity).not.toBe('0/1');expect(r.choice.probabilities).toEqual([{name:'drug',probability:'1/2'},{name:'withhold',probability:'1/2'}]);
  for(const x of results.values())expect(x.rows[1].journalHex).toBe(r.journalHex);
 });
 it('the admitted reward training contains no sleep-relief or harm evidence',()=>{
  const b=get('Deprived').rows[7].appraisal.beliefs.drug;expect(b.pleasure).toBe(600);expect(b.sleep).toBe(0);expect(b.harm).toBe(0);
 });
 it('genuine prior wake accumulation changes later sensed control and inhibition',()=>{
  const r=get('Rested').rows[7],d=get('Deprived').rows[7];expect(r.appraisal.before.sleepiness).toBe(100);expect(d.appraisal.before.sleepiness).toBe(600);expect([r.appraisal.control,d.appraisal.control]).toEqual([950,700]);expect([r.appraisal.inhibited,d.appraisal.inhibited]).toEqual([true,false]);expect(r.appraisal.options).toEqual(['withhold']);expect(d.appraisal.options).toEqual(['drug','withhold']);
 });
 it('recovery after decision8 changes decision9, never retroactively decision8',()=>{
  const a=get('Recovered').rows,b=get('Deprived').rows;expect(a[7].choice).toEqual(b[7].choice);expect(a[7].appraisal).toEqual(b[7].appraisal);expect(a[7].physical.transition.state.sleepDebt).toBe(0);expect(b[7].physical.transition.state.sleepDebt).toBe(600);expect(a[8].appraisal.control).toBe(950);expect(a[8].appraisal.inhibited).toBe(true);expect(a[11].appraisal.inhibited).toBe(true);
 });
 it('sleep changes distributions without guaranteeing a different sampled choice',()=>{
  const a=get('Rested').rows[7],b=get('Deprived').rows[7];expect(a.choice.probabilities).not.toEqual(b.choice.probabilities);expect(a.choice.chosen).toBe('withhold');expect(b.choice.chosen).toBe('withhold');
 });
 it('preserves nonzero identity and original journal bytes at every learning-disabled probe',()=>{
  for(const x of results.values())for(const r of x.rows.slice(2)){expect(r.status).toBe(6);expect(r.journalHex).toBe(x.rows[1].journalHex);expect(r.feedbackJournalHex).toBe(x.rows[1].journalHex);expect(r.identity).toBe(x.rows[1].identity);}
 });
 it('preserves learned reward, cue history, goals and competence across main perturbations',()=>{
  const base=get('Rested').rows;
  for(const scenario of ['Deprived','Recovered'] as const){const c=sleepCase(scenario);expect(c.config).toEqual(sleepCase('Rested').config);for(const [i,r] of get(scenario).rows.entries()){expect(r.learningHex).toBe(base[i].learningHex);expect(r.appraisal.beliefs).toEqual(base[i].appraisal.beliefs);expect(r.appraisal.habit).toEqual(base[i].appraisal.habit);expect(r.appraisal.goals).toEqual(base[i].appraisal.goals);}}
 });
 it('isolates sleep from intoxicant, stress, load and physical execution impairment',()=>{
  for(const scenario of ['Rested','Deprived','Recovered'] as const)for(const at of [8,9,12]){const c=sleepCase(scenario),r=get(scenario).rows[at-1];expect(c.frames[at-1].load).toBe(0);expect(r.appraisal.before.intoxication).toBe(0);expect(r.appraisal.before.stress).toBe(0);expect(r.appraisal.before.arousal).toBe(500);expect(r.physical.challenge).toBe(0);expect(r.physical.executed).toBe(r.choice.chosen);}
 });
 it('NoControl removes the sleep-dependent access effect while retaining sensed differences',()=>{
  for(const scenario of ['Rested','Deprived','Recovered'] as const){const r=get(scenario,'NoControl').rows[7];expect(r.appraisal.inhibited).toBe(false);expect(r.choice).toEqual(get('Rested','NoControl').rows[7].choice);}expect(get('Rested','NoControl').rows[7].appraisal.control).not.toBe(get('Deprived','NoControl').rows[7].appraisal.control);
 });
 it('hidden sleep histories with denied sensing preserve the whole safe output stream',()=>{
  expect(get('BlindRested').safe).toEqual(get('BlindDeprived').safe);expect(get('BlindDeprived').rows[7].appraisal.control).toBeNull();expect(get('BlindRested').rows[7].physical.transition.state.sleepDebt).not.toBe(get('BlindDeprived').rows[7].physical.transition.state.sleepDebt);
 });
 it('false rested sensing controls cognition despite continued physical sleep debt',()=>{
  const r=get('FalseRested').rows[7];expect(r.physical.transition.state.sleepDebt).toBe(600);expect(r.appraisal.before.sleepiness).toBe(0);expect(r.appraisal.control).toBe(1000);expect(r.appraisal.inhibited).toBe(true);
 });
 it('independent failed execution preserves choices and whole safe views in seed0 control',()=>{
  expect(get('FailedExecution').safe).toEqual(get('Recovered').safe);for(const at of [8,9,12]){expect(get('FailedExecution').rows[at-1].physical.executed).toBeNull();expect(get('Recovered').rows[at-1].physical.executed).toBe('withhold');}
 });
 it('unmaintained protection remains adopted; recovery alone does not restore maintenance',()=>{
  const r=get('Unmaintained').rows[8];expect(r.appraisal.control).toBe(950);expect(r.appraisal.goals).toEqual({protection:true,work:false,maintained:false});expect(r.appraisal.inhibited).toBe(false);expect(r.journalHex).toBe(get('Recovered').rows[8].journalHex);
 });
});
