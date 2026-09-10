/** Accepted EMB model packaging. Declaration admission only; no runtime activation. */
import inheritedHex from '../../docs/planning/campaign2-task-cognitive-model/registry.cenc.hex?raw';
import allocation from '../../docs/formal/EMBODIED_RESERVE_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,list,set,map,text,unsigned as u,typedIdentifier,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {statePathPatternValue} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {compileValDeclarations} from '../campaign2/valDeclarations';
import {compileCampaign2StateModel} from '../campaign2/stateModel';
import {compileOccurrenceIdentities} from '../campaign2/occurrenceIdentity';
import {compileEmbodiedRequiredProjections} from '../campaign2/requiredProjection';
import {snapshotMemorySource} from '../campaign2/memoryModel';
import type {Campaign2ModelSource} from '../campaign2/factory';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as unsigned,dataText as str,dataIdentity as identity,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {decodeEmbodied as decode,embodiedSchema as schema,embodiedRecord as r} from './embodiedCodecs';
type R=Extract<CanonicalValue,{kind:'record'}>;
const versions={rulesVersion:'rules/campaign3-embodied-reserve/0.1-candidate',registrySchemaVersion:'campaign3-embodied-registry/0.1-candidate',contentSchemaVersion:'content/0.2-candidate',parameterSchemaVersion:'campaign3-embodied-parameters/0.1-candidate',numericProfileVersion:'numeric/embodied-reserve-exact/0.1-candidate',randomAlgorithmVersion:'rng/sha256-addressed-128-v1-candidate'} as const;
const id=(ns:number,p:string)=>typedIdentifier(ns,text(p)),def=(s:string)=>id(1027,'definition/'+s),event=(s:string)=>id(1001,'event/'+s),seam=(s:string)=>id(1036,'seam/'+s),v=(s:string)=>text(s+'/0.1-candidate');
const eq=(a:CanonicalValue,b:CanonicalValue,why:string)=>{if(key(a)!==key(b))fail(why);};
const raw=(type:number,fields:Record<string,CanonicalValue>)=>record(schema(BigInt(type)),new Map(Object.entries(fields).map(([k,v])=>[BigInt(k),v])));
const ref=(type:number)=>r(254,[u(type),u(1)]);
const role=(ns:number,char=false)=>raw(263,{1:u(ns),...(char?{2:id(1021,'validator/character-qualification')}:{})});
const C=semanticReferentFromAuthoredContent(id(1038,'character/embodied-subject')),O=id(1000,'observer/embodied-subject'),U=id(1039,'unit/embodied-fuel-stock');
const pattern=(root:number,exact=false)=>statePathPatternValue({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[exact?{kind:'exact',selector:{kind:'mapKey',key:C}}:{kind:'wildcard',selectorKind:'mapKey'}]});
const roster=pattern(268),body=pattern(455),bodyRead=pattern(455,true);
const projection=(sourceField:number)=>set([r(266,[u(sourceField),roster,u(1),role(1002,true),id(1028,'ResolvedCharacterSubject')])]);
const base=decode(Uint8Array.from(inheritedHex.trim().match(/../g)!.map(s=>Number.parseInt(s,16))));
const baseSlots=items(base,'list');
const inherited=items(baseSlots[0],'set').filter(v=>{const r=v as R;return r.schema.typeId===172n||(r.schema.typeId===171n&&str(identity(f(r,2n)).payload)==='registry/union-variant-definition');});
const entry=(stable:CanonicalValue,kind:string,version:CanonicalValue,payload:CanonicalValue)=>r(171,[stable,id(1023,kind),version,payload]);
const descriptors=allocation.records.map(s=>r(172,[u(s.typeId),u(1),text(s.name),list(s.fields.map(f=>r(173,[u(f.id),text(f.name),f.required])))]));
const unionVersion=f(inherited.find(v=>(v as R).schema.typeId===171n) as R,3n);
const unions=allocation.unionDefinitions.map(x=>entry(typedIdentifier(1024,list([u(x.recordTypeId),u(x.tag)])),'registry/union-variant-definition',unionVersion,r(259,[u(x.recordTypeId),u(x.tag),set(x.requiredPayloadFieldIds.map(u)),set(x.forbiddenPayloadFieldIds.map(u))])));
const expectedBuild=set([...inherited,...descriptors,...unions]);
const positions=[...allocation.roles,...allocation.mapKeyRoles].map(p=>({type:p.recordTypeId,field:p.fieldId,map:p.position==='StateMapKey',ns:p.requiredNamespace,char:p.domainValidatorId!==null}));
positions.push({type:267,field:1,map:false,ns:1002,char:true},{type:268,field:1,map:true,ns:1000,char:false},{type:227,field:1,map:false,ns:1106,char:false},{type:227,field:2,map:false,ns:1000,char:false});
const expectedRoles=set(positions.map(p=>r(265,[raw(264,{1:u(p.map?2:1),[p.map?3:2]:u(p.type),4:u(p.field)}),role(p.ns,p.char)])));
const ownedLeaf=r(153,[body,r(152,[u(3),u(454)]),false]);
const expectedOwner=r(154,[id(1025,'authority/embodied-reserve'),set([ownedLeaf])]);
const expectedOwnership=r(155,[text('mutation-authority/0.1-candidate#TRC-001-002-addendum'),set([expectedOwner])]);
const expectedReadOnly=set([r(262,[roster,r(152,[u(3),u(267)])])]),expectedKeys=set([body,roster].map(p=>r(261,[p,r(260,[u(1)])])));

export async function compileEmbodiedModel(input:Campaign2ModelSource){
 const source=snapshotMemorySource(input);
 for(const [k,value] of Object.entries(versions))if(source[k as keyof typeof versions]!==value)fail('incompatible EMB version bundle');
 const registry=decode(source.registry),slots=items(registry,'list');if(slots.length!==6)fail('six EMB slots required');
 const rows=items(slots[0],'set'),build=rows.filter(v=>{const r=v as R;return r.schema.typeId===172n||(r.schema.typeId===171n&&str(identity(f(r,2n)).payload)==='registry/union-variant-definition');});
 eq(set(build),expectedBuild,'EMB trusted descriptor/union mismatch');
 eq(slots[1],baseSlots[1],'phase registry mismatch');eq(slots[2],expectedOwnership,'reserve sole ownership mismatch');eq(slots[3],expectedReadOnly,'immutable roster mismatch');eq(slots[4],expectedKeys,'key grammar closure mismatch');eq(slots[5],expectedRoles,'role closure mismatch');
 const entries=rows.filter(v=>!build.includes(v)).map(v=>rec(v,171n));if(entries.length!==14)fail('exact EMB registry entries required');
 const used=new Set<string>();
 function resolve(stable:CanonicalValue,kind:string,version:string,type:number):R{
  const found=entries.filter(e=>key(f(e,1n))===key(stable));if(found.length!==1)fail('missing/duplicate EMB definition');const e=found[0];used.add(key(stable));
  eq(f(e,2n),id(1023,kind),'definition registry kind mismatch');eq(f(e,3n),text(version),'definition version mismatch');return rec(f(e,4n),BigInt(type));
 }
 const definition=(name:string,kind:string,version:string,type:number)=>resolve(def(name),'registry/'+kind,version+'/0.1-candidate',type);
 const kind=id(1004,'semantic-kind/character');
 eq(resolve(kind,'registry/semantic-kind','content-kind/0.1-candidate',329),r(329,[ref(170)]),'character kind mismatch');
 eq(resolve(id(1021,'validator/character-qualification'),'registry/domain-validator','governed-domain-validator/0.1-candidate',330),r(330,[kind]),'character validator mismatch');
 const contentValue=decode(source.content);eq(contentValue,set([r(170,[id(1038,'character/embodied-subject'),kind,...Array.from({length:14},()=>list([]))])]),'exact character content required');
 const params=definition('embodied-reserve-parameters','embodied-reserve-parameters','embodied-reserve',453);
 eq(f(params,1n),U,'fuel unit mismatch');
 const channel=definition('embodied-level-channel','embodied-level-channel','embodied-level-observation',458);
 eq(f(channel,1n),id(1005,'channel/embodied-fuel-level'),'channel identity mismatch');eq(f(channel,2n),O,'channel observer mismatch');eq(f(channel,3n),U,'channel unit mismatch');eq(f(channel,4n),id(1006,'modality/embodied-fuel-level'),'modality mismatch');eq(f(channel,5n),f(params,2n),'sensor/body capacity mismatch');
 const pressure=definition('embodied-pressure','embodied-pressure-definition','embodied-pressure',460);eq(f(pressure,1n),def('embodied-level-channel'),'pressure channel binding mismatch');
 const threshold=f(pressure,2n) as Extract<CanonicalValue,{kind:'rational'}>,capacity=f(params,2n) as typeof threshold;
 if(threshold.numerator*capacity.denominator>capacity.numerator*threshold.denominator)fail('threshold above capacity');
 eq(definition('embodied-reserve-bodies','embodied-reserve-bodies','embodied-reserve',457),r(457,[set([r(456,[C,def('embodied-reserve-parameters')])])]),'body singleton mismatch');
 const noWrite=r(273,[u(1)]),outputs=set([r(277,[ref(464),u(1)])]);
 eq(definition('embodied-level-source','embodied-level-source-registration','embodied-source-admission',465),r(465,[seam('embodied-level-observation'),v('embodied-level-observation'),r(466,[ref(459),set([roster,bodyRead]),projection(1),set([def('embodied-level-channel')]),def('embodied-reserve-bodies'),r(468,[ref(461),ref(463)]),noWrite]),r(467,[event('embodied-level-sample'),u(10)])]),'source closure mismatch');
 for(const present of [true,false]){
  const prefix=present?'Present':'Unavailable';
  const prerequisite=present?r(475,[def('embodied-level-source'),v('embodied-level-observation'),event('embodied-level-sample'),u(10),ref(461),text('semantic-binding/0.1-candidate#SEM-001H'),u(1),event('embodied-level-settlement'),u(14),ref(227),u(1)]):r(476,[def('embodied-level-source'),v('embodied-level-observation'),event('embodied-level-sample'),u(10),ref(463),event('embodied-level-settlement'),u(14),u(1)]);
  const transition=r(present?471:472,[r(present?473:474,[ref(present?461:463),prerequisite]),set([roster]),outputs,noWrite,projection(2),def('embodied-pressure')]);
  eq(resolve(id(1009,'Embodied'+prefix+'PressureTransition'),'registry/embodied-pressure-'+prefix.toLowerCase()+'-registration','embodied-pressure-admission/0.1-candidate',present?469:470),r(present?469:470,[seam('embodied-pressure'),v('embodied-pressure'),transition,r(483,[event('embodied-pressure-'+prefix.toLowerCase()),u(60)])]),'pressure ingress/reference closure mismatch');
 }
 const deliveries:CanonicalValue[]=[];
 for(const amount of [30,5,60]){const d=definition('embodied-delivery-'+amount,'embodied-replenishment-definition','embodied-replenishment',477);eq(f(d,1n),C,'delivery character mismatch');eq(f(d,2n),def('embodied-reserve-parameters'),'delivery parameter mismatch');eq(f(d,3n),U,'delivery unit mismatch');deliveries.push(d);}
 eq(definition('embodied-replenishment','embodied-replenishment-registration','embodied-replenishment',480),r(480,[seam('embodied-replenishment'),v('embodied-replenishment'),ref(478),r(467,[event('embodied-reserve-replenishment'),u(110)]),set([30,5,60].map(n=>def('embodied-delivery-'+n))),def('embodied-reserve-bodies'),set([bodyRead]),set([body]),id(1025,'authority/embodied-reserve'),ref(479)]),'writer closure mismatch');
 const occurrenceMap=map([[227,1106],[461,1115],[463,1115],[464,1142]].map(([type,ns])=>[ref(type),r(278,[u(1),role(ns)])]));
 eq(resolve(def('transition-admission'),'registry/transition-admission','transition-admission/0.4-candidate',279),r(279,[set([]),map([]),occurrenceMap]),'shared admission closure mismatch');
 if(used.size!==entries.length)fail('unconsumed EMB definition');
 const parameterValues=items(decode(source.parameters),'list');if(parameterValues.length!==1)fail('one ordering parameter required');const work=unsigned(f(rec(parameterValues[0],133n),1n));if(work<1n)fail('positive work limit required');
 const val=entries.filter(e=>['registry/semantic-kind','registry/domain-validator'].includes(str(identity(f(e,2n)).payload)));
 const compiler=compileValDeclarations(enc(set(val)),source.registry,{decode,schema});const content=await compiler.compileContent(source.content,enc(slots[0]));content.validateRecordRoles(source.registry);
 const state=compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,{decode,schema});
 for(const type of [465n,469n,470n]){const reg=entries.map(e=>f(e,4n)).find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type)!;const definition=rec(f(rec(reg,type),3n),type===465n?466n:type===469n?471n:472n);compileEmbodiedRequiredProjections(enc(reg),enc(f(definition,type===465n?3n:5n)),[],state,content);}
 const occurrences=compileOccurrenceIdentities(enc(occurrenceMap),content,{decode,schema});
 const modelIdentity=await createModelIdentity({...source,contentManifest:await commitManifest(contentValue),registryManifest:await commitManifest(registry),parameterSet:await commitManifest(decode(source.parameters))});
 // A declaration image may be valid without being one of the future frozen activation cohort.
 return Object.freeze({source,modelIdentity,content,state,occurrences,work,
  definitionBytes:()=>enc(list([params,channel,pressure,...deliveries])),characterBytes:()=>enc(C),observerBytes:()=>enc(O)});
}
