import {list,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import type {ComparisonDrawMap} from '../../substrate/random';
import {CAUSAL_OPPORTUNITIES_RULES,CAUSAL_OPPORTUNITIES_REGISTRY} from '../../assembled/model';
import {CAUSAL_CONTEXT} from '../../assembled/causalAttribution';
import {INTERFERENCE_CONTEXT} from '../../assembled/interferenceExpectation';
import {source as oldSource,data as oldData,task,decode,items,key,enc,type Options} from './assembledInterference';
export const source=()=>({...oldSource(),rulesVersion:CAUSAL_OPPORTUNITIES_RULES,registrySchemaVersion:CAUSAL_OPPORTUNITIES_REGISTRY});
export type Mode='full'|'late'|'latent'|'route'|'none'|'early';
export function data(mode:Mode='late',map?:ComparisonDrawMap,o:Options={}){
 const d=oldData(o),rows=items(decode(d.orderedInputs),'list').filter(v=>{
  const a=items(v,'list'),latent=key(a[2])===key(CAUSAL_CONTEXT),route=key(a[2])===key(INTERFERENCE_CONTEXT);
  if(!latent&&!route||mode==='full')return true;
  if(mode==='early')return key(a[0])===key(signed(3));
  return mode!=='none'&&key(a[0])===key(signed(7))&&(mode==='late'||mode==='latent'&&latent||mode==='route'&&route);
 });
 return {...d,orderedInputs:enc(list([...(map?[map.canonicalValue]:[]),...rows]))};
}
export {task,decode,items,key,enc};
