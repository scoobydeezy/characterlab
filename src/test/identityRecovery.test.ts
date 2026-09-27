import {it,expect} from 'vitest';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {recoveryCase} from './identityRecoveryFixtures';
import {nativeRun,nativeRuntime,outputs,beliefRows,taskSemantic} from './identityBeliefPublicFixtures';
it('actual meaningful recovery changes independent beliefs without deleting the insignificant contrary expression',async()=>{
 const c=recoveryCase({name:'Recovery',law:'Mean'}),run=await nativeRun(c);while(await run.settleNextInstant()){}
 const rows=beliefRows(outputs(run)),source=taskSemantic(outputs(run));
 expect(source.slice(0,4).map(r=>r.chosen)).toEqual(['B','A','B','A']);expect(source[2].contribution).toBe('0/1');
 expect(rows.map(r=>r.states[0].estimate.value)).toEqual(['-1/1','0/1','0/1','1/3','1/3']);
 expect(rows[3].states[0].history.map(e=>e.ticket)).toEqual([1,2,4]);expect(rows[3].appraisals[0].estimate).toBe('0/1');expect(rows[4].appraisals[0].estimate).toBe('1/3');
},600000);
it('withheld recovery reports preserve negative observer belief despite positive acquired self belief',async()=>{
 const run=await nativeRun(recoveryCase({name:'WithheldRecoveryA',law:'Mean'}));while(await run.settleNextInstant()){}
 const last=beliefRows(outputs(run))[4];expect(last.states.map(s=>s.estimate.value)).toEqual(['1/3','-1/1','1/3']);
 expect(last.appraisals.map(a=>a.adverse)).toEqual(['1/3','1/1','1/3']);
},600000);
it('failure at the recovery commit cannot publish new belief, history, outputs or draw addresses',async()=>{
 const {runtime}=await nativeRuntime(recoveryCase({name:'Recovery',law:'Mean'}));for(let i=0;i<3;i++)await runtime.settle();
 const before=runtime.snapshot();await expect(runtime.settleForConformance({onBoundary(b){if(b==='before-commit')throw Error('recovery rollback');}})).rejects.toThrow();
 const after=runtime.snapshot();expect(after.status).toBe('Failed');expect(after.clock).toEqual(before.clock);expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(enc(list(after.outputs))).toEqual(enc(list(before.outputs)));expect(enc(list(after.trace))).toEqual(enc(list(before.trace)));expect(after.randomAddresses).toEqual(before.randomAddresses);expect(()=>runtime.save()).toThrow();
},600000);
