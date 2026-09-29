import {beforeAll,it,expect} from 'vitest';
import {intoxicationCase,type IntoxicationScenario} from './intoxicationControlFixtures';
import {sleepSummary} from './sleepControlAnalysis';
import {runtime} from './identityPublicFixtures';
import {canonicalEncode,list} from '../substrate/canonicalEncoding';
import type {IntegrationLaw} from '../campaign3/biologicalIntegration';
const results=new Map<string,{rows:ReturnType<typeof sleepSummary>;safe:Uint8Array}>();
const get=(s:IntoxicationScenario,l:IntegrationLaw='Full',seed=0)=>results.get(s+'/'+l+'/'+seed)!;
beforeAll(async()=>{
 const roster:{s:IntoxicationScenario;l:IntegrationLaw;seed:number}[]=['Sober','Slow','Fast','BlindSober','BlindSlow','FalseSober','Interference'].map(s=>({s:s as IntoxicationScenario,l:'Full',seed:0}));
 for(const s of ['Sober','Slow','Fast'] as const)roster.push({s,l:'NoControl',seed:0});
 for(const s of ['Slow','HighCompetence'] as const)roster.push({s,l:'Full',seed:1});
 for(const {s,l,seed}of roster){const {runtime:run}=await runtime(intoxicationCase(s,l,seed));while(await run.settle()){}const outputs=run.snapshot().outputs;results.set(s+'/'+l+'/'+seed,{rows:sleepSummary(outputs),safe:canonicalEncode(list(outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1409n,1410n,1411n,1412n,1413n,1414n,1415n,1416n,1417n,1419n,1420n,1429n,1430n,1431n,1432n,1433n,1434n,1437n,1438n,1442n].includes(v.schema.typeId))))});}
},240000);
it('compares identical delivered exposure across constitutions differing only in clearance',()=>{
 const a=intoxicationCase('Slow'),b=intoxicationCase('Fast');expect(a.frames).toEqual(b.frames);const c=structuredClone(b.config);c.constitution.clearance=100;expect(c).toEqual(a.config);expect(a.config.competence).toBe(300);expect(a.frames[6].external.intoxicant).toBe(800);
});
it('acquires real common identity and reward history before exposure',()=>{
 const r=get('Sober').rows[1];expect(r.status).toBe(1);expect(r.identity).not.toBe('0/1');expect(r.qualificationCount).toBe(1);
 for(const s of ['Slow','Fast'] as const){expect(get(s).rows[1].journalHex).toBe(r.journalHex);expect(get(s).rows[1].learningHex).toBe(r.learningHex);}
});
it('exposure at consequence7 cannot retroactively alter decision7',()=>{
 const a=get('Sober').rows[6],b=get('Slow').rows[6];expect(a.appraisal).toEqual(b.appraisal);expect(a.choice).toEqual(b.choice);expect(a.physical.challenge).toBe(0);expect(b.physical.challenge).toBe(0);expect(b.physical.transition.state.burden).toBe(800);
});
it('clearance changes next sensed control and physical execution challenge separately',()=>{
 const a=get('Slow').rows[7],b=get('Fast').rows[7];expect([a.appraisal.before.intoxication,b.appraisal.before.intoxication]).toEqual([700,400]);expect([a.appraisal.control,b.appraisal.control]).toEqual([650,800]);expect([a.physical.challenge,b.physical.challenge]).toEqual([350,200]);expect([a.appraisal.inhibited,b.appraisal.inhibited]).toEqual([false,true]);expect(a.physical.executed).toBeNull();expect(b.physical.executed).toBe(b.choice.chosen);
});
it('execution recovers before inhibition in the slow-clearance trajectory',()=>{
 const r=get('Slow').rows;expect(r[8].physical.challenge).toBe(300);expect(r[8].physical.executed).toBeNull();expect(r[9].physical.challenge).toBe(250);expect(r[9].physical.executed).toBe(r[9].choice.chosen);expect(r[9].appraisal.inhibited).toBe(false);expect(r[10].appraisal.control).toBe(800);expect(r[10].appraisal.inhibited).toBe(true);
});
it('does not convert transient burden into changed acquired history or adopted goal',()=>{
 for(const {rows}of results.values())for(const r of rows.slice(2)){expect(r.status).toBe(6);expect(r.journalHex).toBe(rows[1].journalHex);expect(r.feedbackJournalHex).toBe(rows[1].journalHex);expect(r.learningHex).toBe(rows[1].learningHex);expect(r.appraisal.goals).toEqual({protection:true,work:false,maintained:true});}
});
it('holds sleep, stress, arousal and later load fixed',()=>{
 for(const s of ['Sober','Slow','Fast'] as const)for(const r of get(s).rows.slice(2)){expect(r.appraisal.before.sleepiness).toBe(0);expect(r.appraisal.before.stress).toBe(0);expect(r.appraisal.before.arousal).toBe(500);expect(intoxicationCase(s).frames[r.at-1].load).toBe(0);expect(r.appraisal.beliefs.drug.harm).toBe(0);}
});
it('NoControl removes access differences but preserves different execution outcomes',()=>{
 const slow=get('Slow','NoControl').rows[7],fast=get('Fast','NoControl').rows[7];expect(slow.choice).toEqual(fast.choice);expect(slow.appraisal.inhibited).toBe(false);expect(fast.appraisal.inhibited).toBe(false);expect(slow.physical.executed).toBeNull();expect(fast.physical.executed).toBe(fast.choice.chosen);
});
it('higher competence changes execution without altering first exposed appraisal or intent',()=>{
 const low=get('Slow','Full',1).rows[7],high=get('HighCompetence','Full',1).rows[7];expect(low.appraisal).toEqual(high.appraisal);expect(low.choice).toEqual(high.choice);expect(low.choice.chosen).toBe('drug');expect(low.physical.executed).toBeNull();expect(high.physical.executed).toBe('drug');
});
it('masked burden and downstream reward sensations preserve whole safe streams',()=>{
 expect(get('BlindSlow').safe).toEqual(get('BlindSober').safe);expect(get('BlindSlow').rows[7].appraisal.control).toBeNull();expect(get('BlindSlow').rows[7].physical.executed).toBeNull();expect(get('BlindSober').rows[7].physical.executed).not.toBeNull();
});
it('false sober sensing can preserve inhibition while hidden burden prevents execution',()=>{
 const r=get('FalseSober').rows[7];expect(r.appraisal.before.intoxication).toBe(0);expect(r.appraisal.control).toBe(1000);expect(r.appraisal.inhibited).toBe(true);expect(r.choice.chosen).toBe('withhold');expect(r.physical.challenge).toBe(350);expect(r.physical.executed).toBeNull();
});
it('independent interference does not imply intoxication or weakened inhibition',()=>{
 expect(get('Interference').safe).toEqual(get('Sober').safe);const r=get('Interference').rows[7];expect(r.physical.challenge).toBe(0);expect(r.appraisal.inhibited).toBe(true);expect(r.physical.executed).toBeNull();
});
