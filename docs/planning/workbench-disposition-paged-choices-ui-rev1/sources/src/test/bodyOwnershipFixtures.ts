/** Research harness: public EMB inputs plus explicit component comparators.
 * None of these diagnostic capabilities is exported by the character factory. */
import freeze from '../../docs/planning/campaign3-embodied-model-rev2/FREEZE.json';
import {embodiedFixtureBytes as bytes} from './embodiedFixtures';
import {prepareEmbodiedModel,createEmbodiedRun,restoreEmbodiedRun} from '../campaign3/embodiedFactory';
import {compileEmbodiedModel} from '../campaign3/embodiedModel';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {canonicalEncode as enc,list,set,map,record,rational,signed,unsigned,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataText as str,dataKey as key} from '../campaign2/canonicalData';
import {exact} from '../campaign3/embodiedMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {createStoredBody,createPressureCache,sensedPressure,motiveProbe,type BodyPressure} from '../campaign3/bodyOwnershipComparison';
import {compileRegulatoryReferences} from '../campaign2/regulatoryReference';
import {compileFirstCampaign2Content} from '../campaign2/contentProfile';
import {campaign2Record as r} from '../campaign2/codecs';
import {timeSchemas} from '../substrate/time';
import {contentRegistrySchemas} from '../substrate/contentManifest';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {fixtureContentInputs,fixtureRoleConstraints,fixtureCharacterRole,recordConstraint} from './fixtures/campaign2Model';
const ID=(ns:number,s:string)=>typedIdentifier(ns,text(s));
const n=(v:CanonicalValue)=>(v as {value:bigint}).value;
export const fraction=(q:Q)=>`${q.numerator}/${q.denominator}`;
export const pressureText=(p:BodyPressure)=>p.kind==='Known'?fraction(p.value):'Unavailable';
const records=(vs:readonly CanonicalValue[],t:bigint)=>vs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
export const bodySource=(name:string)=>({...freeze.versions,content:bytes(name+'/content.cenc.hex'),registry:bytes(name+'/registry.cenc.hex'),parameters:bytes(name+'/parameters.cenc.hex')});
function initial(amount:number){return enc(set(items(decode(bytes('runs/baseline/initial-state.cenc.hex')),'set').map(v=>{const leaf=rec(v,151n),value=f(leaf,2n);if(typeof value==='boolean'||value.kind!=='record'||value.schema.typeId!==454n)return v;return record(leaf.schema,new Map([[1n,f(leaf,1n)],[2n,record(value.schema,new Map([[1n,rational(amount,1)],[2n,signed(0)]]))]]));})));}
function ordered(times:readonly number[],delivery?:number){const rows=items(decode(bytes('runs/baseline/ordered-inputs.cenc.hex')),'list');const sample=rows.find(v=>n(items(v,'list')[1])===10n)!,refill=rows.find(v=>{const a=items(v,'list');return n(a[1])===110n&&str(id(f(rec(a[3],478n),1n)).payload)==='definition/embodied-delivery-30';})!;const at=(v:CanonicalValue,t:number)=>list(items(v,'list').map((x,i)=>i===0?signed(t):x));return enc(list([...times.map(t=>at(sample,t)),...(delivery===undefined?[]:[at(refill,delivery)])].sort((a,b)=>Number(n(items(a,'list')[0])-n(items(b,'list')[0])||n(items(a,'list')[1])-n(items(b,'list')[1])))));}
export function bodyCases(){return [
 ...['baseline','slower','coarser','hidden89','overflow','denied','unavailable'].map(name=>({name,model:name==='hidden89'?'baseline':name,initialState:bytes(`runs/${name}/initial-state.cenc.hex`),orderedInputs:bytes(`runs/${name}/ordered-inputs.cenc.hex`)})),
 ...[{name:'kinetic-fast',model:'baseline',amount:80,times:[1,31,41,61],delivery:31},{name:'kinetic-slow',model:'slower',amount:80,times:[1,31,41,61],delivery:31},{name:'no-delivery',model:'baseline',amount:80,times:[1,31,41,61]},
 {name:'alias41',model:'coarser',amount:42,times:[1]},{name:'alias49',model:'coarser',amount:50,times:[1]},{name:'fine41',model:'baseline',amount:42,times:[1]},
 {name:'depleted-refill',model:'baseline',amount:2,times:[3,4],delivery:3},
 {name:'partitioned',model:'baseline',amount:80,times:[1,2,3]}, {name:'direct',model:'baseline',amount:80,times:[3]}].map(x=>({name:x.name,model:x.model,initialState:initial(x.amount),orderedInputs:ordered(x.times,x.delivery)}))];}
/** Real closed REG compiler, existing immutable authored reference semantics. */
async function reference(){const contentId=governedContentDefinitionId('character/body-ownership-control'),character=semanticReferentFromAuthoredContent(contentId),variable=ID(1029,'variable/body-ownership-control'),parameter=ID(1030,'parameter/body-ownership-control'),inputs=fixtureContentInputs(contentId),content=await compileFirstCampaign2Content(inputs.content,inputs.entries,enc(set([...fixtureRoleConstraints,recordConstraint(281,1,fixtureCharacterRole)])),inputs.entries);
 const parameters=record(timeSchemas.linearRateParameters,new Map([[1n,parameter],[2n,signed(0)],[3n,unsigned(1)],[4n,signed(0)],[5n,signed(100)]])),anchor=record(timeSchemas.analyticalAnchor,new Map([[1n,signed(80)],[2n,unsigned(0)],[3n,parameter],[4n,unsigned(0)]]));
 const declaration=record(contentRegistrySchemas.semanticRegistryEntry,new Map([[1n,variable],[2n,ID(1023,'registry/regulatory-variable')],[3n,text('regulatory-reference/0.5-candidate')],[4n,r('RegulatoryVariableRegistration',{VariableDefinition:r('RegulatoryVariableDefinition',{Scale:unsigned(1),Minimum:signed(0),Maximum:signed(100)}),ReferenceDefinition:r('RegulatoryReferenceDefinition',{CharacterReferences:map([[r('RegulatoryCharacterReferenceKey',{CharacterId:character}),anchor]]),Parameters:map([[parameter,parameters]])})})]]));
 const compiled=compileRegulatoryReferences(enc(set([declaration])),content);return {bytes:enc(set([declaration])),at:(at:bigint)=>{const v=compiled.referenceOperatingPoint(character,variable,at);if(v.kind!=='ReferenceValue')throw Error('missing REG');return Q.of(n(v.value));}};
}
export async function runBodyCase(c:ReturnType<typeof bodyCases>[number],replay=true){
 const source=bodySource(c.model),compiled=await compileEmbodiedModel(source),definitions=items(decode(compiled.definitionBytes()),'list'),params=rec(definitions[0],453n),channel=rec(definitions[1],458n),rate=exact(f(params,3n)),width=exact(f(channel,6n)),available=f(channel,7n)===true&&f(channel,8n)===true;
 const anchor=items(decode(c.initialState),'set').map(v=>f(rec(v,151n),2n)).find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===454n)!;
 const amount=exact(f(rec(anchor,454n),1n)),meter=createStoredBody(amount,rate),cache=createPressureCache(),ref=await reference();
 const run=await createEmbodiedRun(await prepareEmbodiedModel(source),{initialState:c.initialState,orderedInputs:c.orderedInputs,runSeed:new Uint8Array(32)}),saves=[run.save()];while(await run.settleNextInstant())saves.push(run.save());
 if(replay)for(let i=0;i<saves.length;i++){const restored=await restoreEmbodiedRun(source,{initialState:c.initialState,orderedInputs:c.orderedInputs,save:saves[i]});if(key(decode(restored.save()))!==key(decode(saves[i])))throw Error('restore mismatch');const next=await restored.settleNextInstant();if(next!==(i+1<saves.length)||key(decode(restored.save()))!==key(decode(saves[Math.min(i+1,saves.length-1)])))throw Error('continuation mismatch');}
 const outputs=items(decode(run.snapshot().outputs),'list'),pressures=records(outputs,464n),trace=items(decode(run.snapshot().trace),'list').map(v=>rec(v,160n));
 const probes:Record<string,unknown>[]=[],effects:Record<string,unknown>[]=[];
 for(const row of items(decode(c.orderedInputs),'list')){const fields=items(row,'list'),at=n(fields[0]),phase=n(fields[1]);if(phase===10n){const p=pressures.find(v=>n(f(rec(f(v,3n),(f(v,3n) as {schema:{typeId:bigint}}).schema.typeId),4n))===at)!;
  const result=rec(f(p,4n),481n),current:BodyPressure=n(f(result,1n))===1n?{kind:'Known',value:exact(f(result,2n))}:{kind:'Unavailable'},stored=meter.sample(at,width,available);cache.accept(at,current);
  const sample=f(p,3n),sr=rec(sample,(sample as {schema:{typeId:bigint}}).schema.typeId),tr=trace.find(t=>{const e=rec(f(t,4n),130n);return n(f(e,3n))===10n&&key(f(t,13n))===key(list([sample]));});
  const body=tr&&items(f(tr,15n),'list')[0];
  const ground=motiveProbe(current);probes.push({at:String(at),body:body?fraction(exact(f(rec(body,484n),1n))):'Unobserved',sample:key(sample),interval:sr.schema.typeId===461n?key(f(sr,5n)):null,mediated:pressureText(current),meter:pressureText(stored.mediated),independent:pressureText(stored.independent),reference:pressureText(sensedPressure(ref.at(at),width,available)),cached:pressureText(cache.query()),meterLevel:fraction(stored.level),referenceLevel:fraction(ref.at(at)),ground:ground.kind==='BodyGround'?fraction(ground.magnitude):'NoGround',cacheAt:String(cache.snapshot().at)});
 }else{const name=str(id(f(rec(fields[3],478n),1n)).payload),which=['definition/embodied-delivery-30','definition/embodied-delivery-5','definition/embodied-delivery-60'].indexOf(name);if(which<0)throw Error('delivery missing');const delivery=exact(f(rec(definitions[which+3],477n),4n)),effect=meter.deliver(at,delivery);effects.push({at:String(at),amount:fraction(delivery),...Object.fromEntries(Object.entries(effect).map(([k,q])=>[k,fraction(q)]))});}}
 return {name:c.name,model:c.model,runIdentity:key(decode(run.runIdentity())),initial:fraction(amount),rate:fraction(rate),width:fraction(width),adaptation:'0/1',referenceDeclaration:key(decode(ref.bytes)),prefixes:saves.length,advancing:saves.length-1,probes,effects,sourceState:key(decode(run.snapshot().state)),sourceOutputs:key(decode(run.snapshot().outputs)),sourceTrace:key(decode(run.snapshot().trace)),save:key(decode(run.save())),meterFinal:{at:String(meter.snapshot().at),level:fraction(meter.snapshot().level)}};
}
