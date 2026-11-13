import {it,expect,vi} from 'vitest';
import {witnessFixture,taskC,taskD,decode,rec,f,key,items,list,u,signed,enc,sid} from './fixtures/assembledCommitmentWitness';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {compileCharacterModel,RECURRENCE_RULES,RECURRENCE_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import * as stateKernel from '../substrate/state';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {W_SOURCE,W_LEARN,witnessPath,validateWitness,lifecycleMetadata,commitmentObserverView} from '../assembled/commitmentWitness';
import {KNOWLEDGE_OWNER} from '../assembled/communication';
import {through,bytes} from './fixtures/assembledAffectReceiving';
it('M100 boundaries reject invented knowledge, foreign authority, rewrites and generated ingress',async()=>{
 const b=witnessFixture(),m=await compileCharacterModel(b.s),c=await compileCharacterState(m),initial=c.initialState(b.d.initialState),h=m.communication!.recipients[0],path=witnessPath(h,taskC),obs=list([typedIdentifier(1168,u(1)),h,signed(12),taskC,list([u(1),u(1),u(0)])]),patch={operations:[{kind:'set' as const,path,expected:{presence:false as const},newValue:obs}]};
 expect(()=>c.stateModel.applyPatch(initial,patch,sid(1025,'authority/belief-expectation'))).toThrow();
 const written=c.stateModel.applyPatch(initial,patch,KNOWLEDGE_OWNER,{writableRoots:[1072n],targetPaths:[path]}).state;expect(()=>c.initialState(enc(written.canonicalValue()))).toThrow('initial communication knowledge');
 expect(()=>c.stateModel.applyPatch(written,{operations:[{kind:'set',path,expected:{presence:true,value:obs},newValue:obs}]},KNOWLEDGE_OWNER)).toThrow('rewrite');expect(()=>c.stateModel.applyPatch(written,{operations:[{kind:'remove',path,expectedOldValue:obs}]},KNOWLEDGE_OWNER)).toThrow();
 expect(()=>validateWitness(list([typedIdentifier(1168,u(1)),h,signed(12),taskD,list([u(1),u(1),u(0)])]),path)).toThrow('target');expect(()=>validateWitness(list([typedIdentifier(1168,u(1)),h,signed(12),taskC,list([u(2),u(1),u(4)])]),path)).toThrow('metadata');
 const prepared=await prepareCharacterModel(b.s),rows=items(decode(b.d.orderedInputs),'list'),source=rows.find(v=>key(items(v,'list')[2])===key(W_SOURCE))!;
 for(const added of [source,list([signed(21),u(140),W_LEARN,list([]),list([])]),list([signed(21),u(30),W_SOURCE,list([taskC,true,u(0),false]),list([])])])await expect(createCharacterRun(prepared,{...b.d,orderedInputs:enc(list([...rows,added]))})).rejects.toThrow();
 await expect(createCharacterRun(await prepareCharacterModel({...b.s,rulesVersion:RECURRENCE_RULES,registrySchemaVersion:RECURRENCE_REGISTRY}),b.d)).rejects.toThrow('version');
 expect(lifecycleMetadata(undefined)).toEqual(list([u(0),u(0),u(0)]));expect(()=>commitmentObserverView([],m.communication!.recipients,-1)).toThrow();
 console.info('M100 BOUNDARIES PASS prior versions/generated ingress, duplicate/malformed source, invented initial knowledge, foreign writer, rewrite/remove, bad target/status and observer selector reject');
},570000);
it('M100 rollback preserves the whole instant after a witness knowledge write fails',async()=>{
 const b=witnessFixture(),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,13n);const before=run.snapshot(),original=stateKernel.applyStatePatch;let reached=false;
 const spy=vi.spyOn(stateKernel,'applyStatePatch').mockImplementation((...args)=>{const result=original(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===1072n&&o.path.fieldId===2n)){reached=true;throw Error('M100 witness patch fault');}return result;});
 try{await expect(run.settleNextInstant()).rejects.toThrow('M100 witness patch fault');}finally{spy.mockRestore();}
 expect(reached).toBe(true);const after=run.snapshot();expect(after.clock).toBe(before.clock);expect(after.status).toBe('Failed');for(const k of ['state','outputs','trace'] as const)bytes(before[k],after[k]);expect(run.diagnostic()).toBeDefined();expect(()=>run.save()).toThrow();console.info('M100 ROLLBACK PASS reached knowledge patch; prior lifecycle/knowledge/state/output/trace/clock preserved');
},570000);
