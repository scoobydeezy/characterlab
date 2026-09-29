/** defining-native-lifecycle/0.1-candidate. Successor state partition and exact ownership. */
import {canonicalEncode as enc,list,signed,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,patternMatches,statePathPatternValue,type StatePath,type StatePathPattern,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {dataKey as key,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {generalSubject,generalId as id,generalRecord as gr} from './generalBindingProfile';
import {definingLifecycleRecord as r,decodeDefiningLifecycle as decode} from './definingLifecycleCodecs';
import {definingContinuationSpec,type DefiningContinuationProgram} from './definingContinuationProgram';
import {initialDefiningInterpretation,adoptDefiningInterpretation,receiveDefiningReport,readDefiningInterpretation} from './definingInterpretationOwner';
import type {compileGeneralDeclarations} from './generalDeclarations';
type Model=Awaited<ReturnType<typeof compileGeneralDeclarations>>;
export const definingLifecycleStages=['defining-adopt','defining-report','defining-horizon'] as const;
export type DefiningLifecycleStage=typeof definingLifecycleStages[number];
export const definingLifecyclePhase=(stage:DefiningLifecycleStage)=>stage==='defining-adopt'?140n:stage==='defining-report'?120n:40n;
export const definingLifecyclePath=(root:1485|1486):StatePath=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key:generalSubject().character}]});
export const definingLifecyclePattern=(root:1485|1486):StatePathPattern=>{const p=definingLifecyclePath(root);return {...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))};};
const fail=(why:string):never=>{throw Error('DEFINING_LIFECYCLE_STATE: '+why);};
export function compileDefiningLifecycleState(base:Model,program:DefiningContinuationProgram){
 const spec=definingContinuationSpec(program),variant=['Absent','High','Low','Wide'].indexOf(spec.goal),s0=initialDefiningInterpretation(program),adopted=adoptDefiningInterpretation(s0,37n),reported=receiveDefiningReport(adopted,43n);
 function goalValue(adopt:boolean){const view=readDefiningInterpretation(adopt?adopted:s0),g=view.goals[0],fields=new Map<bigint,CanonicalValue>([[1n,u(variant)],[2n,view.adopted]]);if(view.adopted)fields.set(3n,signed(37));if(g){fields.set(4n,signed(g.activeFrom));fields.set(5n,signed(g.expiresAt));fields.set(6n,gr(556,[q(g.desired.lower.numerator,g.desired.lower.denominator),q(g.desired.upper.numerator,g.desired.upper.denominator)]));}return r(1485,fields);}
 function reportValue(observed:boolean){const value=readDefiningInterpretation(observed?reported:s0).report;if(value.kind==='NotObserved')return r(1486,[u(0)]);if(value.kind==='Missing')return r(1486,[u(1),signed(value.at)]);return r(1486,[u(2),signed(value.at),gr(556,[q(value.interval.lower.numerator,value.interval.lower.denominator),q(value.interval.upper.numerator,value.interval.upper.denominator)])]);}
 const values=new Map([[1485,[goalValue(false),goalValue(true)]],[1486,[reportValue(false),reportValue(true)]]]);
 const isNew=(p:StatePath)=>p.rootStateTypeId===1485n||p.rootStateTypeId===1486n;
 const legacy=(state:AuthoritativeState)=>new AuthoritativeState(state.entries().filter(e=>!isNew(e.path)));
 function validateNew(state:AuthoritativeState){const rows=state.entries().filter(e=>isNew(e.path));if(rows.length!==2)fail('required owner roots');for(const e of rows){const root=Number(e.path.rootStateTypeId) as 1485|1486;if(!patternMatches(definingLifecyclePattern(root),e.path)||!values.get(root)!.some(v=>key(v)===key(e.value)))fail('owner leaf binding');decode(enc(e.value));}}
 function validateState(state:AuthoritativeState){validateNew(state);base.state.validateState(legacy(state));}
 const authorities=([1485,1486] as const).map(root=>({mutationAuthorityId:id(1025,root===1485?'authority/defining-interpretation-goal':'authority/defining-admitted-report'),patterns:[definingLifecyclePattern(root)]}));
 const registry=new StateAuthorityRegistry(([1485,1486] as const).map(root=>({pattern:definingLifecyclePattern(root),removalAllowed:false,validateValue:(value:CanonicalValue)=>{if(!values.get(root)!.some(v=>key(v)===key(value)))fail('owner value domain');}})),authorities);
 function merge(prior:AuthoritativeState,next:AuthoritativeState){return new AuthoritativeState([...next.entries(),...prior.entries().filter(e=>isNew(e.path))]);}
 function inherited(state:AuthoritativeState,apply:(state:AuthoritativeState)=>ReturnType<Model['state']['applyStagePatch']>){validateState(state);const result=apply(legacy(state)),next=merge(state,result.state);validateState(next);return {...result,state:next};}
 function applyStagePatch(stage:string,state:AuthoritativeState,patch:StatePatch){
  if(!definingLifecycleStages.includes(stage as DefiningLifecycleStage))return inherited(state,s=>base.state.applyStagePatch(stage,s,patch));
  validateState(state);if(stage==='defining-horizon'){if(patch.operations.length)fail('read-only horizon');return {state,diffs:[]};}
  const root=stage==='defining-adopt'?1485:1486;
  if(patch.operations.some(op=>!patternMatches(definingLifecyclePattern(root),op.path)))fail('stage write domain');
  const result=applyStatePatch(state,patch,authorities[root===1485?0:1].mutationAuthorityId,registry);validateState(result.state);return result;
 }
 const state=Object.freeze({...base.state,validateState,applyStagePatch,
  restoreState(bytes:Uint8Array){const state=restoreAuthoritativeState(decode(bytes));validateState(state);return state;},
  applyProtocolPatch:(state:AuthoritativeState,patch:StatePatch)=>inherited(state,s=>base.state.applyProtocolPatch(s,patch)),
  applyPredictionPatch:(state:AuthoritativeState,patch:StatePatch)=>inherited(state,s=>base.state.applyPredictionPatch(s,patch)),
  applyTaskPatch:(state:AuthoritativeState,patch:StatePatch)=>inherited(state,s=>base.state.applyTaskPatch(s,patch)),
  ownershipBytes:()=>enc(list([decode(base.state.ownershipBytes()),...authorities.map(a=>list([a.mutationAuthorityId,list(a.patterns.map(statePathPatternValue))]))]))
 });
 function validateQuiescent(state:AuthoritativeState,now:bigint,nextRuntimeId?:bigint){validateState(state);base.validateQuiescent(legacy(state),now,nextRuntimeId);for(const [root,done] of [[1485,now>=37n],[1486,now>=43n]] as const){if(key(state.read(definingLifecyclePath(root)).value!)!==key(values.get(root)![done?1:0]))fail('quiescent lifecycle');}}
 function transition(stage:DefiningLifecycleStage,source:CanonicalValue,state:AuthoritativeState,now:bigint){
  validateState(state);const command=rec(decode(enc(source)),1487n),index=definingLifecycleStages.indexOf(stage),value=stage==='defining-adopt'?variant:stage==='defining-report'?['missing','original','contrary'].indexOf(spec.report):0;
  const at=stage==='defining-adopt'?37n:stage==='defining-report'?43n:BigInt(spec.now);
  if(key(command)!==key(r(1487,[u(index+1),signed(at),u(value)]))||at!==now)fail('source binding');
  if(stage==='defining-horizon')return {patch:{operations:[]} as StatePatch,reads:[] as ActualReadRecord[]};
  const root=stage==='defining-adopt'?1485:1486,paths=stage==='defining-report'?[definingLifecyclePath(1485),definingLifecyclePath(1486)]:[definingLifecyclePath(1485)];
  const reads:ActualReadRecord[]=paths.map(path=>{const read=state.read(path);return {accessorId:id(1028,'accessor/'+stage),path,presence:read.presence,value:read.value,derivedSources:[]};});
  if(stage==='defining-report'&&key(reads[0].value!)!==key(values.get(1485)![1]))fail('report before adoption');
  const old=state.read(definingLifecyclePath(root)).value!;if(key(old)!==key(values.get(root)![0]))fail('duplicate lifecycle transition');
  return {patch:{operations:[{kind:'set',path:definingLifecyclePath(root),expected:{presence:true,value:old},newValue:values.get(root)![1]}]} as StatePatch,reads};
 }
 const initial={...base.initial,build:()=>new AuthoritativeState([...base.initial.build().entries(),...([1485,1486] as const).map(root=>({path:definingLifecyclePath(root),value:values.get(root)![0]}))])};
 return Object.freeze({model:{...base,state,initial,validateQuiescent},legacy,transition,source(stage:DefiningLifecycleStage){return r(1487,[u(definingLifecycleStages.indexOf(stage)+1),signed(stage==='defining-adopt'?37:stage==='defining-report'?43:spec.now),u(stage==='defining-adopt'?variant:stage==='defining-report'?['missing','original','contrary'].indexOf(spec.report):0)]);}});
}
