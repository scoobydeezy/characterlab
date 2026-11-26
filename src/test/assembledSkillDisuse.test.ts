import {it,expect,vi} from 'vitest';
// @ts-expect-error Durable evidence.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Byte equality.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless archives.
import {deflateRawSync} from 'node:zlib';
import {start,fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,actionA,actionB,cachedMemory,times,type CanonicalValue,type Mode} from './fixtures/assembledSkillDisuse';
import {fixture as oldFixture} from './fixtures/assembledSkillMemory';
import * as skill from '../assembled/skill';
import {createCharacterRun,prepareCharacterModel,restorePreparedCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue,restoreStatePath} from '../substrate/state';
import {ACTION_BODY} from '../assembled/actionBody';
import {ExactRational as Q} from '../substrate/exactMath';
type X=Awaited<ReturnType<typeof start>>;type Run=X['r'];
const hash=(x:Uint8Array)=>createHash('sha256').update(x).digest('hex');
const raw=(x:Uint8Array)=>({sha256:hash(x),length:x.length,deflateBase64:deflateRawSync(x).toString('base64')});
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const traceCache=new WeakMap<ReturnType<Run['snapshot']>,ReturnType<typeof rec>[]>();
const traces=(r:Run)=>{const s=r.snapshot();let ts=traceCache.get(s);if(!ts){ts=items(decode(s.trace),'list').map(v=>rec(v,160n));traceCache.set(s,ts);}return ts;};
const at=(t:CanonicalValue)=>f(rec(f(rec(t,160n),4n),130n),2n);
const projections=(t:CanonicalValue)=>{const v=f(rec(t,160n),13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[v];};
function reports(r:Run,n:number,tag:string){return traces(r).filter(t=>key(at(t))===key(signed(n))).flatMap(projections).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));}
async function through(r:Run,n:number){for(let i=0;r.snapshot().clock<BigInt(n);i++){expect(i).toBeLessThan(128);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(BigInt(n));}
function exact(a:Run,b:Run){for(const k of ['state','trace','outputs'] as const)expect(hash(a.snapshot()[k])).toBe(hash(b.snapshot()[k]));expect(hash(a.save())).toBe(hash(b.save()));}
async function finish(r:Run,others:Run[]=[]){for(let i=0;i<128;i++){const more=await r.settleNextInstant();for(const b of others){expect(await b.settleNextInstant()).toBe(more);exact(r,b);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('settle cap128');}
function probe(x:X,n:number,K:Q,success:boolean,engaged=true){
 const rows=reports(x.r,n,skill.SKILL_ACTUAL);expect(rows.length,'live skill assessment'+n).toBeGreaterThan(0);const a=rows[0],letter=n===6||n===9?'B':'A',p=x.b.procedures[letter];
 expect(a[10],'declared procedure at'+n).toEqual(p);expect(a[6],'actual engagement'+n).toBe(engaged);expect(a[7]).toBe(success);expect(key(a[3])).toBe(key(q(K.numerator,K.denominator)));
 const body=reports(x.r,n,ACTION_BODY);expect(body.length,'actual physical consumer').toBeGreaterThan(0);expect(body[0][3]).toEqual(letter==='A'?actionA:actionB);expect(body[0][5]).toEqual(text(success?'Applied':'Blocked'));
 const read=traces(x.r).filter(t=>key(at(t))===key(signed(n))).find(t=>projections(t).some(v=>key(v)===key(list(a)))&&items(f(t,11n),'list').some(v=>key(f(rec(v,147n),2n))===key(statePathValue(skill.skillPath(C,p)))));
 expect(read,'actual raw competence read').toBeDefined();
 if(x.b.mode!=='old'){
  const s=items(a[12],'list');expect(s[0]).toEqual(text(skill.DISUSE));
  const rawRead=items(f(read!,11n),'list').map(v=>rec(v,147n)).find(v=>key(f(v,2n))===key(statePathValue(skill.skillPath(C,p))))!;
  const prior=f(rawRead,3n)===true?f(rawRead,4n):undefined,computed=skill.disusedSkill(prior,p,BigInt(n),1000000n);
  expect(key(a[12])).toBe(key(skill.disuseAnnex(computed)));expect(key(a[3])).toBe(key(skill.q(computed.K)));
 }
 return {at:n,K:K.numerator+'/'+K.denominator,success,engaged,procedure:letter};
}
const path='docs/planning/ASSEMBLED_CHARACTER_M285_EVIDENCE.json';
function record(k:string,v:unknown){const e=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{candidate:'0.166',plan:'62b86fe2',law:'PeriodicDisuse/0.1 H4/half'};e[k]=v;writeFileSync(path,JSON.stringify(e,null,2)+'\n');}
it('primary285: one character rusts and recovers; unrelated body samples and other procedures do not reset its clock',async()=>{
 const result:Record<string,unknown>={};let main:unknown;
 for(const mode of ['main','dense','old'] as const){const x=await start(mode),rows=[];
  for(const n of times){await through(x.r,n);const expected=n===3||n===6?Q.of(0n):n===7?Q.of(mode==='old'?1n:1n,mode==='old'?2n:4n):n===8?Q.of(mode==='old'?5n:3n,8n):n===10?Q.of(mode==='old'?3n:1n,mode==='old'?4n:2n):Q.of(1n,2n);
   rows.push(probe(x,n,expected,n===3||n===4||n===6||n===9||n===10||mode==='old'));
   if(mode==='main'&&(n===4||n===8))record('save'+n,raw(x.r.save()));
  }
  const anchors=state(x.r).entries().filter(e=>e.path.rootStateTypeId===785n).map(e=>key(e.value));
  if(mode==='main')main={rows,anchors};if(mode==='dense')expect({rows,anchors}).toEqual(main);
  await finish(x.r);result[mode]={rows,anchors,terminal:hash(x.r.save())};if(mode==='main')record('terminal',raw(x.r.save()));
  console.info('M285 primary',mode,JSON.stringify(rows));
 }
 record('primary',result);
},560000);
it('controls285: hidden report, denied practice and explicit interference have distinct effects',async()=>{
 for(const mode of ['hidden','blocked','interference'] as const){const x=await start(mode);await through(x.r,7);probe(x,7,Q.of(1n,4n),false,mode!=='blocked');
  await through(x.r,10);const K=mode==='hidden'?Q.of(1n,2n):mode==='blocked'?Q.of(3n,8n):Q.of(1n,4n);probe(x,10,K,mode==='hidden');
  await finish(x.r);record(mode,{K:K.numerator+'/'+K.denominator,save:raw(x.r.save())});console.info('M285 control',mode,'PASS');
 }
},560000);
it('persistence285: exact repeat and restore before decay and after recovery; computed-update rollback',async()=>{
 const x=await start(),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));
 await through(x.r,4);await through(repeat,4);exact(x.r,repeat);
 const early=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()}));
 while(x.r.snapshot().clock<8n){expect(await x.r.settleNextInstant()).toBe(true);for(const r of[repeat,early]){expect(await r.settleNextInstant()).toBe(true);exact(x.r,r);}}
 const late=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()}));exact(x.r,late);
 await finish(x.r,[repeat,early,late]);record('continuation',{terminal:hash(x.r.save()),restore4:true,restore8:true,repeat:true});
 const fault=await start();await through(fault.r,6);const before=fault.r.snapshot(),fn=skill.disusedPractice;let reached=false;
 const spy=vi.spyOn(skill,'disusedPractice').mockImplementation((...args)=>{const result=fn(...args);if(args[2]===7n){reached=true;throw Error('M285 after computed decay/practice');}return result;});
 try{await expect(fault.r.settleNextInstant()).rejects.toThrow('M285 after computed');}finally{spy.mockRestore();}
 expect(reached).toBe(true);for(const k of ['state','outputs','trace'] as const)expect(hash(fault.r.snapshot()[k])).toBe(hash(before[k]));expect(fault.r.snapshot().clock).toBe(before.clock);record('rollback',{reached,clock:String(before.clock)});
 console.info('M285 persistence/rollback PASS');
},560000);
it('boundaries285: version/owner/initial-state guards, old complete bytes and native long-time execution',async()=>{
 const x=await start();await through(x.r,4);const m=await compileCharacterModel(x.b.s),c=await compileCharacterState(m),p=skill.skillPath(C,x.b.procedures.A),v=state(x.r).read(p).value!;
 expect(()=>c.stateModel.applyPatch(state(x.r),{operations:[{kind:'set',path:p,expected:{presence:true,value:v},newValue:v}]},skill.PHASE_OWNER)).toThrow();
 expect(()=>c.stateModel.read(state(x.r),skill.skillPath(sid(1000,'foreign'),x.b.procedures.A))).toThrow('foreign');
 await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...restoreAuthoritativeState(decode(x.b.d.initialState)).entries(),{path:p,value:v}]).canonicalValue())})).rejects.toThrow('initial');
 const a=items(v,'list');expect(()=>skill.skillValue(v,x.b.procedures.A,true)).toThrow('grammar');
 const legacy=list([text(skill.PROCEDURES),a[1],a[2],a[3]]);expect(()=>skill.skillValue(legacy,x.b.procedures.A,true,true,1000000n)).toThrow('grammar');
 expect(()=>skill.disusedSkill(v,x.b.procedures.A,2n,1000000n)).toThrow('future');
 expect(()=>skill.skillValue(list([...a.slice(0,4),u(1000001)]),x.b.procedures.A,true,true,1000000n)).toThrow('time');
 const old=oldFixture('lost'),r=cachedMemory(await createCharacterRun(await prepareCharacterModel(old.s),old.d)),e=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M283_EVIDENCE.json','utf8'));
 await through(r,4);expect(hash(r.save())).toBe(e.controls.prefix4.sha256);await finish(r);expect(hash(r.save())).toBe(e.controls.terminal.sha256);
 const long=await start('long');await through(long.r,999999);const rows=reports(long.r,999999,skill.SKILL_ACTUAL);expect(rows.length).toBeGreaterThan(0);const report=rows[0];expect(report[6]).toBe(true);expect(report[7]).toBe(false);
 const k=skill.disusedSkill(state(long.r).read(skill.skillPath(C,long.b.procedures.A)).value,long.b.procedures.A,999999n,1000000n).K;
 expect(k.numerator).toBe(1n);expect(k.denominator===2n**250000n).toBe(true);expect(key(report[3])).toBe(key(skill.q(k)));
 await finish(long.r);record('boundaries',{oldPrefix:e.controls.prefix4.sha256,oldTerminal:hash(r.save()),long:{clock:String(long.r.snapshot().clock),save:raw(long.r.save()),denominatorBits:k.denominator.toString(2).length}});
 console.info('M285 boundaries/old bytes/million-time PASS');
},560000);
