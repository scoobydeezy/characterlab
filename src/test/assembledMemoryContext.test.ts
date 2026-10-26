import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {MEMORY_CONTEXT_RULES,WORKSPACE_REGISTRY} from '../assembled/model';
import {JOINT_APPRAISAL,MEMORY_CONTEXT,contextAppraisal} from '../assembled/appraisal';
import {WORKSPACE} from '../assembled/workspace';
import {RECALL,isBodyEpisodePath,MEMORY_RECALL} from '../assembled/memory';
import {BODY_CHANNEL,BODY_OBSERVER} from '../assembled/body';
import {canonicalEncode as enc,list,text,signed,unsigned,rational,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {simInstant} from '../substrate/time';
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {exact as readQ} from '../campaign3/embodiedMath';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {contextSource,contextData,addCurrentSense} from './fixtures/assembledMemoryContext';
import {interactionData,outputs} from './fixtures/assembledInteraction';
import {workLimit} from './fixtures/assembledCharacter';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const entries=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state)).entries();
const episodes=(run:Run)=>entries(run).filter(e=>isBodyEpisodePath(e.path));
const stableState=(run:Run)=>entries(run).filter(e=>!isBodyEpisodePath(e.path)&&e.path.rootStateTypeId!==455n);
const traces=(run:Run)=>outputs(run.snapshot().trace,160n);
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const name=(t:CanonicalValue)=>txt(id(f(rec(t,160n),7n)).payload);
const draws=(run:Run)=>new Map(traces(run).flatMap(t=>items(f(t,14n),'list')).map(v=>[key(f(rec(v,411n),1n)),v]));
const joint=(run:Run,i=0)=>reports(run,JOINT_APPRAISAL)[i];
const mode=(run:Run,i=0)=>txt(items(joint(run,i)[5],'list')[1]);
const selected=(run:Run,i=0)=>items(reports(run,WORKSPACE)[i][4],'list').map(v=>items(v,'list'));
const cognition=(run:Run)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId>=381n&&v.schema.typeId<=433n);
const choice=(run:Run)=>{const decision=outputs(run.snapshot().outputs,409n)[0],result=rec(f(decision,4n),419n);if(uint(f(result,1n))!==3n)return 'NoChoice:'+uint(f(result,1n));return txt(id(f(rec(f(rec(f(result,2n),420n),1n),395n),2n)).payload);};
async function through(run:Run,at:bigint){for(let n=0;run.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await run.settleNextInstant()).toBe(true);}expect(run.snapshot().clock).toBe(at);}
async function finish(run:Run){for(let n=0;await run.settleNextInstant();n++)expect(n).toBeLessThan(32);expect(run.snapshot().clock).toBe(10n);expect(run.diagnostic()).toBeUndefined();}
const exactRuns=(a:Run,b:Run)=>{expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());expect(b.runIdentity()).toEqual(a.runIdentity());};
const mask=(v:CanonicalValue,fields:bigint[])=>{const r=rec(v,160n);return record(r.schema,new Map([...r.fields].map(([n,x])=>[n,fields.includes(n)?false:x])));};
function joins(run:Run,body:0|1){
 expect(uint(f(rec(f(outputs(run.snapshot().outputs,409n)[0],4n),419n),1n))).toBe(3n);const j=joint(run),w=reports(run,WORKSPACE)[0],s=selected(run);expect(s).toHaveLength(1);expect(mode(run)).toBe('RecalledContext');expect(items(j[5],'list')[0]).toEqual(text(MEMORY_CONTEXT));expect(items(j[5],'list')[2]).toEqual(list(s[0]));
 expect(s[0][1]).toEqual(episodes(run)[0].value);expect(s[0][1]).toEqual(reports(run,RECALL)[0][2]);const ep=items(s[0][1],'list');expect(j[2]).toEqual(ep[2]);expect(j[3]).toEqual(ep[3]);expect(f(rec(j[2],461n),4n)).toEqual(signed(3));
 const tw=rec(w[3],381n),forecast=rec(f(tw,5n),380n);expect(items(f(tw,4n),'list')).toHaveLength(2);expect(uint(f(forecast,1n))).toBe(2n);expect(f(rec(f(forecast,2n),361n),1n)).toEqual(rational(3,1));expect(uint(w[2])).toBe(4n);
 const values=items(j[4],'list').map(v=>items(v,'list'));for(const [i,row]of values.entries()){const expected=body===0?(i===0?Q.of(11n,120n):Q.of(11n,30n)):(i===0?Q.of(1n,20n):Q.of(1n,5n));expect(row[4]).toEqual(rational(expected.numerator,expected.denominator));}
 const app=traces(run).find(t=>name(t)==='event/task-appraisal')!,ws=traces(run).find(t=>name(t)==='event/deliberation-opportunity')!,retr=traces(run).find(t=>name(t)==='event/assembled-memory-recall')!;
 expect(f(ws,6n)).toEqual(text('assembled-character-workspace/0.2-candidate'));expect(f(event(retr),1n)).toEqual(s[0][2]);expect(items(f(event(app),8n),'list')).toContainEqual(s[0][2]);expect(items(f(app,12n),'list')[1]).toEqual(list(w));expect(items(f(app,9n),'list')).toContainEqual(ep[1]);expect(items(f(app,11n),'list')).toEqual([]);expect(items(f(ws,9n),'list')).toContainEqual(ep[1]);
 const raw=outputs(run.snapshot().outputs,403n)[0];for(const signal of items(f(raw,3n),'set')){const r=rec(signal,402n);if(uint(f(rec(f(r,1n),401n),3n))!==2n)continue;const basis=f(rec(f(r,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');expect(basis.entries.some(([k])=>{const reference=rec(f(rec(k,399n),2n),237n);return key(f(reference,2n))===key(f(rec(j[2],461n),1n));})).toBe(true);}
 const reasons=items(f(outputs(run.snapshot().outputs,408n)[0],3n),'list').map(v=>rec(v,407n));expect(reasons).toHaveLength(2);expect(reasons.map(v=>f(v,6n))).toEqual([signed(0),signed(body?1:2)]);
 for(const stage of ['event/task-concern','event/task-raw-signals']){const t=traces(run).find(t=>name(t)===stage)!;expect(items(f(t,12n),'list')[1]).toEqual(list(j));expect(items(f(t,9n),'list')).toContainEqual(ep[1]);}
}
describe('M9 memory-dependent choice',()=>{
 it('fixed seeds0..15 matrix: recalled context changes choice and workspace ablation removes the history effect',async()=>{
  const models=await Promise.all([prepareCharacterModel(contextSource(4)),prepareCharacterModel(contextSource(3))]);let changed=0,shared=0;
  for(let seed=0;seed<16;seed++){const runs:Run[][]=[[],[]];
   for(const [c,m]of models.entries())for(const b of [0,1] as const){const d=contextData(b,seed),run=await createCharacterRun(m,d);await through(run,4n);runs[c][b]=run;}
   for(const pair of runs)expect(stableState(pair[0])).toEqual(stableState(pair[1]));for(const b of [0,1])expect(runs[0][b].snapshot().state).toEqual(runs[1][b].snapshot().state);
   for(const [c,pair]of runs.entries())for(const b of [0,1] as const){await through(pair[b],5n);if(c===0)joins(pair[b],b);else{expect(selected(pair[b])).toEqual([]);expect(mode(pair[b])).toBe('Unavailable');expect(reports(pair[b],RECALL)).toHaveLength(1);expect(episodes(pair[b])).toHaveLength(1);}await finish(pair[b]);}
   expect(cognition(runs[1][0])).toEqual(cognition(runs[1][1]));expect(joint(runs[1][0])).toEqual(joint(runs[1][1]));expect(draws(runs[1][0])).toEqual(draws(runs[1][1]));expect(choice(runs[1][0])).toEqual(choice(runs[1][1]));
   for(const b of [0,1]){expect(episodes(runs[0][b])).toEqual(episodes(runs[1][b]));expect(reports(runs[0][b],RECALL)).toEqual(reports(runs[1][b],RECALL));}
   const all=runs.flat().map(draws);for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++)for(const [address,draw]of all[i])if(all[j].has(address)){expect(all[j].get(address)).toEqual(draw);shared++;}
   if(choice(runs[0][0])!==choice(runs[0][1]))changed++;
   console.info('M9 seed '+seed+' choices='+JSON.stringify(runs.map(pair=>pair.map(choice)))+' drawCounts='+JSON.stringify(all.map(m=>m.size)));
  }console.info('M9 changed-history choices='+changed+'/16; actual equal-address draw pairs='+shared);expect(changed).toBeGreaterThan(0);
 },540000);
 it('controls: four current-sensing M3 cells preserve prior behavior against0.8',async()=>{
  const models=[await prepareCharacterModel(contextSource(3,true)),await prepareCharacterModel(contextSource(3))];
  for(const h of [0,1] as const)for(const b of [0,1] as const){const runs:Run[]=[];for(const m of models){const run=await createCharacterRun(m,interactionData(h,b,7));await finish(run);runs.push(run);}const [a,n]=runs;expect(n.snapshot().state).toEqual(a.snapshot().state);expect(cognition(n)).toEqual(cognition(a));expect(draws(n)).toEqual(draws(a));expect(joint(n).slice(0,5)).toEqual(joint(a));expect(mode(n)).toBe('Current');
   const unchanged=(run:Run)=>traces(run).filter(t=>!['event/task-appraisal','event/task-concern','event/task-raw-signals'].includes(name(t))).map(t=>mask(t,[2n,3n,...(name(t)==='event/deliberation-opportunity'?[6n]:[])]));expect(unchanged(n)).toEqual(unchanged(a));
  }
 },180000);
 it('controls: repeat and restore before recall match every whole later boundary',async()=>{
  const s=contextSource(),m=await prepareCharacterModel(s),d=contextData(1),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,4n);await through(b,4n);exactRuns(a,b);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exactRuns(a,restored);
  for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await a.settleNextInstant();for(const peer of [b,restored]){expect(await peer.settleNextInstant()).toBe(more);exactRuns(a,peer);}if(!more)break;}expect(mode(a)).toBe('RecalledContext');expect(draws(a).size).toBeGreaterThan(0);
 },150000);
 it('controls: hidden truth stays out, current zero takes precedence, failed sensing cannot fall back',async()=>{
  const m=await prepareCharacterModel(contextSource()),a=await createCharacterRun(m,contextData(0,7,10)),b=await createCharacterRun(m,contextData(0,7,11));await finish(a);await finish(b);expect(a.snapshot().state).not.toEqual(b.snapshot().state);expect(cognition(a)).toEqual(cognition(b));expect(joint(a)).toEqual(joint(b));expect(draws(a)).toEqual(draws(b));
  const current=await createCharacterRun(m,addCurrentSense(contextData(0),true));await through(current,5n);expect(selected(current)).toHaveLength(1);expect(mode(current)).toBe('Current');expect(f(rec(joint(current)[2],461n),4n)).toEqual(signed(5));for(const row of items(joint(current)[4],'list'))expect(items(row,'list')[2]).toEqual(rational(0,1));
  // Actual workspace plus explicit unavailable current selection: contract-level denial control.
  const t=traces(current).find(t=>name(t)==='event/assembled-body-selection'&&key(f(event(t),2n))===key(signed(5)))!,e=event(t),settledEvent={eventId:uint(f(e,1n)),dueAt:simInstant(5n),phase:20n,eventSequence:uint(f(e,4n)),eventTypeId:id(f(e,5n)),payload:f(e,6n),dependencies:f(e,7n),causalParentEventIds:items(f(e,8n),'list').map(uint)};
  const denied=items(contextAppraisal(joint(current)[1],list(reports(current,WORKSPACE)[0]),5n,{settledEvent},Q.of(60n)),'list');expect(txt(items(denied[5],'list')[1])).toBe('Unavailable');expect(denied[2]).toEqual(list([]));for(const row of items(denied[4],'list'))expect(items(row,'list')).toHaveLength(2);
  for(const [selection,permission]of [[0,true],[1,false]] as const){const run=await createCharacterRun(await prepareCharacterModel(contextSource(4,false,selection,permission)),addCurrentSense(contextData(0)));await finish(run);expect(mode(run)).toBe('Unavailable');expect(reports(run,RECALL)).toHaveLength(0);}
 },150000);
 it('controls: no current handoff at6 even though the memory remains stored',async()=>{
  const run=await createCharacterRun(await prepareCharacterModel(contextSource()),contextData(0,7,10,true));await through(run,5n);expect(mode(run)).toBe('RecalledContext');await through(run,6n);expect(mode(run,1)).toBe('Unavailable');expect(selected(run,1)).toEqual([]);expect(episodes(run)).toHaveLength(1);await finish(run);
 },60000);
 it('controls: late failure after consuming appraisal rolls back the entire instant',async()=>{
  const s=contextSource(),d=contextData(0),rows=items(decode(d.orderedInputs),'list'),delivery=items(rows.find(row=>txt(id(items(row,'list')[2]).payload)==='event/assembled-body-delivery')!,'list');d.orderedInputs=enc(list([...rows,list([signed(5),...delivery.slice(1)])]));const ok=await createCharacterRun(await prepareCharacterModel(s),d);await through(ok,5n);expect(mode(ok)).toBe('RecalledContext');const ts=traces(ok).filter(t=>key(f(event(t),2n))===key(signed(5))),count=new Set(ts.map(t=>key(f(event(t),1n)))).size;expect(ts.some(t=>name(t)==='event/task-appraisal')).toBe(true);
  const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(count-1))),d);await through(failed,4n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow();expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(failed.diagnostic()).toBeDefined();console.info('M9 late rollback '+count+' events, limit'+(count-1));
 },60000);
 it('controls: version/capacity admission and public memory forgery reject',async()=>{
  await expect(prepareCharacterModel(contextSource(4,true))).rejects.toThrow('capacity');await expect(prepareCharacterModel(contextSource(5))).rejects.toThrow('capacity');await expect(prepareCharacterModel({...contextSource(),registrySchemaVersion:WORKSPACE_REGISTRY})).rejects.toThrow('version bundle');
  const m=await prepareCharacterModel(contextSource()),d=contextData(0);await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([list([signed(5),unsigned(20),MEMORY_RECALL,BODY_CHANNEL,list([])])]))})).rejects.toThrow();
 });
});
