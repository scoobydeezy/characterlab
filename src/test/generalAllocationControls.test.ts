import {it,expect} from 'vitest';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {rational as q} from '../substrate/canonicalEncoding';
import {compileGeneralModelCandidate} from '../campaign3/generalModelCandidate';
import {buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {createGeneralSourceRuntime} from '../campaign3/generalSourceRuntime';
it('preserves three distinct allocation candidates in identities and actual selected factors',async()=>{
 const identities:string[]=[],attention:string[][]=[];
 for(const recipe of ['baseline','allocation-disabled','allocation-spatial']){
  const candidate=await compileGeneralModelCandidate(buildGeneralDeclarationPacket(recipe));identities.push(key(candidate.identity.value));const run=createGeneralSourceRuntime(candidate.model);
  for(let i=0;i<3;i++)await run.settleNextInstant();
  const value=run.snapshot().outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===641n)!;
  const rows=items(f(rec(f(rec(value,641n),1n),619n),2n),'list').map(v=>rec(v,618n));
  attention.push(rows.map(row=>key(f(rec(f(row,3n),617n),3n))).sort());
 }
 expect(new Set(identities).size).toBe(3);
 expect(attention[0]).toEqual([q(1,1),q(9,10),q(3,5)].map(key).sort());
 expect(attention[1]).toEqual([q(1,1),q(1,1),q(1,1)].map(key).sort());
 expect(attention[2]).toEqual([q(1,1),q(1,10),q(1,10)].map(key).sort());
},30000);
it('commits differing required initial-state profiles even when their definition packets agree',async()=>{
 const identities=[];
 for(const recipe of ['feedback-both','source-zero-concern','source-above-target'])identities.push(key((await compileGeneralModelCandidate(buildGeneralDeclarationPacket(recipe))).identity.value));
 expect(new Set(identities).size).toBe(3);
});
