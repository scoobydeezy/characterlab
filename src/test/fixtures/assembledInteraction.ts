import {canonicalEncode as enc,list,rational,signed,unsigned,set,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {restoreAuthoritativeState,AuthoritativeState} from '../../substrate/state';
import {decodeEmbodied as decode,embodiedRecord as r} from '../../campaign3/embodiedCodecs';
import {source,data,C,id} from './campaign2Cognitive';
import {successor,changeDefinition,workLimit} from './assembledCharacter';
import {INTERACTION_RULES,INTERACTION_REGISTRY,CALIBRATED_RULES,CALIBRATED_REGISTRY} from '../../assembled/model';
import {BODY_SAMPLE,BODY_DELIVERY,BODY_OBSERVER,BODY_DEFINITION,bodyPath} from '../../assembled/body';
import {dataItems as items,dataField as f,dataRecord as rec} from '../../campaign2/canonicalData';
export function interactionSource(permitted=true,available=true,calibrated=true){
 let s=successor(source());for(const [name,min,max] of [['a',4,6],['b',7,9]] as const)for(const [field,value] of [[3n,rational(min,1)],[4n,rational(max,1)],[5n,signed(2)],[6n,signed(10)]] as const)s=changeDefinition(s,'definition/task-'+name,field,value);
 s=changeDefinition(s,'definition/task-concern',1n,rational(1,1));s=changeDefinition(s,'definition/task-motive',1n,rational(1,2));s=changeDefinition(s,'definition/task-workspace',2n,unsigned(3));s=workLimit(s,100000n);
 if(calibrated)s=changeDefinition(s,'definition/task-reason-dice',4n,r(439,[rational(1,10),unsigned(3)]));
 return {...s,rulesVersion:calibrated?CALIBRATED_RULES:INTERACTION_RULES,registrySchemaVersion:calibrated?CALIBRATED_REGISTRY:INTERACTION_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([ {kind:'text',value:'assembled-body/0.1'},rational(100,1),rational(1,1),rational(10,1),rational(60,1),permitted,available])]))};
}
export function interactionData(history:0|1,body:0|1,seed=0,amount=10){
 const d=data(),old=restoreAuthoritativeState(decode(d.initialState));const initial=new AuthoritativeState([...old.entries().map(e=>e.path.rootStateTypeId===302n?{...e,value:r(299,[signed(history?40:-20)])}:e),{path:bodyPath(C),value:r(454,[rational(amount,1),signed(0)])}]);
 const probe=(at:number)=>list([signed(at),unsigned(110),id(1001,'event/regulatory-diagnostic-probe'),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])]);
 const delivery=list([signed(2),unsigned(110),BODY_DELIVERY,list([C,rational(body?80:0,1)]),list([])]),sample=list([signed(3),unsigned(10),BODY_SAMPLE,r(459,[BODY_OBSERVER,BODY_DEFINITION]),list([])]),choice=list([signed(3),unsigned(40),id(1001,'event/deliberation-opportunity'),r(377,[BODY_OBSERVER,id(1027,'definition/task-workspace')]),list([])]);
 const runSeed=new Uint8Array(32);runSeed[31]=seed;
 return {initialState:enc(initial.canonicalValue()),orderedInputs:enc(list([probe(1),delivery,sample,choice,probe(4)])),runSeed};
}
export function withoutChoice(d:ReturnType<typeof interactionData>){return {...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').filter(row=>{const slots=items(row,'list');return (slots[2] as {payload?:{value?:string}}).payload?.value!=='event/deliberation-opportunity';})))};}
export function outputs(bytes:Uint8Array,type:bigint){return items(decode(bytes),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));}
export function replaceInput(d:ReturnType<typeof interactionData>,change:(row:CanonicalValue)=>CanonicalValue){return {...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').map(change)))};}
