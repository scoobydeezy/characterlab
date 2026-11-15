/** Selected observed tracks -> one learned graph; original C3 kernels and shared state. */
import {list,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {dataItems as items,dataKey as key,dataRecord as rec,dataField as f,dataIdentity as id,dataUnsigned as uint,dataText as txt,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {decodeCognitive as decode} from './codecs';
import {BODY_OBSERVER} from './body';
import {restorePerceptualReferentId} from '../semanticBinding/semanticCodecs';
import {canonicalOperationKeyIndex} from '../campaign3/canonicalChildKeys';
import {settleEventAssociation} from '../campaign3/eventAssociationSettlement';
import {normalizeGraphZeroState} from '../campaign3/graphZeroState';
import {validateEncoding} from './encoding';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const ASSOCIATION='assembled-learned-association/0.1',LEARNED_MEMORY_VERSION='assembled-character-affect-memory/0.4-candidate';
export const ASSOCIATION_OWNER=typedIdentifier(1025,text('authority/assembled-association'));
export interface AssociationSettings {nodes:number;edges:number}
const fail=(s:string):never=>invalidModel('learned association: '+s);
const require=(ok:unknown,s:string)=>{if(!ok)fail(s);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const associationPath=(C:CanonicalValue):StatePath=>({rootStateTypeId:631n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]});
export function compileAssociation(v:CanonicalValue):AssociationSettings{
 const a=items(v,'list');require(a.length===6&&txt(a[0])===ASSOCIATION&&uint(a[1])===1000n&&readQ(a[2]).equals(Q.of(1n))&&readQ(a[3]).equals(Q.of(1n)),'fixed calibration');
 const nodes=Number(uint(a[4])),edges=Number(uint(a[5]));require(nodes<=30&&edges<=nodes*(nodes-1),'capacity');return {nodes,edges};
}
export function observedAssociationKey(v:CanonicalValue){const r=restorePerceptualReferentId(v);require(r.observerId===txt(BODY_OBSERVER.payload),'foreign observer');return v;}
export function focalAssociationCue(full:CanonicalValue){
 const b=items(f(rec(full,227n),5n),'set').map(v=>rec(v,224n)).sort((a,b)=>uint(id(f(a,1n)).payload)<uint(id(f(b,1n)).payload)?-1:1);
 require(b.length>=1&&b.length<=3,'focal binding');return observedAssociationKey(f(b[0],4n));
}
/** Only actual selected rows, never every binding in the frozen provenance. */
export function associationUnits(assessment:CanonicalValue,full:CanonicalValue){
 require(validateEncoding(assessment,full),'positive selected formation');const a=items(assessment,'list'),claims=items(a[5],'list').map(v=>rec(v,240n));
 return items(a[8],'list').map(v=>{const r=items(v,'list'),matches=claims.filter(c=>key(f(c,5n))===txt(r[0]));require(matches.length===1,'selected claim correspondence');const strength=readQ(r[6]);require(strength.compare(Q.of(0n))>0&&strength.compare(Q.of(1n))<=0,'positive unit');return {key:observedAssociationKey(f(matches[0],5n)),strength};});
}
export function associationGraph(value:CanonicalValue|undefined,settings:AssociationSettings){
 if(value===undefined)return {keys:[] as CanonicalValue[],weights:[] as Q[][],lastUpdatedAt:0n};
 const a=items(value,'list');require(a.length===4&&txt(a[0])===ASSOCIATION,'state shape');
 const keys=items(a[1],'list').map(observedAssociationKey),weights=items(a[2],'list').map(v=>items(v,'list').map(readQ)),lastUpdatedAt=uint(a[3]),names=keys.map(key);
 require(lastUpdatedAt>0n&&keys.length<=settings.nodes&&new Set(names).size===names.length&&names.every((k,i)=>i===0||names[i-1]<k),'state order/capacity/time');
 const normalized=normalizeGraphZeroState(names,weights,1000n);
 require(normalized.keys.length===keys.length&&weights.flat().filter(q=>q.numerator>0n).length<=settings.edges,'normalized graph capacity');return {keys,weights,lastUpdatedAt};
}
export function readAssociation(state:AuthoritativeState,model:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,settings:AssociationSettings){
 const path=associationPath(C),prior=model.read(state,path),graph=associationGraph(prior.value,settings);
 const read:ActualReadRecord={accessorId:typedIdentifier(1028,text('accessor/assembled-association')),path,presence:prior.presence,value:prior.value,derivedSources:[]};return {path,prior,graph,read};
}
export function prepareAssociation(state:AuthoritativeState,model:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,settings:AssociationSettings,episode:CanonicalValue,now:bigint){
 const a=items(episode,'list');require(a.length===8&&txt(a[0])==='assembled-social-episode/0.1'&&eq(a[5],{kind:'signed',value:now}),'actual social formation');
 const units=associationUnits(a[6],a[3]),prior=readAssociation(state,model,C,settings),index=canonicalOperationKeyIndex([...prior.graph.keys,...units.map(x=>x.key)]);
 const next=settleEventAssociation({prior:{...prior.graph,keys:prior.graph.keys.map(index.label)},now,formation:units.map(x=>({key:index.label(x.key),strength:x.strength})),calibration:{scale:1000n,eta:Q.of(1n),lambda:Q.of(1n)},capacity:settings});
 const value=list([text(ASSOCIATION),list(next.keys.map(index.original)),list(next.weights.map(row=>list(row.map(qValue)))),u(next.lastUpdatedAt)]);
 associationGraph(value,settings);
 const patch:StatePatch={operations:[{kind:'set',path:prior.path,expected:prior.prior.presence?{presence:true,value:prior.prior.value!}:{presence:false},newValue:value}]};
 return {patch,reads:[prior.read],report:list([text(ASSOCIATION),u(now),a[1],a[6],prior.prior.value??list([]),value])};
}
export function withAssociationState(base:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,settings:AssociationSettings){
 const path=associationPath(C),matches=(p:StatePath)=>p.rootStateTypeId===631n;
 const check=(p:StatePath,v?:CanonicalValue)=>{require(eq(statePathValue(p),statePathValue(path)),'foreign path');if(v)associationGraph(v,settings);};
 const authority=new StateAuthorityRegistry([{pattern:pattern(path),validateValue:(v:CanonicalValue)=>check(path,v),removalAllowed:false}],[{mutationAuthorityId:ASSOCIATION_OWNER,patterns:[pattern(path)]}]);
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!matches(e.path)));
 function validateState(s:AuthoritativeState){base.validateState(without(s));for(const e of s.entries())if(matches(e.path)){check(e.path,e.value);for(const k of associationGraph(e.value,settings).keys)require(s.read({rootStateTypeId:241n,fieldId:2n,selectors:[{kind:'mapKey',key:k}]}).value===true,'unobserved track');}}
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(matches(p))check(p);else base.validatePath(p);},
  restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},
  read(s:AuthoritativeState,p:StatePath){if(!matches(p))return base.read(without(s),p);check(p);const x=s.read(p);if(x.presence)check(p,x.value!);return x;},
  applyPatch(s:AuthoritativeState,patch:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){
   const local=patch.operations.filter(o=>matches(o.path));if(local.length&&local.length!==patch.operations.length)fail('mixed authority patch');
   if(local.length){for(const o of local){check(o.path,o.kind==='set'?o.newValue:undefined);if(scope&&(!scope.writableRoots.includes(631n)||!scope.targetPaths.some(p=>eq(statePathValue(p),statePathValue(o.path)))))fail('write scope');}const result=applyStatePatch(s,patch,owner,authority);validateState(result.state);return result;}
   const result=base.applyPatch(without(s),patch,owner,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>matches(e.path))]);validateState(state);return {...result,state};
  }});
}
