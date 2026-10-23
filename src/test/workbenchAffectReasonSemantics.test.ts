import {it,expect} from 'vitest';
import {affectReasonSemantics} from '../workbench/affectReasonSemantics';
import type {AffectExplanation} from '../workbench/affectExplanations';
const load=(name:string)=>import(/* @vite-ignore */ name),{default:fs}=await load('node:fs'),{createHash}=await load('node:crypto');
const receipt=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-language-rev1/receipt.json','utf8'));
it('preserves original meanings, exact magnitudes and source coverage for every retained decision',()=>{
 let count=0,nuclei=0;for(const file of receipt.results){const bytes=fs.readFileSync(file.file);expect(createHash('sha256').update(bytes).digest('hex')).toBe(file.sha256);for(const card of JSON.parse(bytes).explanations.filter((c:AffectExplanation)=>c.kind==='Decision')){
 const before=JSON.stringify(card),r=affectReasonSemantics(card),ns=JSON.parse(card.provenance)['Reasons [3]']['Nuclei [3]'];expect(r.reasons.length).toBe(ns.length);
 for(const reason of r.reasons){const n=ns[reason.nucleus];expect(reason.semantic.contributions.base).toBe(n['RoleSummary [2]']['BaseNet [1]']);expect(reason.semantic.strengthBand).toBeNull();expect(reason.semantic.certaintyBand).toBeNull();expect(reason.sourceIndices.length).toBe(n['RoleSummary [2]']['CoverageResults [4]'].length);expect(card.human).toContain(reason.semantic.ground);expect(card.human).toContain(reason.semantic.option);nuclei++;}
 expect(affectReasonSemantics({...card,human:'untrusted prose',headline:'untrusted headline'})).toEqual(r);expect(JSON.stringify(card)).toBe(before);count++;}}
 expect(count).toBe(1331);expect(nuclei).toBeGreaterThan(0);
});
it('rejects misleading identity suffixes and cross-goal coverage while ignoring object key order',()=>{
 const card=JSON.parse(fs.readFileSync(receipt.results[0].file,'utf8')).explanations.find((c:AffectExplanation)=>c.kind==='Decision') as AffectExplanation;
 const d=JSON.parse(card.provenance),unknown=structuredClone(d);unknown['Reasons [3]']['Nuclei [3]'][0]['Key [1]']['CandidateKey [1]']['CharacterId [1]'].namespace='999';expect(()=>affectReasonSemantics({...card,provenance:JSON.stringify(unknown)})).toThrow('correspondence');
 const crossed=structuredClone(d),ns=crossed['Reasons [3]']['Nuclei [3]'];ns[0]['Key [1]']['TaskReferent [3]']=ns[1]['Key [1]']['TaskReferent [3]'];expect(()=>affectReasonSemantics({...card,provenance:JSON.stringify(crossed)})).toThrow('correspondence');
 const reverse=(v:any):any=>v&&typeof v==='object'?Array.isArray(v)?v.map(reverse):Object.fromEntries(Object.entries(v).reverse().map(([k,x])=>[k,reverse(x)])):v;
 expect(affectReasonSemantics({...card,provenance:JSON.stringify(reverse(d))})).toEqual(affectReasonSemantics(card));
});
