import {it,expect} from 'vitest';
import {affectAppraisalDecision,affectDecisionEvent} from '../workbench/affectAppraisalDecision';
import type {AffectExplanation} from '../workbench/affectExplanations';
const load=(name:string)=>import(/* @vite-ignore */ name);
const {default:fs}=await load('node:fs'),{createHash}=await load('node:crypto');
const receipt=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-language-rev1/receipt.json','utf8'));
it('links all 1331 original appraisals to their exact recorded decision without changing language',()=>{
 let count=0;for(const source of receipt.results){
  const bytes=fs.readFileSync(source.file);expect(createHash('sha256').update(bytes).digest('hex')).toBe(source.sha256);
  const cards=JSON.parse(bytes).explanations as AffectExplanation[],before=JSON.stringify(cards),linked=new Set();
  for(const appraisal of cards.filter(c=>c.kind==='Appraisal')){
   const decision=affectAppraisalDecision(cards,appraisal.provenance)!;expect(decision).not.toBeNull();expect(decision.at).toBe(appraisal.at);
   expect(JSON.parse(decision.provenance)['Reasons [3]']['Raw [2]']['Appraisal [2]']).toEqual(JSON.parse(appraisal.provenance));linked.add(decision.id);count++;
  }
  expect(linked.size).toBe(cards.filter(c=>c.kind==='Decision').length);expect(JSON.stringify(cards)).toBe(before);
 }expect(count).toBe(1331);
});
it('withholds unmatched or ambiguous payloads and joins only top-level decision emitters',()=>{
 const pair=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-browser-rev1/comparison.json','utf8'));let count=0;
 for(const snapshot of [pair.a,pair.b])for(const appraisal of snapshot.explanations.filter((c:AffectExplanation)=>c.kind==='Appraisal')){
  const decision=affectAppraisalDecision(snapshot.explanations,appraisal.provenance)!;
  const event=affectDecisionEvent(snapshot.timeline,decision);expect(event.phase).toBe('60');expect(event.stage).toBe('decision');count++;
 }
 expect(count).toBe(22);
 const cards=pair.a.explanations,appraisal=cards.find((c:AffectExplanation)=>c.kind==='Appraisal'),decision=affectAppraisalDecision(cards,appraisal.provenance)!,event=affectDecisionEvent(pair.a.timeline,decision);
 expect(affectAppraisalDecision([],appraisal.provenance)).toBeNull();
 const changed=JSON.parse(appraisal.provenance);changed['Severity [4]']='123/1';expect(affectAppraisalDecision(cards,JSON.stringify(changed))).toBeNull();
 expect(()=>affectAppraisalDecision([...cards,decision],appraisal.provenance)).toThrow('Ambiguous');
 expect(()=>affectDecisionEvent([event,event],decision)).toThrow('ambiguous');
 expect(()=>affectDecisionEvent([{...event,phase:'50'}],decision)).toThrow('absent');
 expect(()=>affectDecisionEvent([{...event,output:JSON.stringify([{record:'Wrapper',nested:JSON.parse(decision.provenance)}])}],decision)).toThrow('absent');
});
