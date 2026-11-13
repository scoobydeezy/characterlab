/** M101: same M100 primary native run; captured-input counterfactuals stay outside it. */
import {it,expect} from 'vitest';
import {witnessFixture,taskA,taskB,taskC,taskD,decode,rec,r,f,key,items,list,set,u,signed,q,enc} from './fixtures/assembledCommitmentWitness';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {restoreAuthoritativeState,type StatePath} from '../substrate/state';
import {typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {formationValue,formDisposition} from '../assembled/formation';
import {formationStatePath,jp} from './fixtures/assembledStandingSources';
import {ZERO,ONE,readQ} from '../campaign2/cognitiveMath';
import {workspaceOutput} from '../assembled/configurationWorkspace';
import {compileDescribedReasons} from '../assembled/reasons';
import {definition} from './fixtures/assembledReasonReference';
import {walk} from './fixtures/campaign2Cognitive';
import {NEED} from '../campaign3/commitModel';
import {W_MESSAGE,lifecycleMetadata} from '../assembled/commitmentWitness';
import {PRIORITY_LEARN,GOAL_OWNER} from '../assembled/priority';
import {COMMITMENT_CANCEL} from '../assembled/commitment';
import {through,bytes} from './fixtures/assembledAffectReceiving';
import {outputs,signedValue} from './fixtures/assembledComparison';
const same=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const path=(t:CanonicalValue):StatePath=>({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:t}]});
function records(v:CanonicalValue,type:bigint){const found:ReturnType<typeof rec>[]=[];function visit(x:CanonicalValue){if(typeof x==='boolean')return;if(x.kind==='record'){if(x.schema.typeId===type)found.push(x);for(const y of x.fields.values())visit(y);}else if(x.kind==='list'||x.kind==='set')x.items.forEach(visit);else if(x.kind==='map')x.entries.forEach(([a,b])=>{visit(a);visit(b);});}visit(v);return found;}
it('M101 closes native COMMIT lifecycle, fixed-state counterfactuals, strong-domain and trace correspondence',async()=>{
 const b=witnessFixture(),m=await compileCharacterModel(b.s),component=await compileCharacterState(m),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);
 const state=()=>restoreAuthoritativeState(decode(run.snapshot().state)),history=()=>[state().read(formationStatePath).value!,state().read(jp).value!,state().read({...jp,fieldId:1n}).value!];
 await through(run,11n);const earned=history(),formation=formationValue(earned[0]);expect(formation.P.compare(ZERO)).toBeGreaterThan(0);expect(formation.entries.length).toBeGreaterThan(0);
 let frozen13:ReturnType<typeof state>|undefined;
 const native=new Map<bigint,{raw:ReturnType<typeof rec>;ns:CanonicalValue[]}>(),counts:number[]=[],refs:CanonicalValue[]=[];
 for(const [at,task]of [[12n,undefined],[14n,taskC],[16n,undefined],[18n,taskD],[19n,taskD]] as const){
  if(at===14n){await through(run,13n);frozen13=state();}await through(run,at);const d=outputs(run.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===at)!;expect(d).toBeDefined();const context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=[...items(f(context,3n),'list')];expect(compileDescribedReasons(raw,definition(b.s),5,'SourceCoverage',true).nuclei).toEqual(ns);counts.push(ns.length);native.set(at,{raw,ns});expect(history()).toEqual(earned);
  if(task){expect(ns).toHaveLength(1);const ref=f(rec(f(rec(ns[0],407n),1n),404n),3n);refs.push(ref);expect(ref).toEqual(f(rec(task,371n),2n));expect(f(rec(f(d,4n),419n),1n)).toEqual(u(3));expect(outputs(run.snapshot().outputs,433n).some(o=>same(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n),d))).toBe(true);expect(f(rec(ns[0],407n),5n)).toEqual(signed(0));}
  for(const t of [taskA,taskB,...(at>=14n?[taskC]:[])])expect(f(rec(state().read(path(t)).value!,372n),1n)).toEqual(u(4));
 }
 expect(counts).toEqual([0,1,0,1,1]);expect(refs[0]).not.toEqual(refs[1]);expect(refs[1]).toEqual(refs[2]);
 await through(run,20n);expect(history()).toEqual(earned);const before=run.save(),after=state(),frozen=frozen13!,rawC=native.get(14n)!.raw,rawD=native.get(18n)!.raw,ws=records(rawC,381n)[0],wd=component.definition('task-workspace'),forecast=rec(f(ws,5n),380n),prediction=same(f(forecast,1n),u(2))?f(forecast,2n):undefined;
 expect(ws).toBeDefined();const fixedD=walk(rawC,x=>same(x,taskC)?taskD:x);expect(walk(fixedD,x=>same(x,taskD)?taskC:x)).toEqual(rawC);const sourceFor=(t:CanonicalValue)=>same(t,taskC)?rawC:fixedD;
 const descriptions=(v:CanonicalValue)=>items(f(rec(v,403n),6n),'list');
 function bundle(raws:readonly CanonicalValue[],edit:(d:CanonicalValue)=>CanonicalValue=(d=>d)){const ds=raws.flatMap(v=>descriptions(v).map(edit));expect(items(f(rawC,5n),'set')).toHaveLength(0);return r(403,[f(rawC,1n),f(rawC,2n),set(ds.map(d=>items(d,'list')[2])),f(rawC,4n),set([]),list(ds)],3);}
 const compile=(raw:CanonicalValue)=>compileDescribedReasons(raw,definition(b.s),5,'SourceCoverage',true).nuclei;
 const statuses=[[undefined,undefined],[r(372,[u(1)]),undefined],[r(372,[u(4),signed(14),u(1)],2),undefined],[r(372,[u(4),signed(14),u(1)],2),r(372,[u(1)])],[r(372,[u(4),signed(14),u(1)],2),r(372,[u(1)])]] as const;
 const select=(values:readonly (CanonicalValue|undefined)[],immortal=false)=>{const result=workspaceOutput(f(ws,1n),f(ws,2n),f(ws,3n),wd,component.tasks,14n,{prediction:()=>prediction,status:t=>{const i=[taskC,taskD].findIndex(x=>same(x,t));if(i<0)return frozen.read(path(t)).value;const value=values[i];return immortal&&value!==undefined?r(372,[u(1)]):value;}},5);return items(f(rec(result.output,381n),4n),'list').map(v=>f(rec(v,379n),1n));};
 const controlled=characters(statuses.map(v=>select(v))),immortal=characters(statuses.map(v=>select(v,true)));
 function characters(selected:CanonicalValue[][]){return selected.map(ts=>compile(bundle(ts.map(sourceFor))));}
 expect(controlled.map(x=>x.length)).toEqual([0,1,0,1,1]);expect(immortal[2].length).toBeGreaterThan(0);
 const need=r(371,[f(rec(taskC,371n),1n),f(rec(NEED,371n),2n)]),needTask={...component.tasks.find(t=>same(t.key,taskC))!,key:need},needRaw=walk(rawC,x=>same(x,taskC)?need:x);
 const core=statuses.map(()=>{const selected=workspaceOutput(f(ws,1n),f(ws,2n),f(ws,3n),wd,[needTask],14n,{status:()=>r(372,[u(1)]),prediction:()=>prediction},5);expect(items(f(rec(selected.output,381n),4n),'list')).toHaveLength(1);return compile(needRaw);});expect(core.map(x=>x.length)).toEqual([1,1,1,1,1]);expect(f(rec(f(rec(core[0][0],407n),1n),404n),3n)).toEqual(f(rec(need,371n),2n));expect(need).not.toEqual(taskC);
 const reused=compile(walk(rawD,x=>same(x,taskD)?taskC:x));expect(f(rec(f(rec(reused[0],407n),1n),404n),3n)).toEqual(refs[0]);expect(f(rec(f(rec(reused[0],407n),1n),404n),3n)).not.toEqual(refs[1]);
 expect(()=>component.stateModel.applyPatch(after,{operations:[{kind:'set',path:path(taskC),expected:{presence:true,value:after.read(path(taskC)).value!},newValue:r(372,[u(1)])}]},GOAL_OWNER,{writableRoots:[373n],targetPaths:[path(taskC)]})).toThrow('terminal');
 // Reference-law bound, not authored native history: P is clamped and |alignment|<1.
 expect(formDisposition(ZERO,ONE,0).after).toEqual(Q.of(1n,2n));expect(formDisposition(ZERO,Q.of(-1n),0).after).toEqual(Q.of(-1n,2n));
 const strength=(d:CanonicalValue,zeroBase=false)=>{const a=items(d,'list'),s=rec(a[2],402n),role=f(rec(f(s,1n),401n),3n);return list([a[0],a[1],r(402,[f(s,1n),same(role,u(3))?q(1,2):zeroBase&&same(role,u(1))?q(0,1):f(s,2n),f(s,3n)])]);};
 for(const raw of [rawC,rawD]){const strong=compile(bundle([raw],d=>strength(d))),zero=compile(bundle([raw],d=>strength(d,true)));expect(strong).toHaveLength(1);expect(zero).toHaveLength(0);expect(readQ(f(rec(f(rec(strong[0],407n),2n),406n),2n)).compare(ZERO)).toBeGreaterThan(0);}
 // Actual ordered trace: source/status metadata, adoption/cancellation causes, pressure and execution.
 const traces=outputs(run.snapshot().trace,160n),at=(t:ReturnType<typeof rec>)=>signedValue(f(rec(f(t,4n),130n),2n)),event=(t:ReturnType<typeof rec>)=>f(rec(f(t,4n),130n),5n);
 for(const [instant,task]of [[12n,taskC],[16n,taskD]] as const){const t=traces.find(t=>at(t)===instant&&same(event(t),PRIORITY_LEARN))!;expect(t).toBeDefined();const diffs=items(f(t,17n),'list').map(v=>rec(v,148n)).filter(v=>records(f(v,1n),371n).some(x=>same(x,task)));expect(diffs.map(v=>f(rec(f(v,1n),140n),2n))).toEqual([u(1),u(2),u(3)]);}
 const cancellation=traces.find(t=>at(t)===14n&&same(event(t),COMMITMENT_CANCEL))!;expect(cancellation).toBeDefined();const old=after.read(path(taskC)).value!;expect(f(rec(old,372n),1n)).toEqual(u(4));expect(items(f(rec(f(cancellation,4n),130n),8n),'list')).toEqual([f(rec(old,372n),3n)]);expect(lifecycleMetadata(old)).toEqual(list([u(2),u(2),u(4)]));
 const messages=traces.filter(t=>same(event(t),W_MESSAGE));expect(messages).toHaveLength(6);expect(messages.map(t=>items(items(f(t,13n),'list')[0],'list')[3])).toEqual([list([u(0),u(0),u(0)]),list([u(1),u(1),u(0)]),list([u(2),u(2),u(4)]),list([u(1),u(1),u(0)]),list([u(1),u(1),u(0)]),list([u(2),u(2),u(4)])]);
 for(const [instant,task]of [[14n,taskC],[18n,taskD]] as const){const atRows=traces.filter(t=>at(t)===instant),motives=atRows.flatMap(t=>records(f(t,13n),393n));expect(motives.some(v=>same(f(v,1n),task)&&readQ(f(v,2n)).compare(ZERO)>0)).toBe(true);expect(atRows.some(t=>records(f(t,13n),381n).some(v=>records(f(v,4n),371n).some(x=>same(x,task))))).toBe(true);}
 bytes(before,run.save());expect(history()).toEqual(earned);
 console.info('M101 PASS native/controlled 0,1,0,1,1; CoreNeed '+core.map(x=>x.length)+'; Immortal '+immortal.map(x=>x.length)+'; ReusedId repeats C and actual owner rejects. Earned P='+formation.P.numerator+'/'+formation.P.denominator+'; fixed history; positive standing/native modifier0; conservative1/2 standing cannot revive zero base. All metadata/pressure/ref/execution joins pass; captured controls never enter run/save.');
},570000);
