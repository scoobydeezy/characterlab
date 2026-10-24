import {canonicalEncode as enc,list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {valuesIntegrationPublicRecord as r,decodeValuesIntegrationPublic as decode} from './valuesIntegrationPublicCodecs';
import {copyData} from './biologyPublicBytes';
import {data,value} from './biologyPublicData';
import {sid,actor,path,pattern,historyOwner,historyValue,projectionValue} from './valuesPublicModel';
import {createValuesOwner,type ValueLaw} from './valuesComponent';
import {validateProfile,validateFrames,emptyGoal,emptyWorld,type AppraisalLaw,type IntegrationFrame} from './valuesIntegration';
export {copyData,sid,actor,path,pattern,historyOwner,historyValue,projectionValue};
export const VERSION='values-integration-public/0.1-candidate';
export const stages=[['source',40],['appraisal',50],['reasons',52],['choice',60],['intent',70],['expression',80],['plan',90],['attempt',100],['world',110],['observation',120],['goal',130],['consolidate',140],['forecast',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/values-integration/'+n),owner=(n:string)=>sid(1025,'authority/values-integration/'+n);
export const valueRoots=(law:ValueLaw)=>law==='Refold'?[1516]:[1516,1517];
export const roots=(law:ValueLaw)=>[...valueRoots(law),1522,1523,1524];
export const writeRoots=(law:ValueLaw,n:string)=>n==='world'?[1522]:n==='goal'?[1523]:n==='forecast'?[1524]:n==='consolidate'?valueRoots(law):[];
export const reads=(law:ValueLaw,n:string)=>(n==='appraisal'?[...valueRoots(law),1523,1524]:n==='reasons'?[...valueRoots(law),1523]:n==='observation'?[1522]:n==='forecast'?[...valueRoots(law),1523,1524]:writeRoots(law,n)).map(path);
export const writes=(law:ValueLaw,n:string)=>writeRoots(law,n).map(path);
const grammar=(n:number)=>n===1516?1513:n===1517?1514:n;
const ownership=(law:ValueLaw)=>compileMutationAuthorityRegistry(['world','goal','consolidate','forecast'].map(n=>({authorityName:'authority/values-integration/'+n,ownedLeaves:writeRoots(law,n).map(root=>({pattern:pattern(path(root)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:BigInt(grammar(root))},removalAllowed:false}))})));
export const packed=(id:number,x:unknown)=>r(id,[data(x)]);
export const unpack=<T>(v:CanonicalValue,id:number)=>value<T>(f(rec(v,BigInt(id)),1n));
export const integrationInitial=()=>enc(packed(1527,{version:VERSION}));
export const integrationOrdered=(xs:readonly IntegrationFrame[])=>enc(list(validateFrames(xs).map(x=>packed(1521,x))));
export function integrationRecipe(law:ValueLaw,appraisal:AppraisalLaw='ValueRelative'){
 validateProfile({law,appraisal,seed:0});
 return {parameters:enc(packed(1520,{version:VERSION,law,appraisal})),registry:enc(list([ownership(law).definitionValue,list(stages.map(([n,p])=>list([eventId(n),u(p),list(reads(law,n).map(x=>statePathPatternValue(pattern(x)))),list(writes(law,n).map(x=>statePathPatternValue(pattern(x))))])))]))};
}
export type IntegrationSource=ReturnType<typeof integrationRecipe>;
export async function compileIntegrationModel(input:IntegrationSource){
 const source=copyData(input,['parameters','registry']),profile=unpack<{version:string;law:ValueLaw;appraisal:AppraisalLaw}>(decode(source.parameters),1520),recipe=integrationRecipe(profile.law,profile.appraisal);
 if(key(decode(recipe.parameters))!==key(decode(source.parameters))||key(decode(recipe.registry))!==key(decode(source.registry)))throw Error('VI_EXACT_MODEL');
 const {law,appraisal}=profile,own=ownership(law),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities);
 const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(list([actor,decode(source.parameters),text('component0.1; inherited deadline65; disjoint owners; controlled report forecast')])),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(decode(source.parameters)),numericProfileVersion:'values-exact/0.1',randomAlgorithmVersion:'values-repeated-run-seed-sha256/0.1',registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(s:AuthoritativeState){
  if(s.entries().length!==roots(law).length)throw Error('VI_ROOTS');
  for(const e of s.entries())if(!roots(law).some(n=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(n))))))throw Error('VI_PATH');
  const h=s.read(path(1516));if(!h.presence)throw Error('VI_HISTORY');const o=historyOwner(law,h.value!);
  if(key(historyValue(o))!==key(h.value!))throw Error('VI_HISTORY_CANONICAL');
  if(law!=='Refold'&&key(s.read(path(1517)).value!)!==key(projectionValue(o.view(65))))throw Error('VI_PROJECTION');
  for(const id of [1522,1523,1524]){const v=s.read(path(id));if(!v.presence)throw Error('VI_MISSING');unpack(v.value!,id);}
 }
 return {source,law,appraisal,authority,modelIdentity,validateState};
}
export type IntegrationCompiled=Awaited<ReturnType<typeof compileIntegrationModel>>;
export async function compileIntegrationInputs(model:IntegrationCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(runSeed.length!==32||runSeed.some(x=>x!==runSeed[0])||key(decode(initialState))!==key(decode(integrationInitial())))throw Error('VI_INITIAL');
 const originals=items(decode(orderedInputs),'list'),frames=validateFrames(originals.map(x=>unpack<IntegrationFrame>(x,1521)));
 if(key(decode(integrationOrdered(frames)))!==key(list(originals)))throw Error('VI_ORIGINALS');
 const o=createValuesOwner(model.law),state=new AuthoritativeState([{path:path(1516),value:historyValue(o)},...(model.law==='Refold'?[]:[{path:path(1517),value:projectionValue(o.view(1))}]),{path:path(1522),value:packed(1522,emptyWorld())},{path:path(1523),value:packed(1523,emptyGoal())},{path:path(1524),value:packed(1524,null)}]);model.validateState(state);
 const events:ScheduledEvent[]=originals.map((payload,i)=>({eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(frames[i].instant)),phase:40n,eventTypeId:eventId('source'),payload,dependencies:list([]),causalParentEventIds:[]}));
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(list(originals)),runSeed});
 return {state,events,frames,runIdentity,runSeed:runSeed.slice()};
}
