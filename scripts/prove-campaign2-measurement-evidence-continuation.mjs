// Cross-process runtime continuation proof under the frozen carriage ModelIdentity.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const hash=s=>crypto.createHash('sha256').update(Buffer.from(s,'hex')).digest('hex');
if(!process.argv.includes('--create')&&!process.argv.includes('--restore')){
 const run=(flag,input)=>{const r=spawnSync(process.execPath,[process.argv[1],flag],{encoding:'utf8',input,windowsHide:true,maxBuffer:16*1024*1024});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);};
 const initial=run('--create'),restored=run('--restore',JSON.stringify(initial));assert.equal(restored.save,initial.expected);
 fs.writeFileSync(new URL('../docs/planning/CAMPAIGN2_MEASUREMENT_EVIDENCE_CONTINUATION_PROOF.json',import.meta.url),JSON.stringify({status:'PASS',scope:'fresh-process restore after carriage, then later authored adaptation; complete canonical save equality',modelDigest:initial.digest,savedSha256:hash(initial.saved),continuedSha256:hash(restored.save),separateProcesses:2},null,2)+'\n');console.log('Fresh-process carriage restore and later adaptation continuation PASS.');
}else{
 const {createServer}=await import('vite');const server=await createServer({server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
 try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{canonicalEncode:enc,list,set,signed,unsigned,text,typedIdentifier}=c;
 const {measurementEvidenceModelSource}=await server.ssrLoadModule('/src/campaign2/measurementModelSource.ts'),{compileMeasurementModel}=await server.ssrLoadModule('/src/campaign2/measurementModel.ts');
 const {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run}=await server.ssrLoadModule('/src/campaign2/factory.ts');
 const {campaign2Record:r}=await server.ssrLoadModule('/src/campaign2/codecs.ts'),{probeRecord}=await server.ssrLoadModule('/src/campaign2/probeCodecs.ts');
 const source=measurementEvidenceModelSource(),compiled=await compileMeasurementModel(source),hex=b=>Buffer.from(b).toString('hex');
 if(process.argv.includes('--create')){
 const exposure=(at,n)=>list([signed(at),unsigned(110),typedIdentifier(1001,text('event/authored-adaptation-fact')),r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:compiled.probe.C,ExposureReferentId:compiled.probe.C,ActualContactCount:unsigned(n)})}),list([])]);
 const probe=list([signed(4),unsigned(110),typedIdentifier(1001,text('event/regulatory-diagnostic-probe')),probeRecord(333,[compiled.probe.definitionId]),list([])]),ordered=enc(list([exposure(2,1),probe,exposure(6,1)]));
 const model=await prepareCampaign2Model(source),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:ordered,runSeed:new Uint8Array(32)});await run.settleNextInstant();await run.settleNextInstant();const saved=hex(run.save());await run.settleNextInstant();console.log(JSON.stringify({digest:hex(compiled.modelIdentity.digest),ordered:hex(ordered),saved,expected:hex(run.save())}));
 }else{
 const data=JSON.parse(fs.readFileSync(0,'utf8')),run=await restoreCampaign2Run(source,{orderedInputs:Uint8Array.from(Buffer.from(data.ordered,'hex')),save:Uint8Array.from(Buffer.from(data.saved,'hex'))});await run.settleNextInstant();console.log(JSON.stringify({save:hex(run.save())}));
 }
 }finally{await server.close();}
}
