import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {fixture,exact,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,PROPOSITIONS,type Profile,type Run,type CanonicalValue} from './fixtures/assembledEffectEvidence';
import {BODY_DELIVERY,bodyId} from '../assembled/body';
import {EFFECT_OBSERVE,EFFECT_EVIDENCE,EFFECT_APPLY,effectBeliefPath,isEffectEpisodePath,validateEffectEpisode} from '../assembled/effectEvidence';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {unsigned,record} from '../substrate/canonicalEncoding';
import {applyEpiEvidence,encodingOperands} from '../campaign3/epiMath';
import {runCase,records} from './epiFixtures';
import * as stateModule from '../substrate/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {createCharacterRuntime} from '../assembled/runtime';
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('time');return v.value;};
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const types=(r:Run,t:bigint)=>outputs(r.snapshot().outputs,t);
const events=(r:Run)=>outputs(r.snapshot().trace,160n);
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const safe=(r:Run)=>list(items(decode(r.snapshot().outputs),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===479n)));
const same=(a:CanonicalValue,b:CanonicalValue)=>bytes(enc(a),enc(b));
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
function compare(a:Run,b:Run){bytes(a.snapshot().state,b.snapshot().state);same(safe(a),safe(b));}
function live(r:Run,profile:Profile){
 const samples=types(r,900n),app=types(r,905n),encodings=types(r,910n),probes=types(r,906n);
 const sample=samples.find(s=>time(f(s,4n))===9n);
 if(profile==='denied'){expect(samples).toHaveLength(0);expect(app).toHaveLength(0);expect(encodings).toHaveLength(0);expect(state(r).read(effectBeliefPath(C,PROPOSITIONS[0])).presence).toBe(false);return;}
 expect(sample,'actual safe sample9').toBeDefined();expect(uint(f(sample!,6n))).toBe(profile==='point'?1n:2n);
 const last=encodings.find(e=>time(f(rec(f(e,2n),900n),4n))===9n)!;
 const application=app.find(e=>time(f(rec(f(rec(f(e,2n),904n),2n),900n),4n))===9n)!;
 expect(last).toBeDefined();expect(application).toBeDefined();
 const predicted=encodingOperands(sample!,last.fields.get(3n));
 expect(f(last,4n)).toEqual(predicted.surprise);expect(f(last,5n)).toEqual(predicted.raw);expect(f(last,6n)).toEqual(predicted.strength);
 const expected=applyEpiEvidence(application.fields.get(3n),f(application,2n),1,1);
 expect(f(application,5n)).toBe(expected.applied);expect(application.fields.get(4n)).toEqual(expected.next);
 expect(probes.length).toBeGreaterThanOrEqual(1);const at10=probes[0];
 expect(at10.fields.has(7n),'later cognitive read of surviving encoding').toBe(true);expect(f(at10,7n)).toEqual(last);expect(at10.fields.get(4n)).toEqual(application.fields.get(4n));
 if(profile==='informative'){
  expect(f(rec(f(last,3n),902n),1n)).toEqual(q(1,100));expect(f(last,4n)).toEqual(q(1,25));expect(f(last,5n)).toEqual(q(26,25));expect(f(last,6n)).toEqual(q(26,51));
  expect(f(rec(f(application,4n),902n),1n)).toEqual(q(3,100));expect(f(at10,5n)).toEqual(q(3,100));expect(f(at10,6n)).toEqual(q(4,1));
 }else if(profile==='established'){expect(f(last,4n)).toEqual(q(0,1));expect(f(application,5n)).toBe(false);expect(f(at10,5n)).toEqual(q(2,5));}
 else if(profile==='zero'){expect(last.fields.has(3n)).toBe(false);expect(f(last,6n)).toEqual(q(1,2));expect(application.fields.has(4n)).toBe(false);expect(at10.fields.has(4n)).toBe(false);}
 const entries=state(r).entries().filter(e=>isEffectEpisodePath(e.path));expect(entries.length).toBeGreaterThan(0);entries.forEach(e=>validateEffectEpisode(e.value,C,PROPOSITIONS[0]));
 // Entire roster is reached in the same run as actual tasks, decisions and memory.
 expect(types(r,907n).length).toBe(samples.length);expect(types(r,904n).length).toBe(samples.length);expect(types(r,409n).length).toBeGreaterThanOrEqual(1);
}
it('M114 informative saturation and shared continuation',async()=>{
 const a=fixture('informative',10),b=fixture('informative',80);expect(a.s).toEqual(b.s);bytes(a.d.initialState,b.d.initialState);bytes(a.d.runSeed,b.d.runSeed);
 const m=await prepareCharacterModel(a.s),left=await createCharacterRun(m,a.d),right=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,a.d);let restored:Run|undefined;
 const settlements:string[]=[];
 for(let i=0;i<32;i++){
  const next=await left.settleNextInstant();expect(await right.settleNextInstant()).toBe(next);
  if(left.snapshot().clock<=10n){expect(await repeat.settleNextInstant()).toBe(next);exact(left,repeat);}
  if(restored){expect(await restored.settleNextInstant()).toBe(next);exact(left,restored);}
  compare(left,right);const at=left.snapshot().clock;settlements.push(String(at)+(next?'':':end'));
  if(at===10n){live(left,'informative');live(right,'informative');restored=await restoreCharacterRun(a.s,{initialState:a.d.initialState,orderedInputs:a.d.orderedInputs,save:left.save()});exact(left,restored);}
  console.info('M114 informative equality '+String(at));if(!next){expect(at).toBe(101n);break;}expect(i).toBeLessThan(31);
 }
 expect(restored).toBeDefined();
 const ta=events(left),tb=events(right);expect(ta.length).toBe(tb.length);let draws=0;
 for(let i=0;i<ta.length;i++){const ev=event(ta[i]),truth=[BODY_DELIVERY,EFFECT_OBSERVE].some(x=>key(x)===key(f(ev,5n))),delivery=key(BODY_DELIVERY)===key(f(ev,5n)),omit=truth?[3n,4n,12n,13n,...(delivery?[18n]:[])]:[3n];
  if(delivery){const x=items(f(ta[i],18n),'list').map(v=>rec(v,130n)),y=items(f(tb[i],18n),'list').map(v=>rec(v,130n));expect(x.length).toBe(y.length);expect(x.length).toBeLessThanOrEqual(1);for(let j=0;j<x.length;j++){expect(f(x[j],5n)).toEqual(EFFECT_OBSERVE);expect(f(x[j],3n)).toEqual(unsigned(120));same(list([...x[j].fields].filter(([k])=>k!==6n).map(([k,v])=>list([unsigned(k),v]))),list([...y[j].fields].filter(([k])=>k!==6n).map(([k,v])=>list([unsigned(k),v]))));expect(f(x[j],6n)).toEqual(items(f(ta[i],13n),'list')[0]);expect(f(y[j],6n)).toEqual(items(f(tb[i],13n),'list')[0]);}}
  same(list([...ta[i].fields].filter(([k])=>!omit.includes(k)).map(([k,v])=>list([unsigned(k),v]))),list([...tb[i].fields].filter(([k])=>!omit.includes(k)).map(([k,v])=>list([unsigned(k),v]))));
  draws+=items(f(ta[i],14n),'list').length;
 }
 expect(draws).toBeGreaterThan(0);
 const control=await runCase('informativeA'),original=records(control.outputs,910n).at(-1)!,actual=types(left,910n).at(-1)!;
 for(const field of [4n,5n,6n])expect(f(actual,field)).toEqual(f(original,field));
 console.info('M114 INFORMATIVE PASS '+JSON.stringify({settlements,events:ta.length,draws,learning:'1/100 -> 3/100',surprise:'1/25',strength:'26/51'}));
},550000);
it('M114 established unknown zero denied and point controls',async()=>{
 for(const profile of ['established','fresh','zero','denied','point']as Profile[]){
  const a=fixture(profile,10),b=fixture(profile,80),m=await prepareCharacterModel(a.s),left=await createCharacterRun(m,a.d),right=await createCharacterRun(m,b.d);
  await through(left,10n);await through(right,10n);live(left,profile);live(right,profile);
  if(profile!=='point')compare(left,right);else{expect(types(left,900n)).not.toEqual(types(right,900n));expect(types(left,910n)).not.toEqual(types(right,910n));expect(state(left).read(effectBeliefPath(C,PROPOSITIONS[0])).value).not.toEqual(state(right).read(effectBeliefPath(C,PROPOSITIONS[0])).value);}
  console.info('M114 CONTROL PASS '+profile);
 }
},550000);
function noTruth(v:CanonicalValue):void{
 if(typeof v==='boolean')return;
 if(v.kind==='record'){expect([479n,898n,899n,912n]).not.toContain(v.schema.typeId);for(const x of v.fields.values())noTruth(x);}
 else if(v.kind==='list'||v.kind==='set')v.items.forEach(noTruth);
 else if(v.kind==='map')v.entries.forEach(([k,x])=>{noTruth(k);noTruth(x);});
 else if(v.kind==='typedIdentifier')noTruth(v.payload);
}
function manifest(a:ReturnType<typeof fixture>,b:ReturnType<typeof fixture>){
 expect(a.s).toEqual(b.s);bytes(a.d.initialState,b.d.initialState);bytes(a.d.runSeed,b.d.runSeed);
 const x=items(decode(a.d.orderedInputs),'list'),y=items(decode(b.d.orderedInputs),'list');expect(x.length).toBe(y.length);
 let count=0;for(let i=0;i<x.length;i++){if(key(x[i])===key(y[i]))continue;count++;const p=items(x[i],'list'),other=items(y[i],'list');
 expect(p[2]).toEqual(BODY_DELIVERY);same(list(p.filter((_,i)=>i!==3)),list(other.filter((_,i)=>i!==3)));expect(p[3]).toEqual(list([C,q(10,1),true]));expect(other[3]).toEqual(list([C,q(80,1),true]));}
 expect(count).toBe(1);
}
it('M114 admission owner retention and late rollback',async()=>{
 const b=fixture('informative',10),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d);await through(a,10n);
 manifest(b,fixture('informative',80));
 const physical=types(a,479n).at(-1)!;expect([1n,2n,3n,4n,5n].map(k=>f(physical,k))).toEqual([95,10,5,5,100].map(n=>q(n,1)));
 noTruth(safe(a));noTruth(state(a).canonicalValue());
 for(const t of events(a)){const e=event(t);if(![BODY_DELIVERY,EFFECT_OBSERVE].some(x=>key(x)===key(f(e,5n)))){noTruth(f(t,12n));noTruth(f(t,13n));}
  if(key(f(t,6n))===key(text('effect-evidence/0.1'))&&[50n,130n,140n].includes(uint(f(e,3n))))for(const read of items(f(t,11n),'list')){const root=f(rec(f(rec(read,147n),2n),140n),1n);expect([key(unsigned(362)),key(unsigned(346))]).toContain(key(root));}
 }
 const compiled=await compileCharacterModel(b.s),component=await compileCharacterState(compiled),s=state(a),bp=effectBeliefPath(C,PROPOSITIONS[0]),belief=s.read(bp).value!;
 await expect(createCharacterRun(m,{...b.d,initialState:a.snapshot().state})).rejects.toThrow();
 expect(()=>component.stateModel.applyPatch(s,{operations:[{kind:'set',path:bp,expected:{presence:true,value:belief},newValue:belief}]},bodyId(1025,'authority/episodic-encoding'))).toThrow();
 const episode=s.entries().find(e=>isEffectEpisodePath(e.path))!;
 expect(()=>component.stateModel.applyPatch(s,{operations:[{kind:'set',path:episode.path,expected:{presence:true,value:episode.value},newValue:episode.value}]},bodyId(1025,'authority/belief-expectation'))).toThrow();
 const rows=items(decode(b.d.orderedInputs),'list');
 const forged=list([signed(9),unsigned(130),EFFECT_EVIDENCE,list([]),list([])]);
 await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list([...rows,forged]))})).rejects.toThrow();
 const delivery=rows.find(v=>key(items(v,'list')[2])===key(BODY_DELIVERY))!;
 await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list([...rows,delivery]))})).rejects.toThrow();
 const noRetention=fixture('informative',10,0),empty=await createCharacterRun(await prepareCharacterModel(noRetention.s),noRetention.d);await through(empty,10n);
 expect(state(empty).entries().filter(e=>isEffectEpisodePath(e.path))).toHaveLength(0);const emptyBelief=rec(state(empty).read(bp).value!,902n),fullBelief=rec(belief,902n);
 for(const field of [1n,2n])expect(f(emptyBelief,field)).toEqual(f(fullBelief,field));
 const support=(run:Run,estimate:CanonicalValue)=>{const ids=items(f(rec(estimate,902n),3n),'set').map(key),samples=types(run,900n).filter(s=>ids.includes(key(f(s,1n))));expect(samples.length).toBe(ids.length);return list(samples.map(s=>list([2n,3n,4n,5n,6n,7n].map(k=>f(s,k)))));};
 same(support(empty,emptyBelief),support(a,fullBelief));expect(f(types(empty,906n)[0],4n)).toEqual(emptyBelief);expect(types(empty,906n)[0].fields.has(7n)).toBe(false);expect(types(empty,906n)[0].fields.has(4n)).toBe(true);
 // Test-only reached fault after both real effect owners have produced their writes.
 const inputs=await compileCharacterInputs(compiled,component,b.d),failed=createCharacterRuntime(compiled,component,inputs,component.initialState(b.d.initialState));
 for(let n=0;failed.snapshot().clock<8n;n++){expect(n).toBeLessThan(32);expect(await failed.settleNextInstant()).toBeDefined();}
 expect(failed.snapshot().clock).toBe(8n);
 const snapshot=()=>{const x=failed.snapshot();return {...x,state:enc(x.state.canonicalValue())};},before=snapshot(),dice=failed.committedRandomAddressKeys(),apply=stateModule.applyStatePatch;let reached=false,beliefWritten=false;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.kind==='set'&&key(o.path.rootStateTypeId===362n&&o.path.fieldId===2n?o.newValue:false)===key(belief))){expect(result.state.read(bp).value).toEqual(belief);beliefWritten=true;}if(args[1].operations.some(o=>o.kind==='set'&&isEffectEpisodePath(o.path)&&time(items(o.newValue,'list')[5])===9n)){expect(beliefWritten).toBe(true);expect(result.state.entries().some(e=>isEffectEpisodePath(e.path)&&time(items(e.value,'list')[5])===9n)).toBe(true);reached=true;throw Error('M114 after actual belief and episode writes');}return result;});
 try{await expect(failed.settleNextInstant()).rejects.toThrow('M114 after actual belief and episode writes');}finally{spy.mockRestore();}
 expect(reached).toBe(true);expect({...snapshot(),status:before.status}).toEqual(before);expect(failed.snapshot().status).toBe('Failed');expect(failed.committedRandomAddressKeys()).toEqual(dice);expect(failed.diagnostic()).toBeDefined();
 console.info('M114 OWNERS RETENTION ROLLBACK PASS after actual belief and episode writes; full queue/allocator/state/output/trace/clock/dice unchanged');

},550000);

it('M114 original exact and lattice leakage controls remain discriminating',async()=>{
 for(const numeric of [1,2])for(const projection of [1,2,3]){
  const a=await runCase('establishedA',projection,numeric),b=await runCase('establishedB',projection,numeric);
  if(projection===1)expect(a.run.characterView()).toEqual(b.run.characterView());
  else for(const type of [900n,910n,905n,906n])expect(records(a.outputs,type)).not.toEqual(records(b.outputs,type));
  console.info('M114 ORIGINAL CONTROL PASS '+JSON.stringify({numeric,projection}));
 }
},110000);

it('M114 source capacity and permission admission',async()=>{
 const b=fixture('informative',10),m=await prepareCharacterModel(b.s),rows=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(BODY_DELIVERY));
 const input=(count:number,permission:CanonicalValue,amount=0)=>({...b.d,orderedInputs:enc(list([...rows,...Array.from({length:count},(_,i)=>list([signed(i+1),unsigned(110),BODY_DELIVERY,list([C,q(amount,1),permission]),list([])]))]))});
 await expect(createCharacterRun(m,input(64,true))).resolves.toBeDefined();
 await expect(createCharacterRun(m,input(65,true))).rejects.toThrow('support capacity64');
 await expect(createCharacterRun(m,input(80,false))).resolves.toBeDefined();
 await expect(createCharacterRun(m,input(1,text('true')))).rejects.toThrow('delivery target/amount');
 await expect(createCharacterRun(m,input(1,true,101))).rejects.toThrow('delivery target/amount');
 console.info('M114 SOURCE ADMISSION PASS 64 permitted / 65 rejected / 80 denied; boolean and amount guarded');
},110000);
