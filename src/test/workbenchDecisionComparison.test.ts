import {expect,it} from 'vitest';
import {DECISION_CONTRASTS,compareDecision} from '../workbench/decisionComparison';
import {DecisionWorkbenchRun} from '../workbench/decisionAdapter';
import plan from '../../docs/planning/DECISION_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import {decodeDecision} from '../campaign3/decisionCodecs';
import {fromHex} from '../workbench/canonical';
it('retains every declared original, seed and model correspondence',()=>{
 expect(DECISION_CONTRASTS).toHaveLength(259);expect(new Set(DECISION_CONTRASTS.map(c=>c.id)).size).toBe(259);
 for(const c of DECISION_CONTRASTS){const [a,b]=[c.a,c.b].map(id=>plan.runs.find(r=>`${r.law}/${r.name}`===id)!);expect(a).toBeDefined();expect(b).toBeDefined();expect(a.seed).toBe(b.seed);if(c.kind==='model'){expect(a.modelIdentity).not.toBe(b.modelIdentity);expect(a.orderedInputs).toBe(b.orderedInputs);}else expect(a.modelIdentity).toBe(b.modelIdentity);}
});
it('withholds unequal horizons and distinguishes hidden execution from character knowledge',async()=>{
 const a=await DecisionWorkbenchRun.create('1/invisibleAllowed'),b=await DecisionWorkbenchRun.create('1/invisibleBlocked');await a.advance();let c=compareDecision('invisible/1',a.snapshot(),b.snapshot());expect(c.aligned).toBe(false);expect(c.characterEqual).toBeNull();await b.advance();c=compareDecision('invisible/1',a.snapshot(),b.snapshot());expect(c.characterEqual).toBe(true);expect(c.researchOutputsEqual).toBe(false);expect(c.historyStateEqual).toBe(true);expect(c.runIdentityEqual).toBe(false);expect(decodeDecision(fromHex(c.initialState))).toEqual({kind:'set',items:[]});expect(()=>compareDecision('invisible/1',b.snapshot(),a.snapshot())).toThrow('ordered pair');
},600000);
