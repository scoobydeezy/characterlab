import {it,expect} from 'vitest';
import {AFFECT_CONTRASTS,AFFECT_OBLIGATION_CONTRASTS,affectObligationPairId,compareAffect} from '../workbench/affectComparison';
import {AffectPairSession} from '../workbench/affectPairSession';
import {createAffectInspection,restoreAffectInspection} from '../workbench/affectSession';
const load=(name:string)=>import(/* @vite-ignore */ name),{default:fs}=await load('node:fs');
const original=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-appraisal-comparison-rev1/reports.json','utf8'));
const parity=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-parity-rev1/receipt.json','utf8'));
it('preserves all original eight declarations and admits exactly the original eight obligation pairs',()=>{
 expect(AFFECT_CONTRASTS.slice(0,8)).toEqual(original.map((r:any)=>r.contrast));expect(AFFECT_OBLIGATION_CONTRASTS).toHaveLength(8);
 for(let seed=0;seed<8;seed++){expect(affectObligationPairId(seed,0)).toBeNull();expect(affectObligationPairId(seed,1)).toBe(`obligation/${seed}`);const c=AFFECT_OBLIGATION_CONTRASTS[seed];expect([c.a,c.b]).toEqual([`choice-${seed}-0.1`,`choice-${seed}-10`]);}
 for(const [seed,position]of [[-1,1],[8,1],[0.5,1],[0,0.5],[0,2],[NaN,1]])expect(()=>affectObligationPairId(seed,position)).toThrow('Unsupported');
});
it('keeps fresh input/state equality and reproduces original prefixes, unequal horizons and paired restore',async()=>{
 const factory={create:createAffectInspection,restore:restoreAffectInspection},pair=await AffectPairSession.create('obligation/0',factory),start=pair.snapshot();expect(start.comparison.stateEqual).toBe(true);expect(start.comparison.outputsEqual).toBe(true);expect(start.comparison.a.modelHash).not.toBe(start.comparison.b.modelHash);
 expect(start.comparison.originals[0].orderedInputs).toBe(start.comparison.originals[1].orderedInputs);
 for(let prefix=1;prefix<=3;prefix++){await pair.advance();for(const s of [pair.snapshot().comparison.a,pair.snapshot().comparison.b]){const p=parity.results.find((r:any)=>r.id===s.program).prefixes[prefix];expect(s.saveHash).toBe(p.saveHash);expect(s.stateHash).toBe(p.stateHash);expect(s.outputsHash).toBe(p.outputsHash);}}
 const checkpoint=await pair.checkpoint(),before=pair.snapshot(),restored=await AffectPairSession.restore(checkpoint,factory);expect(restored.snapshot()).toEqual(before);await restored.advance('a');expect(restored.snapshot().comparison.aligned).toBe(false);await restored.advance('b');await pair.advance();expect(restored.snapshot()).toEqual(pair.snapshot());
 const wrong=await createAffectInspection('choice-1-10');expect(()=>compareAffect(start.comparison.a,wrong.snapshot())).toThrow('declared pair');pair.dispose();restored.dispose();
},600000);
