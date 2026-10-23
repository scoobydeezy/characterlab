import {it,expect} from 'vitest';
import {DecisionWorkbenchRun} from '../workbench/decisionAdapter';
import {decisionPlayerPresentations,explainDecisionPlayer} from '../workbench/decisionPlayerPresentation';
it('renders only native player records across all six laws and three regimes without changing native execution',async()=>{
 let presented=0,empty=0;for(const law of [1,2,3,4,5,6])for(const regime of [1,2,3]){const run=await DecisionWorkbenchRun.create(`${law}/r${regime}-s0-allowed`);expect(decisionPlayerPresentations(run.snapshot().researchOutputs)).toEqual([]);await run.advance();const s=run.snapshot(),before=JSON.stringify(s),raw=JSON.parse(s.researchOutputs),expected=raw.map((v:any,index:number)=>({v,index})).filter((x:any)=>x.v.record==='DecisionPlayerDisplay#949/1'),reports=decisionPlayerPresentations(s.researchOutputs);expect(reports.length).toBe(expected.length);for(const [i,r] of reports.entries()){expect(r.sourceIndex).toBe(expected[i].index);expect(r.report.reasons.length).toBe(expected[i].v['Faces [2]'].length);expect(r.report.audience).toBe('player');expect(JSON.stringify(r.report)).not.toMatch(/RandomAddress|CognitiveRandomDraw|EffectiveKey|DecisionWorldOutcome/);presented++;if(!r.report.reasons.length)empty++;}expect(JSON.stringify(run.snapshot())).toBe(before);}expect(presented).toBeGreaterThan(0);expect(empty).toBeGreaterThan(0);
},600000);
it('withholds poisoned presentation fields and never promotes nested or non-player records',async()=>{
 const run=await DecisionWorkbenchRun.create('1/r3-s0-allowed');await run.advance();const raw=JSON.parse(run.snapshot().researchOutputs),display=raw.find((v:any)=>v.record==='DecisionPlayerDisplay#949/1');expect(display).toBeDefined();
 expect(()=>explainDecisionPlayer({...display,privateWorld:true})).toThrow('fields');const poison=structuredClone(display);poison['Faces [2]'][0]['RandomWord [7]']='secret';expect(()=>explainDecisionPlayer(poison)).toThrow('fields');
 expect(decisionPlayerPresentations(JSON.stringify([{record:'Wrapper',nested:display}]))).toEqual([]);expect(()=>explainDecisionPlayer(raw.find((v:any)=>v.record==='DecisionResolution#935/1')??{})).toThrow();
 const broken=structuredClone(display);broken['Faces [2]'][0]['Contribution [6]']='999';expect(()=>explainDecisionPlayer(broken)).toThrow('arithmetic');
 const other=structuredClone(display);other['Chosen [1]']['CharacterId [1]'].namespace='999';expect(()=>explainDecisionPlayer(other)).toThrow('option');
},600000);
