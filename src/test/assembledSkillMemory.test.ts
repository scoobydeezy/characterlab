import {it,expect} from 'vitest';
// @ts-expect-error Node evidence output.
import {writeFileSync,readFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless bounded evidence.
import {deflateRawSync,inflateRawSync} from 'node:zlib';
// @ts-expect-error Byte equality avoids giant object diff output.
import {createHash} from 'node:crypto';
import {start,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,actionA,cachedMemory,type CanonicalValue,type Mode} from './fixtures/assembledSkillMemory';
import {createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState,statePathValue,restoreStatePath} from '../substrate/state';
import {skillPath,skillValue,SKILL_ACTUAL,SKILL_OWNER} from '../assembled/skill';
import {isPositionEpisodePath,EPISODIC_OWNER} from '../assembled/memory';
import {validateActionAnnex} from '../assembled/actionMemory';
import {ACTION_BODY} from '../assembled/actionBody';
import {ExactRational as Q} from '../substrate/exactMath';
type X=Awaited<ReturnType<typeof start>>;type Run=X['r'];
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(hash(a)).toBe(hash(b));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const traces=(r:Run)=>items(decode(r.snapshot().trace),'list').map(v=>rec(v,160n));
const at=(t:CanonicalValue)=>f(rec(f(rec(t,160n),4n),130n),2n);
const projection=(t:CanonicalValue)=>{const v=f(rec(t,160n),13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[v];};
function report(r:Run,n:number,tag:string){
 const rows=traces(r).filter(t=>key(at(t))===key(signed(n))).flatMap(projection).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
 expect(rows.length,'live '+tag+' at'+n).toBeGreaterThan(0);return rows[0];
}
async function through(r:Run,n:number){for(let i=0;r.snapshot().clock<BigInt(n);i++){expect(i).toBeLessThan(128);expect(await r.settleNextInstant(),JSON.stringify(r.diagnostic())).toBe(true);}expect(r.snapshot().clock).toBe(BigInt(n));}
function exact(a:Run,b:Run){for(const k of ['state','outputs','trace'] as const)bytes(a.snapshot()[k],b.snapshot()[k]);bytes(a.save(),b.save());}
async function finish(r:Run,other?:Run){for(let i=0;i<128;i++){const more=await r.settleNextInstant();if(other){expect(await other.settleNextInstant()).toBe(more);exact(r,other);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('settle cap');}
function episodes(r:Run){return state(r).entries().filter(e=>isPositionEpisodePath(e.path));}
function practiceEpisode(r:Run){
 const found=episodes(r).filter(e=>{const a=items(e.value,'list');return key(a[5])===key(signed(4))&&items(a[8],'list').length>0;});
 expect(found,'actual action-conditioned practice episode').toHaveLength(1);
 const row=found[0],a=items(row.value,'list'),annex=validateActionAnnex(a[8],a)!;
 expect(uint(items(annex.observation,'list')[2])).toBe(3n);expect(annex.action).toEqual(actionA);
 return row;
}
function probe(x:X,n:number,K:Q,success:boolean){
 const a=report(x.r,n,SKILL_ACTUAL);expect(a[3]).toEqual(q(K.numerator,K.denominator));expect(a[6],'live actual engagement').toBe(true);expect(a[7]).toBe(success);expect(a[10]).toEqual(x.b.procedure);
 expect(report(x.r,n,ACTION_BODY)[5]).toEqual(text(success?'Applied':'Blocked'));
 const reads=traces(x.r).filter(t=>key(at(t))===key(signed(n))).flatMap(t=>items(f(t,11n),'list'));
 expect(reads.some(v=>key(f(rec(v,147n),2n))===key(statePathValue(skillPath(C,x.b.procedure)))),'actual execution reads competence').toBe(true);
 return a;
}
function receipt(r:Run){const s=r.snapshot();return {clock:String(s.clock),state:hash(s.state),outputs:hash(s.outputs),trace:hash(s.trace),save:hash(r.save())};}
const evidence:Record<string,unknown>={candidate:'0.165',plan:'0cd8ef2f',claim:'detailed observed practice episode may be lost while procedural competence remains; outcome provenance is not erased'};
function save(){writeFileSync('docs/planning/ASSEMBLED_CHARACTER_M283_EVIDENCE.json',JSON.stringify(evidence,null,2));}
it('primary283: actual practice scene is lost while learned competence still changes execution',async()=>{
 const acquired:Uint8Array[]=[],skills:Uint8Array[]=[];
 for(const mode of ['lost','retained','untrained'] as const){
  const x=await start(mode);await through(x.r,3);probe(x,3,Q.of(0n),true);
  await through(x.r,4);const e=practiceEpisode(x.r);acquired.push(enc(e.value));
  const before=state(x.r).read(skillPath(C,x.b.procedure));const K=mode==='untrained'?Q.of(0n):Q.of(1n,2n);
  expect(skillValue(before.value,x.b.procedure,true)).toEqual({K,count:mode==='untrained'?0n:1n});
  if(mode!=='untrained')skills.push(enc(before.value!));
  const source=hash(enc(e.value)),path=key(statePathValue(e.path));await through(x.r,5);
  expect(state(x.r).read(e.path).presence).toBe(mode==='retained');
  if(mode!=='retained')expect(episodes(x.r)).toHaveLength(0);
  await through(x.r,7);probe(x,7,K,mode!=='untrained');expect(state(x.r).read(skillPath(C,x.b.procedure))).toEqual(before);
  const removals=traces(x.r).filter(t=>key(at(t))===key(signed(5))).flatMap(t=>items(f(t,17n),'list')).filter(v=>key(f(rec(v,148n),1n))===path);
  expect(removals.length).toBe(mode==='retained'?0:1);
  await finish(x.r);evidence[mode]={episodeHash:source,practice:hash(enc(list(report(x.r,3,SKILL_ACTUAL)))),competence:K.numerator+'/'+K.denominator,success:mode!=='untrained',removed:mode!=='retained',removals:removals.map(v=>hash(enc(v))),terminal:receipt(x.r)};
  save();console.info('M283 arm',mode,'K',K.numerator+'/'+K.denominator,'episode',source,'terminal',String(x.r.snapshot().clock));
 }
 // Model identity differs by capacity, but evidence and competence acquisition are identical.
 bytes(acquired[0],acquired[1]);bytes(skills[0],skills[1]);
},560000);
it('controls283: repeat and restore before episode loss; denied report never creates the action annex',async()=>{
 if(existsSync('docs/planning/ASSEMBLED_CHARACTER_M283_EVIDENCE.json'))Object.assign(evidence,JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M283_EVIDENCE.json','utf8')));
 const x=await start('lost');await through(x.r,4);const episode=practiceEpisode(x.r);
 const raw=(data:Uint8Array)=>({length:data.length,sha256:hash(data),deflateBase64:deflateRawSync(data).toString('base64')});
 const prefix=raw(x.r.save()),episodeBytes=raw(enc(episode.value));
 const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()}));exact(x.r,restored);
 await finish(x.r,restored);const repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));await finish(repeat);exact(x.r,repeat);
 const h=await start('hidden');await through(h.r,4);expect(episodes(h.r).every(e=>items(items(e.value,'list')[8],'list').length===0)).toBe(true);
 expect(skillValue(state(h.r).read(skillPath(C,h.b.procedure)).value,h.b.procedure,true).K).toEqual(Q.of(1n,2n));
 await through(h.r,7);probe(h,7,Q.of(1n,2n),true);await finish(h.r);
 evidence.controls={repeatRestore:receipt(x.r),hiddenReport:receipt(h.r),prefix4:prefix,practiceEpisode:episodeBytes,terminal:raw(x.r.save()),hiddenTerminal:raw(h.r.save())};save();console.info('M283 controls PASS');
},560000);

it('evidence283: saved causal bytes bind episode removal and procedural execution to their actual owners',()=>{
 const e=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M283_EVIDENCE.json','utf8'));
 expect(e.controls.repeatRestore).toEqual(e.lost.terminal);
 const unpack=(a:{deflateBase64:string;sha256:string;length:number})=>{
  const raw=inflateRawSync(Uint8Array.from(atob(a.deflateBase64),c=>c.charCodeAt(0)));
  expect(raw.length).toBe(a.length);expect(hash(raw)).toBe(a.sha256);return decode(raw);
 };
 const prefix=rec(unpack(e.controls.prefix4),132n),terminal=rec(unpack(e.controls.terminal),132n);
 const ps=restoreAuthoritativeState(f(prefix,5n)),ts=restoreAuthoritativeState(f(terminal,5n));
 const episode=unpack(e.controls.practiceEpisode),path=ps.entries().find(x=>key(x.value)===key(episode))!.path;
 expect(ts.read(path).presence).toBe(false);
 const rows=items(f(terminal,11n),'list').map(v=>rec(v,160n));
 const removed=rows.filter(t=>key(at(t))===key(signed(5))).flatMap(t=>items(f(t,17n),'list')).filter(v=>key(f(rec(v,148n),1n))===key(statePathValue(path)));
 expect(removed).toHaveLength(1);expect(f(rec(removed[0],148n),6n)).toEqual(EPISODIC_OWNER);
 const execution=rows.filter(t=>key(at(t))===key(signed(7))).find(t=>projection(t).some(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(SKILL_ACTUAL))));
 expect(execution,'trace containing actual skill assessment').toBeDefined();
 const reads=items(f(execution!,11n),'list').map(v=>restoreStatePath(f(rec(v,147n),2n)));
 expect(reads.some(p=>p.rootStateTypeId===785n)).toBe(true);
 expect(reads.some(p=>p.rootStateTypeId===346n),'execution must not recover lost scene from an episodic read').toBe(false);
 const writes=rows.flatMap(t=>items(f(t,17n),'list')).filter(v=>restoreStatePath(f(rec(v,148n),1n)).rootStateTypeId===785n);
 expect(writes).toHaveLength(1);expect(f(rec(writes[0],148n),6n)).toEqual(SKILL_OWNER);
 const hidden=rec(unpack(e.controls.hiddenTerminal),132n),hiddenRows=items(f(hidden,11n),'list').map(v=>rec(v,160n));
 const formed=hiddenRows.filter(t=>key(at(t))===key(signed(4))).flatMap(t=>items(f(t,17n),'list')).filter(v=>isPositionEpisodePath(restoreStatePath(f(rec(v,148n),1n)))&&f(rec(v,148n),4n)===true).map(v=>f(rec(v,148n),5n));
 expect(formed.length,'denied-report control still forms ordinary perceived scene').toBeGreaterThan(0);expect(formed.every(v=>items(items(v,'list')[8],'list').length===0)).toBe(true);
 console.info('M283 archived trace PASS: episodic removal owner; one procedural acquisition; actual execution reads785 without346; full hashes verified');
});
