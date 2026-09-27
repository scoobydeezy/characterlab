import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,record,signed,unsigned,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {predictionModelReviewSource} from '../campaign2/predictionModelReview';
import {predictionRecord as r,decodePrediction as decode} from '../campaign2/predictionCodecs';
import {preparePredictionModel,createPredictionRun,restorePredictionRun} from '../campaign2/predictionFactory';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
const id=(n:number,s:string)=>typedIdentifier(n,text(s));
const replace=(v:ReturnType<typeof rec>,n:bigint,x:CanonicalValue)=>record(v.schema,new Map([...v.fields,[n,x]]));
it('PRED-O public prefix binds support, owner, pending queue and private suppression slots',async()=>{
 const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject')),S0=enc(new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])}]).canonicalValue());
 const orderedInputs=enc(list([list([signed(4),unsigned(110),id(1001,'event/regulatory-diagnostic-probe'),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])])]));
 for(const permitted of [true,false]){const source=predictionModelReviewSource(true,permitted),run=await createPredictionRun(await preparePredictionModel(source),{initialState:S0,orderedInputs,runSeed:new Uint8Array(32)});
  const empty=await restorePredictionRun(source,{initialState:S0,orderedInputs,save:run.save()});expect(empty.save()).toEqual(run.save());await run.settleNextInstant();const saved=rec(decode(run.save()),132n);
  const resumed=await restorePredictionRun(source,{initialState:S0,orderedInputs,save:enc(saved)});await run.settleNextInstant();await resumed.settleNextInstant();expect(resumed.save()).toEqual(run.save());
  const corruptions=[replace(saved,7n,list([])),replace(saved,11n,list(items(f(saved,11n),'list').slice(0,1)))];
  if(permitted){const entries=items(f(saved,5n),'set');
   for(const kind of ['support','owner'])corruptions.push(replace(saved,5n,set(entries.map(e=>{const leaf=rec(e,151n),value=f(leaf,2n);if(typeof value==='boolean'||value.kind!=='record'||value.schema.typeId!==361n)return e;
    if(kind==='support')return replace(leaf,2n,replace(value,2n,set([r(237,[unsigned(1),typedIdentifier(1115,unsigned(999))])])));
    const path=rec(f(leaf,1n),140n),selectors=items(f(path,3n),'list'),selector=rec(selectors[0],142n),k=rec(f(selector,1n),360n),foreign=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/foreign'));
    return replace(leaf,1n,replace(path,3n,list([replace(selector,1n,replace(k,1n,foreign))])));
   }))));
  }
  for(const save of corruptions)await expect(restorePredictionRun(source,{initialState:S0,orderedInputs,save:enc(save)})).rejects.toThrow();
 }
},30000);
