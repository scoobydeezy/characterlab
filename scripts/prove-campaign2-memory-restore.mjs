import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url);
if(!process.argv.includes('--worker')){
 const cases=['real','private','formation-ablated','read-ablated'];
 const checks=[];
 for(const name of cases){
  const first=spawnSync(process.execPath,[new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'),'--worker',name],{encoding:'utf8',maxBuffer:32*1024*1024});assert.equal(first.status,0,first.stderr);
  const second=spawnSync(process.execPath,[new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'),'--worker',name,'--restore'],{input:first.stdout,encoding:'utf8',maxBuffer:32*1024*1024});assert.equal(second.status,0,second.stderr);
  checks.push({name,status:'PASS',scope:'fresh process restores pending association and produces exact continuation save'});
 }
 fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_MEMORY_RESTORE_PROOF.json',root),JSON.stringify({status:'PASS',checks,limitations:['Four exact control specimens; not universal persistence qualification.']},null,2)+'\n');console.log(JSON.stringify({status:'PASS',cases:4}));
}else{
 const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
 try{
  const {canonicalEncode:enc,list,text,typedIdentifier,unsigned:u,signed}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
  const {AuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts');
  const {governedContentDefinitionId}=await server.ssrLoadModule('/src/substrate/contentDefinitionId.ts');
  const {semanticReferentFromAuthoredContent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts');
  const {memoryRecord:r}=await server.ssrLoadModule('/src/campaign2/memoryCodecs.ts');
  const {memoryModelSource,memoryWrapperDeclarations}=await server.ssrLoadModule('/src/campaign2/memoryModelSource.ts');
  const {prepareMemoryModel}=await server.ssrLoadModule('/src/campaign2/memoryFactory.ts');
  const {createMemoryRun,restoreMemoryRun}=await server.ssrLoadModule('/src/campaign2/memoryFactory.ts');
  const id=(n,s)=>typedIdentifier(n,text(s)),mode=process.argv[3],w=memoryWrapperDeclarations(),source=memoryModelSource(true,mode!=='private',mode==='formation-ablated'?w.formationAblated:w.formation,mode==='read-ablated'?w.recallAblated:w.recall);
  const hex=b=>Buffer.from(b).toString('hex'),bytes=h=>Uint8Array.from(Buffer.from(h,'hex'));
  if(process.argv.includes('--restore')){const v=JSON.parse(fs.readFileSync(0,'utf8'));const restored=await restoreMemoryRun(source,{initialState:bytes(v.initialState),orderedInputs:bytes(v.orderedInputs),save:bytes(v.save)});assert.equal(hex(restored.save()),v.save);await restored.settleNextInstant();assert.equal(hex(restored.save()),v.expected);console.log('PASS');}
  else{
   const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject')),initialState=enc(new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])}]).canonicalValue());
   const orderedInputs=enc(list([list([signed(4),u(110),id(1001,'event/regulatory-diagnostic-probe'),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])])]));
   const run=await createMemoryRun(await prepareMemoryModel(source),{initialState,orderedInputs,runSeed:new Uint8Array(32)});await run.settleNextInstant();const save=hex(run.save());await run.settleNextInstant();console.log(JSON.stringify({initialState:hex(initialState),orderedInputs:hex(orderedInputs),save,expected:hex(run.save())}));
  }
 }finally{await server.close();}
}
