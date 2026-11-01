import {receivingRecord as rec} from '../../assembled/codecs';
import {list,text,unsigned,signed,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {ComparisonDrawMap,type RandomAddress} from '../../substrate/random';
import {dataField as f,dataIdentity as id,dataText as txt} from '../../campaign2/canonicalData';
import {VALUE_RECEIVING_RULES,VALUE_RECEIVING_REGISTRY} from '../../assembled/model';
import {comparisonRoles} from '../../assembled/comparison';
import {source as previousSource,data as previousData} from './assembledValues';
import {decodeCognitive as decode} from '../../assembled/codecs';
import {dataItems as items,dataKey as key} from '../../campaign2/canonicalData';
import {canonicalEncode as enc} from '../../substrate/canonicalEncoding';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {DISPLAY} from '../../assembled/strategy';
import {sid} from '../../assembled/skill';
import {outputs,signedValue,type Run} from './assembledComparison';
export const source=()=>({...previousSource(),rulesVersion:VALUE_RECEIVING_RULES,registrySchemaVersion:VALUE_RECEIVING_REGISTRY});
export function data(linked=true,seed=0,map?:ComparisonDrawMap,opts:Parameters<typeof previousData>[2]={},importance:CanonicalValue=q(1,1)){
 const d=previousData(linked,seed,opts),rows=items(decode(d.orderedInputs),'list').map(v=>{const x=[...items(v,'list')];if(key(x[2])===key(PRIORITY_DISPLAY)){const p=items(x[3],'list');x[3]=list([p[0],list(items(p[1],'list').map(v=>{const a=items(v,'list');return list([a[0],key(x[0])===key(signed(1))?list([importance]):a[1],a[2],list([q(1,1)]),a[4]]);}))]);}if(key(x[2])===key(DISPLAY)&&[4n,6n].includes(signedValue(x[0]))){const p=items(x[3],'list');x[3]=list([p[0],list(items(p[1],'list').map(v=>{const a=[...items(v,'list')];a[3]=key(a[1])===key(unsigned(0));return list(a);}))]);}return list(x);});
 return {...d,orderedInputs:enc(list([...(map?[map.canonicalValue]:[]),...rows]))};
}
export function mapIdentities(run:Run){
 const addresses:{at:CanonicalValue;a:RandomAddress}[]=[];
 for(const resolution of outputs(run.snapshot().outputs,409n)){
  const at=f(resolution,2n),root=id(f(resolution,1n)),context=rec(f(resolution,3n),408n),options=rec(f(rec(f(context,2n),403n),2n),398n),candidates=items(f(options,3n),'list');
  for(const v of items(f(context,3n),'list')){const nk=rec(f(rec(v,407n),1n),404n),candidate=rec(f(nk,1n),395n);addresses.push({at,a:{causalRootId:root,purposeId:sid(1042,nk.schema.schemaVersion===2n?'purpose/value-reason-face':'purpose/task-reason-face'),drawIndex:0n,subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(candidate,1n))},{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(candidate,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(nk,3n))}]}});}
  if(candidates.length)addresses.push({at,a:{causalRootId:root,purposeId:sid(1042,'purpose/task-decision-tie'),drawIndex:0n,subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(rec(f(rec(candidates[0],397n),1n),395n),1n))}]}});
 }
 return new ComparisonDrawMap(addresses.map(({at,a})=>({localRandomAddress:a,comparisonDrawKey:{keyId:sid(10006,key(list([text('M34'),at,a.purposeId,list(a.subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId])))]))),comparisonRoleId:sid(10005,'assembled/'+txt(a.purposeId.payload).slice(8))}})),comparisonRoles);
}
export {decode,items,key,enc};
