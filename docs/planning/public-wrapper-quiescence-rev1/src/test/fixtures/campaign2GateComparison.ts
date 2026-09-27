/** Independent scalar expectation with a production factory execution harness. */
import {canonicalEncode as enc,list,set,record,signed,unsigned} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {firstTraceModel} from '../../campaign2/firstTraceModel';
import {candidateId as id} from '../../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run} from '../../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../../campaign2/codecs';
import {semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
import {governedContentDefinitionId} from '../../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../../campaign2/orderedInputs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../../campaign2/canonicalData';
const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject')),variable=id(1029,'variable/fixture-regulation');
export async function compareIndependentGates(){
 const reports=[];
 for(const step of [1,-1]){
  const source=firstTraceModel(),slots=[...items(decodeCampaign2(source.registry),'list')];
  slots[0]=set(items(slots[0],'set').map(v=>{
   if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||key(f(v,1n))!==key(id(1035,'rule/fixture-tolerance')))return v;
   const rule=rec(f(v,4n),311n),gate=r('AdaptationGate',{VariantTag:unsigned(2),Source:r('AdaptationReadTarget',{
    StateFamilyId:id(1031,'regulatory-adaptation'),LeafFamilyId:id(1032,'leaf/sensitization'),KeyDerivation:r('AdaptationKeyDerivation',{VariantTag:unsigned(1),RegulatoryVariableId:variable}),
   })});
   return record(v.schema,new Map([...v.fields,[4n,record(rule.schema,new Map([...rule.fields,[5n,gate],[6n,signed(step)]]))]]));
  }));source.registry=enc(list(slots));
  const model=await prepareCampaign2Model(source);
  for(const prior of [0,1,9,10])for(const gate of [0,1,8])for(const count of [0,1,2]){
   const values=[prior,gate],initial=new AuthoritativeState(values.flatMap((n,i)=>n===0?[]:[{
    path:{rootStateTypeId:302n,fieldId:BigInt(i+1),selectors:[{kind:'mapKey' as const,key:r(i===0?'ToleranceKey':'SensitizationKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:variable})}]},
    value:r(i===0?'ToleranceValue':'SensitizationValue',{Magnitude:unsigned(n)}),
   }]));
   const input=enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)})}),list([])])]));
   // Repeated scalar steps, with the gate tested once on its pre-event value.
   let target=prior;if(gate===0)for(let n=0;n<count;n++)target+=step;
   const expected={accept:target>=0&&target<=10,magnitudes:[target,gate+count,count,count],ops:count===0?0:3+(target===prior?0:1)};
   const run=await createCampaign2Run(model,{initialState:enc(initial.canonicalValue()),orderedInputs:input,runSeed:new Uint8Array(32)}),before=run.snapshot();
   let accepted=true,error;try{await run.settleNextInstant();}catch(e){accepted=false;error=(e as {code?:string}).code??(e as Error).name;}
   const after=run.snapshot();let agrees=accepted===expected.accept,observed:unknown;
   if(!accepted){const rollback=['state','outputs','trace','clock'].every(k=>keyValue(after[k as keyof typeof after])===keyValue(before[k as keyof typeof before]));agrees&&=rollback;observed={error,rollback};}
   else{
    const entries=restoreAuthoritativeState(decodeCampaign2(after.state)).entries(),magnitudes=[1n,2n,3n,4n].map(field=>{
     const e=entries.find(e=>e.path.rootStateTypeId===302n&&e.path.fieldId===field);return e?Number((f(rec(e.value,296n+field),1n) as {value:bigint}).value):0;
    });
    const traces=items(decodeCampaign2(after.trace),'list'),trace=rec(traces[8],160n),ops=items(f(rec(f(trace,16n),144n),1n),'list'),diffs=items(f(trace,17n),'list'),reads=items(f(trace,11n),'list');
    const removeCount=ops.filter(o=>typeof o!=='boolean'&&o.kind==='record'&&o.schema.typeId===146n).length;
    agrees&&=JSON.stringify(magnitudes)===JSON.stringify(expected.magnitudes)&&entries.length===magnitudes.filter(n=>n!==0).length&&ops.length===expected.ops&&diffs.length===expected.ops&&reads.length===5&&traces.length===9&&removeCount===(prior>0&&target===0?1:0);
    observed={magnitudes,ops:ops.length,diffs:diffs.length,reads:reads.length,removeCount};
   }
   reports.push({name:`step=${step}/prior=${prior}/gate=${gate}/count=${count}`,expected,accepted,observed,agrees});
  }
 }
 return reports;
}
function keyValue(v:unknown){return JSON.stringify(v,(_k,x)=>typeof x==='bigint'?x.toString():x);}
