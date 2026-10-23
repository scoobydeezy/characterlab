import {it,expect} from 'vitest';
import {affectReasonSources} from '../workbench/affectReasonSources';
import type {AffectExplanation} from '../workbench/affectExplanations';
const load=(name:string)=>import(/* @vite-ignore */ name),{default:fs}=await load('node:fs'),{createHash}=await load('node:crypto');
const receipt=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-language-rev1/receipt.json','utf8'));
it('accounts for every raw signal and recorded coverage across all1331 retained decisions',()=>{
 let decisions=0,sources=0,coverage=0;for(const file of receipt.results){const bytes=fs.readFileSync(file.file);expect(createHash('sha256').update(bytes).digest('hex')).toBe(file.sha256);const cards=JSON.parse(bytes).explanations as AffectExplanation[];
 for(const card of cards.filter(c=>c.kind==='Decision')){const before=JSON.stringify(card),r=affectReasonSources(card),d=JSON.parse(card.provenance),raw=d['Reasons [3]']['Raw [2]']['Signals [3]'],ns=d['Reasons [3]']['Nuclei [3]'];expect(r.rows.length).toBe(raw.length);expect(r.nuclei.length).toBe(ns.length);
 for(const row of r.rows){expect(row.strength).toBe(raw[row.index]['SignedStrength [2]']);expect(row.basis).toEqual(raw[row.index]['EvidenceBasis [3]']);for(const c of row.coverage){const original=ns[c.nucleus]['RoleSummary [2]']['CoverageResults [4]'].find((v:any)=>JSON.stringify(v['SourceKey [1]'])===JSON.stringify(raw[row.index]['Key [1]']));expect(c.effective).toBe(original['EffectiveMagnitude [5]']);coverage++;}sources++;}
 expect(r.rows.reduce((n,x)=>n+x.coverage.length,0)).toBe(ns.reduce((n:number,x:any)=>n+x['RoleSummary [2]']['CoverageResults [4]'].length,0));expect(JSON.stringify(card)).toBe(before);decisions++;}
 }expect(decisions).toBe(1331);expect(sources).toBeGreaterThan(0);expect(coverage).toBeGreaterThan(0);
});
it('withholds broken lineage, duplicate sources and corrupted arithmetic; retains uncovered sources',()=>{
 const c=JSON.parse(fs.readFileSync(receipt.results[0].file,'utf8')).explanations.find((v:AffectExplanation)=>v.kind==='Decision') as AffectExplanation;
 const mutate=(fn:(d:any)=>void)=>{const d=JSON.parse(c.provenance);fn(d);return {...c,provenance:JSON.stringify(d)};};
 expect(()=>affectReasonSources({...c,renderer:'unknown'})).toThrow('Unsupported');
 expect(()=>affectReasonSources(mutate(d=>d['Reasons [3]']['Raw [2]']['Signals [3]'].push(d['Reasons [3]']['Raw [2]']['Signals [3]'][0])))).toThrow('Duplicate');
 expect(()=>affectReasonSources(mutate(d=>d['Reasons [3]']['Nuclei [3]'][0]['RoleSummary [2]']['CoverageResults [4]'][0]['EffectiveMagnitude [5]']='999/1')))).toThrow('arithmetic');
 expect(()=>affectReasonSources(mutate(d=>d['Reasons [3]']['Raw [2]']['Signals [3]']=[]))).toThrow('coverage source');
 const uncovered=affectReasonSources(mutate(d=>d['Reasons [3]']['Nuclei [3]']=[]));expect(uncovered.uncovered.length).toBe(uncovered.rows.length);
});
