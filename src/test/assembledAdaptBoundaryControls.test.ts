import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {AuthoritativeState,restoreAuthoritativeState,ContractReadProjection} from '../substrate/state';
import {record,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import * as ingressModule from '../campaign2/transitionIngressV04';
import * as evaluatorModule from '../campaign2/adaptationEvaluation';
import * as traceModule from '../assembled/traceBinding';
import {campaign2Record as cr} from '../campaign2/codecs';
import {target} from './fixtures/assembledSemanticFinal';
import {fixture,rec,f,items,key,decode,enc,list,text,signed,C} from './fixtures/assembledAdaptBoundary';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const replace=(v:CanonicalValue,k:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields,[k,x]]));};
const of=(r:Run,n:bigint)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n);
const equal=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(r:Run,peer?:Run){for(let n=0;n<32;n++){const more=await r.settleNextInstant();if(peer){expect(await peer.settleNextInstant()).toBe(more);equal(r,peer);}if(!more)return;}throw Error('M147 settle cap');}
it('closure147: the committed superset detects future owners and outputs; no reveal does not teach hidden exposure',async()=>{
 const b=fixture(),compiled=await compileCharacterModel(b.s),closure=compiled.learningProtection!,m=await prepareCharacterModel(b.s),runs=await Promise.all([0,1].map(i=>createCharacterRun(m,fixture(i,false).d)));for(const r of runs)await finish(r);
 expect(key(closure.state(decode(runs[0].snapshot().state)))).toBe(key(closure.state(decode(runs[1].snapshot().state))));expect(key(closure.outputs(decode(runs[0].snapshot().outputs)))).toBe(key(closure.outputs(decode(runs[1].snapshot().outputs))));for(const r of runs){expect(of(r,203n)).toHaveLength(1);expect(of(r,270n)).toHaveLength(1);expect(of(r,342n)).toHaveLength(0);}
 const original=decode(runs[0].snapshot().state),state=restoreAuthoritativeState(original),extra=new AuthoritativeState([...state.entries(),{path:{rootStateTypeId:999999n,fieldId:1n,selectors:[]},value:text('future owner')}]);expect(key(closure.state(extra.canonicalValue()))).not.toBe(key(closure.state(original)));
 const outputs=decode(runs[0].snapshot().outputs),base=items(outputs,'list');for(const extra of [list([text('future-learning-owner/record'),u(1)]),record({typeId:999999n,schemaVersion:1n,name:'future',fields:[{id:1n,name:'value',required:true}]},new Map([[1n,u(1)]]))])expect(key(closure.outputs(list([...base,extra])))).not.toBe(key(closure.outputs(outputs)));
 const slots=items(decode(b.s.registry),'list'),policy=items(slots[49],'list');for(const weakened of [list([policy[0],policy[1],list([u(302),u(346)]),policy[3]]),list([policy[0],policy[1],policy[2],list([u(307),u(324),u(325),u(334),u(270)])])await expect(prepareCharacterModel({...b.s,registry:enc(list([...slots.slice(0,49),weakened]))})).rejects.toThrow('protection');
 console.info('M147 CLOSURE PASS inherited8 families/nonempty EVID outputs plus all later/future state/list/record outputs protected; narrowed policy rejects; with pulse but no diagnostic reveal cognition remains equal');
},590000);
it('outcomes147: no input, wrong basis and no applicable rule stay distinct from four no-change evaluations',async()=>{
 const b=fixture(0,false),m=await prepareCharacterModel(b.s),base=items(decode(b.d.orderedInputs),'list'),row=items(base[0],'list'),fact=f(rec(row[3],304n),1n);
 const empty=await createCharacterRun(m,{...b.d,orderedInputs:enc(list([]))});await finish(empty);expect(of(empty,324n)).toHaveLength(0);
 const miss=list([...row.slice(0,3),replace(row[3],1n,replace(fact,2n,target)),row[4]]),run=await createCharacterRun(m,{...b.d,orderedInputs:enc(list([miss]))});await through(run,2n);expect(of(run,324n)).toHaveLength(1);expect(items(f(rec(of(run,324n)[0],324n),3n),'set')).toHaveLength(0);expect(of(run,325n)).toHaveLength(0);expect(of(run,270n)).toHaveLength(1);expect(restoreAuthoritativeState(decode(run.snapshot().state)).entries().filter(e=>e.path.rootStateTypeId===302n)).toHaveLength(0);
 const wrong=list([...row.slice(0,3),replace(row[3],1n,text('wrong basis')),row[4]]);await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list([wrong]))})).rejects.toThrow();
 console.info('M147 OUTCOMES PASS no dispatch vs admission rejection vs dispatch/zero rules/no evaluations; wrong exposure key never mutates another key; actual permitted pulse still learns');
},590000);
it.each(['event/authored-regulatory-adaptation','event/outcome-evaluation','event/outcome-learning-evidence'])('route147: opposite input fails before reads at %s',async targetEvent=>{
 const b=fixture(1),m=await prepareCharacterModel(b.s),good=await createCharacterRun(m,b.d);await through(good,2n);const opposite=of(good,targetEvent.includes('adaptation')?270n:307n)[0];expect(opposite).toBeDefined();
 const original=ingressModule.beginTransitionIngressV04;let challenged=0;const spy=vi.spyOn(ingressModule,'beginTransitionIngressV04').mockImplementation((...args)=>{const ingress=original(...args);return {...ingress,admit(event){if(key(event.eventTypeId.payload)===key(text(targetEvent))){challenged++;return ingress.admit({...event,payload:opposite});}return ingress.admit(event);}};});
 try{const bad=await createCharacterRun(m,b.d);await through(bad,1n);const before=bad.snapshot(),reads=vi.spyOn(ContractReadProjection.prototype,'read');try{await expect(bad.settleNextInstant()).rejects.toThrow(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));expect(challenged).toBe(1);expect(reads).not.toHaveBeenCalled();expect({...bad.snapshot(),status:before.status}).toEqual(before);}finally{reads.mockRestore();}}finally{spy.mockRestore();}
},590000);
it.each([0,1])('collision147: complete native batch rejects duplicate targets before reads, count%s',async count=>{
 const b=fixture(count),m=await prepareCharacterModel(b.s),original=evaluatorModule.compileAdaptationEvaluator;const spy=vi.spyOn(evaluatorModule,'compileAdaptationEvaluator').mockImplementation((...args)=>{const engine=original(...args);return {...engine,prepare(tokens,at){return engine.prepare(at===2n?[...tokens,tokens[0]]:tokens,at);}};});
 try{const r=await createCharacterRun(m,b.d);await through(r,1n);const before=r.snapshot(),reads=vi.spyOn(ContractReadProjection.prototype,'read');try{await expect(r.settleNextInstant()).rejects.toThrow(expect.objectContaining({code:'ADAPTATION_TARGET_COLLISION'}));expect(reads).not.toHaveBeenCalled();expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{reads.mockRestore();}}finally{spy.mockRestore();}
},590000);
it.each([124n,140n])('rollback147: failure at phase%s preserves the whole exposure instant and exact recovery',async phase=>{
 const b=fixture(1),m=await prepareCharacterModel(b.s),original=traceModule.compileCharacterTraceBinding;const spy=vi.spyOn(traceModule,'compileCharacterTraceBinding').mockImplementation((...args)=>{const binding=original(...args);return {record(...xs:Parameters<typeof binding.record>){const result=binding.record(...xs);if(xs[0].dueAt===2n&&xs[0].phase===phase)throw Error('M147 fault at'+phase);return result;}};});let save:Uint8Array;
 try{const r=await createCharacterRun(m,b.d);await through(r,1n);const before=r.snapshot();save=r.save();await expect(r.settleNextInstant()).rejects.toThrow('M147 fault at'+phase);expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:save!}),clean=await createCharacterRun(m,b.d);await through(clean,1n);equal(restored,clean);await finish(clean,restored);
},590000);
