import {it,expect} from 'vitest';
// @ts-expect-error Evidence.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Hash.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless archive.
import {deflateRawSync,inflateRawSync} from 'node:zlib';
import {groups,fixture,start,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,actionA,taskA,cachedMemory,type CanonicalValue} from './fixtures/assembledSkillFamily';
import {restorePreparedCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {SKILL_ACTUAL,skillPath} from '../assembled/skill';
import {expectationPath,expectationValue} from '../assembled/performanceExpectation';
import {ACTION_BODY} from '../assembled/actionBody';
import {ExactRational as Q} from '../substrate/exactMath';
import {exact as rational} from '../campaign3/embodiedMath';
type X=Awaited<ReturnType<typeof start>>;type Run=X['r'];
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),fraction=(q:Q|undefined)=>q?q.numerator+'/'+q.denominator:'unknown';
const path='docs/planning/ASSEMBLED_CHARACTER_M286_EVIDENCE.json';
const read=()=>existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{};
function record(index:number,value:unknown){const e=read();e.candidate='0.166';e.plan='8100e517';e.native??={};e.native[index]=value;writeFileSync(path,JSON.stringify(e,null,2)+'\n');}
const cached=new WeakMap<ReturnType<Run['snapshot']>,{state:ReturnType<typeof restoreAuthoritativeState>;trace:ReturnType<typeof rec>[]}>();
function view(r:Run){const s=r.snapshot();let v=cached.get(s);if(!v){v={state:restoreAuthoritativeState(decode(s.state)),trace:items(decode(s.trace),'list').map(t=>rec(t,160n))};cached.set(s,v);}return v;}
const at=(t:CanonicalValue)=>f(rec(f(rec(t,160n),4n),130n),2n);
const projections=(t:CanonicalValue)=>{const v=f(rec(t,160n),13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[v];};
function reports(r:Run,n:number,tag:string){return view(r).trace.filter(t=>key(at(t))===key(signed(n))).flatMap(projections).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));}
async function through(r:Run,n:number){for(let i=0;r.snapshot().clock<BigInt(n);i++){expect(i).toBeLessThan(128);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(BigInt(n));}
async function finish(r:Run){for(let i=0;i<128;i++)if(!await r.settleNextInstant()){expect(r.diagnostic()).toBeUndefined();return;}throw Error('native cap128');}
let originalAttempt:Promise<CanonicalValue>|undefined;
async function executionControl(a:readonly CanonicalValue[],i:number){
 const {compileSkillModel,compileSkillInputs,skillRecipe,DEFAULT_SETTINGS}=await import('../campaign3/skillModel'),{createSkillRuntime}=await import('../campaign3/skillRuntime'),{skillRecord:old}=await import('../campaign3/skillCodecs'),{skillInputs}=await import('./skillFixtures'),{skillExecute}=await import('../campaign3/skillMath');
 originalAttempt??=(async()=>{const m=await compileSkillModel(skillRecipe()),input=await compileSkillInputs(m,enc(m.initial.canonicalValue()),skillInputs([{at:1}]),new Uint8Array(32)),run=createSkillRuntime(m,input);while(await run.settle()){}return run.snapshot().outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===795n)!;})();
 const attempt=await originalAttempt,src=old(783,[signed(i+1),a[4],a[5],a[6],a[8],false,u(0)]),control=rec(skillExecute(DEFAULT_SETTINGS,attempt,src,old(784,[a[3],u(0)]),undefined,f(rec(attempt,795n),1n)),796n);
 for(const [field,index] of [[6n,6],[7n,7],[8n,8]] as const)expect(f(control,field)).toEqual(a[index]);
}
async function replay(index:number){
 const x=await start(index),rows=[],typed:Record<string,string>={};let anchor=Q.of(0n),anchorAt=0,count=0,belief:Q|undefined;
 for(const [i,source] of x.b.attempts.entries()){
  const beforeBelief=belief;await through(x.r,source.at);
  const found=reports(x.r,source.at,SKILL_ACTUAL);expect(found.length,'live skill '+index+'/'+source.at).toBeGreaterThan(0);const a=found[0];
  for(const row of found)expect(row).toEqual(a);
  expect(a[10]).toEqual(x.b.procedure);expect(a[6]).toBe(source.permitted);
  const K=anchor.divide(Q.of(2n**BigInt(Math.floor((source.at-anchorAt)/4)))),effective=K.multiply(Q.of(1n).subtract(rational(source.impairment))),success=source.permitted&&effective.compare(rational(source.difficulty))>=0;
  expect(key(a[3])).toBe(key(q(K.numerator,K.denominator)));expect(a[7]).toBe(success);expect(a[8]).toBe(source.practice&&source.permitted);
  const body=reports(x.r,source.at,ACTION_BODY);expect(body.length).toBeGreaterThan(0);expect(body[0][3]).toEqual(actionA);expect(body[0][5]).toEqual(text(success?'Applied':'Blocked'));
  const reads=view(x.r).trace.filter(t=>key(at(t))===key(signed(source.at))).flatMap(t=>items(f(t,11n),'list'));expect(reads.some(v=>key(f(rec(v,147n),2n))===key(statePathValue(skillPath(C,x.b.procedure))))).toBe(true);
  if(source.practice&&source.permitted){const next=K.add(Q.of(1n,source.at<=6?2n:8n));anchor=next.compare(Q.of(1n))>0?Q.of(1n):next;anchorAt=source.at;count++;}
  const stored=view(x.r).state.read(skillPath(C,x.b.procedure));expect(stored.presence).toBe(count>0);if(count){const s=items(stored.value!,'list');expect(s[0]).toEqual(text('assembled-procedures/0.2'));expect(s[1]).toEqual(q(anchor.numerator,anchor.denominator));expect(uint(s[2])).toBe(BigInt(count));expect(uint(s[4])).toBe(BigInt(anchorAt));}
  if(source.visible&&source.permitted){const report=source.report===0?success:source.report===1;const observed=Q.of(report?1n:0n);belief=belief===undefined?observed:belief.add(observed.subtract(belief).multiply(Q.of(1n,source.at<=6?2n:8n)));}
  const actualBelief=expectationValue(view(x.r).state.read(expectationPath(taskA,BigInt(x.b.route))).value,1000000n);expect(fraction(actualBelief.mean),'separate observed confidence').toBe(fraction(belief));
  if(source.source){await executionControl(a,i);rows.push({at:source.at,sourceAt:source.at-3,K:fraction(K),engaged:a[6],success,practice:a[8],anchor:fraction(anchor),anchorAt,count,beliefBefore:fraction(beforeBelief),beliefAfter:fraction(belief),skillBytes:stored.presence?hash(enc(stored.value!)):null});}
  if(source.at===4)for(const type of[425n,426n,431n]){const values=view(x.r).trace.filter(t=>key(at(t))===key(signed(4))).flatMap(projections).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);expect(values.length,'live intent/expression/plan').toBeGreaterThan(0);typed[String(type)]=hash(enc(list(values)));}
 }
 await finish(x.r);const save=x.r.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));
 expect(hash(restored.save())).toBe(hash(save));expect(await restored.settleNextInstant()).toBe(false);
 record(index,{names:x.b.group.names,initial:x.b.group.initial,source:hash(x.b.d.orderedInputs),model:hash(x.b.s.registry),rows,typed,terminal:{sha256:hash(save),length:save.length,deflateBase64:deflateRawSync(save).toString('base64')},restored:true});
 console.info('M286 native',index,x.b.group.names[0],JSON.stringify(rows));
}
it.each(groups.map((_,i)=>i))('native286_%i',async(index)=>{expect(groups).toHaveLength(20);await replay(index);},560000);
it('coverage286: all histories and named behavioral distinctions',()=>{
 const e=read(),n=e.native;expect(Object.keys(n)).toHaveLength(20);expect(e.original.results).toHaveLength(52);
 expect(new Set(Object.values(n).map((v:any)=>v.model)).size).toBe(1);
 expect(Object.values(n).flatMap((v:any)=>v.names).sort()).toEqual(e.original.results.map((v:any)=>v.name).sort());
 const find=(name:string)=>Object.values(n).find((v:any)=>v.names.includes(name)) as any;
 const insecure=find('skilled-insecure').rows,confident=find('incompetent-confident').rows;
 expect(insecure[1].beliefBefore).toBe('0/1');expect(insecure[1].success).toBe(true);
 expect(confident[1].beliefBefore).toBe('1/1');expect(confident[1].success).toBe(false);
 const practice=find('k0-p1-e1').rows;expect(practice[1].anchor).toBe('1/2');expect(practice[2].anchor).toBe('1/1');expect(practice[2].beliefAfter).toBe('0/1');expect(practice[4].success).toBe(true);
 const high=find('physical-1'),low=find('physical-0');expect(high.typed).toEqual(low.typed);expect(high.rows[0].success).toBe(true);expect(low.rows[0].success).toBe(false);
 const impaired=find('impair-0.5').rows,unimpaired=find('impair-0').rows;expect(impaired[0].success).toBe(false);expect(impaired[1].success).toBe(true);expect(impaired.map((r:any)=>r.skillBytes)).toEqual(unimpaired.map((r:any)=>r.skillBytes));
 expect(find('blocked').rows[0].engaged).toBe(false);expect(find('no-feedback').rows[0].beliefAfter).toBe('unknown');
 expect(find('threshold-0.4375').rows[0].success).toBe(true);expect(find('threshold-0.5').rows[0].success).toBe(true);expect(find('threshold-0.5625').rows[0].success).toBe(false);

 const historical=JSON.parse(readFileSync('docs/planning/SKILL_PUBLIC_EXPERIMENT_REV1.json','utf8')),comparisons=[];
 for(const original of e.original.results){const native=find(original.name),prior=historical.results.find((v:any)=>v.name===original.name);expect(native.rows).toHaveLength(prior.outcomes.length);
  const prefixCount=native.initial===1?2:native.initial===0.5?1:0,changes=[];
  for(const [i,row] of native.rows.entries()){const old=prior.outcomes[i],after=prior.adaptation[i],values:Record<string,[unknown,unknown]>={
   K:[old.skill,row.K],success:[old.success,row.success],postSkill:[after.next,row.practice?row.anchor:row.K],
   practiceCount:[after.count,row.count-prefixCount],beliefBefore:[prior.belief[i]??'unknown',row.beliefBefore],beliefAfter:[prior.learning[i].next??'unknown',row.beliefAfter]};
   expect(row.engaged).toBe(old.engaged);
   for(const [field,[before,current]] of Object.entries(values))if(before!==current)changes.push({sourceAt:row.sourceAt,field,original:before,current,classification:field.startsWith('belief')?'L5 developmental update and observed execution differences':field==='success'?'adopted competence trajectory and multiplicative execution versus original execution law':'D3 developmental practice / approved elapsed disuse versus original practice or permanent-loss law'});
  }
  comparisons.push({name:original.name,nativeGroup:native.names[0],originalLaws:original.settings,acquisitionCountOffset:prefixCount,classification:changes.length?'CLASSIFIED LAW DIFFERENCES':'EQUIVALENT declared projections',changes});
 }
 // All retained checkpoints are bound to the exact source and complete trace.
 for(const [index,value] of Object.entries(n)){const v=value as any,b=fixture(Number(index));expect(hash(b.d.orderedInputs)).toBe(v.source);expect(v.restored).toBe(true);
  const raw=inflateRawSync(Uint8Array.from(atob(v.terminal.deflateBase64),c=>c.charCodeAt(0)));expect(raw.length).toBe(v.terminal.length);expect(hash(raw)).toBe(v.terminal.sha256);
  const trace=items(f(rec(decode(raw),132n),11n),'list').map(t=>rec(t,160n));
  for(const source of b.attempts){const actual=trace.filter(t=>key(at(t))===key(signed(source.at))).flatMap(projections).find(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(SKILL_ACTUAL)));expect(actual).toBeDefined();const a=items(actual!,'list');expect(a[4]).toEqual(source.impairment);expect(a[5]).toEqual(source.difficulty);}
 }
 e.comparisons=comparisons;

 e.coverage={original:52,native:20,oneReference:true,restores:20,clauses:[1,2,3,6,7,8],intentEquality:true,classification:'D3 Ramp replaces linear/residual; L5 replaces mean/latest/no-learning; PeriodicDisuse replaces NoRust; multiplicative execution preserves original operand law; bad confidence/intent/permanent-impairment controls remain original only.'};writeFileSync(path,JSON.stringify(e,null,2)+'\n');
});
