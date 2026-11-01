/** assembled-character-comparison/0.1: experiment input, never psychological evidence. */
import {text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ComparisonDrawMap,PurposeComparisonRoleRegistry,type RandomAddress} from '../substrate/random';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel} from '../campaign2/canonicalData';
const atom=(n:number,s:string)=>typedIdentifier(n,text(s));
export const comparisonRoles=new PurposeComparisonRoleRegistry(['task-reason-face','value-reason-face','task-decision-tie'].map(p=>({purposeId:atom(1042,'purpose/'+p),comparisonRoleId:atom(10005,'assembled/'+p)})));
export function comparisonAddress(value:CanonicalValue):RandomAddress {
 const v=rec(value,110n),root=id(f(v,1n)),purpose=id(f(v,2n));
 if(root.namespaceId!==1135n||uint(root.payload)<0n||purpose.namespaceId!==1042n||uint(f(v,4n))!==0n)invalidModel('comparison address domain');
 const name=txt(purpose.payload),roles=['purpose/task-reason-face','purpose/value-reason-face'].includes(name)?['actor','action','task']:name==='purpose/task-decision-tie'?['actor']:invalidModel('comparison purpose');
 const bindings=items(f(v,3n),'list').map(x=>{const b=rec(x,111n);return {subjectRoleId:id(f(b,1n)),subjectId:id(f(b,2n))};});
 if(bindings.length!==roles.length||new Set(bindings.map(b=>key(b.subjectRoleId))).size!==roles.length)invalidModel('comparison subject coverage');
 for(const role of roles){const b=bindings.find(b=>key(b.subjectRoleId)===key(atom(1043,'subject/'+role)));if(!b)invalidModel('comparison subject role');
  if(role==='action'){if(b.subjectId.namespaceId!==1027n||!txt(b.subjectId.payload).length)invalidModel('comparison action');}else validateSemanticReferent(b.subjectId);
 }
 return {causalRootId:root,purposeId:purpose,subjectBindings:bindings,drawIndex:0n};
}
export function compileComparison(value:CanonicalValue){
 const rows=items(f(rec(value,116n),1n),'list');if(rows.length>1000)invalidModel('comparison map capacity1000');
 const entries=rows.map(v=>{const x=rec(v,115n),k=rec(f(x,2n),117n),keyId=id(f(k,1n)),comparisonRoleId=id(f(k,2n));
  if(keyId.namespaceId!==10006n||txt(keyId.payload).length<1||txt(keyId.payload).length>4096||comparisonRoleId.namespaceId!==10005n)invalidModel('comparison key domain');
  return {localRandomAddress:comparisonAddress(f(x,1n)),comparisonDrawKey:{keyId,comparisonRoleId}};
 });
 const result=new ComparisonDrawMap(entries,comparisonRoles);
 if(key(result.canonicalValue)!==key(value))invalidModel('comparison canonical order');
 return result;
}
