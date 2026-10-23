import {it,expect} from 'vitest';
import {compareAffectChoices} from '../workbench/affectChoiceComparison';
const load=(name:string)=>import(/* @vite-ignore */ name),{default:fs}=await load('node:fs'),{createHash}=await load('node:crypto');
const receipt=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-obligation-preflight-rev1/receipt.json','utf8'));
function cards(source:any){const bytes=fs.readFileSync(source.file);expect(createHash('sha256').update(bytes).digest('hex')).toBe(source.sha256);return JSON.parse(bytes).explanations;}
it('preserves all80 original obligation choices and first-difference witnesses across eight seeds',()=>{
 let count=0;for(const original of receipt.results){const [a,b]=original.sources.map(cards),before=JSON.stringify([a,b]),report=compareAffectChoices(a,b);expect(report.firstDifferentChoice).toBe(original.firstDifferentChoice);for(const row of report.rows){const r=original.decisions.find((d:any)=>d.at===row.at);expect(row.chosenEqual).toBe(r.chosenEqual);expect(row.a?.chosen).toEqual(r.aChosen);expect(row.b?.chosen).toEqual(r.bChosen);count++;}expect(compareAffectChoices([...a].reverse(),[...b].reverse())).toEqual(report);expect(JSON.stringify([a,b])).toBe(before);}expect(count).toBe(80);
});
it('distinguishes missing decisions from recorded no-choice and withholds ambiguous or unsupported sources',()=>{
 const a=cards(receipt.results[0].sources[0]).filter((c:any)=>c.kind==='Decision').slice(0,1),b=structuredClone(a),d=JSON.parse(b[0].provenance);delete d['Chosen [8]'];b[0].provenance=JSON.stringify(d);
 expect(compareAffectChoices(a,[]).rows[0].chosenEqual).toBeNull();expect(compareAffectChoices(a,[]).firstDifferentChoice).toBeNull();expect(compareAffectChoices(b,b).rows[0].chosenEqual).toBe(true);expect(compareAffectChoices(a,b).rows[0].chosenEqual).toBe(false);expect(()=>compareAffectChoices([...a,...a],b)).toThrow('Ambiguous');expect(()=>compareAffectChoices([{...a[0],renderer:'unsupported'}],b)).toThrow('Unsupported');
});
