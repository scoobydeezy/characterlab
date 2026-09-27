/** Test-only ambient stand-ins. They are neither model declarations nor character state. */
import {canonicalEncode as enc,set} from '../../substrate/canonicalEncoding';
import {compileValDeclarations} from '../../campaign2/valDeclarations';
import {firstTraceModel} from '../../campaign2/firstTraceModel';
import {decodeCampaign2} from '../../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt} from '../../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
export const forbiddenDimensions=['roster','candidateDomain','recognition','body','state','activity','clock','rng','presentation','trace'] as const;
const ambientKey='__characterlabQualificationAmbient';
export async function compareForbiddenDependencies(){
 const source=firstTraceModel(),registry=items(decodeCampaign2(source.registry),'list')[0],entries=items(registry,'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const selected=entries.filter(v=>['registry/semantic-kind','registry/domain-validator'].includes(txt(id(f(rec(v,171n),2n)).payload)));
 const compiled=await compileValDeclarations(enc(set(selected)),source.registry).compileContent(source.content,enc(registry));
 const character=semanticReferentFromAuthoredContent(id(f(rec(items(decodeCampaign2(source.content),'set')[0],170n),1n)));
 const old=Object.getOwnPropertyDescriptor(globalThis,ambientKey),reports=[];
 try{
  for(const dimension of forbiddenDimensions)for(const present of [false,true]){
   let reads=0;
   const state=Object.fromEntries(forbiddenDimensions.map(k=>[k,k===dimension?present:true]));
   Object.defineProperty(globalThis,ambientKey,{configurable:true,value:new Proxy(state,{get(target,key){reads++;return target[String(key)];}})});
   let actual='ACCEPT';try{compiled.qualifyCharacter(character);}catch(e){actual=(e as {code?:string}).code??(e as Error).name;}
   reports.push({name:`${dimension}/${present?'present':'absent'}`,expected:'ACCEPT',actual,ambientReads:reads,agrees:actual==='ACCEPT'&&reads===0});
  }
 }finally{if(old)Object.defineProperty(globalThis,ambientKey,old);else Reflect.deleteProperty(globalThis,ambientKey);}
 return reports;
}
