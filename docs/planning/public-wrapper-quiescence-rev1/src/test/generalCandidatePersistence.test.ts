import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,signed,unsigned as u} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {compileGeneralModelCandidate} from '../campaign3/generalModelCandidate';
import {buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {createGeneralCandidateRun,restoreGeneralCandidateRun} from '../campaign3/generalCandidateRun';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {generalBindingContext,generalRecord as r} from '../campaign3/generalBindingProfile';
const same=(a:Uint8Array,b:Uint8Array)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const yieldWorker=()=>new Promise(resolve=>setTimeout(resolve,0));
it('restores canonical save/1 by complete execution and preserves continuation',async()=>{
 const candidate=await compileGeneralModelCandidate(buildGeneralDeclarationPacket()),run=await createGeneralCandidateRun(candidate,new Uint8Array(32));
 for(let i=0;i<3;i++){await run.settleNextInstant();await yieldWorker();}
 const save=run.save(),restored=await restoreGeneralCandidateRun(candidate,save);expect(same(restored.save(),save)).toBe(true);
 while(await run.settleNextInstant()){expect(await restored.settleNextInstant()).toBe(true);expect(same(restored.save(),run.save())).toBe(true);await yieldWorker();}
 expect(await restored.settleNextInstant()).toBe(false);
 const other=await compileGeneralModelCandidate(buildGeneralDeclarationPacket('source-consequence-lane'));
 await expect(restoreGeneralCandidateRun(other,save)).rejects.toThrow('model differs');
},90000);
it('rejects forged canonical save fields and copies seed input before asynchronous identity work',async()=>{
 const candidate=await compileGeneralModelCandidate(buildGeneralDeclarationPacket()),seed=new Uint8Array(32),pending=createGeneralCandidateRun(candidate,seed);seed.fill(255);const run=await pending;
 const identity=rec(decode(run.runIdentity(),generalBindingContext()),104n);expect(f(identity,4n)).toEqual({kind:'bytes',value:new Uint8Array(32)});
 const save=rec(decode(run.save(),generalBindingContext()),132n);
 const variants=new Map([[6n,r(131,[u(1),u(0),u(0)])],[7n,list([])],[8n,list([])],[10n,list([u(1)])],[11n,list([u(1)])],[12n,list([u(1)])],[4n,signed(99)]]);
 for(const [field,value] of variants){const fields=new Map(save.fields);fields.set(field,value);await expect(restoreGeneralCandidateRun(candidate,enc(r(132,fields)))).rejects.toThrow();await yieldWorker();}
},90000);
