import {it,expect} from 'vitest';
import {FatigueWorkbenchRun} from '../workbench/fatigueAdapter';
import {FATIGUE_CONTRASTS,compareFatigue} from '../workbench/fatigueComparison';
import catalog from '../workbench/fatigueCatalog.json';
it('covers every original case and identical-input single-setting model pair',()=>{
 const covered=new Set(FATIGUE_CONTRASTS.flatMap(c=>[c.a,c.b]));expect(catalog.programs.every(p=>covered.has(p.id))).toBe(true);expect(new Set(FATIGUE_CONTRASTS.map(c=>c.id)).size).toBe(FATIGUE_CONTRASTS.length);
 for(const a of catalog.programs)for(const b of catalog.programs){if(a.id===b.id||a.orderedInputs!==b.orderedInputs||Number(a.candidate!==b.candidate)+Number(a.law!==b.law)!==1)continue;expect(FATIGUE_CONTRASTS.some(c=>c.kind==='model'&&((c.a===a.id&&c.b===b.id)||(c.a===b.id&&c.b===a.id)))).toBe(true);}
});
it('preserves equal evidence across misleading fatigue while withholding unaligned claims',async()=>{
 const a=await FatigueWorkbenchRun.create(),b=await FatigueWorkbenchRun.create('1/1/falseFatigue');for(let n=0;n<5;n++){await a.advance();await b.advance();}
 const report=await compareFatigue('input/falseFatigue',a.snapshot(),b.snapshot());expect(report.observerEqual).toBe(true);expect(report.outputsEqual).toBe(true);expect(report.saveEqual).toBe(false);expect(report.inputDifferences.length).toBeGreaterThan(0);
 await a.advance();const unaligned=await compareFatigue('input/falseFatigue',a.snapshot(),b.snapshot());expect(unaligned.aligned).toBe(false);expect(unaligned.observerEqual).toBeNull();expect(unaligned.fields).toEqual([]);
 await expect(compareFatigue('input/falseFatigue',b.snapshot(),a.snapshot())).rejects.toThrow('ordered pair');await expect(compareFatigue('input/falseFatigue',{...a.snapshot(),runHash:'00'.repeat(32)},b.snapshot())).rejects.toThrow('identity');
},600000);
it('keeps motor-only visible performance differences distinct from identical preceding intent',async()=>{
 const a=await FatigueWorkbenchRun.create('1/1/motorChallenge'),b=await FatigueWorkbenchRun.create('3/1/motorChallenge');for(let n=0;n<4;n++){await a.advance();await b.advance();}
 const spec=FATIGUE_CONTRASTS.find(c=>c.a===a.snapshot().program&&c.b===b.snapshot().program)!;expect(spec.kind).toBe('model');const report=await compareFatigue(spec.id,a.snapshot(),b.snapshot());expect(report.observerEqual).toBe(false);expect(report.changedSettings).toEqual(['candidate']);expect(report.inputDifferences).toEqual([]);
 const intents=(r:FatigueWorkbenchRun)=>(JSON.parse(r.snapshot().observerExact) as {record:string}[]).filter(v=>v.record==='FatigueIntent#1344/1');expect(intents(a).length).toBe(4);expect(intents(a)).toEqual(intents(b));
},600000);
