import {it,expect,vi} from 'vitest';
import {record,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {compileCharacterModel} from '../assembled/model';
import {compileReasonEvidence,CONTEXT_EVIDENCE} from '../assembled/reasonEvidence';
import {restoreCharacterRun} from '../assembled/character';
import {randomDrawRecord} from '../assembled/codecs';
import * as reasons from '../assembled/reasons';
import {decisionHistoryView,decisionPresentationView,validateDecisionView} from '../assembled/decisionView';
import {transcript} from './fixtures/assembledDecisionAlternatives';
import {exact,bytes} from './fixtures/assembledAffectReceiving';
import {fixture,create,capture,correspondence,sourceCorrespondence,projection,traces,snap,through,decode,items,key,enc,rec,f,uint,q,list,set,text,u,signed,r,definition} from './fixtures/assembledContextReasons';
let normal:Awaited<ReturnType<typeof create>>,zero:Awaited<ReturnType<typeof create>>;
const si=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('signed');return v.value;};
it('M88 native: distinct context changes exact probabilities and actual coupled sampled scores',async()=>{
 normal=await create();zero=await create(true);
 const ai=items(decode(normal.b.d.orderedInputs),'list'),bi=items(decode(zero.b.d.orderedInputs),'list');expect(ai.length).toBe(bi.length);
 const different=ai.map((v,i)=>key(v)!==key(bi[i])?i:-1).filter(i=>i>=0);expect(different).toHaveLength(1);
 const ar=items(ai[different[0]],'list'),br=items(bi[different[0]],'list');ar.forEach((v,i)=>{if(i!==3)expect(v).toEqual(br[i]);});
 const ap=items(ar[3],'list'),bp=items(br[3],'list');expect(ap).toEqual([q(1,1),q(1,1),true,true,q(0,1)]);expect(bp).toEqual([q(0,1),q(1,1),true,true,q(0,1)]);
 const a=capture(normal.run),b=capture(zero.run);
 sourceCorrespondence(a);correspondence(a.raw,a.ns,normal.b.s);correspondence(b.raw,b.ns,zero.b.s);traces(normal.run,a);
 expect(b.produced).toHaveLength(0);expect(items(b.rejected[0],'list')[1]).toEqual(text('Zero'));
 const allContext=a.ns.map(v=>f(rec(f(rec(v,407n),2n),406n),5n));expect(allContext).toContainEqual(q(-1,5));
 for(const av of a.ns){const n=rec(av,407n),other=rec(b.ns.find(v=>key(f(rec(v,407n),1n))===key(f(n,1n)))!,407n),roles=rec(f(n,2n),406n),old=rec(f(other,2n),406n);
  for(const field of [1n,2n,3n])expect(f(roles,field)).toEqual(f(old,field));
  for(const field of [4n,5n,6n])expect(f(n,field)).toEqual(f(other,field));expect(f(other,8n)).toEqual(signed(0));
  if(key(f(roles,5n))===key(q(-1,5)))expect(f(n,8n)).toEqual(signed(-2));
 }
 expect(f(a.data,2n)).not.toEqual(f(b.data,2n));expect(uint(f(a.data,8n))).not.toBe(1n);expect(uint(f(b.data,8n))).not.toBe(1n);
 const ad=items(f(a.data,9n),'list'),bd=items(f(b.data,9n),'list');expect(ad).toHaveLength(2);expect(bd).toHaveLength(2);let matched=0,changedScore=0;
 for(const value of ad){
  const row=rec(value,422n),nk=rec(f(row,1n),404n),other=rec(bd.find(v=>key(f(rec(v,422n),1n))===key(nk))!,422n),draw=randomDrawRecord(f(row,5n)),od=randomDrawRecord(f(other,5n));
  for(const field of [2n,3n,4n,7n])expect(f(draw,field),'same effective address/result/span/attempts').toEqual(f(od,field));matched++;
  expect(si(f(row,7n))).toBe((uint(f(nk,4n))===1n?1n:-1n)*(uint(f(row,6n))+si(f(row,3n))+si(f(row,4n))+si(f(row,8n))));
  if(si(f(row,8n))!==0n){expect(f(row,7n)).not.toEqual(f(other,7n));changedScore++;}
 }
 expect(matched).toBe(2);expect(changedScore).toBe(1);
 const out=items(decode(snap(normal.run).outputs),'list'),ts=items(decode(snap(normal.run).trace),'list');
 const history=decisionHistoryView(out,ts),player=decisionPresentationView(out);validateDecisionView(history);validateDecisionView(player);
 expect(items(history,'list')[0]).toEqual(text('assembled-decision-view/0.2-candidate/history'));
 expect(items(player,'list')[0]).toEqual(text('assembled-decision-view/0.2-candidate/player'));
 const historyRow=items(items(history,'list')[1],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(f(a.d,1n)))!;
 const projectedNuclei=items(items(historyRow[3],'list')[3],'list').map(v=>items(v,'list'));expect(projectedNuclei.some(v=>key(v[6])===key(signed(-2))&&key(items(v[1],'list')[3])===key(q(-1,5)))).toBe(true);
 // QuietRoll intentionally has no player row. Its frozen resolution still carries c.
 if(uint(f(a.data,8n))===3n){const row=items(items(player,'list')[1],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(f(a.d,1n)))!;expect(items(row[2],'list').some(v=>key(items(v,'list')[6])===key(signed(-2)))).toBe(true);}
 expect(normal.run.decisionHistory()).toEqual(enc(history));expect(normal.run.decisionPresentation()).toEqual(enc(player));
 console.info('M88 NATIVE '+JSON.stringify({probabilities:items(f(a.data,2n),'list').map(v=>key(f(rec(v,421n),2n))),zeroProbabilities:items(f(b.data,2n),'list').map(v=>key(f(rec(v,421n),2n))),modes:[Number(uint(f(a.data,8n))),Number(uint(f(b.data,8n)))],draws:[transcript(a.data).length,transcript(b.data).length],sharedReasonDraws:matched,changedSampledScores:changedScore,winnerChanged:key(f(a.data,1n))!==key(f(b.data,1n))}));
},570000);
it('M88 controls: privacy, old admission and original weak-context/zero-base boundaries',async()=>{
 const n=normal??await create(),z=zero??await create(true),hidden=await create(false,true),denied=await create(false,false,false),legacy=await create(false,false,true,true);
 const a=capture(n.run),b=capture(z.run),h=capture(hidden.run),d=capture(denied.run),old=capture(legacy.run);
 expect(h.report).toEqual(a.report);expect(h.ns).toEqual(a.ns);expect(f(h.data,2n)).toEqual(f(a.data,2n));expect(transcript(h.data)).toEqual(transcript(a.data));
 expect(d.produced).toHaveLength(0);expect(items(d.rejected[0],'list')[1]).toEqual(text('MissingEvidence'));expect(f(d.data,2n)).toEqual(f(b.data,2n));
 expect(key(set(old.ns.map(projection)))).toBe(key(set(b.ns.map(projection))));expect(f(old.data,2n)).toEqual(f(b.data,2n));
 const m=await compileCharacterModel(n.b.s),prior=await compileCharacterModel(legacy.b.s);
 expect(()=>prior.content.validateRecordRoles(enc(a.raw))).toThrow('successor model');
 expect(()=>prior.content.validateRecordRoles(enc(typedIdentifier(1115,a.raw)))).toThrow('successor model');
 const signal=rec(items(items(a.produced[0],'list')[1],'list')[2],402n),contextKey=f(signal,1n);
 for(const record of [contextKey,...a.ns.map(v=>f(rec(v,407n),2n)),...a.ns,...items(f(a.data,9n),'list')]){expect(decode(enc(record))).toEqual(record);expect(()=>prior.content.validateRecordRoles(enc(record))).toThrow('successor model');m.content.validateRecordRoles(enc(record));}
 expect(()=>compileReasonEvidence(n.b.declaration,m.strategy!,[],false)).toThrow('declaration');
 for(const role of [0,2,3,5]){const descriptor=items(n.b.descriptor,'list').map((v,i)=>i===5?u(role):v);expect(()=>compileReasonEvidence(list([text(CONTEXT_EVIDENCE),list([list(descriptor)])]),m.strategy!,[],true)).toThrow('role');}
 expect(()=>compileReasonEvidence(list([text(CONTEXT_EVIDENCE),list([n.b.descriptor,n.b.descriptor])]),m.strategy!,[],true)).toThrow('label');
 expect(()=>r(401,[f(rec(contextKey,401n),1n),f(rec(contextKey,401n),2n),u(1)],2)).toThrow('context role');
 expect(()=>r(401,[f(rec(contextKey,401n),1n),f(rec(contextKey,401n),2n),u(4)],1)).toThrow();
 expect(()=>reasons.compileDescribedReasons(a.raw,definition(n.b.s))).toThrow('successor');
 const descriptions=items(f(a.raw,6n),'list'),ctx=items(items(a.produced[0],'list')[1],'list'),sk=rec(contextKey,401n);
 const base=items(descriptions.find(v=>{const s=rec(items(v,'list')[2],402n),k=rec(f(s,1n),401n);return uint(f(k,3n))===1n&&key(f(k,1n))===key(f(sk,1n))&&key(f(k,2n))===key(f(sk,2n));})!,'list');
 const change=(d:readonly CanonicalValue[],strength:CanonicalValue)=>list([d[0],d[1],r(402,[f(rec(d[2],402n),1n),strength,f(rec(d[2],402n),3n)])]);
 for(const [strength,context,expected] of [[q(1,10),q(1,2),1],[q(0,1),q(1,2),0],[q(1,10),q(0,1),0]] as const){
  const ds=[change(base,strength),change(ctx,context)],raw=r(403,[f(a.raw,1n),f(a.raw,2n),set(ds.map(v=>items(v,'list')[2])),f(a.raw,4n),set([]),list(ds)],3);
  const result=reasons.compileDescribedReasons(raw,definition(n.b.s),3,'Jaccard',true);
  expect(result.nuclei).toHaveLength(expected);correspondence(raw,result.nuclei,n.b.s);
 }
 console.info('M88 CONTROLS PASS hidden truth identical; denied evidence absent; zero-context0.78 numeric semantics retained; old direct/nested admission rejects; original weak base rescued / zero base rejected / weak alone inactive');
},570000);
it('M88 persistence and rollback: exact context continuation and atomic failure',async()=>{
 const a=await create(false,false,true,false,9n),b=await create(false,false,true,false,9n);exact(a.run,b.run);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 for(const run of [a.run,b.run,restored])await through(run,10n);exact(a.run,b.run);exact(a.run,restored);const captured=capture(a.run);
 // Component-only presentation of the actual saved rolls, not a native regime claim.
 expect(items(items(decisionPresentationView([captured.d]),'list')[1],'list')).toHaveLength(0);
 const displayData=record(captured.data.schema,new Map([...captured.data.fields].map(([n,v])=>[n,n===8n?u(3):v])));
 const displayDecision=record(captured.d.schema,new Map([...captured.d.fields].map(([n,v])=>[n,n===4n?r(419,[u(3),displayData]):v])));
 const display=decisionPresentationView([displayDecision]),faces=items(items(items(items(display,'list')[1],'list')[0],'list')[2],'list');
 expect(faces).toHaveLength(2);
 faces.forEach((v,i)=>{const projected=items(v,'list'),actual=rec(items(f(captured.data,9n),'list')[i],422n);expect(projected).toEqual([f(actual,1n),f(actual,2n),f(actual,3n),f(actual,4n),f(actual,6n),f(actual,7n),f(actual,8n)]);});
 console.info('M88 PROJECTION PASS native QuietRoll remains hidden from player rows; component-only displayed actual rolls preserve separate context and contribution');

 const checkpoints:bigint[]=[];
 for(let n=0;;n++){
  expect(n).toBeLessThan(32);const settled=[];for(const run of [a.run,b.run,restored])settled.push(await run.settleNextInstant());
  expect(settled[1]).toBe(settled[0]);expect(settled[2]).toBe(settled[0]);const x=a.run.snapshot();
  for(const run of [b.run,restored]){const y=run.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.run.save(),run.save());bytes(a.run.runIdentity(),run.runIdentity());}
  if(!settled[0])break;checkpoints.push(x.clock);
 }
 expect(a.run.snapshot().clock).toBe(101n);for(const run of [a.run,b.run,restored])expect(run.diagnostic()).toBeUndefined();
 const fault=await create(false,false,true,false,9n),before=fault.run.snapshot(),original=reasons.compileDescribedReasons;let called=false;
 const spy=vi.spyOn(reasons,'compileDescribedReasons').mockImplementation((...args)=>{const result=original(...args);if(args[4]&&result.nuclei.some(v=>si(f(rec(v,407n),8n))!==0n)){called=true;throw Error('M88 after context compilation');}return result;});
 try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M88 after context compilation');}finally{spy.mockRestore();}
 expect(called).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);expect(()=>fault.run.save()).toThrow('only an active quiescent run');
 console.info('M88 PERSISTENCE PASS repeat9/restore9->10 and every checkpoint '+checkpoints.join(',')+'; whole-instant rollback after actual context compilation');
},570000);
