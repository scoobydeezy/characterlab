/** M110 cost-only control patch regression. Structural test state, no psychology claim.
 * Real C0 patch authority and habit owner around an explicitly validating small base.
 * Native0.85 byte/rollback comparisons remain required before this repair is accepted. */
import {it,expect,vi} from 'vitest';
import {withControlState,CONTROL,GOAL_OWNER,WORKSPACE_OWNER,controlGoalPath,maintenancePath} from '../assembled/control';
import {withHabitState,rewardPath,HABIT} from '../assembled/habit';
import {REAPPRAISAL_FRAME,REAPPRAISAL_OBS,SHARED_AFFECT_OBS,MITIGATION_OBS,reappraisalPath,framePath} from '../assembled/reappraisal';
import {fatiguePath} from '../assembled/fatigue';
import {ruminationPath} from '../assembled/rumination';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,restoreStatePath,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {canonicalEncode as enc,list,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeCognitive as decode} from '../assembled/codecs';
import {dataKey as key} from '../campaign2/canonicalData';
import {sid,pattern} from '../assembled/skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
type Model=ReturnType<typeof compileCampaign2StateModel>;
const C=text('structural-holder'),owner=sid(1025,'authority/validation-test');
const path:StatePath={rootStateTypeId:9000n,fieldId:1n,selectors:[]},noOp:StatePatch={operations:[]};
const goal=controlGoalPath(C),value=(n:number,at=1)=>list([text(CONTROL),u(n),u(at)]);
function setup(mode:boolean|2|3=false){
 const checkPath=(p:StatePath)=>{if(key(statePathValue(p))!==key(statePathValue(path)))throw Error('base path');};
 const check=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='unsigned'||v.value>1n)throw Error('base value');};
 const validateState=vi.fn((s:AuthoritativeState)=>{for(const e of s.entries()){checkPath(e.path);check(e.value);}});
 const authority=new StateAuthorityRegistry([{pattern:pattern(path),validateValue:check,removalAllowed:false}],[{mutationAuthorityId:owner,patterns:[pattern(path)]}]);
 const base:Model={declaredFamilies:()=>[],family:()=>undefined,validatePath:checkPath,validateState,
  restorePath(bytes){const p=restoreStatePath(decode(bytes));checkPath(p);return p;},
  restoreState(bytes){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},
  read(s,p){checkPath(p);return s.read(p);},
  applyPatch(s,p,writer,scope){if(scope&&p.operations.some(o=>!scope.writableRoots.includes(o.path.rootStateTypeId)||!scope.targetPaths.some(t=>key(statePathValue(t))===key(statePathValue(o.path)))))throw Error('base scope');const result=applyStatePatch(s,p,writer,authority);validateState(result.state);return result;}
 };
 const habit=withHabitState(base,C),fullBase=vi.fn(habit.validateState);
 const sm=withControlState({...habit,validateState:fullBase},C,mode,true,{task:text('test-task'),law:'Alternating'});
 const initial=new AuthoritativeState([{path,value:u(0)}]);
 return {sm,initial,validateState,fullBase,authority};
}
const plus=(s:AuthoritativeState,p:StatePath,v:CanonicalValue)=>new AuthoritativeState([...s.entries().filter(e=>key(statePathValue(e.path))!==key(statePathValue(p))),{path:p,value:v}]);
function rejectsWithoutMutation(s:AuthoritativeState,fn:()=>unknown,message?:string){const before=enc(s.canonicalValue());expect(fn).toThrow(message);expect(enc(s.canonicalValue())).toEqual(before);}
it('control delegated validation preserves state/diffs and validates the base without a second full pass',()=>{
 const {sm,initial,validateState,fullBase,authority}=setup();
 const s=plus(initial,goal,value(1)),patch:StatePatch={operations:[{kind:'set',path,expected:{presence:true,value:u(0)},newValue:u(1)}]};
 const direct=applyStatePatch(initial,patch,owner,authority),result=sm.applyPatch(s,patch,owner);
 expect(enc(result.state.canonicalValue())).toEqual(enc(plus(direct.state,goal,value(1)).canonicalValue()));expect(result.diffs).toEqual(direct.diffs);
 expect(validateState).toHaveBeenCalled();expect(fullBase).not.toHaveBeenCalled();
 expect(enc(sm.applyPatch(s,noOp,owner).state.canonicalValue())).toEqual(enc(s.canonicalValue()));expect(fullBase).not.toHaveBeenCalled();
 sm.validateState(result.state);expect(fullBase).toHaveBeenCalledTimes(1);
 expect(enc(sm.restoreState(enc(result.state.canonicalValue())).canonicalValue())).toEqual(enc(result.state.canonicalValue()));expect(fullBase).toHaveBeenCalledTimes(2);
});
for(const mode of [false,true,2,3] as const)it('control rejects invalid inherited/local states through no-op/full/restore mode '+mode,()=>{
 const {sm,initial}=setup(mode),bad:[string,AuthoritativeState][]=[
  ['base value',plus(initial,path,u(2))],['control state value',plus(initial,goal,value(9))],
  ['control foreign path',plus(initial,{...goal,selectors:[]},value(1))],
  ['control state value',plus(initial,maintenancePath(C),value(1))],
  ['',plus(initial,rewardPath(C),list([text(HABIT),true,u(1),u(1)]))],
  ['',plus(initial,fatiguePath(C),true)],['',plus(initial,ruminationPath(C),true)]
 ];
 for(const [message,s]of bad)for(const check of [()=>sm.applyPatch(s,noOp,owner),()=>sm.validateState(s),()=>sm.restoreState(enc(s.canonicalValue()))])rejectsWithoutMutation(s,check,message||undefined);
 if(mode){
  const evidence=typedIdentifier(1164,u(1)),frame=list([text(REAPPRAISAL_FRAME),u(1),typedIdentifier(1141,u(1)),list([evidence])]);
  const dangling=plus(initial,framePath(C),frame);
  for(const check of [()=>sm.applyPatch(dangling,noOp,owner),()=>sm.validateState(dangling),()=>sm.restoreState(enc(dangling.canonicalValue()))])rejectsWithoutMutation(dangling,check,'frame evidence retained');
  const observation=list([text(mode===3?MITIGATION_OBS:mode===2?SHARED_AFFECT_OBS:REAPPRAISAL_OBS),evidence,C,u(1),u(1),list([true]),u(0),...(mode===2||mode===3?[u(0)]:[]),...(mode===3?[list([])]:[])]);
  const valid=plus(dangling,reappraisalPath(C),list([observation]));expect(enc(sm.applyPatch(valid,noOp,owner).state.canonicalValue())).toEqual(enc(valid.canonicalValue()));
 }
});
it('control-owned patches retain full validation, writer/scope, mixed-patch and lifecycle checks',()=>{
 const {sm,initial,fullBase}=setup(),patch:StatePatch={operations:[{kind:'set',path:goal,expected:{presence:false},newValue:value(1)}]};
 const adopted=sm.applyPatch(initial,patch,GOAL_OWNER).state;expect(fullBase).toHaveBeenCalledTimes(1);expect(adopted.read(goal).value).toEqual(value(1));
 rejectsWithoutMutation(initial,()=>sm.applyPatch(initial,patch,WORKSPACE_OWNER));
 rejectsWithoutMutation(initial,()=>sm.applyPatch(initial,patch,GOAL_OWNER,{writableRoots:[],targetPaths:[]}),'write scope');
 rejectsWithoutMutation(initial,()=>sm.applyPatch(initial,{operations:[...patch.operations,{kind:'set',path,expected:{presence:true,value:u(0)},newValue:u(1)}]},GOAL_OWNER),'mixed owned patch');
 rejectsWithoutMutation(adopted,()=>sm.applyPatch(adopted,{operations:[{kind:'set',path:goal,expected:{presence:true,value:value(1)},newValue:value(1,2)}]},GOAL_OWNER),'goal lifecycle');
 const corrupt=plus(initial,path,u(2));rejectsWithoutMutation(corrupt,()=>sm.applyPatch(corrupt,patch,GOAL_OWNER),'base value');
 const released=sm.applyPatch(adopted,{operations:[{kind:'set',path:goal,expected:{presence:true,value:value(1)},newValue:value(2,2)}]},GOAL_OWNER).state;
 expect(released.read(goal).value).toEqual(value(2,2));expect(initial.read(goal).presence).toBe(false);expect(adopted.read(goal).value).toEqual(value(1));
});

import {withCommunicationState,knowledgePath as communicationPath} from '../assembled/communication';
import {withSocialState,personPath,SOCIAL} from '../assembled/social';
import {withRelationshipState,relationshipPath,REL} from '../assembled/relationship';
import {withRecognitionState} from '../assembled/recognitionState';
import {catalogEntries,OBSERVER} from '../assembled/recognition';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {nextTrackSequencePath} from '../semanticBinding/semanticStateAuthority';
import {signed} from '../substrate/canonicalEncoding';
const target=semanticReferentFromAuthoredContent(governedContentDefinitionId('validation-target'));
const recognition={candidates:[target],templates:['shape'],bindings:[{candidate:target,template:'shape'}]};
const wrappers=[
 {name:'communication',wrap:(base:Model)=>withCommunicationState(base,[C]),entries:[{path:communicationPath(C),value:list([list([typedIdentifier(1168,u(1)),C,signed(1),list([true])])])}]},
 {name:'social',wrap:(base:Model)=>withSocialState(base,C,target),entries:[{path:personPath(C,target),value:list([text(SOCIAL),list([list([typedIdentifier(1115,u(1)),C,target,signed(1),u(1),u(1),list([true]),list([false])])])])}]},
 {name:'relationship',wrap:(base:Model)=>withRelationshipState(base,C,target),entries:[{path:relationshipPath(C,target),value:list([text(REL),list([list([typedIdentifier(1115,u(1)),C,target,signed(1),true,true,u(1)])])])}]},
 {name:'recognition',wrap:(base:Model)=>withRecognitionState(base,recognition),entries:catalogEntries(recognition)}
];
for(const spec of wrappers)it('outer '+spec.name+' keeps delegated equality and all inherited/local rejection paths',()=>{
 const {sm:base,initial,validateState}=setup(),full=vi.fn(base.validateState),sm=spec.wrap({...base,validateState:full});
 const s=new AuthoritativeState([...initial.entries(),...spec.entries]),patch:StatePatch={operations:[{kind:'set',path,expected:{presence:true,value:u(0)},newValue:u(1)}]};
 const result=sm.applyPatch(s,patch,owner),expected=base.applyPatch(initial,patch,owner);
 expect(enc(result.state.canonicalValue())).toEqual(enc(new AuthoritativeState([...expected.state.entries(),...spec.entries]).canonicalValue()));expect(result.diffs).toEqual(expected.diffs);
 expect(validateState).toHaveBeenCalled();expect(full).not.toHaveBeenCalled();
 expect(enc(sm.applyPatch(s,noOp,owner).state.canonicalValue())).toEqual(enc(s.canonicalValue()));expect(full).not.toHaveBeenCalled();
 sm.validateState(s);expect(full).toHaveBeenCalledTimes(1);expect(enc(sm.restoreState(enc(s.canonicalValue())).canonicalValue())).toEqual(enc(s.canonicalValue()));
 const bad=[plus(s,path,u(2)),plus(s,spec.entries[0].path,true),plus(s,{...spec.entries[0].path,selectors:[]},spec.entries[0].value)];
 if(spec.name==='recognition')bad.push(initial,plus(s,nextTrackSequencePath(OBSERVER),u(1)));
 for(const invalid of bad)for(const check of [()=>sm.applyPatch(invalid,noOp,owner),()=>sm.validateState(invalid),()=>sm.restoreState(enc(invalid.canonicalValue()))])rejectsWithoutMutation(invalid,check);
});
