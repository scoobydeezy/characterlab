/** Pure overlap-domain parity controls. Synthetic operands grant no public ancestry. */
import {it,expect} from 'vitest';
import {list,map,unsigned as u,rational,record,set} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {receivingRecord as old,receivingSchema} from '../campaign3/receivingCodecs';
import {multisourceRecord as r} from '../campaign3/multisourcePublicCodecs';
import {multisourceCoverage} from '../campaign3/multisourceReasons';
import {receivingCoverageComponent,mixedReasonOutput,bodyOptionsOutput,mixedCandidateOutput,mixedRawOutput} from '../campaign3/receivingTransforms';
import {C,id,occurrence,positivePressure,taskSource,def} from './receivingFixtures';
import {readQ} from '../campaign2/cognitiveMath';
it('matches the preserved aggregate kernel across shared, disjoint, collective and signed partitions',()=>{
 const option=old(395,[C,id(1027,'definition/protocol-contact-one')]),ground=record(receivingSchema(494n),new Map([[1n,u(2)],[3n,old(493,[C,id(1027,'definition/embodied-pressure')])]]));
 const atom=(n:number)=>old(399,[u(1),old(237,[u(1),occurrence(1115,n)])]);
 for(const supports of [[[1],[1],[1]],[[1],[2],[3]],[[1],[2],[1,2]]])for(const sign of [1,-1])for(const role of [1]){
  const inputs=supports.map((basis,i)=>r(721,[r(720,[option,ground,u(role),u(2),id(1027,'description/'+i)]),rational(sign*(3-i),4),old(400,[map(basis.map(a=>[atom(a),rational(1,1)]))])])),output=multisourceCoverage(inputs,1n)[0];
  const inherited=inputs.map(v=>{const s=rec(v,721n),k=rec(f(s,1n),720n);return old(496,[old(495,[f(k,1n),f(k,2n),f(k,3n),f(k,5n)]),f(s,2n),f(s,3n)]);});
  const control=receivingCoverageComponent(inherited);expect((role===1?output.base:output.situation).equals(control.net)).toBe(true);
  expect(output.witnesses.map(w=>key(f(rec(w,723n),5n)))).toEqual(control.trace.map(w=>key(f(rec(w,500n),5n))));
 }
});
it('preserves inherited dice bands, modifiers and distributions in the common receiving domain',async()=>{
 const recipe=multisourceRecipe('shared','GroundAggregate'),model=await compileMultisourceModel(recipe.source),inputs=await compileMultisourceInputs(model,recipe.initialState,recipe.orderedInputs,new Uint8Array(32).fill(7)),run=createMultisourceRuntime(model,inputs,model.initialState(recipe.initialState));
 await run.settleNextInstant();const outputs=run.snapshot().outputs,actualRaw=rec(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===722n)!,722n),actualReasons=rec(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===726n)!,726n);
 const task=taskSource('one'),pd=id(1027,'definition/embodied-pressure'),body=bodyOptionsOutput(occurrence(1132,3),positivePressure(),pd,()=>[{instructionId:id(1027,'definition/embodied-response-a'),pressureDefinitionId:pd,actionId:id(1027,'definition/protocol-contact-one')}]);
 const mixed=mixedCandidateOutput(occurrence(1132,16),old(491,[task.candidates,body])),template=rec(mixedRawOutput(occurrence(1133,17),old(498,[mixed,task.raw]),pd),499n),fields=new Map(template.fields);
 // Only the pure old receiver sees this control envelope. Public runs never admit it.
 fields.set(3n,set(items(f(actualRaw,3n),'list').map(v=>{const signal=rec(v,721n),k=rec(f(signal,1n),720n),body=f(rec(f(k,2n),494n),1n);return old(496,[old(495,[f(k,1n),f(k,2n),f(k,3n),...((body as {value:bigint}).value===2n?[f(k,5n)]:[])]),f(signal,2n),f(signal,3n)]);}))); 
 const inherited=items(f(rec(mixedReasonOutput(occurrence(1134,18),record(template.schema,fields),def('task-reason-dice')),504n),3n),'list');
 const actual=items(f(actualReasons,3n),'list');expect(actual.length).toBe(inherited.length);
 for(const value of inherited){const n=rec(value,503n),nk=rec(f(n,1n),502n),matched=rec(actual.find(v=>{const k=rec(f(rec(v,725n),1n),724n);return key(f(k,1n))===key(f(nk,1n))&&key(f(k,2n))===key(f(nk,2n));})!,725n),roles=rec(f(n,2n),501n);
  expect(key(f(matched,2n))).toBe(key(f(roles,1n)));expect(key(f(matched,3n))).toBe(key(f(roles,3n)));expect(key(f(matched,4n))).toBe(key(f(n,3n)));expect(key(f(matched,5n))).toBe(key(f(n,4n)));expect(key(f(matched,6n))).toBe(key(f(n,6n)));expect(key(f(matched,7n))).toBe(key(f(rec(f(n,7n),424n),1n)));
 }
},30000);

import {multisourceRecipe} from '../campaign3/multisourceModelRecipe';
import {compileMultisourceModel} from '../campaign3/multisourceModel';
import {compileMultisourceInputs} from '../campaign3/multisourceInputs';
import {createMultisourceRuntime} from '../campaign3/multisourceRuntime';
