import {canonicalEncode as enc,list,set,map,record,signed,unsigned} from '../../substrate/canonicalEncoding';
import {INT64_MAX} from '../../substrate/time';
import {firstTraceModel} from '../../campaign2/firstTraceModel';
import {candidateId as id} from '../../campaign2/firstModelCandidate';
import {compileValDeclarations} from '../../campaign2/valDeclarations';
import {compileRegulatoryReferences} from '../../campaign2/regulatoryReference';
import {decodeCampaign2} from '../../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as ident,dataText as txt} from '../../campaign2/canonicalData';
export async function compareIndependentReg(){
 const source=firstTraceModel(),registry=items(decodeCampaign2(source.registry),'list')[0],entries=items(registry,'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const selected=entries.filter(v=>['registry/semantic-kind','registry/domain-validator'].includes(txt(ident(f(rec(v,171n),2n)).payload)));
 const content=await compileValDeclarations(enc(set(selected)),source.registry).compileContent(source.content,enc(registry));
 const original=rec(entries.find(v=>txt(ident(f(rec(v,171n),2n)).payload)==='registry/regulatory-variable')!,171n),variable=f(original,1n),registration=rec(f(original,4n),283n),definition=rec(f(registration,1n),280n),reference=rec(f(registration,2n),282n);
 const pair=(v:ReturnType<typeof f>)=>{if(typeof v==='boolean'||v.kind!=='map')throw Error('map required');return v.entries[0];};
 const [characterKey,anchorValue]=pair(f(reference,1n)),[parameterKey,parameterValue]=pair(f(reference,2n)),character=f(rec(characterKey,281n),1n);
 const cases=[];
 for(const rate of [-1n,0n,1n])for(const anchor of [0n,7n]){
  const scale=rate===0n?1n:3n,a=rec(anchorValue,121n),p=rec(parameterValue,120n);
  const changedReference=record(reference.schema,new Map([[1n,map([[characterKey,record(a.schema,new Map([...a.fields,[1n,signed(anchor)]]))]])],[2n,map([[parameterKey,record(p.schema,new Map([...p.fields,[2n,signed(rate)],[3n,unsigned(scale)],[4n,signed(-INT64_MAX)],[5n,signed(INT64_MAX)]]))]])]]));
  const changed=record(original.schema,new Map([...original.fields,[4n,record(registration.schema,new Map([[1n,record(definition.schema,new Map([...definition.fields,[2n,signed(-INT64_MAX)],[3n,signed(INT64_MAX)]]))],[2n,changedReference]]))]]));
  const reg=compileRegulatoryReferences(enc(set([changed])),content);
  for(const time of [0n,1n,2n,3n,4n,10n,INT64_MAX]){
   // Independent Euclidean construction: positive quotient/remainder, then signed floor.
   const magnitude=(rate<0n?-rate:rate)*time,quotient=magnitude/scale,remainder=magnitude%scale;
   const expected=anchor+(rate<0n?-quotient-(remainder===0n?0n:1n):quotient);
   const observed=reg.referenceOperatingPoint(character,variable,time),value=observed.kind==='ReferenceValue'?observed.value:undefined;
   const actual=value!==undefined&&typeof value!=='boolean'&&value.kind==='signed'?value.value:undefined;
   cases.push({name:`rate=${rate}/anchor=${anchor}/time=${time}/reference`,expected:String(expected),actual:String(actual),agrees:actual===expected});
   for(const displacement of [-INT64_MAX,-1n,0n,1n,INT64_MAX]){
    const total=expected+displacement,valid=total>=-INT64_MAX&&total<=INT64_MAX,result=reg.validateAdaptedReference(character,variable,time,signed(displacement));
    const expectedResult=valid?'Valid':'REG_ADAPTED_REFERENCE_OUT_OF_RANGE',actualResult=result.kind==='Valid'?'Valid':result.code;
    cases.push({name:`rate=${rate}/anchor=${anchor}/time=${time}/D=${displacement}`,expected:expectedResult,actual:actualResult,agrees:expectedResult===actualResult});
   }
  }
 }
 return cases;
}
