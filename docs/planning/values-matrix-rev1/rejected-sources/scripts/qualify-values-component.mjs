import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const dir='docs/planning/values-matrix-rev1';fs.mkdirSync(dir,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/valuesComponent.ts'),receiving=await server.ssrLoadModule('/src/campaign3/valuesReceiving.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),d=await server.ssrLoadModule('/src/campaign3/biologyPublicData.ts');
 const names=['Positive','Withheld','Unlinked','Neutral','Contradiction','Reversal','TargetB','Duplicate'];
 function receipts(name){let xs=Array.from({length:name==='Reversal'?8:name==='Contradiction'?4:3},(_,i)=>({instant:i+1,id:i+1,category:name==='Unlinked'?null:'Care',target:name==='TargetB'?'B':'A',outcome:name==='Withheld'?null:name==='Neutral'?0:i<3?1:-1}));if(name==='Duplicate')xs.push({...xs[2]});return xs;}
 const contexts=[{mode:'ValuesOnly',currentNeed:0,goal:1,linked:true},{mode:'NeedOnly',currentNeed:0,goal:1,linked:true},{mode:'NeedOnly',currentNeed:1,goal:1,linked:true},{mode:'Joint',currentNeed:1,goal:1,linked:true},{mode:'ValuesOnly',currentNeed:0,goal:0,linked:true},{mode:'ValuesOnly',currentNeed:0,goal:1,linked:false}];
 const graph=new Set();function visit(f){f=f.replaceAll('\\','/');if(graph.has(f))return;graph.add(f);if(!f.endsWith('.ts'))return;for(const hit of fs.readFileSync(f,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const base=path.resolve(path.dirname(f),hit[1].split('?')[0]),found=[base,base+'.ts',base+'.json',path.join(base,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(found,`${f}: ${hit[1]}`);visit(path.relative(process.cwd(),found));}}
 ['src/campaign3/valuesComponent.ts','src/campaign3/valuesReceiving.ts','src/test/valuesComponent.test.ts','src/test/valuesReceiving.test.ts','src/substrate/identity.ts'].forEach(visit);
 ['scripts/qualify-values-component.mjs','docs/formal/VALUES_COMPONENT_CONTRACT.md'].forEach(f=>graph.add(f));
 const artifacts=[...graph].sort().map(path=>({path,sha256:sha(fs.readFileSync(path))}));
 const modelBindings=[];
 for(const law of m.VALUE_LAWS)modelBindings.push(await ids.createModelIdentity({rulesVersion:m.VALUES_VERSION,contentSchemaVersion:m.VALUES_VERSION,contentManifest:await ids.commitManifest(d.data({category:'Care',channel:'controlled-admitted-outcome',receiver:'two inherited task carriers; goal0/quarter; complete evidence overlap',artifacts})),parameterSchemaVersion:m.VALUES_VERSION,parameterSet:await ids.commitManifest(d.data({law})),numericProfileVersion:'exact-rational/values-0.1',randomAlgorithmVersion:'values-probe-seed-routed-cognitive-sha256/0.1',registrySchemaVersion:m.VALUES_VERSION,registryManifest:await ids.commitManifest(d.data({owner:'component consolidation',native:false,phase:140,consumption:'strictly later'}))}));
 const models=modelBindings.map((b,i)=>({law:m.VALUE_LAWS[i],identity:hex(b.canonicalBytes)})),runs=[],runBindings=[];
 for(let model=0;model<models.length;model++)for(const name of names)for(let seed=0;seed<8;seed++){
  const originals=receipts(name),inputs={originals,seed,contexts,gapInstant:65},binding=await ids.createRunIdentity({modelIdentity:modelBindings[model],initialState:await ids.commitManifest(c.bytes(m.createValuesOwner(models[model].law).save())),orderedInputSequence:await ids.commitManifest(d.data(inputs)),runSeed:new Uint8Array(32).fill(seed)});
  runBindings.push(binding);runs.push({index:runs.length,model,name,seed,originals,runIdentity:hex(binding.canonicalBytes),inputsSha256:sha(c.canonicalEncode(d.data(inputs)))});
 }
 const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VALUES_VERSION,'values-matrix/0.1'),comparison=await ids.createComparisonCase(modelBindings,runBindings,c.text('Eight seeds retained. Same safe receipts and addressed probes across laws. Every original prefix restores and receives one successor; terminal receives gap probe. Complete contexts at final state. No physical simulator or native scheduler.'));
 const expected={status:'FROZEN BEFORE EXECUTION',models,runs,contexts,artifacts,experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),prefixes:runs.reduce((n,r)=>n+r.originals.length+1,0)};
 const planFile=dir+'/plan.json';
 if(process.argv.includes('--freeze')){write(planFile,expected);console.log(`FROZEN ${models.length} models/${runs.length} runs/${expected.prefixes} prefixes`);}
 else{
  const plan=JSON.parse(fs.readFileSync(planFile));assert.deepEqual(plan,expected,'frozen source or identity mismatch');
  const part=Number(process.argv.find(x=>x.startsWith('--part='))?.split('=')[1]??0);assert(Number.isInteger(part)&&part>=0&&part<4);
  const probe=async(owner,instant,seed,context)=>{const x=await receiving.receiveValues(owner,{instant,seed,...context});return {view:x.view,contribution:x.contribution,chosen:x.chosen,probabilities:x.probabilities,addresses:x.addresses,reason:hex(c.canonicalEncode(x.reason)),resolution:hex(c.canonicalEncode(x.resolution))};};
  for(const row of plan.runs.filter(r=>r.model===part)){
   const file=`${dir}/run-${row.index}.json`;if(fs.existsSync(file))throw Error(`Existing receipt: ${file}`);
   try{
    const law=plan.models[row.model].law,owner=m.createValuesOwner(law),saves=[owner.save()];for(const x of row.originals){owner.admit(x);saves.push(owner.save());}
    const prefixes=[];
    for(let prefix=0;prefix<saves.length;prefix++){
     const restored=m.restoreValuesPrefix(law,row.originals,prefix,saves[prefix]),fresh=m.createValuesOwner(law);row.originals.slice(0,prefix).forEach(x=>fresh.admit(x));
     assert.deepEqual(restored.save(),fresh.save());
     const instant=prefix?row.originals[prefix-1].instant+1:1,baseline=await probe(fresh,instant,row.seed,contexts[0]);assert.deepEqual(await probe(restored,instant,row.seed,contexts[0]),baseline);
     let successor;
     if(prefix<row.originals.length){const x=row.originals[prefix],before=restored.save();if(!restored.history().some(y=>y.id===x.id)){assert.throws(()=>restored.admit(x,true),/INJECTED/);assert.deepEqual(restored.save(),before);}restored.admit(x);assert.deepEqual(restored.save(),saves[prefix+1]);const next=m.restoreValuesPrefix(law,row.originals,prefix+1,saves[prefix+1]);successor=await probe(restored,x.instant+1,row.seed,contexts[0]);assert.deepEqual(successor,await probe(next,x.instant+1,row.seed,contexts[0]));}
     else{successor=await probe(restored,65,row.seed,contexts[0]);assert.deepEqual(successor,await probe(fresh,65,row.seed,contexts[0]));}
     prefixes.push({prefix,save:hex(saves[prefix]),probe:baseline,successor});
    }
    const final=[];for(const ctx of contexts)final.push({context:ctx,result:await probe(owner,65,row.seed,ctx)});
    const forged=m.createValuesOwner(law);for(const x of row.originals)forged.admit(x);let rejection=false;
    if(row.originals.length){const changed=row.originals.map(x=>({...x,target:x.target==='A'?'B':'A'}));try{m.restoreValuesPrefix(law,changed,changed.length,forged.save());}catch{rejection=true;}assert(rejection);}
    write(file,{status:'PASS',index:row.index,runIdentity:row.runIdentity,law,name:row.name,seed:row.seed,prefixes,final,changedOriginalRejected:rejection});
   }catch(e){write(`${dir}/failure-${row.index}.json`,{index:row.index,error:String(e),stack:e.stack});throw e;}
  }
  console.log(`PASS part${part}: ${plan.runs.filter(r=>r.model===part).length} runs`);
 }
}finally{await server.close();}
