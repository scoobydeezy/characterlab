import {it,expect,vi} from 'vitest';
import {createCharacterRun,prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,FAMILIARITY_RULES,FAMILIARITY_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {AuthoritativeState} from '../substrate/state';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import * as memory from '../assembled/memory';
import {creditSummary,summaryValue,summaryPath,isSummaryPath} from '../assembled/recollection';
import {appearanceEpisode,appearancePath,isAppearancePath,FAMILIARITY} from '../assembled/familiarity';
import {fixture as claimFixture} from './fixtures/assembledLongitudinalCompletion';
import {fixture155,items,decode,key,enc,list,text,u} from './fixtures/assembledRecollection';
import {C,target,bytes,exact} from './fixtures/assembledFamiliarity';
import {start155,state155,memories155,summaries155,recall155,through155,finish155} from './assembledRecollection.test';
it('boundaries155: source-bound summary ownership and actual summary-plus-fragment rollback preserve whole continuation',async()=>{
 const x=await start155();await through155(x.run,5n);const state=state155(x.run),c=await compileCharacterState(await compileCharacterModel(x.b.s)),first=memories155(x.run)[0],a=appearanceEpisode(first.value),summary=summaries155(x.run)[0];
 expect(items(a[8],'list')).toHaveLength(0);
 expect(()=>c.stateModel.read(state,summaryPath(target,u(1)))).toThrow('holder');
 expect(()=>c.stateModel.applyPatch(state,{operations:[{kind:'set',path:summary.path,expected:{presence:true,value:summary.value},newValue:summary.value}]},memory.EPISODIC_OWNER)).toThrow('fresh credit');
 expect(()=>c.stateModel.applyPatch(state,{operations:[{kind:'set',path:first.path,expected:{presence:true,value:first.value},newValue:list([...a.slice(0,8),list([false])])}]},memory.EPISODIC_OWNER)).toThrow('only peripheral');
 const fake=list([a[0],typedIdentifier(1125,u(100000)),typedIdentifier(1115,u(100000)),...a.slice(3,8),list([true])]),path=appearancePath(C,items(fake,'list')[2]),next=creditSummary(summary.value,fake);
 const patch={operations:[{kind:'set' as const,path,expected:{presence:false as const},newValue:fake},{kind:'set' as const,path:summary.path,expected:{presence:true as const,value:summary.value},newValue:next}]};
 expect(()=>c.stateModel.applyPatch(state,patch,typedIdentifier(1025,text('authority/wrong')))).toThrow();
 expect(()=>creditSummary(next,fake)).toThrow('duplicate source');
 const corrupt=[...summaryValue(next)];corrupt[2]=u(999);expect(()=>summaryValue(list(corrupt))).toThrow('counts');
 const old=await compileCharacterState(await compileCharacterModel({...x.b.s,rulesVersion:FAMILIARITY_RULES,registrySchemaVersion:FAMILIARITY_REGISTRY}));expect(()=>old.stateModel.validateState(state)).toThrow('summary version');
 const initial=c.initialState(x.b.d.initialState);await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...initial.entries(),summary]).canonicalValue())})).rejects.toThrow('initial');
 const make=memory.createEpisodicExtension;let reached=false;const spy=vi.spyOn(memory,'createEpisodicExtension').mockImplementation((...args)=>{const component=make(...args);return Object.freeze({...component,prepare(...xs){const stage=component.prepare(...xs);return {...stage,finish(s){const next=stage.finish(s);if(xs[0].some(e=>e.dueAt===6n)){const changed=xs[1].entries().filter(e=>isAppearancePath(e.path)).some(e=>items(appearanceEpisode(e.value)[8],'list').length&&next.read(e.path).presence&&!items(appearanceEpisode(next.read(e.path).value!)[8],'list').length);const aggregate=next.entries().find(e=>isSummaryPath(e.path)&&key(summaryValue(e.value)[1])===key(u(1)))!;expect(changed).toBe(true);expect(summaryValue(aggregate.value).slice(2,4)).toEqual([u(2),u(2)]);reached=true;throw Error('M155 summary fragment fault');}return next;}};}});});
 let saved:Uint8Array|undefined;try{const fault=await createCharacterRun(x.m,x.b.d);for(let i=0;i<96;i++){const before=fault.snapshot();saved=fault.save();try{await fault.settleNextInstant();}catch(e){expect(String(e)).toContain('M155 summary fragment fault');expect(reached).toBe(true);expect({...fault.snapshot(),status:before.status}).toEqual(before);break;}}expect(reached).toBe(true);}finally{spy.mockRestore();}
 const restored=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:saved!});await finish155(x.run);await finish155(restored);exact(x.run,restored);
 console.info('M155 BOUNDARIES PASS summary credit/owner/holder/count/version/S0/guess guards; fault after actual summary+fragment writes; exact rollback and full recovered continuation');
},540000);
it('preservation155: previous familiarity and claim-memory state remain unchanged apart from the declared summary',async()=>{
 const b=fixture155(),old=await createCharacterRun(await prepareCharacterModel({...b.s,rulesVersion:FAMILIARITY_RULES,registrySchemaVersion:FAMILIARITY_REGISTRY}),b.d),now=await createCharacterRun(await prepareCharacterModel(b.s),b.d);
 const familiar=(r:typeof old)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(FAMILIARITY)));
 for(let i=0;i<96;i++){const more=await old.settleNextInstant();expect(await now.settleNextInstant()).toBe(more);expect(state155(now).entries().filter(e=>!isSummaryPath(e.path))).toEqual(state155(old).entries());expect(familiar(now)).toEqual(familiar(old));if(!more)break;if(i===95)throw Error('preservation queue cap');}
 const claim=claimFixture('encodedEpisodes'),s={...claim.s,rulesVersion:b.s.rulesVersion,registrySchemaVersion:b.s.registrySchemaVersion},previous={...claim.s,rulesVersion:FAMILIARITY_RULES,registrySchemaVersion:FAMILIARITY_REGISTRY};
 const a=await createCharacterRun(await prepareCharacterModel(previous),claim.d),z=await createCharacterRun(await prepareCharacterModel(s),claim.d);
 for(let i=0;i<96;i++){const more=await a.settleNextInstant();expect(await z.settleNextInstant()).toBe(more);bytes(a.snapshot().state,z.snapshot().state);expect(summaries155(z)).toHaveLength(0);if(!more){console.info('M155 PRESERVATION PASS0.114 familiarity/all other learned state at every instant; claim path whole state/no duplicate summary');return;}}throw Error('claim queue cap');
},540000);
