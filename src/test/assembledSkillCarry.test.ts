import {it,expect} from 'vitest';
// @ts-expect-error Evidence.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Hash.
import {createHash} from 'node:crypto';
import {skillFixture,longFixture,memoryFixture,start,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,actionA,cachedMemory,type CanonicalValue,type Profile} from './fixtures/assembledSkillCarry';
const path='docs/planning/ASSEMBLED_CHARACTER_M287_EVIDENCE.json',hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
function record(k:string,v:unknown){const e=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{candidate:'0.166',plan:'114837da'};e[k]=v;writeFileSync(path,JSON.stringify(e,null,2)+'\n');}
function plain(v:CanonicalValue):unknown{if(typeof v==='boolean')return v;if(v.kind==='list'||v.kind==='set')return v.items.map(plain);if(v.kind==='record')return {record:String(v.schema.typeId),version:String(v.schema.schemaVersion),fields:Object.fromEntries([...v.fields].map(([k,v])=>[String(k),plain(v)]))};if(v.kind==='map')return v.entries.map(([k,v])=>[plain(k),plain(v)]);if(v.kind==='rational')return v.numerator+'/'+v.denominator;if(v.kind==='typedIdentifier')return {id:String(v.namespaceId),payload:plain(v.payload)};if(v.kind==='bytes')return Array.from(v.value);return String(v.value);}
it('admission287: current receiving declarations admit older histories without learned S0',async()=>{
 const rows=[],errors=[];for(const [name,make] of [['skill',()=>skillFixture('trained-positive')],['long',longFixture],['memory',()=>memoryFixture('lost')]] as const){const b=make();try{const x=await start(b);expect(x.r.snapshot().clock).toBe(0n);rows.push({name,source:hash(b.d.orderedInputs),registry:hash(b.s.registry),...('receiving'in b?b.receiving:{})});console.info('M287 admitted',name);}catch(error){const message=error instanceof Error?error.message:String(error);errors.push({name,message});console.info('M287 admission error',name,message);}}
 record('admission',{rows,errors});expect(errors).toEqual([]);
},560000);

// @ts-expect-error Lossless evidence.
import {deflateRawSync} from 'node:zlib';
import {restorePreparedCharacterRun} from '../assembled/character';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue,restoreStatePath} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {skillPath,SKILL_ACTUAL,SKILL_UPDATE} from '../assembled/skill';
import {expectationPath,expectationValue} from '../assembled/performanceExpectation';
import {ACTION_BODY} from '../assembled/actionBody';
import {isPositionEpisodePath} from '../assembled/memory';
import {validateActionAnnex} from '../assembled/actionMemory';
import {relationshipPath,relationshipFold,relationshipHistory} from '../assembled/relationship';
import {identityJournal,qualificationParts} from '../assembled/identityEligibility';
import {target as person} from './fixtures/assembledLongitudinalCompletion';
type Run=Awaited<ReturnType<typeof start>>['r'];
const fraction=(v:Q|undefined)=>v?v.numerator+'/'+v.denominator:'unknown';
const raw=(b:Uint8Array)=>({sha256:hash(b),length:b.length,deflateBase64:deflateRawSync(b).toString('base64')});
const cache=new WeakMap<ReturnType<Run['snapshot']>,{state:AuthoritativeState;trace:ReturnType<typeof rec>[]}>();
function view(r:Run){const s=r.snapshot();let v=cache.get(s);if(!v){v={state:restoreAuthoritativeState(decode(s.state)),trace:items(decode(s.trace),'list').map(v=>rec(v,160n))};cache.set(s,v);}return v;}
const at=(t:CanonicalValue)=>f(rec(f(rec(t,160n),4n),130n),2n);
const projections=(t:CanonicalValue)=>{const v=f(rec(t,160n),13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[v];};
const atRows=(r:Run,n:number)=>view(r).trace.filter(t=>key(at(t))===key(signed(n)));
function reports(r:Run,n:number,label:string){return atRows(r,n).flatMap(projections).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));}
async function through(r:Run,n:number){for(let i=0;r.snapshot().clock<BigInt(n);i++){expect(i).toBeLessThan(128);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(BigInt(n));}
function equal(a:Run,b:Run){for(const k of ['state','outputs','trace'] as const)expect(hash(a.snapshot()[k])).toBe(hash(b.snapshot()[k]));expect(hash(a.save())).toBe(hash(b.save()));}
async function finish(r:Run,others:Run[]=[]){for(let i=0;i<128;i++){const more=await r.settleNextInstant();for(const other of others){expect(await other.settleNextInstant()).toBe(more);equal(r,other);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M287 natural completion cap');}
function actual(r:Run,p:CanonicalValue,n:number,K:Q,success:boolean,engaged=true){
 const rows=reports(r,n,SKILL_ACTUAL);expect(rows.length,'live procedural assessment at'+n).toBeGreaterThan(0);const a=rows[0];expect(a[10],'declared actual procedure').toEqual(p);expect(a[3]).toEqual(q(K.numerator,K.denominator));expect(a[6]).toBe(engaged);expect(a[7]).toBe(success);
 const body=reports(r,n,ACTION_BODY);expect(body.length,'physical execution consumer').toBeGreaterThan(0);expect(body[0][5]).toEqual(text(success?'Applied':'Blocked'));
 const trace=atRows(r,n).find(t=>projections(t).some(v=>key(v)===key(list(a)))&&items(f(t,11n),'list').some(v=>key(f(rec(v,147n),2n))===key(statePathValue(skillPath(C,p)))));
 expect(trace,'actual competence read').toBeDefined();return a;
}
const profiles:Profile[]=['trained-negative','trained-positive','untrained-positive','impaired','blocked','hidden'];
it.each(profiles)('skill287_%s',async(profile)=>{
 const x=await start(skillFixture(profile)),rows=[],typed:Record<string,string>={};const trained=!['untrained-positive','blocked'].includes(profile);
 for(const n of[10,12,14,16,18,20,22]){await through(x.r,n);const K=n<=12||!trained?Q.of(0n):n===14?Q.of(1n,2n):n<=18?Q.of(1n,4n):Q.of(1n,8n),success=n===14&&trained,a=actual(x.r,x.b.procedure,n,K,success,!(profile==='blocked'&&n===12));
  const belief=expectationValue(view(x.r).state.read(expectationPath(x.b.tasks[0],0n)).value,1000000n).mean;
  expect(fraction(belief)).toBe(profile==='hidden'?'unknown':profile.endsWith('positive')?n<20?'1/1':'7/8':'0/1');
  const skill=view(x.r).state.read(skillPath(C,x.b.procedure));if(n>=12&&trained){expect(skill.presence).toBe(true);const a=items(skill.value!,'list');expect(a[1]).toEqual(q(1,2));expect(uint(a[2])).toBe(1n);expect(uint(a[4])).toBe(12n);}else expect(skill.presence).toBe(false);
  if(n===14)for(const type of[425n,426n,431n]){const values=atRows(x.r,n).flatMap(projections).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);expect(values.length).toBeGreaterThan(0);typed[String(type)]=hash(enc(list(values)));}
  rows.push({at:n,K:fraction(K),success,engaged:a[6],confidence:fraction(belief),impairment:key(a[4])});
 }
 await finish(x.r);record('skill-'+profile,{source:hash(x.b.d.orderedInputs),receiving:x.b.receiving,rows,typed,terminal:raw(x.r.save())});console.info('M287 skill',profile,JSON.stringify(rows));
},560000);
it.each(['original','lost','retained','untrained'] as const)('memory287_%s',async(mode)=>{
 const x=await start(memoryFixture(mode));await through(x.r,4);
 const episodes=view(x.r).state.entries().filter(e=>isPositionEpisodePath(e.path));
 const found=episodes.filter(e=>{const a=items(e.value,'list');return key(a[5])===key(signed(4))&&items(a[8],'list').length>0;});expect(found).toHaveLength(1);
 const episode=found[0],a=items(episode.value,'list'),annex=validateActionAnnex(a[8],a)!;expect(uint(items(annex.observation,'list')[2])).toBe(3n);expect(annex.action).toEqual(actionA);
 const learned=view(x.r).state.read(skillPath(C,x.b.procedure)),prefix=x.r.save(),K=mode==='untrained'?Q.of(0n):Q.of(1n,2n);
 let restored:Run|undefined;if(mode==='lost'){restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:prefix}));equal(x.r,restored);}
 for(const n of mode==='original'?[5,7]:[5,6,7]){await through(x.r,n);if(restored){await through(restored,n);equal(x.r,restored);}
  expect(view(x.r).state.read(episode.path).presence).toBe(mode==='retained');expect(view(x.r).state.read(skillPath(C,x.b.procedure))).toEqual(learned);
  if(n===6)actual(x.r,x.b.procedure,n,K,mode!=='untrained');
  if(n===7)actual(x.r,x.b.procedure,n,K.divide(Q.of(2n)),false);
 }
 const removals=atRows(x.r,5).flatMap(t=>items(f(t,17n),'list')).filter(v=>key(f(rec(v,148n),1n))===key(statePathValue(episode.path)));expect(removals.length).toBe(mode==='retained'?0:1);
 const skillRead=atRows(x.r,mode==='original'?7:6).find(t=>projections(t).some(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(SKILL_ACTUAL)))&&items(f(t,11n),'list').some(v=>key(f(rec(v,147n),2n))===key(statePathValue(skillPath(C,x.b.procedure)))))!;
 expect(skillRead).toBeDefined();expect(items(f(skillRead,11n),'list').some(v=>restoreStatePath(f(rec(v,147n),2n)).rootStateTypeId===346n)).toBe(false);
 await finish(x.r,restored?[restored]:[]);
 record('memory-'+mode,{source:hash(x.b.d.orderedInputs),episode:hash(enc(episode.value)),removed:mode!=='retained',probe6:mode==='original'?null:{K:fraction(K),success:mode!=='untrained'},probe7:{K:fraction(K.divide(Q.of(2n))),success:false},prefix4:mode==='lost'?raw(prefix):undefined,restored:mode==='lost',terminal:raw(x.r.save())});console.info('M287 memory',mode,'PASS');
},560000);
it('long287: BIO, procedure and REL coexist while the new rust law changes old recovery timing',async()=>{
 const x=await start(longFixture());await through(x.r,4);const bio=()=>view(x.r).state.entries().filter(e=>[415n,1503n].includes(e.path.rootStateTypeId)),bioAt4=bio(),journal=bioAt4.filter(e=>e.path.rootStateTypeId===415n&&e.path.fieldId===2n).flatMap(e=>identityJournal(e.value));expect(journal).toHaveLength(1);expect(qualificationParts(journal[0]).accepted).toBe(true);
 await through(x.r,9);expect(bio()).toEqual(bioAt4);const acquired=view(x.r).state,skill=items(acquired.read(skillPath(C,x.b.procedure)).value!,'list');expect(skill[1]).toEqual(q(1,2));expect(uint(skill[4])).toBe(6n);
 const relation=acquired.read(relationshipPath(C,person)).value!;expect(relationshipFold(relation)).toEqual({count:2n,rupture:false,comfort:true});expect(relationshipHistory(relation)).toHaveLength(2);
 const episodes=acquired.entries().filter(e=>e.path.rootStateTypeId===346n);expect(episodes.length).toBeGreaterThan(0);
 const prefix=x.r.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:prefix}));equal(x.r,restored);
 const rows=[];for(const n of[30,32,34,36]){for(let steps=0;x.r.snapshot().clock<BigInt(n);steps++){expect(steps).toBeLessThan(128);expect(await x.r.settleNextInstant()).toBe(true);expect(await restored.settleNextInstant()).toBe(true);equal(x.r,restored);}expect(x.r.snapshot().clock).toBe(BigInt(n));const K=n===30?Q.of(1n,128n):n===36?Q.of(1n,8n):Q.of(0n);actual(x.r,x.b.procedure,n,K,false);expect(bio()).toEqual(bioAt4);expect(view(x.r).state.read(relationshipPath(C,person)).value).toEqual(relation);rows.push({at:n,K:fraction(K),success:false});
  if(n===30){const after=new Set(view(x.r).state.entries().filter(e=>e.path.rootStateTypeId===346n).map(e=>key(statePathValue(e.path))));expect(episodes.some(e=>!after.has(key(statePathValue(e.path))))).toBe(true);expect(reports(x.r,n,SKILL_UPDATE)[0][3]).toEqual(q(0,1));}
 }
 const final=items(view(x.r).state.read(skillPath(C,x.b.procedure)).value!,'list');expect(final[1]).toEqual(q(1,8));expect(uint(final[2])).toBe(2n);expect(uint(final[4])).toBe(34n);
 await finish(x.r,[restored]);record('long',{source:hash(x.b.d.orderedInputs),receiving:x.b.receiving,bio:hash(enc(new AuthoritativeState(bioAt4).canonicalValue())),relation:hash(enc(relation)),rows,prefix9:raw(prefix),terminal:raw(x.r.save()),restored:true});console.info('M287 LONG current law differences/unchanged non-target histories PASS');
},560000);
