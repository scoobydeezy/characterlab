// Review-only specimen construction. No memory execution, activation or restore implementation.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),dir='docs/planning/campaign2-measurement-memory-model/',folder=new URL(dir,root);
const raw=p=>fs.readFileSync(new URL(p,root)),read=p=>raw(p).toString('utf8'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const allocations=['MEASUREMENT_MEMORY','MEMORY_WRAPPER'].map(x=>JSON.parse(read('docs/formal/'+x+'_ALLOCATION_TABLE.json')));
for(const a of allocations)assert.equal(a.status,'PERMANENT AND FROZEN');
const walk=p=>fs.readdirSync(new URL(p+'/',root),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
const prior=[...walk('docs/formal').filter(p=>!p.endsWith('/OPEN_DECISIONS.md')),...fs.readdirSync(new URL('docs/planning/',root),{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name.startsWith('campaign2-')&&e.name.endsWith('-model')&&e.name!=='campaign2-measurement-memory-model').flatMap(e=>walk('docs/planning/'+e.name))].sort().map(path=>({path,sha256:hash(raw(path))}));
for(const path of walk('docs/planning/campaign2-measurement-memory-blocked-review'))prior.push({path,sha256:hash(raw(path))});
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {canonicalEncode:enc,canonicalDecode,RecordSchemaRegistry,record,list,set,map,text,unsigned:u,signed,typedIdentifier}=c;
 const {commitManifest,createModelIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const {measurementEvidenceModelSource,measurementSupportedSchemas}=await server.ssrLoadModule('/src/campaign2/measurementModelSource.ts');
 const {recordRole}=await server.ssrLoadModule('/src/campaign2/firstModelCandidate.ts');
 const {statePathPatternValue}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {PROBE_SUCCESSOR_BUNDLE}=await server.ssrLoadModule('/src/campaign2/probeSuccessorReview.ts');
 const addedSchemas=allocations.flatMap(a=>a.records).map(s=>({typeId:BigInt(s.typeId),schemaVersion:1n,name:s.name,fields:s.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
 const all=[...measurementSupportedSchemas(),...addedSchemas],registry=new RecordSchemaRegistry();for(const s of all)registry.register(s);
 const decode=b=>canonicalDecode(b,registry),hex=v=>Buffer.from(enc(v)).toString('hex'),id=(n,s)=>typedIdentifier(n,text(s)),f=(v,n)=>v.fields.get(BigInt(n));
 const r=(n,vs)=>record(all.find(s=>s.typeId===BigInt(n)),new Map(vs.map((v,i)=>[BigInt(i+1),v])));
 const named=(n,values)=>{const schema=all.find(s=>s.typeId===BigInt(n));return record(schema,new Map(Object.entries(values).map(([name,v])=>{const field=schema.fields.find(f=>f.name===name);assert(field,`${n}.${name}`);return [field.id,v];})));};
 const replace=(v,n,x)=>record(v.schema,new Map([...v.fields].map(([i,a])=>[i,i===BigInt(n)?x:a])));
 const ref=n=>r(254,[u(n),u(1)]),empty=()=>set([]),role=(ns,validator)=>named(263,{RequiredNamespace:u(ns),...(validator?{DomainValidatorId:id(1021,validator)}:{})});
 const entry=(stable,version,def,kind='registry/transition-registration')=>r(171,[stable,id(1023,kind),text(version),def]);
 const isEntry=(v,name)=>v.kind==='record'&&v.schema.typeId===171n&&f(v,1).payload?.value===name;
 const find=(xs,name)=>{const matches=xs.filter(v=>isEntry(v,name));assert.equal(matches.length,1,name);return matches[0];};
 const pattern=root=>statePathPatternValue({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
 const roster=pattern(268),episode=pattern(346),subject=id(1028,'ResolvedCharacterSubject'),seam=id(1036,'seam/measurement-episodic-memory');
 const memory='measurement-episodic-memory/0.1-candidate',formation='measurement-memory-formation-registration/0.1-candidate',recall='measurement-recall-registration/0.1-candidate',fa='measurement-formation-write-ablation/0.1-candidate',ra='measurement-recall-read-ablation/0.1-candidate',v04='transition-admission/0.4-candidate';
 const kinds=['MeasurementEpisodeEvidenceTransition','MemoryFormationTransition','MeasurementRecallTransition'];
 const profiles={orderedInput:'campaign2-probe-ordered-input/0.1-candidate',trace:'campaign2-measurement-memory-trace-binding/0.1-candidate',persistence:'campaign2-measurement-memory-persistence/0.1-candidate'};
 const versions={rulesVersion:'rules/campaign2-measurement-memory/0.1-candidate',registrySchemaVersion:'campaign2-measurement-memory-registry/0.1-candidate'};
 const bundle=[...PROBE_SUCCESSOR_BUNDLE,'transition-admission-extension/0.7-candidate','measurement-evidence-carriage/0.1-candidate','campaign2-measurement-evidence-trace-binding/0.1-candidate',memory,formation,recall,fa,ra,'projection-input-field-path/0.1-candidate','measurement-episode-read/0.1-candidate','measurement-recall-opportunity/0.1-candidate',profiles.trace,profiles.persistence];
 assert.equal(bundle.length,41);
 const m2=r(343,[list([u(2),u(2),u(2)]),roster,u(1),role(1002,'validator/character-qualification'),subject]);
 const idn=r(266,[u(1),roster,u(1),role(1002,'validator/character-qualification'),subject]);
 const er=r(349,[subject,u(2),episode,id(1028,'accessor/measurement-episode-read')]);
 const admission=(type,producer)=>r(274,[ref(type),named(275,{VariantTag:u(2),ProducingTransitionKind:id(1009,producer)}),u(1)]);
 const ingress=(event,phase)=>r(276,[id(1001,event),u(1),u(phase),u(1),u(1)]);
 const noWrite=r(273,[u(1)]),formInput=admission(342,kinds[0]);
 const formIngress=ingress('event/measurement-episode-formation',140);
 const m1=r(356,[r(272,[seam,text(memory),r(271,[admission(337,'MeasurementEvidenceIntakeTransition'),empty(),set([r(277,[ref(342),u(1)])]),noWrite]),ingress('event/measurement-episode-evidence',130)]),empty(),empty(),empty()]);
 const formationNormal=r(357,[r(347,[seam,text(memory),r(348,[formInput,set([roster]),empty(),named(322,{VariantTag:u(2),MutationAuthority:id(1025,'authority/measurement-episode-formation'),WritableFamilies:set([id(1031,'episodic-memory')])})]),formIngress]),set([m2])]);
 const formationAblated=r(356,[r(272,[seam,text(fa),r(271,[formInput,set([roster]),empty(),noWrite]),formIngress]),empty(),set([m2]),empty()]);
 const recallInput=r(354,[ref(351),id(1027,'definition/measurement-recall-opportunity')]);
 const recallNormal=r(358,[r(353,[seam,text(memory),recallInput,set([roster,episode]),set([r(355,[ref(352)])]),noWrite]),set([idn]),set([er])]);
 const recallAblated=r(358,[r(353,[seam,text(ra),recallInput,set([roster]),empty(),noWrite]),set([idn]),empty()]);
 const descriptors=addedSchemas.map(s=>r(172,[u(s.typeId),u(1),text(s.name),list(s.fields.map(x=>r(173,[u(x.id),text(x.name),x.required])))]));
 const roles=allocations[0].roles.map(x=>recordRole(x.recordTypeId,x.fieldId,role(x.requiredNamespace,x.domainValidatorId)));
 const rosterRole=r(265,[named(264,{VariantTag:u(2),RootStateTypeId:u(268),FieldId:u(1)}),role(1000)]);
 // Builder accepts canonical wrapper selections; no F/R metadata is an authority input.
 function construct(a,p,fw,rw){
  const base=measurementEvidenceModelSource(a,p),slots=decode(base.registry).items,old=slots[0].items;
  const singleton=find(old,'definition/transition-admission'),ad=f(singleton,4);
  const updated=replace(singleton,4,r(279,[f(ad,1),map([...f(ad,2).entries,...kinds.slice(0,2).map(k=>[id(1009,k),id(1026,'route/character-learning')])]),map([...f(ad,3).entries,...allocations[0].occurrenceIdentities.map(x=>[ref(x.recordTypeId),r(278,[u(1),role(x.requiredNamespace)])])])]));
  const topology=find(old,'definition/campaign2-state-families');
  const familyMap=f(f(topology,4),1).entries.map(([k,v])=>[k,k.payload.value==='episodic-memory'?replace(v,2,named(286,{VariantTag:u(2),RootStateTypeId:u(346),LeafFields:map([[id(1032,'leaf/measurement-episode'),u(1)]])})):v]);
  const topo=replace(topology,4,r(284,[map(familyMap)]));
  const newRows=[entry(id(1009,kinds[0]),v04,m1),entry(id(1009,kinds[1]),fw.schema.typeId===357n?formation:v04,fw),entry(id(1009,kinds[2]),recall,rw),entry(id(1027,'definition/measurement-recall-opportunity'),'measurement-recall-opportunity/0.1-candidate',r(350,[id(1009,'MeasurementEvidenceIntakeTransition'),id(1001,'event/measurement-exact-recall'),signed(1)]),'registry/measurement-recall-opportunity')];
  const owner=r(154,[id(1025,'authority/measurement-episode-formation'),set([r(153,[episode,r(152,[u(3),u(345)]),false])])]);
  return {...base,...versions,registry:enc(list([set([...old.filter(v=>v!==singleton&&v!==topology),updated,topo,...descriptors,...newRows]),slots[1],replace(slots[2],2,set([...f(slots[2],2).items,owner])),set([...slots[3].items,r(262,[roster,r(152,[u(3),u(267)])])]),set([...slots[4].items,r(261,[roster,r(260,[u(1)])]),r(261,[episode,r(260,[u(2),u(344)])])]),set([...slots[5].items,...roles,rosterRole])]))};
 }
 const checks=[];const check=(name,value)=>{assert(value,name);checks.push({name,status:'PASS'});};
 async function commit(source){return createModelIdentity({...source,contentManifest:await commitManifest(decode(source.content)),parameterSet:await commitManifest(decode(source.parameters)),registryManifest:await commitManifest(decode(source.registry))});}
 const expectedCache=new Map();
 // Exact bounded specimen validator. Not a new general or runtime activation compiler.
 async function compile(source,tuple=profiles){
  assert.deepEqual(tuple,profiles);assert.deepEqual(Object.keys(source).sort(),Object.keys(measurementEvidenceModelSource()).sort());
  const slots=decode(source.registry).items;assert.equal(slots.length,6);const rows=slots[0].items;
  const probe=f(find(rows,'definition/regulatory-diagnostic-probe'),4),a=f(probe,4),p=f(probe,5);assert.equal(typeof a,'boolean');assert.equal(typeof p,'boolean');
  const fw=f(find(rows,kinds[1]),4),rw=f(find(rows,kinds[2]),4);
  assert([356n,357n].includes(fw.schema?.typeId));assert.equal(rw.schema?.typeId,358n);
  const expectedFW=fw.schema.typeId===357n?formationNormal:formationAblated;
  const rv=f(f(rw,1),2).value;assert([memory,ra].includes(rv));const expectedRW=rv===memory?recallNormal:recallAblated;
  const cacheKey=[a,p,expectedFW===formationNormal,expectedRW===recallNormal].join('/');
  if(!expectedCache.has(cacheKey))expectedCache.set(cacheKey,construct(a,p,expectedFW,expectedRW));
  const expected=expectedCache.get(cacheKey);
  for(const k of Object.keys(expected))assert.equal(typeof expected[k]==='string'?source[k]:hex(decode(source[k])),typeof expected[k]==='string'?expected[k]:hex(decode(expected[k])),k);
  return {source,model:await commit(source),a,p,F:expectedFW===formationNormal,R:expectedRW===recallNormal};
 }
 const positive=await compile(construct(true,true,formationNormal,recallNormal)),{source,model}=positive;
 const oldSource=measurementEvidenceModelSource(),oldSlots=decode(oldSource.registry).items,slots=decode(source.registry).items;
 const oldPacket=n=>Buffer.from(read('docs/planning/campaign2-measurement-evidence-model/'+n+'.cenc.hex').trim(),'hex');
 check('declaration source matches frozen parent registry',Buffer.from(oldSource.registry).equals(oldPacket('registry')));
 const readable=v=>typeof v==='boolean'?v:v.kind==='record'?{record:`${v.schema.name}/${v.schema.typeId}/${v.schema.schemaVersion}`,fields:Object.fromEntries([...v.fields].map(([i,x])=>[`${i}:${v.schema.fields.find(f=>f.id===i).name}`,readable(x)]))}:v.kind==='typedIdentifier'?{namespace:String(v.namespaceId),payload:readable(v.payload)}:['list','set'].includes(v.kind)?{[v.kind]:v.items.map(readable)}:v.kind==='map'?{map:v.entries.map(([k,x])=>[readable(k),readable(x)])}:Object.fromEntries(Object.entries(v).map(([k,x])=>[k,typeof x==='bigint'?String(x):x]));
 const delta=slots.map((v,i)=>({position:i,byteIdentical:hex(v)===hex(oldSlots[i]),before:readable(oldSlots[i]),after:readable(v)}));
 check('slot1 unchanged',delta[1].byteIdentical);
 check('17 new schema descriptors',slots[0].items.filter(v=>v.kind==='record'&&v.schema.typeId===172n).length-oldSlots[0].items.filter(v=>v.kind==='record'&&v.schema.typeId===172n).length===17);
 for(let n=342;n<=358;n++)check('descriptor exactly once '+n,slots[0].items.filter(v=>v.kind==='record'&&v.schema.typeId===172n&&f(v,1).value===BigInt(n)).length===1);
 check('slot5 exactly15 declarations:14 memory plus1 IDN',slots[5].items.length-oldSlots[5].items.length===15);
 const rosterMapRoles=values=>values.filter(v=>{const p=f(v,1);return f(p,1)?.value===2n&&f(p,3)?.value===268n&&f(p,4)?.value===1n;});
 check('parent absence preserved as historical fact',rosterMapRoles(oldSlots[5].items).length===0);
 check('exactly one accepted268 map-key role',rosterMapRoles(slots[5].items).length===1&&hex(rosterMapRoles(slots[5].items)[0])===hex(rosterRole));
 for(const value of roles)check('frozen memory role bytes '+hex(f(value,1)),slots[5].items.filter(v=>hex(v)===hex(value)).length===1);
 check('203/2 record role preserved separately',slots[5].items.some(v=>{const p=f(v,1);return f(p,1)?.value===1n&&f(p,2)?.value===203n&&f(p,4)?.value===2n&&hex(f(v,2))===hex(role(1000));}));
 check('slot3 one exact IDN family',slots[3].items.length===1&&hex(f(slots[3].items[0],1))===hex(roster));
 check('slot4 two added key declarations',slots[4].items.length-oldSlots[4].items.length===2);
 check('slot2 exact sparse map-entry owner',f(slots[2],2).items.some(v=>hex(v)===hex(r(154,[id(1025,'authority/measurement-episode-formation'),set([r(153,[episode,r(152,[u(3),u(345)]),false])])]))));
 for(const v of oldSlots[0].items.filter(v=>v.kind==='record'&&v.schema.typeId===171n&&!['definition/transition-admission','definition/campaign2-state-families'].some(n=>isEntry(v,n))))check('inherited bare row '+f(v,1).payload.value,slots[0].items.some(x=>hex(x)===hex(v)));
 check('opportunity bare350 signed delay1',f(find(slots[0].items,'definition/measurement-recall-opportunity'),4).schema.typeId===350n&&hex(f(f(find(slots[0].items,'definition/measurement-recall-opportunity'),4),3))===hex(signed(1)));
 const variants=[];for(const a of [false,true])for(const p of [false,true])for(const fw of [formationAblated,formationNormal])for(const rw of [recallAblated,recallNormal]){const v=await compile(construct(a,p,fw,rw));variants.push({a:v.a,p:v.p,F:v.F,R:v.R,modelDigest:Buffer.from(v.model.digest).toString('hex'),registryHex:Buffer.from(v.source.registry).toString('hex'),modelIdentityHex:Buffer.from(v.model.canonicalBytes).toString('hex')});}
 check('16 distinct committed models',new Set(variants.map(v=>v.modelDigest)).size===16);
 const blocked=JSON.parse(read('docs/planning/campaign2-measurement-memory-blocked-review/CONTROL_COMMITMENTS.json'));
 for(let i=0;i<16;i++){assert.deepEqual([variants[i].a,variants[i].p,variants[i].F,variants[i].R],[blocked[i].a,blocked[i].p,blocked[i].F,blocked[i].R]);check('variant'+i+' recomputed commitment differs from blocked specimen',variants[i].modelDigest!==blocked[i].modelDigest&&variants[i].registryHex!==blocked[i].registryHex);}
 // Reuse actual IDN closure compiler on its exact fragment. The old general decoder
 // does not admit new memory schemas; this is explicitly an IDN component proof.
 const {compileValDeclarations}=await server.ssrLoadModule('/src/campaign2/valDeclarations.ts');
 const {compileCampaign2StateModel}=await server.ssrLoadModule('/src/campaign2/stateModel.ts');
 const valRows=oldSlots[0].items.filter(v=>v.kind==='record'&&v.schema.typeId===171n&&['registry/semantic-kind','registry/domain-validator'].includes(f(v,2).payload.value));
 const characterRole=oldSlots[5].items.find(v=>{const p=f(v,1);return f(p,1)?.value===1n&&f(p,2)?.value===267n&&f(p,4)?.value===1n;});assert(characterRole);
 async function idnClosure(roleDeclarations){
  const content=await compileValDeclarations(enc(set(valRows)),enc(set([characterRole,...roleDeclarations]))).compileContent(source.content,enc(set(valRows)));
  return compileCampaign2StateModel(enc(replace(slots[2],2,empty())),enc(slots[3]),enc(set(slots[4].items.filter(v=>hex(f(v,1))===hex(roster)))),content);
 }
 await idnClosure([rosterRole]);checks.push({name:'actual VAL/stateModel IDN component closure PASS',status:'PASS'});
 for(const [label,declarations]of [['missing',[]],['wrong namespace',[replace(rosterRole,2,role(1002))]],['RecordField substitution',[recordRole(203,2,role(1000))]],['duplicate',[rosterRole,rosterRole]],['unexpected validator',[replace(rosterRole,2,role(1000,'validator/character-qualification'))]]]){await assert.rejects(()=>idnClosure(declarations));checks.push({name:'actual IDN component rejects '+label,status:'PASS'});}
 for(const v of variants){const vs=decode(Buffer.from(v.registryHex,'hex')).items;check('IDN fragment identical in variant '+v.modelDigest,hex(vs[3])===hex(slots[3])&&rosterMapRoles(vs[5].items).length===1&&hex(rosterMapRoles(vs[5].items)[0])===hex(rosterRole));}
 const mutateRow=(name,change)=>({...source,registry:enc(list([set(slots[0].items.map(v=>isEntry(v,name)?change(v):v)),...slots.slice(1)]))});
 const reject=async(name,mutated)=>{await assert.rejects(()=>compile(mutated));checks.push({name,status:'PASS'});};
 await reject('MEM-PACK-B bare memory registration',mutateRow(kinds[0],v=>replace(v,4,f(f(v,4),1))));
 await reject('MEM-PACK-B wrong profile',{...source,registrySchemaVersion:oldSource.registrySchemaVersion});
 await reject('MEM-PACK-C wrapped inherited EVID',mutateRow('OutcomeEvaluationTransition',v=>replace(v,4,r(356,[f(v,4),empty(),empty(),empty()]))));
 await reject('MEM-PACK-C wrong wrapper',mutateRow(kinds[1],v=>replace(v,4,recallNormal)));
 await reject('MEM-PACK-A anonymous list',mutateRow(kinds[0],v=>replace(v,4,list([f(f(v,4),1),empty()]))));
 await reject('MEM-PACK-F missing episode requirement',mutateRow(kinds[2],v=>replace(v,4,replace(f(v,4),3,empty()))));
 await reject('MEM-PACK-F external static binding',{...source,staticBindings:[]});
 for(const [label,values]of [['missing IDN role',slots[5].items.filter(v=>hex(v)!==hex(rosterRole))],['wrong IDN namespace',slots[5].items.map(v=>hex(v)===hex(rosterRole)?replace(v,2,role(1002)):v)],['IDN RecordField substitution',slots[5].items.filter(v=>hex(v)!==hex(rosterRole))],['unexpected IDN validator',slots[5].items.map(v=>hex(v)===hex(rosterRole)?replace(v,2,role(1000,'validator/character-qualification')):v)]]){const ss=[...slots];ss[5]=set(values);await reject(label,{...source,registry:enc(list(ss))});}
 const altered=mutateRow(kinds[2],v=>replace(v,4,replace(f(v,4),3,set([replace(er,2,u(1))]))));
 await reject('MEM-PACK-F wrong evidence source field',altered);
 const alteredModel=await commit(altered);check('MEM-PACK-D/G same inner record changed requirements change commitment',!Buffer.from(alteredModel.digest).equals(Buffer.from(model.digest))&&hex(f(f(find(decode(altered.registry).items[0].items,kinds[2]),4),1))===hex(f(recallNormal,1)));
 check('MEM-PACK-E substrate nontrivial set permutation only',hex(set([idn,m2]))===hex(set([m2,idn])));
 check('specimen set construction permutation',hex(list(slots.map(v=>v.kind==='set'?set([...v.items].reverse()):v)))===hex(decode(source.registry)));
 for(const key of Object.keys(profiles)){await assert.rejects(()=>compile(source,{...profiles,[key]:'unadmitted/profile'}));checks.push({name:'wrong '+key+' profile rejects',status:'PASS'});}
 for(const n of [0,3,4,5])for(let i=0;i<slots[n].items.length;i++){const mutated=[...slots];mutated[n]=set(slots[n].items.filter((_,j)=>j!==i));await reject(`missing slot${n} entry${i}`,{...source,registry:enc(list(mutated))});}
 const {compileBoundedModelDeclarations}=await server.ssrLoadModule('/src/campaign2/modelPackaging.ts');
 const {firstTraceModel}=await server.ssrLoadModule('/src/campaign2/firstTraceModel.ts');
 const {compileOrderedInputProfile}=await server.ssrLoadModule('/src/campaign2/orderedInputs.ts');
 const {scheduledEventValue}=await server.ssrLoadModule('/src/substrate/persistence.ts');
 const inherited=await compileBoundedModelDeclarations(firstTraceModel());
 const input=compileOrderedInputProfile(profiles.orderedInput,inherited.compiled.content,inherited.domains),parentModel=await commit(oldSource);
 const opportunity=(at,event='event/regulatory-diagnostic-probe')=>list([signed(at),u(110),id(1001,event),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])]);
 for(const entries of [[],[opportunity(4)],[opportunity(8),opportunity(4)]]){
  const b=enc(list(entries)),state=enc(empty()),seed=new Uint8Array(32);
  const before=await input.create(b,state,parentModel,seed),after=await input.create(b,state,model,seed);
  check('ordered-input equivalence bounded corpus '+entries.length,hex(list(before.initialEvents.map(scheduledEventValue)))===hex(list(after.initialEvents.map(scheduledEventValue))));assert.deepEqual(before.initialAllocators,after.initialAllocators);
 }
 for(const e of ['event/measurement-exact-recall','event/measurement-episode-evidence','event/measurement-episode-formation','event/measurement-future-padding','event/measurement-episode-evidence-padding','event/measurement-episode-formation-padding']){await assert.rejects(()=>input.create(enc(list([opportunity(4,e)])),enc(empty()),model,new Uint8Array(32)));checks.push({name:'original input excludes '+e,status:'PASS'});}
 const artifacts={content:source.content,parameters:source.parameters,registry:source.registry,'content-identity':enc(f(model.value,2)),'parameter-identity':enc(f(model.value,3)),'registry-identity':enc(f(model.value,6)),'model-identity':model.canonicalBytes};
 const write=process.argv.includes('--write');if(write)fs.mkdirSync(folder,{recursive:true});
 const output=(n,data)=>{if(write)fs.writeFileSync(new URL(n,folder),data);assert.equal(fs.readFileSync(new URL(n,folder),'utf8'),data,n);};
 const files=[];for(const [n,b]of Object.entries(artifacts)){assert.deepEqual(enc(decode(b)),b);const same=Buffer.from(b).equals(oldPacket(n));assert.equal(same,['content','parameters','content-identity','parameter-identity'].includes(n));output(n+'.cenc.hex',Buffer.from(b).toString('hex')+'\n');output(n+'.json',JSON.stringify(readable(decode(b)),null,2)+'\n');files.push({name:n,sha256:hash(b),bytes:b.length,byteIdenticalToCarriage:same});}
 output('CONTROL_COMMITMENTS.json',JSON.stringify(variants,null,2)+'\n');
 const report={status:'REVIEW CANDIDATE — NOT FROZEN',amendment:{id:'C2-MEM-PACK-002',status:'ACCEPTED AND APPLIED',slot5Additions:{memoryRecordField:14,idnStateMapKey:1,total:15},idnClosure:'PASS through existing VAL/stateModel compiler on exact IDN fragment; full memory runtime compiler remains gated'},versions:Object.fromEntries(Object.entries(source).filter(([,v])=>typeof v==='string')),profiles,semanticBundle:bundle,modelDigest:Buffer.from(model.digest).toString('hex'),registryDelta:delta,files,controls:variants.map(({registryHex,modelIdentityHex,...v})=>v),checks,preservedSources:prior,limitations:['Review admission is bounded specimen validation plus separately executed IDN closure; not runtime qualification.','Exact bounded review constructor/validator; no authoritative memory runtime.','MEM-PACK-A..G component evidence only; full qualification NOT PASSED.','MEMR-A..P NOT PASSED; runtime implementation gated by model freeze.','Fresh-process rematerialization is checked by rerunning this script without --write.']};
 output('REVIEW_MANIFEST.json',JSON.stringify(report,null,2)+'\n');for(const p of prior)assert.equal(hash(raw(p.path)),p.sha256,p.path);
 console.log(JSON.stringify({status:report.status,modelDigest:report.modelDigest,checks:checks.length,preserved:prior.length,models:variants.length}));
}finally{await server.close();}
