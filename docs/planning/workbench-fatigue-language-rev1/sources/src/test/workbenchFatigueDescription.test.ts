import {it,expect} from 'vitest';
import {FatigueWorkbenchRun} from '../workbench/fatigueAdapter';
import {describeFatigueObserver as describe} from '../workbench/fatigueDescription';
it('keeps hidden conditions out of descriptions and preserves historical wording',async()=>{
 const runs=await Promise.all(['main','hiddenReward','falseFatigue','falseRecovery'].map(p=>FatigueWorkbenchRun.create('1/1/'+p)));let previous=describe(runs[0].snapshot().observerHex).entries;
 for(let i=1;i<=8;i++){
  for(const r of runs)await r.advance();const report=describe(runs[0].snapshot().observerHex);
  for(const r of runs.slice(1))expect(describe(r.snapshot().observerHex)).toEqual(report);
  expect(report.entries.slice(0,previous.length)).toEqual(previous);expect(report.entries.length).toBe(i*10);
  expect(report.entries.every(e=>!/Draws \[6\]|RandomAddress|FatigueOutcome#|FatigueAttempt#/.test(e.exact))).toBe(true);previous=report.entries;
 }
 const evaluation=(at:string)=>previous.find(e=>e.at===at&&e.kind==='Fatigue evaluation')!.human;
 expect(evaluation('1')).toContain('Known fatigue: false; retained diagnostic grade: 0');
 expect(evaluation('4')).toContain('Known fatigue: true; retained diagnostic grade: 0');
 for(const at of ['5','6','7'])expect(evaluation(at)).toContain('retained diagnostic grade: 2; cognitive impairment applied: true');
 expect(evaluation('8')).toContain('retained diagnostic grade: 0; cognitive impairment applied: false');
 expect(previous.find(e=>e.at==='6'&&e.kind==='Retained fatigue experience')!.human).toContain('Missing feedback preserves');
 expect(()=>describe('00')).toThrow();
},600000);
it('retains missing recovery and separates motor failure from cognitive impairment',async()=>{
 const missing=await FatigueWorkbenchRun.create('1/1/missingRecovery');for(let i=0;i<8;i++)await missing.advance();
 expect(describe(missing.snapshot().observerHex).entries.find(e=>e.at==='8'&&e.kind==='Fatigue evaluation')!.human).toContain('retained diagnostic grade: 2');
 const a=await FatigueWorkbenchRun.create('1/1/motorChallenge'),b=await FatigueWorkbenchRun.create('3/1/motorChallenge');
 for(let i=0;i<4;i++){await a.advance();await b.advance();}
 const aa=describe(a.snapshot().observerHex).entries.filter(e=>e.at==='4'),bb=describe(b.snapshot().observerHex).entries.filter(e=>e.at==='4');
 expect(aa.find(e=>e.kind==='Selected intent')).toEqual(bb.find(e=>e.kind==='Selected intent'));
 for(const es of [aa,bb])expect(es.find(e=>e.kind==='Fatigue evaluation')!.human).toContain('cognitive impairment applied: false');
 expect(aa.find(e=>e.kind==='Admitted outcome evidence')!.human).toContain('observed target performance: true');
 expect(bb.find(e=>e.kind==='Admitted outcome evidence')!.human).toContain('observed target performance: false');
},600000);
