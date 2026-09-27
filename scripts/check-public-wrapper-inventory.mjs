import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/public-wrapper-quiescence-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),preserved=read(root+'/PRESERVATION.json'),inventory=read(root+'/INVENTORY.json').inventory,byPath=new Map(preserved.artifacts.map(a=>[a.original,a]));
for(const a of preserved.artifacts)assert.equal(sha(fs.readFileSync(a.archive)),a.sha256,a.archive);
const actual=fs.readdirSync('src/campaign3').filter(n=>n.endsWith('Runtime.ts')&&fs.readFileSync('src/campaign3/'+n,'utf8').includes('createCanonicalSave')).map(n=>'src/campaign3/'+n).sort();assert.deepEqual(actual,inventory.map(r=>r.path));
const raw=['identityTask','identityBiology','biologyPublic'],dispositions=[];
for(const item of inventory){
 const name=item.path.split('/').at(-1).replace('Runtime.ts',''),current=fs.readFileSync(item.path,'utf8'),prior=fs.readFileSync(byPath.get(item.path).archive,'utf8');let classification,reason,probe;
 if(raw.includes(name)){
  const reconstructed=current.replace("import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';\r\n",'').replace("import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';\n",'').replace('return guardPublicWrapperSettlement({settle:()=>settle()','return {settle:()=>settle()').replace('diagnostic:()=>scheduler.failureDiagnostic});','diagnostic:()=>scheduler.failureDiagnostic};');assert.equal(reconstructed,prior);
  const before=read(root+'/'+name+'-probe-rev1.json'),after=read(root+'/'+name+'-probe-rev2.json');assert(before.torn);assert(!after.torn);assert.deepEqual(after.rows.map(r=>r.final),before.rows.map(r=>r.final));assert(after.rows.every(r=>!r.observed.accepted&&!r.observed.snapshotAccepted));
  classification='EXPOSED_REPAIRED';reason='Raw continuation ledger published after scheduler commit; whole-wrapper barrier now rejects save and snapshot through cleanup.';probe=name+'-probe-rev2.json';
 }else if(name==='embodied'){
  const reconstructed=current.replace("import {guardScheduledPublicWrapper} from './scheduledWrapperQuiescence';\r\n",'').replace("import {guardScheduledPublicWrapper} from './scheduledWrapperQuiescence';\n",'').replace('return Object.freeze(guardScheduledPublicWrapper({','return Object.freeze({').replace(/ \}\)\);(\r?\n\}\s*)$/,' });$1');assert.equal(reconstructed,prior);
  const before=read(root+'/embodied-concurrent-rev1.json'),after=read(root+'/embodied-concurrent-rev2.json');assert.equal(before.status,'Failed');assert.equal(after.status,'Active');assert.equal(after.result.accepted,false);assert.match(after.result.error,/not quiescent/);
  classification='EXPOSED_REPAIRED';reason='Second settlement overlapped prior ingress cleanup and failed the run. Whole-wrapper settlement/read barrier repairs lifecycle without changing serial bytes.';probe='embodied-concurrent-rev2.json';
 }else{
  assert.equal(current,prior,item.path);
  if(name==='identityBelief'){
   assert(current.includes('guardIdentityBeliefSettlement'));classification='INDEPENDENTLY_GUARDED';reason='Already-qualified whole-wrapper barrier; prior native belief closure and exact failure/fix receipts preserved.';
  }else if(item.serializedLedger){
   assert(current.includes('random.committedAddressKeys()'));const revision=name==='personstate'?2:1;probe=name+'-probe-rev'+revision+'.json';const result=read(root+'/'+probe);assert.equal(result.status,'PROBED');assert(!result.torn);const error=name==='multisource'?'MULTISOURCE_RANDOM_STAGE':'random ledger requires quiescence';assert(result.rows.length>0&&result.rows.every(r=>!r.observed.accepted&&r.observed.error.includes(error)),name);
   classification='INDEPENDENTLY_GUARDED';reason=(name==='multisource'?'MultisourceRandomSession':'CognitiveRandomSession')+'.committedAddressKeys rejects while the oracle is live, including scheduler-to-wrapper window. Snapshots that omit the ledger expose only scheduler-committed values.';
  }else if(name==='longitudinal'){
   probe='longitudinal-probe-rev1.json';const result=read(root+'/'+probe);assert(!result.torn);assert(result.rows.every(r=>r.observed.accepted&&r.observed.saveSha256===r.final));classification='INAPPLICABLE_TO_SPLIT_PUBLICATION';reason='Continuation metadata is constant empty; addressed RNG is reconstructed by complete-prefix replay and is not read by public snapshots/save/view. Active settlement guard prevents reuse before cleanup.';
  }else{
   assert(current.includes('continuingRunInputs:list([])'));classification='INAPPLICABLE_TO_SPLIT_PUBLICATION';
   if(name==='attention'){assert(prior.includes('initialQueue:[input.event]'));reason='Exactly one admitted source instant; all saved fields scheduler-owned, empty continuation. During settlement scheduler queue reads reject; after commit the queue is empty, so another call cannot reset live ingress.';}
   else{assert(/if\(active\).*concurrent/.test(current),name);reason='All saved/view state is scheduler-owned; continuation metadata is constant empty. Active wrapper guard rejects overlapping settlement before scratch-state reset.';}
  }
 }
 dispositions.push({path:item.path,classification,reason,sourceSha256:sha(fs.readFileSync(item.path)),preservedSha256:byPath.get(item.path).sha256,...(probe?{probe:root+'/'+probe}: {})});
}
for(const [path,reason]of [
 ['src/campaign3/generalSourceRuntime.ts','Manual Save132 producer used by generalFactory/generalCandidateRun: bookkeeping commits in scheduler adaptation.beforeCommit and cleanup in adaptation.close before the scheduler releases quiescence.'],
 ['src/campaign2/adaptationRuntime.ts','Shared Campaign2 factories: continuation/state bookkeeping is committed and closed inside scheduler adaptation hooks, not in an awaiting outer wrapper.'],
]){assert.equal(sha(fs.readFileSync(path)),byPath.get(path).sha256);dispositions.push({path,classification:'INDEPENDENTLY_GUARDED',reason,sourceSha256:byPath.get(path).sha256});}
const scheduler=fs.readFileSync('src/substrate/scheduler.ts','utf8');assert(scheduler.includes('this.#adaptation?.close();'));assert(scheduler.indexOf('this.#adaptation?.close();')<scheduler.lastIndexOf('this.#isSettling = false;'));
const session=fs.readFileSync('src/campaign2/cognitiveArbitration.ts','utf8');assert(session.includes("committedAddressKeys(){if(oracle)stage('random ledger requires quiescence')"));
const result={status:'PASS',scope:'47 native Campaign3 wrappers plus GA manual Save132 and Campaign2 shared adaptation runtime. Data-only native public factory routing; not a psychological qualification.',dispositions,counts:Object.fromEntries([...new Set(dispositions.map(d=>d.classification))].map(c=>[c,dispositions.filter(d=>d.classification===c).length]))};
const out=root+'/INVENTORY_DISPOSITIONS.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),result);console.log('PASS49 producers: '+JSON.stringify(result.counts));
