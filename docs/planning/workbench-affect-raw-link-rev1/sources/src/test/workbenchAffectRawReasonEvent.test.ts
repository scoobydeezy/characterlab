import {it,expect} from 'vitest';
import {affectRawReasonEvent} from '../workbench/affectRawReasonEvent';
import type {AffectExplanation} from '../workbench/affectExplanations';
const load=(name:string)=>import(/* @vite-ignore */ name),{default:fs}=await load('node:fs');
const read=(p:string)=>JSON.parse(fs.readFileSync(p,'utf8'));
it('joins28 retained native raw emitters and their original task-state reads without mutation',()=>{
 const old=read('docs/planning/workbench-affect-browser-rev1/comparison.json'),language=read('docs/planning/workbench-affect-language-rev1/receipt.json');for(const s of [old.a,old.b])s.explanations=read(language.results.find((r:any)=>r.program===s.program).file).explanations;
 const pair=read('docs/planning/workbench-affect-obligation-control-rev1/browser-oracle-3.json');let count=0;
 for(const s of [old.a,old.b,pair.a,pair.b]){const before=JSON.stringify(s);for(const c of s.explanations.filter((c:AffectExplanation)=>c.kind==='Decision')){const e=affectRawReasonEvent(s.timeline,c);expect(e.stage).toBe('raw');expect(e.phase).toBe('51');expect(e.instant).toBe(c.at);expect(JSON.parse(e.output)).toContainEqual(JSON.parse(c.provenance)['Reasons [3]']['Raw [2]']);expect(e.reads.length).toBe(2);count++;}expect(JSON.stringify(s)).toBe(before);}expect(count).toBe(28);
});
it('rejects nested copies, wrong phases/instants, missing and duplicate emitters and altered lineage',()=>{
 const s=read('docs/planning/workbench-affect-obligation-control-rev1/browser-oracle-3.json').a,c=s.explanations.find((c:AffectExplanation)=>c.kind==='Decision'),e=affectRawReasonEvent(s.timeline,c);
 expect(()=>affectRawReasonEvent([],c)).toThrow('absent');expect(()=>affectRawReasonEvent([e,e],c)).toThrow('ambiguous');expect(()=>affectRawReasonEvent([{...e,phase:'52'}],c)).toThrow('absent');expect(()=>affectRawReasonEvent([{...e,instant:'99'}],c)).toThrow('absent');expect(()=>affectRawReasonEvent([{...e,output:JSON.stringify([{nested:JSON.parse(e.output)}])}],c)).toThrow('absent');expect(()=>affectRawReasonEvent([e],{...c,renderer:'unknown'})).toThrow('Unsupported');
 const d=JSON.parse(c.provenance);d['Reasons [3]']['Raw [2]']['Appraisal [2]']['At [2]']='99';expect(()=>affectRawReasonEvent([e],{...c,provenance:JSON.stringify(d)})).toThrow('lineage');
});
