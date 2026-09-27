/** Closed task model/state construction; no live TC qualification. */
import {describe,it,expect} from 'vitest';
import controls from '../../docs/planning/campaign2-task-commitment-model/CONTROLS.json';
import {AuthoritativeState} from '../substrate/state';
import {canonicalEncode as enc,bytesToHex,record,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {compileTaskModel} from '../campaign2/taskModel';
import {taskModelReviewSource,type TaskSpecimen} from '../campaign2/taskModelReview';
import {decodeTask,taskRecord as r} from '../campaign2/taskCodecs';
import {dataField as f,dataRecord as rec,dataItems as items} from '../campaign2/canonicalData';
const cases=controls.filter(c=>c.specimen==='overlapping'||c.flags.every(Boolean));
describe('closed task model construction',()=>{
 it.each(cases)('matches frozen model $specimen / $flags',async c=>{
  const model=await compileTaskModel(taskModelReviewSource(c.specimen as TaskSpecimen,...c.flags));
  expect(bytesToHex(model.modelIdentity.digest)).toBe(c.modelDigest);
  expect(model.flags).toEqual(c.flags);expect(model.tasks).toHaveLength(2);
 },30000);
 it('admits terminal observation support only inside the declared window',async()=>{
  const model=await compileTaskModel(taskModelReviewSource()),task=model.tasks[0],ref=r(237,[u(1),typedIdentifier(1115,u(7))]);
  const state=(value:CanonicalValue)=>new AuthoritativeState([{path:task.path,value}]);
  expect(()=>model.stateModel.validateState(state(r(372,[u(1)])))).not.toThrow();
  expect(()=>model.stateModel.validateState(state(r(372,[u(3)])))).not.toThrow();
  expect(()=>model.stateModel.validateState(state(r(372,[u(2),ref,signed(task.activeFrom)])))).not.toThrow();
  for(const at of [task.activeFrom-1n,task.deadline])expect(()=>model.stateModel.validateState(state(r(372,[u(2),ref,signed(at)])))).toThrow('outside window');
  // Structural support validity is deliberately not a claim that occurrence7 happened.
 });
 it('rejects a valid-content but uncommitted task window',async()=>{
  const source=taskModelReviewSource(),slots=items(decodeTask(source.registry),'list');
  const rows=items(slots[0],'set').map(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;
   const definition=f(v,4n);if(typeof definition==='boolean'||definition.kind!=='record'||definition.schema.typeId!==370n)return v;
   const modified=record(definition.schema,new Map([...definition.fields].map(([i,x])=>[i,i===6n?signed(99):x])));
   return record(v.schema,new Map([...v.fields].map(([i,x])=>[i,i===4n?modified:x])));
  });
  const {list,set}=await import('../substrate/canonicalEncoding');
  await expect(compileTaskModel({...source,registry:enc(list(slots.map((s,i)=>i===0?set(rows):s)))})).rejects.toThrow('frozen declaration family');
 });
});
