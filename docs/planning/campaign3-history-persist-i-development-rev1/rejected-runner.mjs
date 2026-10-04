// Original PERSIST-I: isolated supported-module graphs, unchanged non-admitting model.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {cognitiveDeclarationTools} from './cognitive-model-declarations.mjs';
const out='docs/planning/campaign3-history-persist-i-rev1';
fs.mkdirSync(out,{recursive:true});
assert(!fs.existsSync(out+'/proof.json'),'use a new revision');
const hash=b=>createHash('sha256').update(b).digest('hex');
function files(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(d+'/'+e.name):[d+'/'+e.name]);}
const paths=[...files('src').filter(p=>p.endsWith('.ts')),'scripts/prove-history-persist-i.mjs','scripts/cognitive-model-declarations.mjs',...files('docs/planning/campaign2-task-cognitive-model')];
const fingerprints=()=>paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),before=fingerprints();
const results=[];
for(const mutant of [null,'src/campaign2/adaptationRuntime.ts','src/campaign2/factory.ts']){
 const pair=[];
 for(const enabled of [false,true]){
  const loaded=new Set();let transformed=0;
  const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},plugins:[{name:'production-cognitive-support-boundary',enforce:'pre',transform(code,id){
   const path=id.replaceAll('\\','/').split('?')[0];
   if(path.includes('/src/'))loaded.add(path.slice(path.indexOf('/src/')+1));
   if(!enabled&&/\/src\/campaign2\/cognitive[^/]*\.ts$/.test(path))throw Error('PERSIST_I_COGNITIVE_SUPPORT_EXCLUDED');
   if(mutant&&path.endsWith('/'+mutant)){
    const site='randomRelevantAuthoritativeIds:()=>list([])';assert.equal(code.split(site).length-1,1);transformed++;
    // Named fault: build capability contaminates a model-local metadata projection.
    return code.replace(site,enabled?"randomRelevantAuthoritativeIds:()=>list([{kind:'unsigned',value:377n}])":site);
   }
  }}]});
  try{
   let capability;
   if(!enabled){
    await assert.rejects(()=>server.ssrLoadModule('/src/campaign2/cognitiveFactory.ts'),/PERSIST_I_COGNITIVE_SUPPORT_EXCLUDED/);
    capability={supported:false,unavailableVerified:true};
   }else{
    const t=await cognitiveDeclarationTools(server),{c,r,id,f}=t,{canonicalEncode:enc,list,set,unsigned:u,signed}=c;
    const {prepareCognitiveModel,createCognitiveRun}=await server.ssrLoadModule('/src/campaign2/cognitiveFactory.ts');
    const {decodeCognitive:decode}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts');
    const {AuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts');
    const {semanticReferentFromAuthoredContent:referent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts');
    const {governedContentDefinitionId:definition}=await server.ssrLoadModule('/src/substrate/contentDefinitionId.ts');
    const C=referent(definition('character/bridge-subject')),observer=id(1000,'observer/bridge-subject');
 function data(){const initial=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:observer}]},value:r(267,[C])},{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r(294,[C,id(1029,'variable/fixture-regulation')])}]},value:r(299,[signed(-50)])},...['a','b'].flatMap((n,i)=>{const key=r(371,[C,referent(definition('content/task-'+n))]);return [{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key}]},value:r(372,[u(1)])},{path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey',key}]},value:r(390,[id(1027,'definition/task-instruction-'+(i?'two':'one'))])}];})]);return {initialState:enc(initial.canonicalValue()),runSeed:new Uint8Array(32),orderedInputs:enc(list([1,2,3,4,5,6].map(at=>{const probe=at===1||at===5;return list([signed(at),u(probe?110:40),id(1001,probe?'event/regulatory-diagnostic-probe':'event/deliberation-opportunity'),probe?r(333,[id(1027,'definition/regulatory-diagnostic-probe')]):r(377,[observer,id(1027,'definition/task-workspace')]),list([])]);}))) };}
    const run=await createCognitiveRun(await prepareCognitiveModel(t.source('baseline')),data());
    await run.settleNextInstant();await run.settleNextInstant();
    const draws=decode(run.snapshot().trace).items.flatMap(v=>f(v,14).items);assert(draws.length>0);
    const {firstTraceModel}=await server.ssrLoadModule('/src/campaign2/firstTraceModel.ts');
    const {prepareCampaign2Model}=await server.ssrLoadModule('/src/campaign2/factory.ts');
    // Both an entire successor packet and its declarations under the old profile reject,
    // before any run is created: rejection also covers an unexercised branch.
    await assert.rejects(()=>prepareCampaign2Model(t.source('baseline')));
    const old=firstTraceModel(),successor=t.source('baseline');
    await assert.rejects(()=>prepareCampaign2Model({...old,registry:successor.registry,content:successor.content,parameters:successor.parameters}));
    capability={supported:true,actualDraws:draws.length,drawBytes:Buffer.from(enc(list(draws))).toString('hex'),oldProfileRejectsSuccessor:true,oldProfileRejectsDeclarations:true};
   }
   const assay=await server.ssrLoadModule('/src/test/fixtures/campaign2BuildMetadata.ts');
   const baseline=await assay.buildMetadata();assert.equal(transformed,mutant?1:0);
   pair.push({enabled,capability,...baseline,loadedModules:[...loaded].sort()});
  }finally{await server.close();}
 }
 const [a,b]=pair;assert.equal(a.model,b.model);assert.equal(a.field9,a.empty);assert.equal(a.restored,a.save);
 if(!mutant){assert.equal(a.save,b.save);assert.equal(b.field9,b.empty);assert.equal(b.restored,b.save);}
 else if(mutant.endsWith('adaptationRuntime.ts')){assert.notEqual(a.save,b.save);assert.notEqual(b.field9,b.empty);assert.equal(b.restored,undefined);}
 else{assert.equal(a.save,b.save);assert.equal(b.field9,b.empty);assert.equal(b.restored,undefined);}
 results.push({mutant,status:mutant?'DETECTED':'PASS',pair});
}
assert.deepEqual(fingerprints(),before);
fs.writeFileSync(out+'/proof.json',JSON.stringify({status:'ORIGINAL PERSIST-I BOUNDED MODULE-GRAPH WITNESS PASS',sourceFingerprints:before,results,limits:[
 'Two isolated Vite module graphs: production cognitive modules explicitly unavailable versus available and executed. Not historical binary reproduction, toolchain equivalence or arbitrary plugin loading.',
 'Same original no-RNG model and empty original-input cohort; exact full canonical model/save/restore bytes compared, not hashes alone.',
 'Actual admitted baseline cognitive draws prove the enabled capability; metadata/old-profile controls remain independent. No new RNG seam, production law, model, allocation or persisted schema.',
 'Two deliberate save/restore build-dependence substitutions, not exhaustive possible build dependencies. Existing successor RNG restore qualification unchanged.'
]},null,2)+'\n');
console.log(JSON.stringify(results.map(x=>({mutant:x.mutant,status:x.status}))));
