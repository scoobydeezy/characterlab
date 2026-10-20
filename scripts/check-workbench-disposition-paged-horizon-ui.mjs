import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-disposition-paged-horizon-ui-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',script='scripts/check-workbench-disposition-paged-horizon-ui.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),hashes=s=>['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>s[k]);
export function verifyHorizonCapture(capture,initial,terminal){
 assert.equal(initial.prefix,1);assert.equal(terminal.prefix,18);assert.equal(terminal.complete,true);assert.equal(terminal.timeline.length,180);
 const original=initial.timeline.find(e=>e.id==='19'),retained=terminal.timeline.find(e=>e.id==='19');assert(original&&retained);assert.equal(retained.output,original.output);
 const options=terminal.timeline.map(e=>({value:e.id,label:`${e.instant} · ${e.stage} · ${e.id}`}));
 for(const [name,currentPage]of [['beforeReload',false],['afterReload',true]]){
  const c=capture[name];assert(c);assert.deepEqual(c.hashes,hashes(terminal));
  assert.equal(c.status[0],'Paged DISPOSITION prefix 18 · Complete');assert.deepEqual(c.alerts,[]);
  assert.equal(c.stepEnabled,false);assert.equal(c.runEnabled,false);assert.equal(c.pauseEnabled,false);assert.equal(c.loadEnabled,true);
  assert.deepEqual(c.events,options);assert.deepEqual(JSON.parse(c.selector),{kind:'event',id:'19',part:'output'});
  assert.equal(c.revision,currentPage?terminal.saveHash:initial.saveHash);assert.equal(c.text,original.output.slice(0,4096));
  assert.equal(c.range,`Offset 0 · ${c.text.length} units · total ${original.output.length}`);
  assert.equal(c.previousEnabled,false);assert.equal(c.nextEnabled,currentPage&&original.output.length>4096);
  if(currentPage)assert.equal(c.status.length,1);else assert.deepEqual(c.status.slice(1),['Historical page retained from an earlier revision. Restore that checkpoint to continue its pages, or load the selection at the current revision.']);
 }
}
function checkParents(){
 const freeze=read(root+'/freeze.json');for(const parent of freeze.parents)assert.equal(sha(fs.readFileSync(parent.path)),parent.sha256,parent.path);
 const ui=read(freeze.parents[0].path);assert.equal(sha(fs.readFileSync(ui.parent.path)),ui.parent.sha256);
 for(const s of [...ui.sources,...read(ui.parent.path).sources])assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 return freeze;
}
if(process.argv.includes('--self-test')){
 // Synthetic verifier controls only; these never create a browser qualification receipt.
 const initial={prefix:1,saveHash:'initial',timeline:[{id:'19',output:'x'.repeat(5000)}]},terminal={prefix:18,complete:true,modelHash:'model',runHash:'run',stateHash:'state',saveHash:'terminal',projectionHash:'projection',timeline:Array.from({length:180},(_,i)=>({id:String(i+10),instant:String(Math.floor(i/10)+1),stage:'fixture',output:'x'.repeat(5000)}))};
 const capture={};for(const [name,current]of [['beforeReload',false],['afterReload',true]])capture[name]={hashes:hashes(terminal),status:['Paged DISPOSITION prefix 18 · Complete',...current?[]:['Historical page retained from an earlier revision. Restore that checkpoint to continue its pages, or load the selection at the current revision.']],alerts:[],stepEnabled:false,runEnabled:false,pauseEnabled:false,loadEnabled:true,events:terminal.timeline.map(e=>({value:e.id,label:`${e.instant} · ${e.stage} · ${e.id}`})),selector:'{"kind":"event","id":"19","part":"output"}',revision:current?'terminal':'initial',text:'x'.repeat(4096),range:'Offset 0 · 4096 units · total 5000',previousEnabled:false,nextEnabled:current};
 verifyHorizonCapture(capture,initial,terminal);
 const changes=[c=>c.beforeReload.hashes[3]='wrong',c=>c.beforeReload.revision='terminal',c=>c.beforeReload.text='wrong',c=>c.beforeReload.nextEnabled=true,c=>c.beforeReload.events.pop(),c=>c.beforeReload.events[0].label='wrong',c=>c.beforeReload.status[0]='Paged DISPOSITION prefix 17 · Working',c=>c.afterReload.revision='initial',c=>c.afterReload.stepEnabled=true,c=>c.afterReload.alerts.push('failure'),c=>c.afterReload.selector='{"kind":"projection"}',c=>c.afterReload.status.push('stale')];
 for(const mutate of changes){const c=structuredClone(capture);mutate(c);assert.throws(()=>verifyHorizonCapture(c,initial,terminal));}
 console.log(`PASS verifier self-test: one synthetic valid capture and ${changes.length} rejecting controls; NO browser qualification`);
}else if(process.argv.includes('--prepare')){
 checkParents();const inputs=[root+'/freeze.json',root+'/start.json',prior+'/receipt.json','docs/planning/workbench-disposition-paged-rev1/receipt.json','docs/planning/workbench-disposition-paged-rev1/verification.json'];
 fs.writeFileSync(root+'/verifier-freeze.json',JSON.stringify({status:'PREPARED; TERMINAL BROWSER CAPTURE REQUIRED',verifier:{path:script,sha256:sha(fs.readFileSync(script))},inputs:inputs.map(path=>({path,sha256:sha(fs.readFileSync(path))}))},null,2)+'\n',{flag:'wx'});console.log('Prepared terminal verifier; no browser PASS');
}else{
 const frozen=read(root+'/verifier-freeze.json');assert.equal(sha(fs.readFileSync(script)),frozen.verifier.sha256);for(const input of frozen.inputs)assert.equal(sha(fs.readFileSync(input.path)),input.sha256,input.path);checkParents();
 const archive=new Map(read(prior+'/receipt.json').artifacts.map(a=>[a.path,a.sha256]));
 const snapshot=prefix=>{const name=`snapshot-0-${prefix}.json.gz`,bytes=fs.readFileSync(prior+'/'+name);assert.equal(sha(bytes),archive.get(name),name);return JSON.parse(gunzipSync(bytes));};
 const initial=snapshot(1),terminal=snapshot(18),capture=read(root+'/browser.json');verifyHorizonCapture(capture,initial,terminal);
 const start=read(root+'/start.json');assert.deepEqual(start.hashes,hashes(initial));assert.equal(start.retainedPage.revision,initial.saveHash);assert.equal(start.retainedPage.text,initial.timeline.find(e=>e.id==='19').output.slice(0,4096));
 const artifacts=['browser.json','complete.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}));
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BASELINE PAGED BROWSER TERMINAL',program:'Plastic/Main',startPrefix:1,terminalPrefix:18,events:180,artifacts,verifier:frozen,scope:'Browser continued restored1 to complete18. All five terminal identities and180 option headers match authenticated original. Prefix1 event19 output page retains original revision with paging disabled; explicit reload at18 returns identical exact text with terminal revision and paging enabled. No alerts and no further advance controls. Native19-prefix audit is separate supporting evidence. No all-program, six-mode, terminal checkpoint restore, complete-text paging, heap or latency qualification.'},null,2)+'\n',{flag:'wx'});console.log('PASS baseline paged browser terminal');
}
