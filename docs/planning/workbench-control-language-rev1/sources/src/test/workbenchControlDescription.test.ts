import {it,expect} from 'vitest';
import {ControlWorkbenchRun} from '../workbench/controlAdapter';
import {describeControlObserver as describe} from '../workbench/controlDescription';
it('preserves hidden-reward invariance and historical descriptions while excluding mechanical draws',async()=>{
 const a=await ControlWorkbenchRun.create(),b=await ControlWorkbenchRun.create('1/1/hiddenReward');let previous=describe(a.snapshot().observerHex).entries;
 for(let i=0;i<6;i++){await a.advance();await b.advance();const report=describe(a.snapshot().observerHex);expect(report).toEqual(describe(b.snapshot().observerHex));expect(report.entries.slice(0,previous.length)).toEqual(previous);expect(report.entries.every(e=>!e.exact.includes('Draws [6]')&&!e.exact.includes('RandomAddress')&&!e.exact.includes('ControlOutcome#1024'))).toBe(true);previous=report.entries;}
 const at5=previous.filter(e=>e.at==='5');expect(at5.find(e=>e.kind==='Control evaluation')?.human).toContain('inhibition applied: false');expect(at5.find(e=>e.kind==='Control evaluation')?.human).toContain('maintained neutral card: true');
},600000);
it('labels effective-access and erasure controls without claiming maintenance or unlearning',async()=>{
 const lost=await ControlWorkbenchRun.create('4/1/lost'),erase=await ControlWorkbenchRun.create('5/1/main');for(let i=0;i<5;i++)await lost.advance();for(let i=0;i<4;i++)await erase.advance();
 const access=describe(lost.snapshot().observerHex).entries.find(e=>e.at==='5'&&e.kind==='Control evaluation')!;expect(access.human).toContain('effective goal access reported by this candidate: true');expect(access.human).toContain('not proof of actual workspace maintenance');
 const history=describe(erase.snapshot().observerHex).entries.find(e=>e.at==='4'&&e.kind==='History update')!;expect(history.human).toContain('3 before and 0 after');expect(history.human).toContain('not successful resistance');
 expect(()=>describe('00')).toThrow();
},600000);
