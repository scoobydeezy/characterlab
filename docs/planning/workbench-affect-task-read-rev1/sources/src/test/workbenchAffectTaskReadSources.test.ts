import {it,expect} from 'vitest';
import {affectTaskReadSources} from '../workbench/affectTaskReadSources';
import {affectRawReasonEvent} from '../workbench/affectRawReasonEvent';
import type {AffectExplanation} from '../workbench/affectExplanations';
const load=(name:string)=>import(/* @vite-ignore */ name),{default:fs}=await load('node:fs'),read=(p:string)=>JSON.parse(fs.readFileSync(p,'utf8'));
const pair=read('docs/planning/workbench-affect-obligation-control-rev1/browser-oracle-3.json');
it('maps every source from28 original native decisions to the correct complete task-key read',()=>{
 const old=read('docs/planning/workbench-affect-browser-rev1/comparison.json'),language=read('docs/planning/workbench-affect-language-rev1/receipt.json');for(const s of [old.a,old.b])s.explanations=read(language.results.find((r:any)=>r.program===s.program).file).explanations;
 let count=0,rows=0;for(const s of [old.a,old.b,pair.a,pair.b]){const before=JSON.stringify(s);for(const card of s.explanations.filter((c:AffectExplanation)=>c.kind==='Decision')){const report=affectTaskReadSources(s.timeline,card),event=affectRawReasonEvent(s.timeline,card);for(const row of report.rows){expect(row.status).toBe('recorded-read');const read=event.reads[row.readIndex!],path=JSON.parse(read.label);expect(path['RootStateTypeId [1]']).toBe('373');expect(path['FieldId [2]']).toBe('1');expect(path['Selectors [3]'][0]['CanonicalMapKey [1]']).toEqual(row.taskKey);expect(row.exact).toBe(read.exact);expect(row.path).toBe(read.path);rows++;}count++;}expect(JSON.stringify(s)).toBe(before);}expect(count).toBe(28);expect(rows).toBeGreaterThan(0);
});
it('does not join equal values at wrong paths, infer missing reads or accept duplicate paths',()=>{
 const card=pair.a.explanations.find((c:AffectExplanation)=>c.kind==='Decision'),event=affectRawReasonEvent(pair.a.timeline,card),alter=(reads:any[])=>[{...event,reads}];
 expect(affectTaskReadSources(alter([]),card).rows.every(r=>r.status==='no-recorded-read'&&r.exact===null)).toBe(true);
 const wrong=event.reads.map((r:any)=>({...r,path:'wrong',label:r.label}));expect(affectTaskReadSources(alter(wrong),card).rows.every(r=>r.readIndex===null)).toBe(true);
 expect(()=>affectTaskReadSources(alter([...event.reads,event.reads[0]]),card)).toThrow('Ambiguous');
 const changed=event.reads.map((r:any)=>({...r,exact:'Absent'}));expect(affectTaskReadSources(alter(changed),card).rows.every(r=>r.status==='recorded-read'&&r.exact==='Absent')).toBe(true);
});
