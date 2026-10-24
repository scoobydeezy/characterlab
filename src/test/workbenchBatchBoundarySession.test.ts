import {expect,it} from 'vitest';
import {BatchSession} from '../workbench/batchSession';
import type {BatchJob,BatchRunView} from '../workbench/experimentRegistry';
const hash='a'.repeat(64),job:BatchJob={id:'reason/test',experimentId:'reason',name:'collective',law:1,seed:7,expectedSaveHashes:[hash]};
it('rejects a public declaration that attempts to adopt a component boundary',()=>{
 expect(()=>new BatchSession([{...job,executionKind:'composed-component'} as BatchJob])).toThrow('Unexpected execution boundary');
});
it('withholds a passing result when a public adapter omits its native clock',async()=>{
 const batch=new BatchSession([job],async()=>({advance:async()=>false,view:()=>({prefix:0,total:0,complete:true,clock:null,modelHash:hash,runHash:hash,stateHash:hash,saveHash:hash} as unknown as BatchRunView)}));
 await batch.run();expect(batch.snapshot().status).toBe('failed');expect(batch.snapshot().results[0].prefixes).toEqual([]);
 expect(batch.snapshot().results[0].error).toBe('Adapter prefix or identity contract mismatch');
});
