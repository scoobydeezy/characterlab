import {it,expect} from 'vitest';
import control from '../../docs/planning/ASSEMBLED_CHARACTER_M109_CONTROL.json';
import {fixture as oldFixture,create as oldCreate,finish as oldFinish,bytes} from './fixtures/assembledBiography';
it('M109 frozen085 full public save',async()=>{
 const {run}=await oldCreate(oldFixture());await oldFinish(run);const actual=run.save();
 expect(control.gzip.length).toBeGreaterThan(0);
 const packed=Uint8Array.from(atob(control.gzip),c=>c.charCodeAt(0)),expected=new Uint8Array(await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());bytes(actual,expected);console.info('M109 frozen085 exact full save '+actual.length+' bytes PASS');
},220000);

import {fixture,header,times,create,live,snap,through,finish,exact,rec,f,uint,items,key,decode,enc,list,text,signed,id,sid,bound} from './fixtures/assembledTimedComparison';
import {compileTimedComparison,timedComparisonValue,TIMED_COMPARISON,type TimedEntry} from '../assembled/timedComparison';
import {comparisonAddress,comparisonRoles} from '../assembled/comparison';
import {createAssembledRandomSession} from '../assembled/random';
import {RandomRunOracle,ComparisonDrawMap} from '../substrate/random';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {bioStep} from '../campaign3/bioComparison';
import {cognitiveRecord as r,randomDrawRecord} from '../assembled/codecs';
import {unsigned as u} from '../substrate/canonicalEncoding';
it('M109 unit C0 correspondence admission and atomic binding',async()=>{
 const original=await bioStep(1n,6,r(414,[list([])]),'Earned'),data=rec(f(rec(f(rec(original.resolution,409n),4n),419n),2n),420n),n=items(f(rec(original.reasons,408n),3n),'list')[0];
 const draw=randomDrawRecord(f(rec(items(f(data,9n),'list')[0],422n),5n)),address=comparisonAddress(f(draw,1n)),entry:TimedEntry={at:1n,purposeId:address.purposeId,subjectBindings:address.subjectBindings,comparisonDrawKey:{keyId:sid(10006,'M109/unit/1'),comparisonRoleId:sid(10005,'assembled/task-reason-face')}},second={...entry,at:2n,comparisonDrawKey:{...entry.comparisonDrawKey,keyId:sid(10006,'M109/unit/2')}};
 const value=timedComparisonValue([entry,second]),schedule=compileTimedComparison(value),seed=new Uint8Array(32).fill(6),root2=sid(1135,'wrong');
 const rootA=address.causalRootId,rootB={...rootA,payload:u(999999)},a=await new RandomRunOracle(seed,schedule.bind(1n,rootA)).drawBounded(address,6n),otherAddress={...address,causalRootId:rootB},b=await new RandomRunOracle(seed,schedule.bind(1n,rootB)).drawBounded(otherAddress,6n);
 expect(a.localAddress).not.toEqual(b.localAddress);expect(a.effectiveKey).toEqual(b.effectiveKey);expect(a.attempts).toEqual(b.attempts);expect(a.result).toBe(b.result);
 expect(await new RandomRunOracle(seed,schedule.bind(2n,rootB)).drawBounded(address,6n)).toEqual(await new RandomRunOracle(seed).drawBounded(address,6n));
 expect(()=>timedComparisonValue([entry,entry])).toThrow('duplicate');expect(()=>timedComparisonValue([entry,{...second,comparisonDrawKey:entry.comparisonDrawKey}])).toThrow('injective');
 expect(()=>timedComparisonValue([{...entry,at:0n}])).toThrow('instant');expect(()=>timedComparisonValue([{...entry,at:101n}])).toThrow('instant');expect(()=>timedComparisonValue([{...entry,purposeId:sid(1042,'purpose/foreign')}])).toThrow();expect(()=>timedComparisonValue([{...entry,subjectBindings:[]}])).toThrow();
 expect(()=>timedComparisonValue([{...entry,comparisonDrawKey:{...entry.comparisonDrawKey,comparisonRoleId:sid(10005,'wrong')}}])).toThrow('incompatible');
 expect(()=>compileTimedComparison(list([text(TIMED_COMPARISON),list([...items(items(value,'list')[1],'list')].reverse())]))).toThrow('canonical');expect(()=>schedule.bind(1n,root2)).toThrow();
 const session=createAssembledRandomSession(seed,undefined,3,false,true,schedule);expect(()=>session.begin()).toThrow('authenticated');session.begin(1n);const cap=session.forResolution(rootA,original.reasons);expect(()=>session.forResolution(rootA,original.reasons)).toThrow('already bound');const first=await cap.reason(n);session.close();expect(session.committedAddressKeys()).toEqual([]);await expect(cap.reason(n)).rejects.toThrow('expired');
 session.begin(1n);const retry=await session.forResolution(rootA,original.reasons).reason(n);expect(retry).toEqual(first);session.prepareCommit();session.commit();session.close();expect(session.committedAddressKeys()).toHaveLength(1);session.begin(1n);await expect(session.forResolution(rootA,original.reasons).reason(n)).rejects.toThrow('repeated');session.close();
 const staticMap=new ComparisonDrawMap([{localRandomAddress:address,comparisonDrawKey:entry.comparisonDrawKey}],comparisonRoles);expect(()=>createAssembledRandomSession(seed,staticMap,3,false,true,schedule)).toThrow('mutually exclusive');
 const fixed=fixture(),model=await prepareCharacterModel(fixed.s),rows=items(decode(fixed.d.orderedInputs),'list'),old=oldFixture();
 await expect(createCharacterRun(await prepareCharacterModel(old.s),fixed.d)).rejects.toThrow('requires assembled0.86');
 for(const bad of [list([...rows,rows[0]]),list([rows[0],rows[0],...rows.slice(1)]),list([rows[0],staticMap.canonicalValue,...rows.slice(1)]),list([...rows.slice(1),rows[0]])])await expect(createCharacterRun(model,{...fixed.d,orderedInputs:enc(bad)})).rejects.toThrow();
 const unknown=timedComparisonValue([{...entry,at:99n}]);await expect(createCharacterRun(model,{...fixed.d,orderedInputs:enc(list([unknown,...rows.slice(1)]))})).rejects.toThrow('declared deliberation');
 console.info('M109 UNIT PASS distinct actual roots/shared candidates; natural fallback; admission/injectivity/purpose/time/order; abort/retry/expired/reused ledger');
},170000);
it('M109 native paired timed coupling through complete histories',async()=>{
 const a=await create(fixture(0)),b=await create(fixture(1));bytes(snap(a.run).state,snap(b.run).state);bytes(snap(a.run).outputs,snap(b.run).outputs);expect(a.run.runIdentity()).not.toEqual(b.run.runIdentity());let common=0,differentRoots=0;
 for(const at of times){await through(a.run,at);await through(b.run,at);live(a.run,at);live(b.run,at);const aa=bound(a.run,at,0),bb=bound(b.run,at,1);if(at<=12n)continue;
  let matched=0;const other=new Map(bb.map(d=>[key(f(d,2n)),d]));for(const x of aa){const y=other.get(key(f(x,2n)));if(!y)continue;matched++;common++;if(key(f(x,1n))!==key(f(y,1n)))differentRoots++;expect(f(x,4n)).toEqual(f(y,4n));expect(f(x,3n)).toEqual(f(y,3n));expect(f(x,7n)).toEqual(f(y,7n));}expect(matched).toBeGreaterThanOrEqual(2);
 }
 await finish(a.run);await finish(b.run);console.info('M109 NATIVE PASS '+JSON.stringify({common,differentRoots,calendars:[101,101],preflights:0,rebindings:0,seeds:[0,0]}));
},460000);
it('M109 public repeat and restore timed inputs at every later settlement',async()=>{
 const b=fixture(0),a=await create(b,12n),repeat=await create(b,12n);exact(a.run,repeat.run);const save=a.run.save(),restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});exact(a.run,restored);
 await expect(restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:fixture(1).d.orderedInputs,save})).rejects.toThrow('commitments differ');
 const times=[];for(let count=0;count<32;count++){
  const next=await a.run.settleNextInstant();expect(await repeat.run.settleNextInstant()).toBe(next);expect(await restored.settleNextInstant()).toBe(next);const x=a.run.snapshot(),s=a.run.save(),identity=a.run.runIdentity();
  for(const other of [repeat.run,restored]){const y=other.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(s,other.save());bytes(identity,other.runIdentity());}
  if(!next){expect(x.clock).toBe(101n);console.info('M109 PERSISTENCE PASS save12; '+times.join(',')+' and exhaustion');return;}times.push(x.clock);
 }throw Error('M109 settle cap');
},520000);
