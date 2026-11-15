import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,time,rec,f,uint,items,key,decode,enc,list,text,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue,type Profile} from './fixtures/assembledHabitReversal';
import {habitJournal,habitPath,rewardPath,rewardValue,cueStrength,HABIT_OPTIONS,HABIT_OBS} from '../assembled/habit';
import {ACTION_BODY} from '../assembled/actionBody';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const journal=(r:Run)=>habitJournal(state(r).read(habitPath(C)).value);
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const habit=(r:Run)=>reports(r,HABIT_OPTIONS).find(v=>uint(v[1])===18n)!;
const fraction=(v:Q)=>v.numerator+'/'+v.denominator;
async function through(r:Run,at:bigint){for(let i=0;r.snapshot().clock<at;i++){expect(i).toBeLessThan(64);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(a:Run,b?:Run){for(let i=0;i<64;i++){const next=await a.settleNextInstant();if(b){expect(await b.settleNextInstant()).toBe(next);exact(a,b);}if(!next)return;}throw Error('settle cap64');}
function inspect(r:Run){
 const h=habit(r);expect(h,'live habit candidate evaluation').toBeDefined();
 const d=outputs(r.snapshot().outputs,409n).find(v=>time(f(v,2n))===18n)!;
 expect(d,'live native resolution').toBeDefined();
 const reason=rec(f(d,3n),408n),ns=items(f(reason,3n),'list');
 const status=rec(f(d,4n),419n);
 console.info('M118 observed '+JSON.stringify({history:journal(r).map(v=>({at:String(uint(items(v,'list')[2])),positive:items(v,'list')[5]})),strength:key(h[3]),admitted:h[5],offered:items(h[6],'list').length,nuclei:ns.length,status:String(uint(f(status,1n))),effects:reports(r,ACTION_BODY).map(v=>({action:key(v[3]),status:key(v[5])}))}));
 expect(ns.length,'live reasons').toBeGreaterThan(0);expect(uint(f(status,1n)),'chosen native decision').toBe(3n);
 return {h,d,ns,data:rec(f(status,2n),420n)};
}
it('primary118: current reference acquires, retains and reverses a real habit',async()=>{
 const runs:Run[]=[];
 for(const profile of ['trained','untrained','reversed'] as const){
  const b=fixture(profile),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,18n);const p=inspect(r);
  expect(cueStrength(journal(r),true)).toEqual(profile==='trained'?Q.of(3n,4n):profile==='reversed'?Q.of(3n,8n):Q.of(0n));
  expect(p.h[5]).toBe(profile==='trained');expect(items(p.h[6],'list').length).toBe(profile==='trained'?3:0);
  expect(rewardValue(state(r).read(rewardPath(C)).value)).toMatchObject({positive:false,at:15n});
  runs.push(r);
 }
 console.info('M118 primary strength/admission passed');
},560000);
