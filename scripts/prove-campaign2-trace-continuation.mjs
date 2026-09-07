// Fresh-process FCT-5 continuation witness. Temporary files contain only model sources, original
// input bytes, checkpoint save and an independent comparison result; no initial-state handoff.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createServer} from 'vite';
const root=fileURLToPath(new URL('../',import.meta.url)),self=fileURLToPath(import.meta.url);
const hex=b=>Buffer.from(b).toString('hex'),unhex=s=>new Uint8Array(Buffer.from(s,'hex'));
if(process.argv[2]?.startsWith('--worker-')){
  const dir=process.argv[3],server=await createServer({server:{middlewareMode:true},appType:'custom'});
  const put=(name,value)=>fs.writeFileSync(path.join(dir,name),value),get=name=>fs.readFileSync(path.join(dir,name),'utf8');
  try{
    const factory=await server.ssrLoadModule('/src/campaign2/factory.ts');
    if(process.argv[2]==='--worker-create'){
      const {firstModelCandidate,candidateId:id}=await server.ssrLoadModule('/src/campaign2/firstModelCandidate.ts');
      const {canonicalEncode:enc,list,set,signed,unsigned}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
      const {campaign2Record:r}=await server.ssrLoadModule('/src/campaign2/codecs.ts');
      const {semanticReferentFromAuthoredContent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts');
      const {governedContentDefinitionId}=await server.ssrLoadModule('/src/substrate/contentDefinitionId.ts');
      const {AUTHORED_FACT_EVENT}=await server.ssrLoadModule('/src/campaign2/orderedInputs.ts');
      const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
      const facts=[r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(2)}),r('ProceduralPracticeFact',{CharacterId:character,ProcedureId:id(1034,'procedure/fixture-practice'),CompletedRepetitions:unsigned(3)})];
      const orderedInputs=enc(list(facts.map((Fact,i)=>list([signed(2+2*i),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact}),list([])]))));
      const {firstTraceModel}=await server.ssrLoadModule('/src/campaign2/firstTraceModel.ts');
      const source=firstTraceModel(),model=await factory.prepareCampaign2Model(source);
      const run=await factory.createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)});
      await run.settleNextInstant();put('checkpoint.hex',hex(run.save()));put('inputs.hex',hex(orderedInputs));
      put('model.json',JSON.stringify(Object.fromEntries(Object.entries(source).map(([k,v])=>[k,typeof v==='string'?v:hex(v)]))));
      await run.settleNextInstant();
      const {decodeCampaign2}=await server.ssrLoadModule('/src/campaign2/codecs.ts');
      const trace=decodeCampaign2(run.snapshot().trace);assert.equal(trace.kind,'list');assert.equal(trace.items.length,18);assert(trace.items.every(r=>r.kind==='record'&&r.schema.typeId===160n));
      put('expected.hex',hex(run.save()));
    }else if(process.argv[2]==='--worker-restore'){
      const raw=JSON.parse(get('model.json')),source=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,['content','registry','parameters'].includes(k)?unhex(v):v]));
      const run=await factory.restoreCampaign2Run(source,{orderedInputs:unhex(get('inputs.hex')),save:unhex(get('checkpoint.hex'))});
      assert.equal(hex(run.save()),get('checkpoint.hex'),'restored checkpoint round trip');
      await run.settleNextInstant();put('actual.hex',hex(run.save()));
    }else throw Error('unknown worker mode');
  }finally{await server.close();}
}else{
  const temporaryRoot=path.resolve(os.tmpdir()),dir=fs.mkdtempSync(path.join(temporaryRoot,'characterlab-fct5-'));
  assert.equal(path.dirname(path.resolve(dir)),temporaryRoot);
  const files=['checkpoint.hex','inputs.hex','model.json','expected.hex','actual.hex'];
  try{
    for(const mode of ['--worker-create','--worker-restore'])execFileSync(process.execPath,[self,mode,dir],{cwd:root,stdio:'pipe',windowsHide:true});
    const expected=fs.readFileSync(path.join(dir,'expected.hex'),'utf8'),actual=fs.readFileSync(path.join(dir,'actual.hex'),'utf8');assert.equal(actual,expected,'full final save equality');
    const report={status:'PASS',control:'TRACE-C2-H fresh-process complete trace continuation',processes:2,originalInitialStateTransferred:false,
      committedTraceRecords:18,checkpointRoundTrip:'byte-identical',continuedFullSave:'byte-identical',finalSaveBytes:actual.length/2,
      finalSaveSha256:crypto.createHash('sha256').update(Buffer.from(actual,'hex')).digest('hex'),
      scope:'Complete 0.2 trace/save continuation; independent FCT-6 and whole qualification remain separate.'};
    fs.writeFileSync(path.join(root,'docs/planning/CAMPAIGN2_TRACE_CONTINUATION_PROOF.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
  }finally{
    for(const name of files){const target=path.resolve(dir,name);assert.equal(path.dirname(target),path.resolve(dir));if(fs.existsSync(target))fs.unlinkSync(target);}
    fs.rmdirSync(dir); // Exact newly-created, now-empty directory; never a recursive removal.
  }
}
