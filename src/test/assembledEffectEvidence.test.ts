import {it,expect} from 'vitest';
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
import {workLimit} from './fixtures/assembledCharacter';
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
 expect(at10.fields.has(7n),'later cognitive read of surviving encoding').toBe(true);expect(f(at10,7n)).toEqual(last);
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
 for(let i=0;i<ta.length;i++){const ev=event(ta[i]),truth=[BODY_DELIVERY,EFFECT_OBSERVE].some(x=>key(x)===key(f(ev,5n))),omit=truth?[3n,4n,12n,13n]:[3n];
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
it('M114 admission owner retention and late rollback',async()=>{
 const b=fixture('informative',10),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d);await through(a,10n);
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
 expect(state(empty).entries().filter(e=>isEffectEpisodePath(e.path))).toHaveLength(0);expect(state(empty).read(bp).value).toEqual(belief);expect(types(empty,906n)[0].fields.has(7n)).toBe(false);expect(types(empty,906n)[0].fields.has(4n)).toBe(true);
 // Native transaction failure after effect9 has frozen evidence: derive only work
 // topology, then set the cap below the last event. Earlier instants must fit.
 const counts=new Map<bigint,Set<string>>();for(const t of events(a)){const e=event(t),at=time(f(e,2n)),set=counts.get(at)??new Set<string>();set.add(key(f(e,1n)));counts.set(at,set);}
 const n=counts.get(9n)!.size;expect(Math.max(...[...counts].filter(([at])=>at<9n).map(([,s])=>s.size))).toBeLessThan(n-1);
 const failed=await createCharacterRun(await prepareCharacterModel(workLimit(b.s,BigInt(n-1))),b.d);await through(failed,8n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow();expect({...failed.snapshot(),status:before.status}).toEqual(before);
 console.info('M114 OWNERS RETENTION ROLLBACK PASS '+JSON.stringify({eventsAt9:n,cap:n-1}));
},550000);
