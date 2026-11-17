import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {compileCognitiveIngress} from '../assembled/ingress';
import {compileLearningProtection,learningProtectionDeclaration} from '../assembled/learningProtection';
import * as ingressModule from '../campaign2/transitionIngressV04';
import * as evaluatorModule from '../campaign2/adaptationEvaluation';
import * as traceModule from '../assembled/traceBinding';
import * as bridgeModule from '../campaign2/consequenceBridge';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue,ContractReadProjection} from '../substrate/state';
import {record,set,rational,unsigned as u,typedIdentifier as tid,type CanonicalValue} from '../substrate/canonicalEncoding';
import {campaign2Record as cr} from '../campaign2/codecs';
import {fixture,rec,f,items,key,decode,enc,list,text,signed,C} from './fixtures/assembledAdaptBoundary';
import {target} from './fixtures/assembledSemanticFinal';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const records=(r:Run)=>items(decode(r.snapshot().outputs),'list');
const of=(r:Run,n:bigint)=>records(r).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n);
const traces=(r:Run)=>items(decode(r.snapshot().trace),'list').map(v=>rec(v,160n));
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const named=(r:Run,n:string)=>traces(r).filter(t=>key(f(event(t),5n))===key(tid(1001,text('event/'+n))));
const equal=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<32;n++){const more=await r.settleNextInstant();for(const p of peers){expect(await p.settleNextInstant()).toBe(more);equal(r,p);}if(!more)return;}throw Error('M147 settle cap');}
const replace=(v:CanonicalValue,k:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields,[k,x]]));};
const paths=()=>{const V=tid(1029,text('variable/fixture-regulation')),L=tid(1033,text('load/fixture-load'));return [cr('ToleranceKey',{CharacterId:C,ExposureReferentId:C,RegulatoryVariableId:V}),cr('SensitizationKey',{CharacterId:C,ExposureReferentId:C,RegulatoryVariableId:V}),cr('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:V}),cr('AccumulatedLoadKey',{CharacterId:C,LoadDomainId:L})].map((key,i)=>({rootStateTypeId:302n,fieldId:BigInt(i+1),selectors:[{kind:'mapKey' as const,key}]}));};
const readout=(o:CanonicalValue)=>key(f(rec(f(rec(o,203n),6n),204n),2n));
const parent=(a:CanonicalValue,b:CanonicalValue)=>expect(key(f(event(a),8n))).toBe(key(list([f(event(b),1n)])));
const metadata=(r:Run)=>key(list(traces(r).map(t=>list([1n,2n,3n,4n,5n,7n,8n].map(k=>f(event(t),k))))));
it('pair147: one root branches into equal permitted learning and unequal hidden adaptation, later evidence mediates memory',async()=>{
 const bs=[fixture(0),fixture(1)],m=await prepareCharacterModel(bs[0].s),compiled=await compileCharacterModel(bs[0].s),closure=compiled.learningProtection!,runs=await Promise.all(bs.map(b=>createCharacterRun(m,b.d)));
 const manifests=bs.map(b=>items(decode(b.d.orderedInputs),'list')),entry=items(manifests[1][0],'list');expect(key(list([list([...entry.slice(0,3),replace(entry[3],1n,replace(f(rec(entry[3],304n),1n),3n,u(0))),entry[4]]),...manifests[1].slice(1)]))).toBe(key(list(manifests[0])));
 const ids=runs.map(r=>rec(decode(r.runIdentity()),104n));for(const field of [1n,2n,4n])expect(key(f(ids[0],field))).toBe(key(f(ids[1],field)));expect(key(f(ids[0],3n))).not.toBe(key(f(ids[1],3n)));
 const captured:{value:CanonicalValue;bytes:string}[]=[],original=traceModule.compileCharacterTraceBinding;
 const spy=vi.spyOn(traceModule,'compileCharacterTraceBinding').mockImplementation((...args)=>{const binding=original(...args);return {record(...xs:Parameters<typeof binding.record>){const t=binding.record(...xs);if(xs[0].dueAt===2n&&xs[0].phase<=130n)for(const value of xs[1])captured.push({value,bytes:key(value)});return t;}};});
 const repeats=await Promise.all(bs.map(b=>createCharacterRun(m,b.d)));try{for(const r of [...runs,...repeats])await through(r,2n);}finally{spy.mockRestore();}
 expect(captured.length).toBeGreaterThan(6);for(const c of captured)expect(key(c.value)).toBe(c.bytes);
 const query=closure.query();expect(query.inheritedFamilies).toHaveLength(8);expect(query.inheritedOutputSchemas).toEqual(expect.arrayContaining(['269/1','270/1','342/1','429/1']));expect(query.stateDefault).toBe('protected');
 expect(key(closure.state(decode(runs[0].snapshot().state)))).toBe(key(closure.state(decode(runs[1].snapshot().state))));expect(key(closure.outputs(decode(runs[0].snapshot().outputs)))).toBe(key(closure.outputs(decode(runs[1].snapshot().outputs))));
 for(const type of [203n,227n,269n,270n]){expect(of(runs[0],type)).toHaveLength(1);expect(of(runs[1],type)).toEqual(of(runs[0],type));}
 for(let i=0;i<2;i++){const r=runs[i];equal(r,repeats[i]);expect(of(r,324n)).toHaveLength(1);expect(of(r,325n)).toHaveLength(4);expect(items(f(rec(of(r,324n)[0],324n),3n),'set')).toHaveLength(4);
  expect(key(set(of(r,325n).map(v=>f(rec(v,325n),4n))))).toBe(key(set(paths().map(statePathValue))));for(const v of of(r,325n))expect(key(f(rec(f(rec(v,325n),6n),327n),1n))).toBe(key(u(i?2:1)));
  expect(key(set(state(r).entries().filter(e=>e.path.rootStateTypeId===302n).map(e=>statePathValue(e.path))))).toBe(key(set(i?paths().map(statePathValue):[])));
  const root=named(r,'authored-adaptation-fact')[0],adapt=named(r,'authored-regulatory-adaptation')[0],observation=named(r,'fixture-consequence-observation')[0];parent(adapt,root);parent(observation,root);
  const chain=['fixture-consequence-observation','fixture-consequence-tracking','fixture-consequence-binding','fixture-consequence-classification','fixture-consequence-freeze','outcome-evaluation','outcome-learning-evidence'].map(n=>named(r,n)[0]);for(let k=1;k<chain.length;k++)parent(chain[k],chain[k-1]);
  expect(key(f(chain[5],12n))).toBe(key(of(r,227n)[0]));expect(key(f(chain[6],12n))).toBe(key(of(r,269n)[0]));expect(items(f(chain[5],11n),'list')).toHaveLength(0);expect(items(f(chain[6],11n),'list')).toHaveLength(0);
  expect(items(f(adapt,17n),'list')).toHaveLength(i?4:0);expect(items(f(event(adapt),8n),'list')).not.toEqual(items(f(event(chain[6]),8n),'list'));
 }
 expect(metadata(runs[0])).toBe(metadata(runs[1]));expect(f(rec(decode(runs[0].save()),132n),6n)).toEqual(f(rec(decode(runs[1].save()),132n),6n));
 const restored=await Promise.all(bs.map((b,i)=>restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:runs[i].save()})));
 for(let i=0;i<2;i++){for(const r of [runs[i],repeats[i],restored[i]])await through(r,4n);equal(runs[i],repeats[i]);equal(runs[i],restored[i]);
  const obs=of(runs[i],203n).find(v=>key(f(rec(v,203n),5n))===key(signed(4)))!;expect(obs).toBeDefined();expect(readout(obs)).toBe(key(rational(BigInt(50+i),10n)));
  const intake=of(runs[i],337n)[0],m1=of(runs[i],342n)[0],episode=state(runs[i]).entries().find(e=>e.path.rootStateTypeId===346n)!;expect(key(f(rec(intake,337n),2n))).toBe(key(obs));expect(key(f(rec(m1,342n),2n))).toBe(key(intake));expect(key(f(rec(episode.value,345n),1n))).toBe(key(m1));
  const reads=items(f(named(runs[i],'regulatory-diagnostic-probe')[0],11n),'list');expect(reads).toHaveLength(1);expect(key(f(rec(reads[0],147n),2n))).toBe(key(statePathValue(paths()[2])));expect(f(rec(reads[0],147n),3n)).toBe(i===1);
  if(i)expect(key(f(rec(reads[0],147n),4n))).toBe(key(f(rec(items(f(named(runs[i],'authored-regulatory-adaptation')[0],17n),'list').find(v=>key(f(rec(v,148n),1n))===key(statePathValue(paths()[2])))!,148n),5n)));
  const at4=await restoreCharacterRun(bs[i].s,{initialState:bs[i].d.initialState,orderedInputs:bs[i].d.orderedInputs,save:runs[i].save()});equal(runs[i],at4);await finish(runs[i],[repeats[i],restored[i],at4]);expect(of(runs[i],352n)).toHaveLength(1);expect(key(f(rec(of(runs[i],352n)[0],352n),2n))).toBe(key(episode.value));
 }
 expect(metadata(runs[0])).toBe(metadata(runs[1]));for(const r of runs)expect(traces(r).every(t=>items(f(t,14n),'list').length===0)).toBe(true);
 console.info('M147 PAIR PASS exact count-only manifests/model/S0/seed; same110 root -> independent ADAPT and120..124..130 learning; protected closure equal;4 live rules; later D-only5/5.1 ->actual episode/recall; no dice; frozen<=130 records unchanged; matched topology; repeat/save2/save4/every later boundary exact');
},590000);
