/** Owner-authorized one-shot diagnostic; excluded from ordinary test execution.
 * Only logs exceptions before scheduler message wrapping; rethrows the same object.
 * Activate only with an explicit M25_DIAGNOSTIC=1 invocation and120sec outer cap. */
import {it,vi} from 'vitest';
vi.mock('../campaign2/canonicalData',async importOriginal=>{
 const actual=await importOriginal<typeof import('../campaign2/canonicalData')>();
 return Object.fromEntries(Object.entries(actual).map(([name,value])=>[name,typeof value!=='function'?value:(...args:unknown[])=>{
  try{return (value as (...args:unknown[])=>unknown)(...args);}catch(error){console.error('M25_DIAGNOSTIC canonicalData.'+name,error instanceof Error?error.stack:String(error));throw error;}
 }]));
});
vi.mock('../substrate/trace',async importOriginal=>{
 const actual=await importOriginal<typeof import('../substrate/trace')>();
 return {...actual,traceRecordValue(...args:Parameters<typeof actual.traceRecordValue>){
  try{return actual.traceRecordValue(...args);}catch(error){console.error('M25_DIAGNOSTIC traceRecordValue',error instanceof Error?error.stack:String(error));throw error;}
 }};
});
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {peopleSource,peopleData} from './fixtures/assembledPersonHistory';
import {through} from './fixtures/assembledComparison';
it.skipIf((globalThis as typeof globalThis & {process?:{env?:{M25_DIAGNOSTIC?:string}}}).process?.env?.M25_DIAGNOSTIC!=='1')('diagnostic only: original first-branch seed0 setup through3',async()=>{
 const model=await prepareCharacterModel(peopleSource()),run=await createCharacterRun(model,peopleData(false,0));
 try{await through(run,3n);console.info('M25_DIAGNOSTIC setup reached3; no matrix executed');}
 catch(error){console.error('M25_DIAGNOSTIC stopped at committed clock='+run.snapshot().clock,error instanceof Error?error.stack:String(error));throw error;}
},115000);
