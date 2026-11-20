/** M188 bd8218b9: captured current embarrassment, never reconstructed decisions. */
import {it,expect,vi} from 'vitest';
import * as stateModule from '../substrate/state';
import {restoreAuthoritativeState,AuthoritativeState,statePathValue} from '../substrate/state';
import {list,text,unsigned as u,rational as q,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {fixture,decode,items,key,enc,target,actionA,actionB,type Opt} from './fixtures/assembledEmbarrassmentCurrent';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {receivingRecord as rec,cognitiveRecord as cr} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataText as txt,dataIdentity as id,dataRecord as metadataRecord} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {EMBARRASSMENT,EMBARRASSMENT_VERSION,evaluationFold,evaluationSource} from '../assembled/embarrassment';
import {personPath,personHistory,personMean,PERSON_OWNER} from '../assembled/social';
import {REL_OWNER} from '../assembled/relationship';
import {importancePath} from '../assembled/priority';
import {arbitrationOutput} from '../assembled/arbitration';
import {randomAddressValue,naturalRandomKeyValue} from '../substrate/random';
import {sid} from '../assembled/skill';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
import {timeDomainVersion,EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {nativeRuntime,nativeCase,nativeRows} from './embarrassmentPublicFixtures';
const VERSION=timeDomainVersion(EMBARRASSMENT_VERSION,EXTENDED_TIME_LIMIT);
const cache=new WeakMap<Run,ReturnType<Run['snapshot']>>();
const snap=(r:Run)=>{let s=cache.get(r);if(!s){s=r.snapshot();cache.set(r,s);}return s;};
async function step(r:Run){cache.delete(r);return r.settleNextInstant();}
async function through(r:Run,t:bigint){for(let n=0;snap(r).clock<t;n++){expect(n).toBeLessThan(32);expect(await step(r)).toBe(true);}expect(snap(r).clock).toBe(t);}
async function finish(r:Run){for(let n=0;await step(r);n++)expect(n).toBeLessThan(32);expect(r.diagnostic()).toBeUndefined();}
const trace=(r:Run)=>outputs(snap(r).trace,160n),event=(t:ReturnType<typeof trace>[number])=>rec(f(t,4n),130n);
const reports=(r:Run,tag:string)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const app=(r:Run,at=3)=>reports(r,EMBARRASSMENT+'/appraisal').find(a=>uint(a[1])===BigInt(at))!;
const state=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state));
const history=(r:Run)=>state(r).read(personPath(C,target)).value;
const dec=(r:Run)=>outputs(snap(r).outputs,409n).find(v=>signedValue(f(v,2n))===3n)!;
const result=(d:CanonicalValue)=>{const s=rec(f(rec(d,409n),4n),419n);expect(uint(f(s,1n)),'live resolved choice').toBe(3n);return rec(f(s,2n),420n);};
const frac=(v:CanonicalValue)=>{const n=readQ(v);return n.numerator+'/'+n.denominator;};
const definition=(s:ReturnType<typeof fixture>['s'],name:string)=>f(metadataRecord(items(items(decode(s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/'+name)))!,171n),4n);
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((v,i)=>v===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of['state','outputs','trace']as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
async function create(o:Opt={},at=3n){const b=fixture(o),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};}
function live(r:Run,mismatch:boolean){
 const a=app(r);expect(a,'live appraisal').toBeDefined();expect(a[8]).toEqual(text('Known'));
 expect(a.slice(3,8)).toEqual([list([mismatch]),list([true]),list([q(1,2)]),list([q(mismatch?1:0,2)]),q(3,5)]);
 expect(a[9]).toEqual(list([q(mismatch?3:0,10),q(mismatch?3:0,10)]));
 expect(personHistory(history(r))).toHaveLength(2);expect(personMean(history(r))).toBeUndefined();
 const producer=trace(r).find(t=>txt(f(t,6n))===VERSION&&uint(f(event(t),3n))===50n&&signedValue(f(event(t),2n))===3n)!;
 expect(producer).toBeDefined();expect(f(producer,13n)).toEqual(a);
 const reads=items(f(producer,11n),'list').map(v=>rec(v,147n));expect(reads.map(v=>f(v,2n))).toContainEqual(statePathValue(personPath(C,target)));
 const config=items(items(decode(fixture().s.registry),'list')[42],'list');
 expect(reads.map(v=>f(v,2n))).toContainEqual(statePathValue(importancePath(config[2])));
 expect(items(f(producer,12n),'list')[0]).toEqual(history(r));
 const receive=trace(r).find(t=>txt(f(t,6n))===VERSION&&uint(f(event(t),3n))===80n&&signedValue(f(event(t),2n))===3n)!;
 expect(receive).toBeDefined();const input=items(f(receive,12n),'list');expect(input[1]).toEqual(a);expect(uint(input[2])).toBe(uint(f(event(producer),1n)));
 const joined=reports(r,EMBARRASSMENT+'/reasons').find(a=>uint(a[1])===3n)!;expect(joined[2]).toEqual(a);
 const additions=items(joined[3],'list').map(v=>items(v,'list'));expect(additions).toHaveLength(1);expect(additions[0][2]).toEqual(q(mismatch?3:0,10));
 expect(readQ(additions[0][3])).toEqual(readQ(additions[0][1]).add(readQ(additions[0][2])));
 const d=dec(r);expect(d).toBeDefined();const context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list').map(v=>rec(v,407n)),signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
 expect(ns).toHaveLength(2);
 for(const action of[actionA,actionB]){const base=signals.filter(v=>{const sk=rec(f(v,1n),401n);return key(f(rec(f(sk,1n),395n),2n))===key(action)&&uint(f(sk,3n))===1n;});expect(base).toHaveLength(1);expect(readQ(f(base[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);}
 if(mismatch){
  const contribution=signals.find(v=>key(f(v,1n))===key(additions[0][0]))!;expect(contribution).toBeDefined();expect(f(contribution,2n)).toEqual(additions[0][3]);
  expect(items(f(raw,6n),'list').some(v=>key(items(v,'list')[2])===key(contribution))).toBe(true);
  expect(ns.some(n=>items(f(rec(f(n,2n),406n),4n),'list').some(v=>{const c=rec(v,405n);return key(f(c,1n))===key(f(contribution,1n))&&readQ(f(c,5n)).compare(Q.of(0n))>0;}))).toBe(true);
 }
 expect(outputs(snap(r).outputs,426n).some(e=>key(f(rec(f(e,2n),425n),2n))===key(d)),'actual expression').toBe(true);
 expect(outputs(snap(r).outputs,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d)),'actual attempted execution').toBe(true);
 return {a,d,context,ns,raw,additions};
}
async function exactProof(s:ReturnType<typeof fixture>['s'],runs:Run[]){
 const def=definition(s,'task-arbitration'),resolutions=runs.map(dec),rs=resolutions.map(result),contexts=resolutions.map(d=>rec(f(d,3n),408n)),ns=contexts.map(c=>items(f(c,3n),'list').map(n=>rec(n,407n)));
 expect(ns[0].map(n=>f(n,4n))).toEqual(ns[1].map(n=>f(n,4n)));
 expect(ns[0].map(n=>f(n,1n))).toEqual(ns[1].map(n=>f(n,1n)));
 const candidates=ns[0].map(n=>f(rec(f(n,1n),404n),1n)),sizes=ns[0].map(n=>uint(f(n,4n)));expect(sizes).toHaveLength(2);
 for(const xs of ns)for(const n of xs)if(n.schema.schemaVersion===3n)expect(uint(f(n,10n))).toBe(0n);
 const counts=[0n,0n],total=sizes[0]*sizes[1]*2n;expect(total).toBeLessThanOrEqual(4096n);let changed=0;
 for(let a=0n;a<sizes[0];a++)for(let b=0n;b<sizes[1];b++)for(let tie=0n;tie<2n;tie++){
  const winners:CanonicalValue[]=[];
  for(let arm=0;arm<2;arm++){
   const occ=f(resolutions[arm],1n),draw=(value:bigint,span:bigint,n?:CanonicalValue)=>{
    const k=n?rec(f(rec(n,407n),1n),404n):undefined,c=k?rec(f(k,1n),395n):rec(candidates[0],395n);
    const address={causalRootId:id(occ),purposeId:sid(1042,k?'purpose/task-reason-face':'purpose/task-decision-tie'),subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(c,1n))},...(k?[{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(c,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(k,3n))}]:[])],drawIndex:0n};
    return cr(411,[randomAddressValue(address),naturalRandomKeyValue(address),u(value),u(span),u(((1n<<128n)/span)*span),false,list([cr(410,[u(0),u(value),false])])],1);
   };
   const out=await arbitrationOutput(occ,3n,contexts[arm],def,{async reason(n){const first=key(f(rec(f(rec(n,407n),1n),404n),1n))===key(candidates[0]);return draw(first?a:b,first?sizes[0]:sizes[1],n);},async tie(leaders){expect(leaders).toHaveLength(2);return draw(tie,2n);}},3),data=result(out),winner=f(data,1n);
   expect(f(data,2n)).toEqual(f(rs[arm],2n));winners.push(winner);if(key(winner)===key(candidates[0]))counts[arm]++;
  }
  if(key(winners[0])!==key(winners[1]))changed++;
 }
 console.info('M188 DIAGNOSTIC '+JSON.stringify({changed,cases:String(total),counts:counts.map(String),modes:rs.map(r=>String(uint(f(r,8n)))),probabilities:rs.map(r=>items(f(r,2n),'list').map(v=>frac(f(rec(v,421n),2n)))),nuclei:ns.map(xs=>xs.map(n=>({roles:[1n,2n,3n].map(i=>frac(f(rec(f(n,2n),406n),i))),die:String(uint(f(n,4n))),standing:String(signedValue(f(n,5n))),situation:String(signedValue(f(n,6n)))})))}));
 expect(changed).toBeGreaterThan(0);expect(counts[0]).not.toBe(counts[1]);
 for(let arm=0;arm<2;arm++){const probability=items(f(rs[arm],2n),'list').find(v=>key(f(rec(v,421n),1n))===key(candidates[0]))!;const actual=uint(f(rs[arm],8n))===1n?Q.of(key(f(rs[arm],1n))===key(candidates[0])?1n:0n):readQ(f(rec(probability,421n),2n));expect(actual.equals(Q.of(counts[arm],total))).toBe(true);}
 console.info('M188 EXACT '+JSON.stringify({cases:String(total),changed,firstCandidateWins:counts.map(String),probabilities:counts.map(n=>n+'/'+total),scope:'captured actual contexts; paired uniform faces and fair ties; no seed-pair claim'}));
 const withdraw=key(f(rec(candidates[0],395n),2n))===key(actionA)?counts[0]:total-counts[0];expect(withdraw).toBeGreaterThan(0n);expect(withdraw).toBeLessThan(total);return {counts,total,changed};
}
it('M188 primary actual contextual affect reaches grounded choice and execution',async()=>{
 const A=fixture(),B=fixture({mismatch:false});expect(A.s).toEqual(B.s);bytes(A.d.initialState,B.d.initialState);
 const m=await prepareCharacterModel(A.s),a=await createCharacterRun(m,A.d),b=await createCharacterRun(m,B.d);
 for(const r of[a,b])await through(r,3n);const pa=live(a,true),pb=live(b,false);
 expect(pa.additions[0][1]).toEqual(pb.additions[0][1]);
 expect(items(f(pa.raw,3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))===1n)).toEqual(items(f(pb.raw,3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))===1n));
 await exactProof(A.s,[a,b]);for(const r of[a,b])await finish(r);
 expect(snap(a).clock).toBe(snap(b).clock);
 console.info('M188 PRIMARY PASS same model/initial state; perceived mixed judgment -> prior contextual U3/10 vs0 -> actual compiled reasons/choice/expression/attempt; full queues to '+snap(a).clock);
},540000);
it('M188 controls recognition access unknown timing zero motive and original semantics',async()=>{
 for(const [o,status,amount]of [
  [{unknown:0},'Unavailable',undefined],[{unknown:1},'Unavailable',undefined],[{unknown:2},'Unavailable',undefined],
  [{denied:true},'Unavailable',undefined],[{signal:'appearance/stripe'},'Unavailable',undefined],[{signal:'appearance/plain'},'Unavailable',undefined],
  [{late:true},'Unavailable',undefined],[{seen:false},'Known',0],[{mixed:false,judgment:false},'Known',0],[{zeroBase:true},'Known',0]
 ] as [Opt,string,number|undefined][]){
  const {r}=await create(o);expect(app(r),'present appraisal').toBeDefined();expect(app(r)[8]).toEqual(text(status));expect(app(r)[9]).toEqual(list(amount===undefined?[]:[q(amount,1),q(amount,1)]));
  if(o.zeroBase)expect(items(reports(r,EMBARRASSMENT+'/reasons').find(a=>uint(a[1])===3n)![3],'list')).toHaveLength(0);
  if(o.late)expect(evaluationFold(personHistory(history(r))).likelihood).toEqual(Q.of(1n));
  await finish(r);console.info('M188 CONTROL '+JSON.stringify({o,status,amount,end:String(snap(r).clock)}));
 }
 const x=await create({unknown:2,judgment:true}),y=await create({unknown:2,judgment:false});bytes(snap(x.r).outputs,snap(y.r).outputs);bytes(snap(x.r).state,snap(y.r).state);await finish(x.r);await finish(y.r);
 const corrected=await create({mixed:false,correction:true});expect(app(corrected.r)[6]).toEqual(list([q(1,1)]));const old=app(corrected.r);await through(corrected.r,4n);expect(app(corrected.r,4)[6]).toEqual(list([q(2,3)]));expect(app(corrected.r)).toEqual(old);await finish(corrected.r);
 for(const [scenario,o]of [['Balanced',{}],['NoMismatch',{mismatch:false}],['Unseen',{seen:false}],['UnknownJudgment',{unknown:2}],['Nonnegative',{judgment:false}]] as const){
  const old=await nativeRuntime(nativeCase(scenario));for(let i=0;i<3;i++)await old.runtime.settle();
  const {r}=await create({mixed:false,competing:false,...o}),original=nativeRows(old.runtime.snapshot().outputs).at(-1)!;
  expect(items(app(r)[9],'list').map(frac)).toEqual(original.affect);await finish(r);console.info('M188 ORIGINAL '+scenario+' '+JSON.stringify(original.affect));
 }
 console.info('M188 CONTROLS PASS original Contextual semantic correspondence; unknown remains unknown; no authored evaluator belief.');
},540000);
it('M188 persistence privacy ownership and actual person-write rollback',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,b.d),h=fixture({truth:false}),hidden=await createCharacterRun(m,h.d);
 expect(b.s).toEqual(h.s);expect(b.d.orderedInputs).not.toEqual(h.d.orderedInputs);
 for(let n=0;snap(a).clock<2n;n++){expect(n).toBeLessThan(32);for(const r of[a,repeat,hidden])expect(await step(r)).toBe(true);exact(a,repeat);bytes(snap(a).state,snap(hidden).state);bytes(snap(a).outputs,snap(hidden).outputs);}
 const saved=a.save(),restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});exact(a,restored);
 // Reached second learning is faulted from save1, not an unrelated attempted write.
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const checkpoint=fault.save(),before=snap(fault),apply=stateModule.applyStatePatch;let reached=false;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const value=apply(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===810n)){reached=true;throw Error('M188 after actual person patch');}return value;});
 try{await expect(step(fault)).rejects.toThrow('M188 after actual person patch');expect(reached).toBe(true);for(const k of['state','outputs','trace']as const)bytes(snap(fault)[k],before[k]);expect(snap(fault).clock).toBe(before.clock);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:checkpoint});await through(recovered,2n);exact(a,recovered);
 const compiled=await compileCharacterState(await compileCharacterModel(b.s)),current=state(a),path=personPath(C,target),old=current.read(path).value!,rows=personHistory(old),last=[...items(rows.at(-1)!,'list')];last[0]=typedIdentifier(1115,u(9999));last[3]=signed(3);last[5]=u(3);
 const patch={operations:[{kind:'set' as const,path,expected:{presence:true as const,value:old},newValue:list([text('assembled-social/0.1'),list([...rows,list(last)])])}]};
 expect(()=>compiled.stateModel.applyPatch(current,patch,REL_OWNER)).toThrow();
 expect(personHistory(compiled.stateModel.applyPatch(current,patch,PERSON_OWNER).state.read(path).value)).toHaveLength(3);
 expect(()=>compiled.stateModel.applyPatch(current,{operations:[{...patch.operations[0],newValue:old}]},PERSON_OWNER)).toThrow('history rewrite');
 const initial=restoreAuthoritativeState(decode(b.d.initialState));await expect(createCharacterRun(m,{...b.d,initialState:enc(new AuthoritativeState([...initial.entries(),{path,value:old}]).canonicalValue())})).rejects.toThrow();
 for(const bad of[list([]),list([list([true,true])])])expect(()=>evaluationSource(bad)).toThrow();
 for(let n=0;n<32;n++){const more=await step(a);for(const r of[repeat,restored,recovered]){expect(await step(r)).toBe(more);exact(a,r);}expect(await step(hidden)).toBe(more);bytes(snap(a).state,snap(hidden).state);bytes(snap(a).outputs,snap(hidden).outputs);if(snap(a).clock===3n)live(a,true);if(!more)break;if(n===31)throw Error('M188 settle cap');}
 for(const r of[a,repeat,restored,recovered,hidden])expect(r.diagnostic()).toBeUndefined();
 console.info('M188 PERSISTENCE PASS exact every later full state/output/trace/save/run byte; public save2; rollback/recovery1->2->end; hidden safe prefixes; owner/append-only/bootstrap boundaries; end '+snap(a).clock);
},540000);
