import {it,expect} from 'vitest';
import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';
import {affectFactorView,AFFECT_FACTOR_AXES} from '../workbench/affectFactorProjection';
import {AffectFactorView} from '../workbench/AffectFactorView';
import type {AffectExplanation} from '../workbench/affectExplanations';
const load=(name:string)=>import(/* @vite-ignore */ name);
const {default:fs}=await load('node:fs'),{createHash}=await load('node:crypto');
it('preserves all frozen appraisal factors, coordinate dimensions and unavailable values',()=>{
 const receipt=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-language-rev1/receipt.json','utf8'));
 let records=0,missing=0,knownZero=0,split=0;
 for(const file of receipt.results){const bytes=fs.readFileSync(file.file);expect(createHash('sha256').update(bytes).digest('hex')).toBe(file.sha256);
  const saved=JSON.parse(bytes),before=JSON.stringify(saved.explanations),rows=affectFactorView(saved.explanations);
  expect(rows.length).toBe(saved.explanations.filter((c:AffectExplanation)=>c.kind==='Appraisal').length);
  for(const row of rows){records++;const source=JSON.parse(row.provenance),fields=['Likelihood [8]','Severity [4]','Vulnerability [9]','Control [10]'];
   AFFECT_FACTOR_AXES.forEach((axis,i)=>{const expected=source[fields[i]],actual=row.factors[axis];if(expected===undefined){expect(actual).toBeNull();missing++;}else {expect(actual!.exact).toBe(expected);const [n,d]=expected.split('/').map(Number);expect(Math.abs(actual!.plot-n/d)).toBeLessThan(1e-9+Number.EPSILON);if(n===0)knownZero++;}});
   expect(row.raw.map(x=>x.exact)).toEqual(source['RawCoordinates [5]']);expect(row.result.map(x=>x.exact)).toEqual(source['Coordinates [6]']);if(row.result.length===2)split++;
  }
  const html=renderToStaticMarkup(createElement(AffectFactorView,{cards:saved.explanations}));expect(html).toContain('not independent stored emotion state');expect(JSON.stringify(saved.explanations)).toBe(before);
 }
 expect(receipt.results.length).toBe(105);expect(records).toBeGreaterThan(500);expect(missing).toBeGreaterThan(0);expect(knownZero).toBeGreaterThan(0);expect(split).toBeGreaterThan(0);
});
it('rejects mismatched revisions and invalid factors without inventing a visual',()=>{
 const card:AffectExplanation={id:'a',renderer:'affect-evaluation-explanation/0.1',kind:'Appraisal',at:'1',headline:'',human:'',provenance:JSON.stringify({record:'AffectAppraisal#754/1','At [2]':'2','Severity [4]':'1/2','RawCoordinates [5]':[],'Coordinates [6]':[]})};
 expect(()=>affectFactorView([card])).toThrow('identity');
 const raw=JSON.parse(card.provenance);raw['At [2]']='1';raw['Severity [4]']='2/1';card.provenance=JSON.stringify(raw);expect(()=>affectFactorView([card])).toThrow('unit interval');
 const html=renderToStaticMarkup(createElement(AffectFactorView,{cards:[card]}));expect(html).toContain('role="alert"');expect(html).not.toContain('<svg');
});
