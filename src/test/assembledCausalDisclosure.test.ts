import {it,expect} from 'vitest';
// @ts-expect-error Node-only evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Node-only hashing.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless Node-only evidence.
import {deflateSync} from 'node:zlib';
import {restorePreparedCharacterRun,createCharacterRun,prepareCharacterModel} from '../assembled/character';
import {compileCharacterModel,BELIEF_CONFIDENCE_RULES,BELIEF_CONFIDENCE_REGISTRY} from '../assembled/model';
import {FROZEN,SIGNAL,RECEIVED,knowledgePath,CAUSAL_DISCLOSURE_VERSION} from '../assembled/communication';
import {CAUSAL_APPRAISAL} from '../assembled/causalAttribution';
import {SKILL_ACTUAL} from '../assembled/skill';
import {ACTION_BODY} from '../assembled/actionBody';
import {OBSTRUCTION_RESULT} from '../assembled/externalObstruction';
import {restoreAuthoritativeState} from '../substrate/state';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {start,fixture,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,sid,type CanonicalValue} from './fixtures/assembledCausalDisclosure';
const file='docs/planning/ASSEMBLED_CHARACTER_M254_EVIDENCE.json',hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex'),zip=(v:Uint8Array)=>({hash:hash(v),bytes:v.length,deflate:deflateSync(v).toString('base64')});
const put=(k:string,v:unknown)=>{const old=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};if(old[k]!==undefined){expect(old[k]).toEqual(v);return;}old[k]=v;writeFileSync(file,JSON.stringify(old,null,2)+'\n');};
type Run=Awaited<ReturnType<typeof start>>['run'];
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
function exact(a:Run,b:Run){const x=a.snapshot(),y=b.snapshot();expect(x.clock).toBe(y.clock);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());}
function capture(run:Run){const s=run.snapshot();return {clock:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(run.save())};}
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function finish(run:Run){for(let i=0;i<96;i++)if(!await run.settleNextInstant())return;throw Error('M254 queue cap');}
function claims(x:Awaited<ReturnType<typeof start>>,last=9){
 const frozen=reports(x.run,FROZEN),signals=reports(x.run,SIGNAL),causal=reports(x.run,CAUSAL_APPRAISAL);
 expect(causal.map(v=>v[6])).toEqual([list([]),q(1,10),q(last,10)]);
 expect(frozen.map(v=>v[1])).toEqual([4,6,8].map(signed));expect(frozen.map(v=>v[4])).toEqual([list([]),list([q(1,10)]),list([q(last,10)])]);
 for(const v of frozen)expect(v[3],'chosen action is disclosure').toEqual(x.b.action);
 expect(signals.map(v=>v[5])).toEqual([false,true,true]);for(const v of signals.slice(1))expect(v[4],'physical execution applied').toBe(true);expect(reports(x.run,OBSTRUCTION_RESULT)[0][6]).toBe(true);
 const state=restoreAuthoritativeState(decode(x.run.snapshot().state)),history=items(state.read(knowledgePath(x.b.recipients[0])).value!,'list');expect(history.map(v=>items(v,'list')[3])).toEqual([list([q(1,10)]),list([q(last,10)])]);
 expect(state.read(knowledgePath(x.b.recipients[1])).presence).toBe(false);
 for(const v of history)expect(items(v,'list')[4]).toEqual(x.b.topic);
 const ts=outputs(x.run.snapshot().trace,160n).filter(t=>{const e=rec(f(t,4n),130n);return key(f(e,3n))===key(u(90))&&typeof f(t,6n)!=='boolean'&&(f(t,6n) as {value?:string}).value?.startsWith(CAUSAL_DISCLOSURE_VERSION);});
 expect(ts).toHaveLength(3);for(const t of ts)expect(items(f(t,11n),'list')).toHaveLength(2);
 return {probabilities:['unknown','1/10',last+'/10'],delivered:2,recipientDenied:true,actualReadTraces:ts.length};
}
it('causal254 primary: actual failure explanation changes delivered behavior',async()=>{
 for(const mode of ['corrected','denied'] as const){const x=await start(mode);await through(x.run,8n);put(mode+'-delivered-raw',capture(x.run));const result=claims(x,mode==='denied'?1:9);put(mode+'-claims',result);await finish(x.run);put(mode+'-terminal',{save:hash(x.run.save())});}
 console.info('M254 PRIMARY actual failure4 -> explanation1/10 delivered6 -> corrected9/10 delivered8; denied correction stays1/10');
},590000);
it('causal254 boundaries: unknown, success, current evidence and recipient gates',async()=>{
 for(const mode of ['missing','success','current','delivery','access'] as const){const x=await start(mode);await through(x.run,8n);put(mode+'-raw',capture(x.run));
  const frozen=reports(x.run,FROZEN),signals=reports(x.run,SIGNAL),state=restoreAuthoritativeState(decode(x.run.snapshot().state));expect(frozen).toHaveLength(3);
  if(mode==='missing'||mode==='success'){expect(frozen.map(v=>v[4])).toEqual([list([]),list([]),list([])]);expect(signals.every(v=>v[5]===false)).toBe(true);}
  if(mode==='current')claims(x);
  if(mode==='delivery'||mode==='access'){expect(frozen.map(v=>v[4])).toEqual([list([]),list([q(1,10)]),list([q(9,10)])]);expect(signals.map(v=>v[5])).toEqual(mode==='delivery'?[false,false,false]:[false,true,true]);}
  if(mode!=='current')expect(state.read(knowledgePath(x.b.recipients[0])).presence).toBe(false);
  await finish(x.run);put(mode+'-terminal',{save:hash(x.run.save())});
 }
 console.info('M254 BOUNDARIES unknown/not-failure absent; current14 evidence waits140; delivery/access gates preserve private belief');
},590000);
it('causal254 privacy repeat and continuation',async()=>{
 const x=await start(),hidden=await start('hidden');await through(x.run,6n);await through(hidden.run,6n);
 const saved=x.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:saved})),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));await through(repeat,6n);exact(x.run,repeat);exact(x.run,restored);
 const projection=(r:Run)=>({causal:reports(r,CAUSAL_APPRAISAL).map(v=>v.slice(0,9)),claims:reports(r,FROZEN).map(v=>[v[1],v[4],v[5]]),received:reports(r,RECEIVED).map(v=>{const a=items(v[1],'list');return [a[1],a[2],a[3],a[4]];})});
 put('privacy6',{main:capture(x.run),hidden:capture(hidden.run)});expect(reports(x.run,ACTION_BODY)[0][5]).toEqual(text('Blocked'));expect(reports(hidden.run,ACTION_BODY)[0][5]).toEqual(text('Applied'));for(const r of [x.run,hidden.run])expect(reports(r,SKILL_ACTUAL)[0][7]).toBe(true);expect(reports(x.run,OBSTRUCTION_RESULT)[0][6]).toBe(true);expect(reports(hidden.run,OBSTRUCTION_RESULT)[0][6]).toBe(false);expect(projection(x.run)).toEqual(projection(hidden.run));
 for(let i=0;i<96;i++){const more=await x.run.settleNextInstant();for(const p of [restored,repeat]){expect(await p.settleNextInstant()).toBe(more);exact(x.run,p);}expect(await hidden.run.settleNextInstant()).toBe(more);expect(projection(x.run)).toEqual(projection(hidden.run));if(!more){put('continuation',{checkpoint:hash(saved),terminal:hash(x.run.save()),exactRepeatRestore:true,hiddenObstructionDiffers:true,projection:Object.fromEntries(Object.entries(projection(x.run)).map(([name,rows])=>[name,rows.map(row=>key(list(row)))])),hidden:capture(hidden.run)});return;}}
 throw Error('M254 continuation cap');
},590000);
it('causal254 admission and old topic',async()=>{
 const b=fixture(),slots=items(decode(b.s.registry),'list'),comm=items(slots[18],'list'),topic=items(comm[3],'list'),compiled=await compileCharacterModel(b.s),other=compiled.strategy!.flatMap(t=>t.plans).find(p=>key(p.actionId)!==key(comm[1]))!.actionId;
 for(const [name,t,c]of [['zero',list([topic[0],topic[1],u(0)]),false],['large',list([topic[0],topic[1],u(1000001)]),false],['foreign',list([topic[0],sid(1027,'unknown-task'),topic[2]]),false],['contrary',comm[3],true]] as const){const changed=[...slots];changed[18]=list([...comm.slice(0,3),t,...(c?[other]:[])]);await expect(compileCharacterModel({...b.s,registry:enc(list(changed))}),name).rejects.toThrow();}
 await expect(prepareCharacterModel({...b.s,rulesVersion:BELIEF_CONFIDENCE_RULES,registrySchemaVersion:BELIEF_CONFIDENCE_REGISTRY})).rejects.toThrow('outcome topic');
 const old=await start('corrected',true);await through(old.run,8n);expect(reports(old.run,FROZEN)).toHaveLength(3);put('ordinary157',capture(old.run));await finish(old.run);put('admission',{invalidTaskTicketContrary:true,oldVersionRejectsNewTopic:true,ordinaryTopicStillRuns:true});
},590000);

