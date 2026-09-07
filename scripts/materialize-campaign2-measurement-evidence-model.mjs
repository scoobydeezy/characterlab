// Review-only materialization. No factory, scheduler or authoritative carriage activation.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),dir='docs/planning/campaign2-measurement-evidence-model/',folder=new URL(dir,root);
const raw=p=>fs.readFileSync(new URL(p,root)),read=p=>raw(p).toString('utf8'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const allocation=JSON.parse(read('docs/formal/MEASUREMENT_EVIDENCE_CARRIAGE_ALLOCATION_TABLE.json'));
assert.equal(allocation.status,'PERMANENT AND FROZEN');
const prior=[];
for(const d of ['docs/planning/campaign2-first-model','docs/planning/campaign2-trace-model','docs/planning/campaign2-probe-model','docs/planning/campaign2-probe-successor-model','docs/formal'])for(const n of fs.readdirSync(new URL(d+'/',root)).sort()){
 if(d==='docs/formal'&&!/ALLOCATION|PERMANENT/.test(n))continue;
 const p=d+'/'+n;if(fs.statSync(new URL(p,root)).isFile())prior.push({path:p,sha256:hash(raw(p))});
}
const server=await createServer({server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {canonicalEncode:enc,canonicalDecode,RecordSchemaRegistry,record,list,set,text,unsigned,typedIdentifier,signed}=c;
 const {commitManifest,createModelIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const {contentRegistrySchemas}=await server.ssrLoadModule('/src/substrate/contentManifest.ts');
 const {probeModelReviewSource,compileProbeModelReview}=await server.ssrLoadModule('/src/campaign2/probeModelReview.ts');
 const {probeSupportedSchemas}=await server.ssrLoadModule('/src/campaign2/probeCodecs.ts');
 const {PROBE_SUCCESSOR_BUNDLE,probeSuccessorReview}=await server.ssrLoadModule('/src/campaign2/probeSuccessorReview.ts');
 const {recordRole}=await server.ssrLoadModule('/src/campaign2/firstModelCandidate.ts');
 const schemas=allocation.records.map(r=>({typeId:BigInt(r.typeId),schemaVersion:1n,name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
 const all=[...probeSupportedSchemas(),...schemas],registry=new RecordSchemaRegistry();for(const s of all)registry.register(s);
 const decode=b=>canonicalDecode(b,registry),hex=v=>Buffer.from(enc(v)).toString('hex'),id=(n,s)=>typedIdentifier(n,text(s));
 const r=(n,values)=>record(all.find(s=>s.typeId===BigInt(n)),new Map(values.map((v,i)=>[BigInt(i+1),v]))),f=(v,i)=>v.fields.get(BigInt(i));
 const entry=(stable,kind,version,def)=>record(contentRegistrySchemas.semanticRegistryEntry,new Map([[1n,stable],[2n,id(1023,kind)],[3n,text(version)],[4n,def]]));
 const isEntry=(v,stable)=>v.kind==='record'&&v.schema.typeId===171n&&f(v,1).payload?.value===stable;
 const versions={rulesVersion:'rules/campaign2-measurement-evidence/0.1-candidate',registrySchemaVersion:'campaign2-measurement-evidence-registry/0.1-candidate'};
 const profiles={orderedInput:'campaign2-probe-ordered-input/0.1-candidate',trace:'campaign2-measurement-evidence-trace-binding/0.1-candidate',persistence:'campaign2-measurement-evidence-persistence/0.1-candidate'};
 const bundle=[...PROBE_SUCCESSOR_BUNDLE,'transition-admission-extension/0.7-candidate','measurement-evidence-carriage/0.1-candidate',profiles.trace];assert.equal(bundle.length,31);
 function construct(a=true,p=true){
 const base=probeModelReviewSource(a,p),slots=decode(base.registry).items,old=slots[0].items;
 const channel=f(f(old.find(v=>isEntry(v,'definition/regulatory-diagnostic-probe')),4),3);
 const intake=entry(id(1027,'definition/measurement-evidence-intake'),'registry/measurement-evidence-intake','measurement-evidence-carriage/0.1-candidate',r(336,[f(channel,2),f(channel,1),f(channel,5)]));
 const schema=n=>r(254,[unsigned(n),unsigned(1)]);
 const producer=r(338,[id(1036,'seam/regulatory-diagnostic-probe'),text('regulatory-diagnostic-probe/0.1-candidate'),id(1001,'event/regulatory-diagnostic-probe-observation'),unsigned(120),schema(203)]);
 const admission=r(339,[schema(203),producer,unsigned(1)]);
 const definition=r(340,[admission,set([]),set([r(277,[schema(337),unsigned(1)])]),r(273,[unsigned(1)])]);
 const ingress=r(276,[id(1001,'event/measurement-evidence-intake'),unsigned(1),unsigned(130),unsigned(1),unsigned(1)]);
 const transition=entry(id(1009,'MeasurementEvidenceIntakeTransition'),'registry/transition-registration','transition-admission-extension/0.7-candidate',r(341,[id(1036,'seam/measurement-evidence-carriage'),text('measurement-evidence-carriage/0.1-candidate'),definition,ingress]));
 const role=ns=>r(263,[unsigned(ns)]);
 const oldSingleton=old.find(v=>isEntry(v,'definition/transition-admission')),singleton=f(oldSingleton,4);
 const additions=allocation.occurrenceIdentities.map(x=>[schema(x.recordTypeId),r(278,[unsigned(1),role(x.requiredNamespace)])]);
 const changed=r(279,[f(singleton,1),f(singleton,2),{kind:'map',entries:[...f(singleton,3).entries,...additions]}]);
 const newSingleton=entry(f(oldSingleton,1),'registry/transition-admission','transition-admission/0.4-candidate',changed);
 const descriptors=schemas.map(s=>record(contentRegistrySchemas.recordSchemaDescriptor,new Map([[1n,unsigned(s.typeId)],[2n,unsigned(1)],[3n,text(s.name)],[4n,list(s.fields.map(x=>record(contentRegistrySchemas.recordFieldDescriptor,new Map([[1n,unsigned(x.id)],[2n,text(x.name)],[3n,true]]))))]])));
 const roles=allocation.roles.map(x=>recordRole(x.recordTypeId,x.fieldId,role(x.requiredNamespace)));
 return {...base,...versions,registry:enc(list([set([...old.filter(v=>v!==oldSingleton),newSingleton,...descriptors,intake,transition]),...slots.slice(1,5),set([...slots[5].items,...roles])]))};
 }
 const checks=[];function check(name,value){assert(value,name);checks.push({name,status:'PASS'});}
 function binding(source,tuple=profiles){assert.equal(source.rulesVersion,versions.rulesVersion);assert.equal(source.registrySchemaVersion,versions.registrySchemaVersion);assert.deepEqual(tuple,profiles);}
 async function compile(source,tuple=profiles){
 binding(source,tuple);const slots=decode(source.registry).items;assert.equal(slots.length,6);
 const defs=slots[0].items.filter(v=>isEntry(v,'definition/regulatory-diagnostic-probe'));assert.equal(defs.length,1);const d=f(defs[0],4),a=f(d,4),p=f(d,5);assert.equal(typeof a,'boolean');assert.equal(typeof p,'boolean');
 const expected=construct(a,p);for(const k of Object.keys(expected))assert.equal(typeof expected[k]==='string'?source[k]:hex(decode(source[k])),typeof expected[k]==='string'?expected[k]:hex(decode(expected[k])),k);
 await compileProbeModelReview(probeModelReviewSource(a,p));
 const model=await createModelIdentity({...source,contentManifest:await commitManifest(decode(source.content)),parameterSet:await commitManifest(decode(source.parameters)),registryManifest:await commitManifest(decode(source.registry))});return {source,model};
 }
 const positive=await compile(construct()),{source,model}=positive,old=await probeSuccessorReview();
 const oldBytes=n=>Buffer.from(read('docs/planning/campaign2-probe-successor-model/'+n+'.cenc.hex').trim(),'hex');
 function readable(v){if(typeof v==='boolean')return v;if(v.kind==='record')return {record:`${v.schema.name}/${v.schema.typeId}/${v.schema.schemaVersion}`,fields:Object.fromEntries([...v.fields].map(([i,x])=>[`${i}:${v.schema.fields.find(f=>f.id===i).name}`,readable(x)]))};if(v.kind==='typedIdentifier')return {namespace:String(v.namespaceId),payload:readable(v.payload)};if(v.kind==='list'||v.kind==='set')return {[v.kind]:v.items.map(readable)};if(v.kind==='map')return {map:v.entries.map(([k,x])=>[readable(k),readable(x)])};if(v.kind==='bytes')return {bytes:Buffer.from(v.value).toString('hex')};return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,typeof x==='bigint'?String(x):x]));}
 const slots=decode(source.registry).items,oldSlots=decode(old.source.registry).items;
 const delta=slots.map((v,i)=>{const same=hex(v)===hex(oldSlots[i]);if(i>=1&&i<=4)check('unchanged slot '+i,same);const added=[0,5].includes(i)?v.items.filter(x=>!oldSlots[i].items.some(y=>hex(y)===hex(x))):[],removed=[0,5].includes(i)?oldSlots[i].items.filter(x=>!v.items.some(y=>hex(y)===hex(x))):[];return {position:i,byteIdentical:same,added:added.map(readable),removed:removed.map(readable)};});
 check('slot 0 exact nine additions one singleton replacement',delta[0].added.length===9&&delta[0].removed.length===1);check('slot 5 exact eight additions',delta[5].added.length===8&&delta[5].removed.length===0);
 for(const e of oldSlots[0].items.filter(v=>v.kind==='record'&&v.schema.typeId===171n&&!isEntry(v,'definition/transition-admission')))check('preserved row '+hex(f(e,1)),slots[0].items.some(v=>hex(v)===hex(e)));
 const changed=[...model.value.fields].filter(([i,v])=>hex(v)!==hex(old.modelIdentity.value.fields.get(i))).map(([i])=>String(i));assert.deepEqual(changed,['1','6']);
 const variants=[];for(const a of [false,true])for(const p of [false,true]){const v=await compile(construct(a,p));variants.push({available:a,permitted:p,modelDigest:Buffer.from(v.model.digest).toString('hex'),modelIdentity:readable(v.model.value),registrySha256:hash(v.source.registry)});}check('four distinct committed models',new Set(variants.map(v=>v.modelDigest)).size===4);
 const permuted={...source,registry:enc(list(slots.map(v=>v.kind==='set'?set([...v.items].reverse()):v)))};check('canonical set permutation',Buffer.from((await compile(permuted)).model.canonicalBytes).equals(Buffer.from(model.canonicalBytes)));
 for(const k of Object.keys(profiles)){await assert.rejects(()=>compile(source,{...profiles,[k]:'unadmitted/profile'}));checks.push({name:'reject wrong '+k,status:'PASS'});}
 await assert.rejects(()=>compile({...source,registrySchemaVersion:old.source.registrySchemaVersion}));
 for(const index of [0,5]){const vals=slots[index].items;for(let i=0;i<vals.length;i++){const mutated=[...slots];mutated[index]=set(vals.filter((_,j)=>j!==i));await assert.rejects(()=>compile({...source,registry:enc(list(mutated))}));}checks.push({name:'reject every missing slot '+index+' entry',count:vals.length,status:'PASS'});}
 const {compileBoundedModelDeclarations}=await server.ssrLoadModule('/src/campaign2/modelPackaging.ts'),{firstTraceModel}=await server.ssrLoadModule('/src/campaign2/firstTraceModel.ts');
 const {compileOrderedInputProfile}=await server.ssrLoadModule('/src/campaign2/orderedInputs.ts'),{scheduledEventValue}=await server.ssrLoadModule('/src/substrate/persistence.ts');
 const inherited=await compileBoundedModelDeclarations(firstTraceModel()),input=compileOrderedInputProfile(profiles.orderedInput,inherited.compiled.content,inherited.domains);
 const opportunity=(at,event='event/regulatory-diagnostic-probe')=>list([signed(at),unsigned(110),id(1001,event),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])]);
 for(const entries of [[],[opportunity(4)],[opportunity(8),opportunity(4)]]){const bytes=enc(list(entries)),state=enc(set([])),seed=new Uint8Array(32);const a=await input.create(bytes,state,old.modelIdentity,seed),b=await input.create(bytes,state,model,seed);check('input equivalence corpus '+entries.length,hex(list(a.initialEvents.map(scheduledEventValue)))===hex(list(b.initialEvents.map(scheduledEventValue))));assert.deepEqual(a.initialAllocators,b.initialAllocators);}
 for(const event of ['event/measurement-evidence-intake','event/measurement-evidence-padding'])await assert.rejects(()=>input.create(enc(list([opportunity(4,event)])),enc(set([])),model,new Uint8Array(32)));
 checks.push({name:'generated carriage kinds rejected as initial input',status:'PASS'});
 const artifacts={content:source.content,parameters:source.parameters,registry:source.registry,'content-identity':enc(model.value.fields.get(2n)),'parameter-identity':enc(model.value.fields.get(3n)),'registry-identity':enc(model.value.fields.get(6n)),'model-identity':model.canonicalBytes};
 const write=process.argv.includes('--write');if(write)fs.mkdirSync(folder,{recursive:true});const files=[];
 function output(name,data){if(write)fs.writeFileSync(new URL(name,folder),data);assert.equal(fs.readFileSync(new URL(name,folder),'utf8'),data);}
 for(const [name,bytes]of Object.entries(artifacts)){assert.deepEqual(enc(decode(bytes)),bytes);const same=Buffer.from(bytes).equals(oldBytes(name));assert.equal(same,['content','parameters','content-identity','parameter-identity'].includes(name));output(name+'.cenc.hex',Buffer.from(bytes).toString('hex')+'\n');output(name+'.json',JSON.stringify(readable(decode(bytes)),null,2)+'\n');files.push({name,sha256:hash(bytes),bytes:bytes.length,byteIdenticalToProbe2:same});}
 const evidence={A:'Structural exact delta and missing-entry negatives PASS; runtime admission not executed.',B:'Exact specimen row/version comparison PASS; generic V07 runtime compiler not implemented.',C:'Exact review tuple and wrong-profile negatives PASS; factory selection not implemented.',D:'Exact committed definition/producer and roles PASS; runtime capability boundary not executed.',E:'Reused compiler rejects generated source kinds; carriage restore not implemented.',F:'Committed topology contract only; runtime NOT PASSED.',G:'Accepted historical rule only; carriage restore NOT PASSED.',H:'Canonical parity, permutation, four models and preservation PASS; fresh-process proof recorded separately.',I:'Same unmodified input compiler and dependencies; bounded empty/single/multiple probe corpus PASS. Universal coverage and authored-source successor integration remain NOT PASSED.'};
 const report={status:'CONCRETE BYTES ACCEPTED AND FROZEN',versions:Object.fromEntries(Object.entries(source).filter(([,v])=>typeof v==='string')),profiles,semanticBundle:bundle,modelDigest:Buffer.from(model.digest).toString('hex'),changedModelFields:changed,registryDelta:delta,files,variants,checks,packagingEvidence:evidence,preservedSources:prior,limitations:['Review constructor only; no authoritative carriage implementation.','EVC-A..P NOT PASSED. PACK component findings do not qualify entire obligations.','ModelIdentity frozen; runtime qualification remains separate.']};
 output('REVIEW_MANIFEST.json',JSON.stringify(report,null,2)+'\n');for(const p of prior)assert.equal(hash(raw(p.path)),p.sha256);
 console.log(JSON.stringify({modelDigest:report.modelDigest,checks:checks.length,preservedFiles:prior.length,status:report.status}));
}finally{await server.close();}
