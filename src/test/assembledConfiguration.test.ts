import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {createAssembledRandomSession} from '../assembled/random';
import {analyzeOptions} from '../assembled/configurationMath';
import {analyzeOptions as oldAnalysis,ONE,readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {restoreAuthoritativeState} from '../substrate/state';
import {list,set,unsigned,text,signed,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataUnsigned as uint,dataText as txt,dataIdentity as id} from '../campaign2/canonicalData';
import {personPath} from '../assembled/social';
import {REL_APPRAISAL,relationshipPath,relationshipHistory} from '../assembled/relationship';
import {selectedBodyEffect} from '../assembled/actionBody';
import {PERFORMANCE,PERFORMANCE_SETTING,PERFORMANCE_OBS} from '../assembled/performance';
import {controlAllocation} from '../assembled/control';
import {C} from './fixtures/campaign2Cognitive';
import {target} from './fixtures/assembledSocial';
import {configurationSource,configurationData,reducedSource,newAction,newSpec,newTask,newInstruction,decode,items,rec,f,key,enc,replace,walk} from './fixtures/assembledConfiguration';
import {outputs,mapFromDecision,through,finish,draws,decisions,choice,atom,type Run} from './fixtures/assembledComparison';
import {workLimit,overlapAuthority} from './fixtures/assembledCharacter';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
let prepared:Promise<{model:Awaited<ReturnType<typeof prepareCharacterModel>>;maps:ReturnType<typeof mapFromDecision>[]}>|undefined;
function fixture(){return prepared??=(async()=>{const model=await prepareCharacterModel(configurationSource()),maps=[];for(const p of [true,false]){const run=await createCharacterRun(model,configurationData(p,0));await through(run,3n);maps.push(mapFromDecision(run));console.info('M21b preflight '+JSON.stringify({participant:p,mode:Number(uint(f(rec(f(rec(f(decisions(run)[0],4n),419n),2n),420n),8n))),draws:draws(run).length}));}return {model,maps};})();}
const mapped=(p:boolean,seed:number,map:ReturnType<typeof mapFromDecision>)=>{const d=configurationData(p,seed);return {...d,orderedInputs:enc(list([map.canonicalValue,...items(decode(d.orderedInputs),'list')]))};};
describe('M21b one configurable character',()=>{
 it('numerical: binary equality and independent exact three-way fair ties',()=>{
  for(let n=1;n<=5;n++){const options=[0,1].map(i=>({key:text('action/'+i),distribution:new Map([[0n,Q.of(BigInt(n),BigInt(n+1))],[BigInt(i+1),Q.of(1n,BigInt(n+1))]]),reasonMass:ONE}));expect(analyzeOptions(options,Q.of(1n,2n),Q.of(1n,2n))).toEqual(oldAnalysis(options,Q.of(1n,2n),Q.of(1n,2n)));}
  const symmetric=[0,1,2].map(i=>({key:text('action/'+i),distribution:new Map([[0n,Q.of(1n,2n)],[1n,Q.of(1n,2n)]]),reasonMass:ONE}));
  const reference=[Q.of(0n),Q.of(0n),Q.of(0n)];for(let bits=0;bits<8;bits++){const scores=[0,1,2].map(i=>(bits>>i)&1),best=Math.max(...scores),leaders=scores.flatMap((v,i)=>v===best?[i]:[]);for(const i of leaders)reference[i]=reference[i].add(Q.of(1n,BigInt(8*leaders.length)));}
  expect(analyzeOptions(symmetric,ONE,ONE,3).probabilities.map(p=>p.probability)).toEqual(reference);expect(reference).toEqual([Q.of(1n,3n),Q.of(1n,3n),Q.of(1n,3n)]);
  expect(()=>analyzeOptions(symmetric,ONE,ONE)).toThrow('candidate domain');
  expect(controlAllocation(5,4,false,false,false,false,false).spare).toBe(1);
 });
 it('admission: arbitrary names, reduced configuration and malformed coverage/topology',async()=>{
  const s=configurationSource();expect(await prepareCharacterModel(s)).toBeDefined();expect(await prepareCharacterModel(reducedSource())).toBeDefined();
  const rename=(v:CanonicalValue)=>[newAction,newInstruction,newSpec,newTask].some(x=>key(x)===key(v))&&typeof v!=='boolean'&&v.kind==='typedIdentifier'?{...v,payload:text('unlisted/'+key(v))}:v;
  const renamed=(v:CanonicalValue):CanonicalValue=>walk(v,x=>{const changed=rename(x);return changed!==x?changed:typeof x!=='boolean'&&x.kind==='typedIdentifier'?{...x,payload:renamed(x.payload)}:x;});
  expect(await prepareCharacterModel({...s,content:enc(renamed(decode(s.content))),registry:enc(renamed(decode(s.registry)))})).toBeDefined();
  await expect(prepareCharacterModel(overlapAuthority(s))).rejects.toThrow();
  const mutate=(change:Parameters<typeof walk>[1])=>({...s,registry:enc(walk(decode(s.registry),change))});
  await expect(prepareCharacterModel(mutate(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===378n?replace(v,2n,unsigned(6)):v))).rejects.toThrow('capacity');
  await expect(prepareCharacterModel(mutate(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===416n?replace(v,2n,set([])):v))).rejects.toThrow('coverage');
  const partial=items(decode(s.registry),'list'),body=items(partial[10],'list');await expect(prepareCharacterModel({...s,registry:enc(list(partial.map((v,i)=>i===10?list([body[0],body[1],set(items(body[2],'set').slice(0,2))]):v)))})).rejects.toThrow('coverage');
 },60000);
 it('matrix: three genuine candidates and acquired history change choice under coupled entropy',async()=>{
  const {model,maps}=await fixture(),compiled=await compileCharacterModel(configurationSource()),changed:number[]=[];let common=0,unmatched=0,third=0;
  for(let seed=0;seed<8;seed++){
   const a=await createCharacterRun(model,mapped(true,seed,maps[0])),b=await createCharacterRun(model,mapped(false,seed,maps[1]));await through(a,3n);await through(b,3n);
   expect(state(a).read(personPath(C,target))).toEqual(state(b).read(personPath(C,target)));
   for(const r of [a,b]){const context=rec(f(decisions(r)[0],3n),408n),options=rec(f(rec(f(context,2n),403n),2n),398n);expect(items(f(options,3n),'list')).toHaveLength(3);const prior=state(r).read(relationshipPath(C,target)).value;expect(relationshipHistory(prior)).toHaveLength(r===a?2:0);expect(reports(r,REL_APPRAISAL).at(-1)![3]).toEqual(prior??list([]));}
   expect(f(decisions(a)[0],3n)).not.toEqual(f(decisions(b)[0],3n));
   const aa=draws(a),bb=draws(b),y=new Map(bb.map(v=>[key(f(v,2n)),v]));let paired=0;
   for(const d of [...aa,...bb])expect(rec(f(d,2n),113n).schema.typeId).toBe(113n);
   for(const x of aa){const z=y.get(key(f(x,2n)));if(z){paired++;const ax=items(f(x,7n),'list'),az=items(f(z,7n),'list');for(let i=0;i<Math.min(ax.length,az.length);i++){expect(f(rec(ax[i],410n),1n)).toEqual(f(rec(az[i],410n),1n));expect(f(rec(ax[i],410n),2n)).toEqual(f(rec(az[i],410n),2n));}}}
   expect(paired).toBeGreaterThan(0);common+=paired;unmatched+=aa.length+bb.length-2*paired;if(choice(a)!==choice(b))changed.push(seed);
   console.info('M21b cell '+JSON.stringify({seed,a:choice(a),b:choice(b),common:paired,draws:aa.length+bb.length}));
   await finish(a);await finish(b);
   for(const r of [a,b]){third+=outputs(r.snapshot().outputs,433n).filter(v=>key(selectedBodyEffect(v,C,compiled.actionBody!).action)===key(newAction)).length;expect(outputs(r.snapshot().trace,160n).filter(t=>key(f(rec(f(t,4n),130n),5n))===key(atom(1001,'event/task-deadline')))).toHaveLength(3);}
  }
  expect(changed.length).toBeGreaterThan(0);expect(third).toBeGreaterThan(0);console.info('M21b matrix '+JSON.stringify({runs:16,changed,common,unmatched,thirdActionExecutions:third,terminal:10}));
 },550000);
 it('continuation: exact repeat, restores2/3, hidden truth, learned-S0 rejection and rollback',async()=>{
  const {model,maps}=await fixture(),d=mapped(true,0,maps[0]),a=await createCharacterRun(model,d),b=await createCharacterRun(model,d);await through(a,2n);const s2=a.save();await through(a,3n);const s3=a.save();await finish(a);await finish(b);exact(a,b);
  for(const save of [s2,s3]){const restored=await restoreCharacterRun(configurationSource(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save});await finish(restored);exact(a,restored);}
  const hidden={...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').map(v=>{if(typeof v!=='boolean'&&v.kind==='record')return v;const x=[...items(v,'list')];if(key(x[2])===key(atom(1001,'event/assembled-social-source'))){const p=[...items(x[3],'list')];p[1]=!p[1];x[3]=list(p);}return list(x);})))},h=await createCharacterRun(model,hidden);await finish(h);expect(h.snapshot().state).toEqual(a.snapshot().state);expect(decisions(h)).toEqual(decisions(a));expect(draws(h)).toEqual(draws(a));
  await expect(createCharacterRun(model,{...d,initialState:a.snapshot().state})).rejects.toThrow('initial');
  const failed=await createCharacterRun(await prepareCharacterModel(workLimit(configurationSource(),1n)),d),before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);
  const decision=decisions(a)[0],context=f(decision,3n),options=rec(f(rec(f(rec(context,408n),2n),403n),2n),398n);
  const leaders=items(f(options,3n),'list').map(v=>f(rec(v,397n),1n)).sort((a,b)=>key(a)<key(b)?-1:1),rng=createAssembledRandomSession(new Uint8Array(32),undefined,3);
  rng.begin();const tie=rec(await rng.forResolution(f(decision,1n),context).tie(leaders),411n);expect(uint(f(tie,4n))).toBe(3n);expect(uint(f(tie,3n))).toBeLessThan(3n);rng.close();
  console.info('M21b continuation: repeat/restores2/3/hidden truth/learned-S0/rollback/three-leader tie PASS');
 },240000);
 it('feedback: all three selected task reports get real identities; hidden rows preserve later allocation',async()=>{
  const s=configurationSource(),slots=[...items(decode(s.registry),'list')],strategy=items(slots[12],'list');
  slots[12]=list([strategy[0],list(items(strategy[1],'list').map(v=>list([items(v,'list')[0],atom(1027,'definition/task-instruction-one'),atom(1027,'definition/task-instruction-two')]))) ]);
  const source={...s,registry:enc(list(slots))},model=await prepareCharacterModel(source),base=configurationData(),tasks=state(await createCharacterRun(model,base)).entries().filter(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===1n).map(e=>(e.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key),runs:Run[]=[];
  for(const visible of [true,false]){const frame=list([signed(3),unsigned(30),PERFORMANCE_SETTING,list([text(PERFORMANCE),list(tasks.map(t=>list([t,visible,unsigned(0)])))]),list([])]),d={...base,orderedInputs:enc(list([...items(decode(base.orderedInputs),'list'),frame]))},r=await createCharacterRun(model,d);await through(r,3n);runs.push(r);const rows=reports(r,PERFORMANCE_OBS);expect(rows).toHaveLength(visible?3:0);for(const row of rows)expect(id(row[1]).namespaceId).toBe(1164n);expect(new Set(rows.map(row=>key(row[1]))).size).toBe(rows.length);}
  expect(f(outputs(runs[0].snapshot().outputs,429n)[0],1n)).toEqual(f(outputs(runs[1].snapshot().outputs,429n)[0],1n));
  expect(draws(runs[0])).toEqual(draws(runs[1]));console.info('M21b three-target feedback IDs and later qualification allocation PASS');
 },90000);
});
