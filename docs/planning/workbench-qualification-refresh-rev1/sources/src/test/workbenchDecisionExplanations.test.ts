import {expect,it} from 'vitest';
import {DecisionWorkbenchRun} from '../workbench/decisionAdapter';
import {explainDecisionCharacter} from '../workbench/decisionExplanations';
it('keeps selected intent separate from observed completion and missing current evidence',async()=>{
 const run=await DecisionWorkbenchRun.create('1/denied');await run.advance();const s=run.snapshot(),language=explainDecisionCharacter(s.characterView);
 expect(language.cards.some(c=>c.kind==='Current evidence unavailable'&&c.text.includes('not an observed zero'))).toBe(true);
 const selected=language.cards.find(c=>c.kind==='Selected intent and factors')!;expect(selected.text).toContain('do not establish epistemic certainty');expect(selected.factors.length).toBeGreaterThan(0);expect(language.cards.some(c=>c.kind==='Consequence observation')).toBe(true);expect(run.snapshot()).toEqual(s);
 expect(explainDecisionCharacter(s.characterView)).toEqual(language);
 for(const c of language.cards)expect(JSON.parse(c.exact)).toEqual(JSON.parse(s.characterView)[c.sourceIndex]);
 expect(()=>explainDecisionCharacter(s.researchOutputs)).toThrow('Private');
 const expression=JSON.parse(selected.exact);expect(()=>explainDecisionCharacter(JSON.stringify([{...expression,'Mode [10]':'9'}]))).toThrow('mode');expect(()=>explainDecisionCharacter(JSON.stringify([{...expression,record:'DecisionSafeExpression#944/2'}]))).toThrow('version');
},600000);
it('does not recover hidden execution permission from an unobserved consequence',async()=>{
 const views=[];for(const id of ['1/invisibleAllowed','1/invisibleBlocked']){const run=await DecisionWorkbenchRun.create(id);while(await run.advance()){}views.push(run.snapshot());}
 expect(views[0].stateHash).not.toBeUndefined();expect(views[0].outputsHash).not.toBe(views[1].outputsHash);
 expect(explainDecisionCharacter(views[0].characterView)).toEqual(explainDecisionCharacter(views[1].characterView));expect(explainDecisionCharacter(views[0].characterView).cards.some(c=>c.kind==='Consequence observation')).toBe(false);
},600000);
