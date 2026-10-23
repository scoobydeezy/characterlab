import {it,expect} from 'vitest';
import {compareAffectAppraisals} from '../workbench/affectAppraisalComparison';
import {AFFECT_CONTRASTS} from '../workbench/affectComparison';
const load=(name:string)=>import(/* @vite-ignore */ name);const {default:fs}=await load('node:fs'),{createHash}=await load('node:crypto');
const receipt=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-language-rev1/receipt.json','utf8'));
function cards(program:string){const entry=receipt.results.find((r:any)=>r.program===program);expect(entry).toBeDefined();const bytes=fs.readFileSync(entry.file);expect(createHash('sha256').update(bytes).digest('hex')).toBe(entry.sha256);return JSON.parse(bytes).explanations;}
it('compares every declared retained contrast by exact appraisal instant and original operands',()=>{
 const keys=['Likelihood [8]','Severity [4]','Vulnerability [9]','Control [10]','RawCoordinates [5]','Coordinates [6]'];
 for(const c of AFFECT_CONTRASTS){const a=cards(c.a),b=cards(c.b),original=JSON.stringify([a,b]),report=compareAffectAppraisals(a,b);
  const av=a.filter((x:any)=>x.kind==='Appraisal'),bv=b.filter((x:any)=>x.kind==='Appraisal');
  for(const row of report.rows){const x=av.find((x:any)=>x.at===row.at),y=bv.find((x:any)=>x.at===row.at);expect(row.a?.provenance??null).toBe(x?.provenance??null);expect(row.b?.provenance??null).toBe(y?.provenance??null);const changed=!x||!y||keys.some(k=>JSON.stringify(JSON.parse(x.provenance)[k])!==JSON.stringify(JSON.parse(y.provenance)[k]));expect(row.changed.length>0).toBe(changed);}
  if(c.id==='hidden-world')expect(report.firstDifference).toBeNull();if(c.id.startsWith('interior/')){expect(report.firstDifference).toBe('14');expect(report.rows.find(r=>r.at==='14')!.changed).toEqual(['Resulting coordinates']);}
  expect(compareAffectAppraisals([...a].reverse(),[...b].reverse())).toEqual(report);expect(JSON.stringify([a,b])).toBe(original);
 }
});
it('retains missing evaluations and unavailable factors separately from scalar zero',()=>{
 const a=cards('baseline').filter((c:any)=>c.kind==='Appraisal').slice(0,1),b=structuredClone(a);const raw=JSON.parse(b[0].provenance);raw['Likelihood [8]']='0/1';b[0].provenance=JSON.stringify(raw);
 expect(compareAffectAppraisals(a,b).rows[0].changed).toContain('Likelihood');expect(compareAffectAppraisals(a,[]).rows[0].changed).toEqual(['Evaluation presence']);
 expect(()=>compareAffectAppraisals([a[0],{...a[0],id:'different'}],a)).toThrow('Ambiguous appraisal instant');
});
