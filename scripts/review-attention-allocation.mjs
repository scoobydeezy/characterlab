// Independent parity, availability and declaration round-trip gate. No freeze here.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/ATTENTION_ALLOCATION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const read=p=>JSON.parse(fs.readFileSync(p)),fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
const draftPath='docs/planning/ATTENTION_ALLOCATION_DRAFT.json',a=read(draftPath),s=read(a.symbolicInput.path),markdown=fs.readFileSync('docs/planning/ATTENTION_ALLOCATION_DRAFT.md','utf8');
let checks=0;const equal=(a,b)=>{assert.deepEqual(a,b);checks++;};
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});let rounds=0,passed,faults=[];
try{const {receivingSupportedSchemas}=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),schemas=receivingSupportedSchemas(),byType=new Map(schemas.map(x=>[Number(x.typeId),x]));
 const occupied=new Set(schemas.map(x=>Number(x.typeId))),namespaces=new Set(),members=new Set();
 function scan(v){if(!v||typeof v!=='object')return;for(const [k,n] of Object.entries(v)){if(/namespace/i.test(k)&&Number.isInteger(n))namespaces.add(n);if(k==='typeId'&&Number.isInteger(n))occupied.add(n);}const ns=v.namespace??v.namespaceId??v.requiredNamespace;if(Number.isInteger(ns)&&typeof v.payload==='string')members.add(ns+'/'+v.payload);for(const x of Object.values(v))scan(x);}
 for(const f of a.priorAllocations){equal(fp(f.path),f);scan(read(f.path));}
 function audit(x,checkMarkdown=false){
  equal(x.records.length,Object.keys(s.records).length);equal(x.records.map(r=>r.name),Object.keys(s.records));
  const map=new Map(x.records.map(r=>[r.name,r]));const row=n=>typeof n==='number'||/^\d+$/.test(n)?byType.get(Number(n)):map.get(n);const type=n=>Number(row(n).typeId),field=(n,f)=>Number(row(n).fields.find(x=>x.name===f).id);
  for(const [i,r] of x.records.entries()){equal(r.typeId,516+i);assert(!occupied.has(r.typeId));equal(r.schemaVersion,1);equal(r.fields.length,s.records[r.name].length);for(const [j,f] of r.fields.entries()){const source=s.records[r.name][j],optional=source.type.startsWith('optional<');equal(f,{id:j+1,name:source.name,type:optional?source.type.slice(9,-1):source.type,required:!optional});}if(checkMarkdown){assert(markdown.includes(`|${r.typeId}/1|${r.name}|${r.fields.map(f=>`${f.id} ${f.name}${f.required?'':'?'}`).join('; ')}|`));checks++;}}
  equal(x.newNamespaces,[{family:'SelectionOccurrenceId',namespace:1143,payload:'unsigned shared runtime ordinal'},{family:'ProcessingOccurrenceId',namespace:1144,payload:'unsigned shared runtime ordinal'}]);for(const n of x.newNamespaces)assert(!namespaces.has(n.namespace));
  equal(x.identifierAliases,{...s.identityFamilies,SelectionOccurrenceId:1143,ProcessingOccurrenceId:1144});equal(x.members,s.members);
  for(const m of x.members){assert(!members.has(m.namespace+'/'+m.payload));if(checkMarkdown)assert(markdown.includes(`|${m.namespace}|${m.family}|${m.payload}|`));checks++;}
  equal(x.roles,s.roles.map(r=>({recordTypeId:type(r.record),fieldId:field(r.record,r.field),family:r.family,requiredNamespace:x.identifierAliases[r.family],domainValidatorId:null})));
  equal(x.mapKeyRoles,[241,242].map(recordTypeId=>({recordTypeId,fieldId:1,family:'ObserverId',requiredNamespace:1000,domainValidatorId:null,position:'StateMapKey'})));
  equal(x.collectionIdentityChecks,s.collectionChecks.map(r=>({recordTypeId:type(r.record),fieldId:field(r.record,r.field),family:r.family,requiredNamespace:r.namespace,owner:r.owner})));
  const enums=Object.fromEntries(Object.entries(s.enums).map(([n,values])=>[n,values.map((name,i)=>({name:String(name),value:typeof name==='number'?name:i+1}))]));equal(x.finiteEnums,enums);
  const finite=[];for(const r of x.records)for(const f of r.fields){const t=f.type.replace(/^(set|list[^<]*)</,'').replace(/>$/,'');if(enums[t])finite.push({recordTypeId:r.typeId,fieldId:f.id,container:f.type===t?'scalar':f.type.startsWith('set<')?'set':'list',enum:t});}equal(x.finiteFields,finite);
  const unions=s.unions.flatMap(u=>u.variants.map(v=>({recordTypeId:type(u.record),tag:enums[s.records[u.record].find(f=>f.name===u.tagField).type].find(t=>t.name===v.tag).value,name:v.tag,tagFieldId:field(u.record,u.tagField),requiredPayloadFieldIds:v.required.map(n=>field(u.record,n)),forbiddenPayloadFieldIds:v.forbidden.map(n=>field(u.record,n))})));equal(x.unionDefinitions,unions);
  equal(x.unionMembers,unions.map(u=>({namespace:1024,payload:[u.recordTypeId,u.tag],encoding:'list<unsigned,unsigned>'})));if(checkMarkdown)for(const m of x.unionMembers)assert(markdown.includes(`(${m.payload.join(',')})`));
  equal(x.occurrenceIdentities,s.occurrenceRules.map(r=>{const role=x.roles.find(q=>q.recordTypeId===type(r.record)&&q.fieldId===field(r.record,r.field));assert(role);assert(row(r.record).fields.find(f=>Number(f.id)===role.fieldId).required);return {recordTypeId:role.recordTypeId,schemaVersion:1,fieldId:role.fieldId,family:role.family,requiredNamespace:role.requiredNamespace};}));
 }
 audit(a,true);passed=checks;
 for(const [name,mutate] of [['record collision',x=>x.records[0].typeId=515],['namespace reuse',x=>x.newNamespaces[0].namespace=1142],['field renumbering',x=>x.records[0].fields[0].id=2],['optional made required',x=>x.records.find(r=>r.name==='AttentionSelectionSource').fields[1].required=true],['capacity shifted',x=>x.finiteEnums.capacity[0].value=1],['member omitted',x=>x.members.pop()],['union operand dropped',x=>x.unionDefinitions[0].forbiddenPayloadFieldIds=[]],['role misnamespace',x=>x.roles[0].requiredNamespace=1002],['map key validator smuggled',x=>x.mapKeyRoles[0].domainValidatorId='validator/character-qualification'],['collection namespace swapped',x=>x.collectionIdentityChecks[0].requiredNamespace=1000],['wrong detection occurrence field',x=>x.occurrenceIdentities.find(r=>r.recordTypeId===214).fieldId=1]]){const x=structuredClone(a);mutate(x);assert.throws(()=>audit(x));faults.push(name);}
 const registry=new c.RecordSchemaRegistry(schemas),rec=(t,values)=>c.record(byType.get(t),new Map(values.map((v,i)=>[BigInt(i+1),v]))),u=n=>c.unsigned(BigInt(n));
 const round=v=>{const bytes=c.canonicalEncode(v);assert.deepEqual(c.canonicalEncode(c.canonicalDecode(bytes,registry)),bytes);rounds++;};
 const role=r=>rec(263,[u(r.requiredNamespace)]);
 for(const r of a.roles){const position=c.record(byType.get(264),new Map([[1n,u(1)],[2n,u(r.recordTypeId)],[4n,u(r.fieldId)]]));round(rec(265,[position,role(r)]));}
 for(const r of a.mapKeyRoles){const position=c.record(byType.get(264),new Map([[1n,u(2)],[3n,u(r.recordTypeId)],[4n,u(r.fieldId)]]));round(rec(265,[position,role(r)]));}
 for(const r of a.occurrenceIdentities)round(rec(278,[u(r.fieldId),role(r)]));
 for(const r of a.unionDefinitions)round(rec(259,[u(r.recordTypeId),u(r.tag),c.set(r.requiredPayloadFieldIds.map(u)),c.set(r.forbiddenPayloadFieldIds.map(u))]));
 for(const m of a.members)round(c.typedIdentifier(BigInt(m.namespace),c.text(m.payload)));
 for(const m of a.unionMembers)round(c.typedIdentifier(1024n,c.list(m.payload.map(u))));
}finally{await server.close();}
equal(fp(a.sourceManifest.path),a.sourceManifest);equal(fp(a.symbolicInput.path),a.symbolicInput);for(const f of a.priorAllocations)equal(fp(f.path),f);
const old=read('docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.json'),preserved=[...old.evidence,...old.verifiedFingerprints,old.script];for(const f of preserved)equal(fp(f.path),f);
fs.writeFileSync(output,JSON.stringify({status:'NUMERIC REVIEW PASS; NOT YET PERMANENT',parityChecks:passed,negativeControls:faults,canonicalDeclarationRoundTrips:rounds,preservedEMBFingerprints:preserved.length,reviewedArtifacts:[draftPath,'docs/planning/ATTENTION_ALLOCATION_DRAFT.md',a.sourceManifest.path,a.symbolicInput.path,'scripts/prepare-attention-allocation.mjs','scripts/review-attention-allocation.mjs'].map(fp),priorAllocations:a.priorAllocations,limits:['No runtime codec, model commitment or AT2 control is qualified.','New namespace values remain proposals until the separate freeze.']},null,2)+'\n');console.log({parityChecks:passed,negativeControls:faults.length,roundTrips:rounds,preserved:preserved.length});
