import {beforeAll,it,expect} from 'vitest';
import {fixture,C,decode} from './fixtures/assembledHiddenExposure';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {compileHiddenExposure} from '../assembled/hiddenExposure';
import {compileTimedComparison,timedComparisonValue,type TimedEntry} from '../assembled/timedComparison';
import {LEGACY_TIME_LIMIT as OLD,EXTENDED_TIME_LIMIT as LONG,type TimeLimit} from '../assembled/timeDomain';
import {canonicalEncode as enc,list,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {sid} from '../assembled/skill';
import {bioStep} from '../campaign3/bioComparison';
import {cognitiveRecord as r,randomDrawRecord} from '../assembled/codecs';
import {comparisonAddress} from '../assembled/comparison';
import {RandomRunOracle} from '../substrate/random';
import {createAssembledRandomSession} from '../assembled/random';
import {simInstant} from '../substrate/time';

// Original hidden-exposure fixture: body10, seed0, no social/choice source. The new
// component source is authored at4000, never retimed after admission. No cognition
// is fabricated. Public0.109 admission still rejects it until atomic activation.
let b:ReturnType<typeof fixture>,m:Awaited<ReturnType<typeof compileCharacterModel>>,c:Awaited<ReturnType<typeof compileCharacterState>>,row:readonly CanonicalValue[];
beforeAll(async()=>{b=fixture(1,false);m=await compileCharacterModel(b.s);c=await compileCharacterState(m);row=items(items(decode(b.d.orderedInputs),'list')[0],'list');},120000);
const source=(at:bigint)=>list([signed(at),...row.slice(1)]);
const compile=(rows:CanonicalValue[],limit:TimeLimit=OLD)=>compileHiddenExposure(m,c,rows,b.d,{event:900n,sequence:1000n},[],limit);
it('source162: exact late hidden source keeps original authority, repeat and admission bounds',async()=>{
 for(const at of [OLD,101n,4000n,LONG]){
  const a=(await compile([source(at)],LONG))!,z=(await compile([source(at)],LONG))!;
  expect(a.events).toEqual(z.events);expect(a.events[0].dueAt).toBe(at);
  const execute=(s:typeof a)=>{const instant=s.begin(at);let n=3000n;const allocator={allocateRuntimeId:()=>n++},e=s.events[0];
   for(const forged of [{...e,eventId:901n},{...e,eventSequence:1001n},{...e,phase:130n},{...e,dueAt:simInstant(at+1n)},{...e,dependencies:list([C])},{...e,payload:list([])}])expect(()=>instant.execute(forged,allocator)).toThrow();
   expect(n).toBe(3000n);const v=instant.execute(e,allocator);expect(n).toBe(3001n);expect(f(rec(v,307n),3n)).toEqual(signed(at));
   expect(()=>instant.execute(e,allocator)).toThrow();instant.close();expect(()=>instant.execute(e,allocator)).toThrow();return v;};
  expect(execute(a)).toEqual(execute(z));
  if(at===OLD){const legacy=(await compile([source(at)]))!;expect(legacy.events).toEqual(a.events);expect(execute(legacy)).toEqual(execute(z));}
  else await expect(compile([source(at)])).rejects.toThrow('time');
 }
 for(const at of [0n,LONG+1n])await expect(compile([source(at)],LONG)).rejects.toThrow('time');
 await expect(compile([source(4000n),source(4000n)],LONG)).rejects.toThrow('duplicate');
 await expect(compile(Array.from({length:101},(_,i)=>source(BigInt(i+1))),LONG)).rejects.toThrow('capacity100');
 const a=(await compile([source(4000n)],LONG))!;
 await expect(compileHiddenExposure(m,c,[source(4000n)],b.d,{event:900n,sequence:1000n},a.events,LONG)).rejects.toThrow('collision');
 await expect(compile([],101n as TimeLimit)).rejects.toThrow('time domain');
 await expect(compileCharacterInputs(m,c,{...b.d,orderedInputs:enc(list([source(4000n)]))})).rejects.toThrow();
 console.info('M162 source PASS100/101/4000/1000000; original fact authority, forged identity/time/payload, duplicate/capacity/collision; public guard retained');
});
it('source162: late timed maps couple distinct actual addresses and preserve rollback ledger',async()=>{
 const original=await bioStep(1n,6,r(414,[list([])]),'Earned'),data=rec(f(rec(f(rec(original.resolution,409n),4n),419n),2n),420n),reason=items(f(rec(original.reasons,408n),3n),'list')[0];
 const draw=randomDrawRecord(f(rec(items(f(data,9n),'list')[0],422n),5n)),address=comparisonAddress(f(draw,1n));
 const entry:TimedEntry={at:4000n,purposeId:address.purposeId,subjectBindings:address.subjectBindings,comparisonDrawKey:{keyId:sid(10006,'M162/4000'),comparisonRoleId:sid(10005,'assembled/task-reason-face')}};
 for(const at of [OLD,101n,4000n,LONG]){
  const value=timedComparisonValue([{...entry,at}],LONG);expect(compileTimedComparison(value,LONG).instants).toEqual([at]);
  if(at===OLD)expect(value).toEqual(timedComparisonValue([{...entry,at}]));else {expect(()=>timedComparisonValue([{...entry,at}])).toThrow('instant');expect(()=>compileTimedComparison(value)).toThrow('instant');}
 }
 const schedule=compileTimedComparison(timedComparisonValue([entry],LONG),LONG),seed=new Uint8Array(32).fill(6),rootA=address.causalRootId,rootB={...rootA,payload:u(999999)},other={...address,causalRootId:rootB};
 const a=await new RandomRunOracle(seed,schedule.bind(4000n,rootA)).drawBounded(address,6n),z=await new RandomRunOracle(seed,schedule.bind(4000n,rootB)).drawBounded(other,6n);
 expect(a.localAddress).not.toEqual(z.localAddress);expect(a.effectiveKey).toEqual(z.effectiveKey);expect(a.attempts).toEqual(z.attempts);expect(a.result).toBe(z.result);
 expect(await new RandomRunOracle(seed,schedule.bind(4001n,rootA)).drawBounded(address,6n)).toEqual(await new RandomRunOracle(seed).drawBounded(address,6n));
 for(const at of [0n,LONG+1n])expect(()=>timedComparisonValue([{...entry,at}],LONG)).toThrow('instant');
 expect(()=>timedComparisonValue([entry,entry],LONG)).toThrow('duplicate');expect(()=>timedComparisonValue([entry,{...entry,at:4001n}],LONG)).toThrow('injective');
 expect(()=>timedComparisonValue([{...entry,purposeId:sid(1042,'purpose/foreign')}],LONG)).toThrow();
 expect(()=>timedComparisonValue(Array(1001).fill(entry),LONG)).toThrow('capacity1000');
 const session=createAssembledRandomSession(seed,undefined,3,false,true,schedule);session.begin(4000n);const cap=session.forResolution(rootA,original.reasons),first=await cap.reason(reason);session.close();expect(session.committedAddressKeys()).toEqual([]);await expect(cap.reason(reason)).rejects.toThrow('expired');
 session.begin(4000n);expect(await session.forResolution(rootA,original.reasons).reason(reason)).toEqual(first);session.prepareCommit();session.commit();session.close();expect(session.committedAddressKeys()).toHaveLength(1);
 session.begin(4000n);await expect(session.forResolution(rootA,original.reasons).reason(reason)).rejects.toThrow('repeated');session.close();
 console.info('M162 coupling PASS4000; distinct real addresses/shared effective key, candidates/result; natural fallback, rollback/retry/expired/repeated ledger');
},120000);
