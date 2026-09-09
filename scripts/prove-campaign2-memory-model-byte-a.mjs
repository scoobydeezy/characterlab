import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),folder='docs/planning/campaign2-measurement-memory-model/';
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const controls=JSON.parse(read(folder+'CONTROL_COMMITMENTS.json')),freeze=JSON.parse(read(folder+'FREEZE.json'));
for(const f of freeze.files)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(folder+f.name,root))).digest('hex'),f.sha256);
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const {memoryModelSource,memoryWrapperDeclarations,MEMORY_BUNDLE}=await server.ssrLoadModule('/src/campaign2/memoryModelSource.ts');
 const {prepareMemoryModel,memoryModelIdentity}=await server.ssrLoadModule('/src/campaign2/memoryFactory.ts');
 const {compileMemoryModel}=await server.ssrLoadModule('/src/campaign2/memoryModel.ts');
 const {decodeMemory}=await server.ssrLoadModule('/src/campaign2/memoryCodecs.ts');
 const {canonicalEncode:enc,list,set,record,unsigned:u}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {AuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts');
 const w=memoryWrapperDeclarations(),results=[];
 for(const control of controls){const source=memoryModelSource(control.a,control.p,control.F?w.formation:w.formationAblated,control.R?w.recall:w.recallAblated);assert.equal(Buffer.from(source.registry).toString('hex'),control.registryHex);const handle=await prepareMemoryModel(source);assert.equal(Buffer.from(memoryModelIdentity(handle)).toString('hex'),control.modelIdentityHex);results.push({a:control.a,p:control.p,F:control.F,R:control.R,digest:control.modelDigest,status:'PASS'});}
 const source=memoryModelSource(),compiled=await compileMemoryModel(source);assert.equal(compiled.stateModel.declaredFamilies().length,7); // six writable + IDN read-only
 compiled.stateModel.validateState(new AuthoritativeState([]));
 assert.equal(MEMORY_BUNDLE.length,41);
 const slots=decodeMemory(source.registry).items,field=(v,n)=>v.fields.get(BigInt(n));
 const replace=(v,n,x)=>record(v.schema,new Map([...v.fields].map(([k,a])=>[k,k===BigInt(n)?x:a])));
 const row=(name,fn)=>({...source,registry:enc(list([set(slots[0].items.map(v=>v.kind==='record'&&v.schema.typeId===171n&&field(v,1).payload?.value===name?fn(v):v)),...slots.slice(1)]))});
 const checks=[];async function reject(name,value){await assert.rejects(()=>prepareMemoryModel(value));checks.push({name,status:'PASS'});}
 await reject('static binding injection',{...source,staticBindings:[]});
 await reject('wrong profile',{...source,registrySchemaVersion:'campaign2-registry/0.1-candidate'});
 await reject('bare registration',row('MemoryFormationTransition',v=>replace(v,4,field(field(v,4),1))));
 await reject('wrong wrapper',row('MemoryFormationTransition',v=>replace(v,4,w.recall)));
 await reject('anonymous list',row('MemoryFormationTransition',v=>replace(v,4,list([field(field(v,4),1),set([])]))));
 await reject('missing requirement',row('MeasurementRecallTransition',v=>replace(v,4,replace(field(v,4),3,set([])))));
 const rolePos=v=>field(v,1),isIDN=v=>field(rolePos(v),1)?.value===2n&&field(rolePos(v),3)?.value===268n;
 await reject('missing IDN role',{...source,registry:enc(list([...slots.slice(0,5),set(slots[5].items.filter(v=>!isIDN(v)))]))});
 await reject('wrong IDN namespace',{...source,registry:enc(list([...slots.slice(0,5),set(slots[5].items.map(v=>isIDN(v)?replace(v,2,replace(field(v,2),1,u(1002))):v))]))});
 let invoked=false;const accessor={...source};Object.defineProperty(accessor,'registry',{enumerable:true,get(){invoked=true;return source.registry;}});await reject('accessor input',accessor);assert.equal(invoked,false);
 const pendingSource={...source,registry:source.registry.slice()},pending=prepareMemoryModel(pendingSource);pendingSource.registry.fill(0);assert.equal(Buffer.from(memoryModelIdentity(await pending)).toString('hex'),read(folder+'model-identity.cenc.hex').trim());
 assert.throws(()=>memoryModelIdentity({}));const bytes=memoryModelIdentity(await prepareMemoryModel(source));bytes.fill(0);assert.equal(Buffer.from(memoryModelIdentity(await prepareMemoryModel(source))).toString('hex'),read(folder+'model-identity.cenc.hex').trim());
 const report={status:'PASS',scope:'production frozen-byte model preparation; complete successor VAL/state declaration closure; no behavior/runtime qualification',referenceDigest:freeze.referenceDigest,models:results,checks,fullStateFamilies:{writable:6,readOnly:1},staticBindings:'caller injection rejected',limitations:['create/run/restore memory behavior not exercised','MEMR-A..P remain NOT PASSED','MEM-PACK-A..G not wholesale promoted']};
 fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_MEMORY_MODEL_BYTE_A_PROOF.json',root),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:'PASS',models:results.length,negatives:checks.length,referenceDigest:freeze.referenceDigest}));
}finally{await server.close();}
