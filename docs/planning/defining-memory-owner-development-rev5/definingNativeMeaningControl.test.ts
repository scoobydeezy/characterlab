import {it,expect} from 'vitest';
import {canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint} from '../campaign2/canonicalData';
import {admitDefiningContinuationProgram as admit} from '../campaign3/definingContinuationProgram';
import {definingMeaningCases} from '../campaign3/definingMeaning';
import {createDefiningMemoryModel} from '../campaign3/definingMemoryModel';
import {definingTraining} from '../campaign3/definingMemoryExperiment';
it('native absent interpretation goal with still-live training goal cannot borrow its qualification',async()=>{const run=await createDefiningMemoryModel(admit({...definingMeaningCases()[0],goal:'Absent',now:50}));let instants=0;while(await run.runtime.settleNextInstant())instants++;const s=run.runtime.snapshot(),result=rec(s.outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1489n)!,1489n),qualification=rec(f(result,7n),567n);expect(uint(f(qualification,1n))).toBe(1n);const trainingGoal=rec(s.state.entries().find(e=>e.path.rootStateTypeId===633n)!.value,560n);expect(uint(f(rec(items(f(trainingGoal,1n),'list')[0],559n),3n))).toBe(1n);const memory=definingTraining(enc(s.state.canonicalValue())).memory;expect(memory.filter(a=>a.kind==='EventContinuant').map(a=>a.id)).toEqual([139n]);expect(memory.every(a=>a.units.every(u=>u.outcomeSignificanceDirections.length===0))).toBe(true);expect(s.clock).toBe(50n);expect(instants).toBe(23);},240000);
