/** Production-side comparison harness; independent oracle lives in a separate module. */
import {canonicalEncode,set,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {firstTraceModel} from '../../campaign2/firstTraceModel';
import {compileValDeclarations} from '../../campaign2/valDeclarations';
import {campaign2Record as r,decodeCampaign2} from '../../campaign2/codecs';
import {dataItems as items,dataField as f,dataRecord as rec,dataIdentity as id,dataText as txt} from '../../campaign2/canonicalData';
import {independentRoleVerdict,roleCorpus,type RoleOperation} from './independentCampaign2Roles';
export async function compareIndependentRoles(){
 const source=firstTraceModel(),registry=items(decodeCampaign2(source.registry),'list')[0],entries=items(registry,'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const selected=entries.filter(v=>['registry/semantic-kind','registry/domain-validator'].includes(txt(id(f(rec(v,171n),2n)).payload)));
 const compiler=compileValDeclarations(canonicalEncode(set(selected)),source.registry),registryBytes=canonicalEncode(registry);
 const qualifier=selected.find(v=>txt(id(f(rec(v,171n),2n)).payload)==='registry/domain-validator')!;
 const qualified=r('CanonicalIdentityRole',{RequiredNamespace:unsigned(1002),DomainValidatorId:f(rec(qualifier,171n),1n)}),namespace=r('CanonicalIdentityRole',{RequiredNamespace:unsigned(1002)});
 const reports=[];
 for(const populated of [false,true]){
  const content=populated?decodeCampaign2(source.content):set([]),ids=items(content,'set').map(v=>f(rec(v,170n),1n)),compiled=await compiler.compileContent(canonicalEncode(content),registryBytes);
  for(const c of roleCorpus())for(const operation of ['qualify','qualified-role','namespace-role'] as RoleOperation[]){
   const expected=independentRoleVerdict(c.value,operation,ids);let actual='ACCEPT';
   try{if(operation==='qualify')compiled.qualifyCharacter(c.value);else compiled.validateRole(canonicalEncode(c.value),canonicalEncode(operation==='qualified-role'?qualified:namespace));}
   catch(error){actual=(error as {code?:string;name:string}).code??(error as Error).name;}
   reports.push({name:`${populated?'populated':'empty'}/${operation}/${c.name}`,expected,actual,agrees:actual===expected});
  }
 }
 return reports;
}
