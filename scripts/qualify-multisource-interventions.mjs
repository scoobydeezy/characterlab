/** Matched public interventions, using frozen models and frozen run inputs. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const destination='docs/planning/MULTISOURCE_PUBLIC_INTERVENTIONS_REV1.json';assert(!fs.existsSync(destination));
const freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-multisource-model-rev2/FREEZE.json','utf8')),server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'}),hash=b=>createHash('sha256').update(b).digest('hex');
try{
 const {prepareMultisourceModel,createMultisourceRun,restoreMultisourceRun}=await server.ssrLoadModule('/src/campaign3/multisourceFactory.ts');
 const {decodeMultisource:decode}=await server.ssrLoadModule('/src/campaign3/multisourcePublicCodecs.ts');
 const {generalAttentionRecord:ga}=await server.ssrLoadModule('/src/campaign3/generalAttentionCodecs.ts');
 const {receivingRecord:old}=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts');
 const {canonicalEncode:enc,list,signed,unsigned:u,rational,typedIdentifier,text}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {AuthoritativeState,restoreAuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts');
 const f=(r,n)=>r.fields.get(BigInt(n)),key=v=>Buffer.from(enc(v)).toString('hex'),q=v=>v.numerator+'/'+v.denominator;
 const results=[];
 async function run(name,imageName,intervention){
  const image=freeze.models.find(x=>x.name===imageName),load=name=>new Uint8Array(Buffer.from(fs.readFileSync(image.files.find(f=>f.path.endsWith('/'+name+'.cenc.hex')).path,'utf8').trim(),'hex'));
  const source={...freeze.versions,content:load('content'),registry:load('registry'),parameters:load('parameters')},profile=decode(source.parameters),baseState=restoreAuthoritativeState(decode(load('initial-state'))),baseInputs=decode(load('ordered-inputs'));
  const changed=intervention({profile,state:baseState,inputs:baseInputs}),initialState=enc(changed.state.canonicalValue()),orderedInputs=enc(changed.inputs),model=await prepareMultisourceModel(source),run=await createMultisourceRun(model,{initialState,orderedInputs,runSeed:new Uint8Array(32).fill(7)});
  while(await run.settleNextInstant()){}const save=run.save(),restored=await restoreMultisourceRun(source,{initialState,orderedInputs,save});assert.deepEqual(save,restored.save());
  const outputs=decode(run.snapshot().outputs).items,ofType=t=>outputs.filter(v=>v.schema?.typeId===BigInt(t));
  const result={name,imageName,modelIdentity:image.modelIdentity,initialState:key(changed.state.canonicalValue()),orderedInputs:key(changed.inputs),runSeed:Buffer.from(new Uint8Array(32).fill(7)).toString('hex'),runIdentity:Buffer.from(run.runIdentity()).toString('hex'),wholePrefixRestore:true,saveSha256:hash(save),outputsSha256:hash(run.snapshot().outputs),firstRawSha256:hash(enc(ofType(722)[0])),reasonCounts:ofType(726).map(v=>f(v,3).items.length),probabilities:ofType(728).map(v=>f(v,6).items.map(p=>({option:f(f(p,1),2).payload.value,probability:q(f(p,2))}))),assessments:ofType(719).map(v=>f(v,3).items.map(a=>({description:f(a,1).payload.value,kind:Number(f(a,2).value),strength:f(a,4)?q(f(a,4)):null}))),replenishments:ofType(652).length};
  results.push(result);console.log('Matched intervention: '+name);return result;
 }
 const noTaskA=({profile,state,inputs})=>{const task=f(f(profile,3).items[0],1);return {state:new AuthoritativeState(state.entries().filter(e=>e.path.rootStateTypeId!==373n||key(e.path.selectors[0].key)!==key(task))),inputs};};
 for(const c of ['duplicate','aggregate']){const reference=await run(c+'-matched-aggregate',c+'--GroundAggregate',noTaskA),dice=await run(c+'-matched-description-dice',c+'--DescriptionDice',noTaskA);assert.equal(reference.firstRawSha256,dice.firstRawSha256);assert.notEqual(reference.reasonCounts[0],dice.reasonCounts[0]);assert.notDeepEqual(reference.probabilities[0],dice.probabilities[0]);}
 const hidden=[];for(const amount of [21,29])hidden.push(await run('hidden-'+amount,'shared--GroundAggregate',({state,inputs})=>({state:new AuthoritativeState(state.entries().map(e=>e.path.rootStateTypeId===649n?{path:e.path,value:old(454,[rational(amount,1),signed(0)])}:e)),inputs})));assert.equal(hidden[0].outputsSha256,hidden[1].outputsSha256);
 const replenished=await run('independent-B-replenishment','independent--GroundAggregate',({profile,state,inputs})=>({state,inputs:list([inputs.items[0],list([signed(50),u(110),typedIdentifier(1001,text('event/multisource/replenish')),ga('LocalReserveReplenishment',[f(f(profile,5).items[1],1),rational(30,1)]),list([])]),inputs.items[1]])}));
 const strength=(time,suffix)=>replenished.assessments[time].find(a=>a.description.endsWith(suffix)).strength;assert.equal(strength(0,'body-a'),strength(1,'body-a'));assert.notEqual(strength(0,'task-situation'),strength(1,'task-situation'));assert.equal(replenished.replenishments,1);
 fs.writeFileSync(destination,JSON.stringify({date:'2026-09-20',scope:'Seven public runs; exact raw-byte equality for both matched DescriptionDice contrasts; hidden-bin equality; independent owned replenishment; full-prefix restore for each; all input bytes frozen here.',runs:results.length,prefixRestores:results.length,results},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
