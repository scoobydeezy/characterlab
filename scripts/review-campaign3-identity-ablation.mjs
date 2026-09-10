// Generated public-run cohort evidence, not a whole Campaign-2 verdict.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {cognitiveDeclarationTools} from './cognitive-model-declarations.mjs';
const output='docs/planning/CAMPAIGN3_IDENTITY_ABLATION_REVIEW_REV1.json';
assert(!fs.existsSync(output),'preserve existing evidence; issue a new revision');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(dir+'/'+e.name):[dir+'/'+e.name]);}
const paths=[...files('src').filter(p=>p.endsWith('.ts')),'scripts/review-campaign3-identity-ablation.mjs','scripts/cognitive-model-declarations.mjs','docs/planning/campaign2-task-cognitive-model/FREEZE.json'];
const fingerprint=()=>paths.map(path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')})),before=fingerprint();
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const t=await cognitiveDeclarationTools(server),{c,r,id,f}=t,{canonicalEncode:enc,list,set,unsigned:u,signed}=c;
 const {prepareCognitiveModel,createCognitiveRun}=await server.ssrLoadModule('/src/campaign2/cognitiveFactory.ts');
 const {decodeCognitive:decode}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts');
 const {AuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {semanticReferentFromAuthoredContent:referent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts');
 const {governedContentDefinitionId:definition}=await server.ssrLoadModule('/src/substrate/contentDefinitionId.ts');
 const C=referent(definition('character/bridge-subject')),observer=id(1000,'observer/bridge-subject');
 function data(){const initial=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:observer}]},value:r(267,[C])},{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r(294,[C,id(1029,'variable/fixture-regulation')])}]},value:r(299,[signed(-50)])},...['a','b'].flatMap((n,i)=>{const key=r(371,[C,referent(definition('content/task-'+n))]);return [{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key}]},value:r(372,[u(1)])},{path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey',key}]},value:r(390,[id(1027,'definition/task-instruction-'+(i?'two':'one'))])}];})]);return {initialState:enc(initial.canonicalValue()),runSeed:new Uint8Array(32),orderedInputs:enc(list([1,2,3,4,5,6].map(at=>{const probe=at===1||at===5;return list([signed(at),u(probe?110:40),id(1001,probe?'event/regulatory-diagnostic-probe':'event/deliberation-opportunity'),probe?r(333,[id(1027,'definition/regulatory-diagnostic-probe')]):r(377,[observer,id(1027,'definition/task-workspace')]),list([])]);}))) };}
 const math=await server.ssrLoadModule('/src/campaign2/cognitiveMath.ts');
 const {ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const encode=v=>Buffer.from(enc(v)).toString('hex');
 const row=(source,type)=>t.decode(source.registry).items[0].items.map(v=>f(v,4)).find(v=>v.schema?.typeId===BigInt(type));
 const base=t.source(),off=t.source('standing-access-off');assert.deepEqual(base.content,off.content);assert.deepEqual(base.parameters,off.parameters);
 const normalize=v=>{if(v?.kind==='record'){const fields=new Map([...v.fields].map(([k,x])=>[k,normalize(x)]));if(v.schema.typeId===436n)fields.set(1n,true);return c.record(v.schema,fields);}if(v?.kind==='list'||v?.kind==='set')return (v.kind==='list'?list:set)(v.items.map(normalize));return v;};
 assert.equal(f(row(base,436),1),true);assert.equal(f(row(off,436),1),false);assert.equal(encode(normalize(t.decode(base.registry))),encode(normalize(t.decode(off.registry))));
 function analysis(nuclei){const groups=new Map();for(const n of nuclei){const candidate=f(f(n,1),1),key=encode(candidate),g=groups.get(key)??{key:candidate,distribution:new Map([[0n,Q.of(1n)]]),reasonMass:Q.of(0n)};const d=math.readDistribution(f(n,7));g.distribution=math.convolve(g.distribution,d);g.reasonMass=g.reasonMass.add(math.absolute(math.expectation(d)));groups.set(key,g);}if(!groups.size)return 'NoActiveReasons';const a=math.analyzeOptions([...groups.values()],Q.of(1n,2n),Q.of(1n,2n));return {probabilities:a.probabilities.map(p=>[encode(p.key),String(p.probability.numerator)+'/'+p.probability.denominator]),mode:a.mode,authorship:String(a.authorshipPotential.numerator)+'/'+a.authorshipPotential.denominator};}
 const results=[],pairs=[],component=[];
 for(const seed of [0,1,2,3]){
  const runs={};
  for(const recipe of ['baseline','standing-access-off','standing-integer']){
   const input=data();input.runSeed[31]=seed;const source=t.source(recipe),run=await createCognitiveRun(await prepareCognitiveModel(source),input);while(await run.settleNextInstant()){}
   const snapshot=run.snapshot(),outputs=decode(snapshot.outputs).items,history=decode(snapshot.state).items.map(v=>f(v,2)).filter(v=>v.schema?.typeId===414n),nuclei=outputs.filter(v=>v.schema?.typeId===408n).flatMap(v=>f(v,3).items),raw=outputs.filter(v=>v.schema?.typeId===403n);
   const choices=outputs.filter(v=>v.schema?.typeId===409n).map(v=>{const result=f(v,4);return f(result,1).value===3n?encode(f(result,2)):encode(result);});
   const result={seed,recipe,modelDigest:t.allocation?JSON.parse(fs.readFileSync('docs/planning/campaign2-task-cognitive-model/FREEZE.json')).models.find(v=>v.recipe===recipe).modelDigest:undefined,choices,history:history.map(encode),state:encode(decode(snapshot.state)),actualDraws:decode(snapshot.trace).items.flatMap(v=>f(v,14).items).map(encode),standingModifiers:nuclei.map(v=>String(f(v,5).value)),standingSignalCount:raw.flatMap(v=>f(v,3).items).filter(v=>f(f(v,1),3).value===3n).length};
   results.push(result);runs[recipe]=result;
   if(recipe==='standing-integer')for(const [i,rawOutput]of raw.entries()){
    const signals=f(rawOutput,3).items,without=signals.filter(v=>f(f(v,1),3).value!==3n),beforeBytes=encode(rawOutput),definition=row(source,437);
    const intact=analysis(math.compileReasonNuclei(signals,definition)),ablated=analysis(math.compileReasonNuclei(without,definition));assert.equal(encode(rawOutput),beforeBytes);
    component.push({seed,decision:i+1,scope:'actual generated raw source; pure compiler/analyzer intervention only',intact,ablated,changed:JSON.stringify(intact)!==JSON.stringify(ablated)});
   }
  }
  const a=runs.baseline,b=runs['standing-access-off'];pairs.push({seed,historyEqual:JSON.stringify(a.history)===JSON.stringify(b.history),stateEqual:a.state===b.state,decisionDataEqual:JSON.stringify(a.choices)===JSON.stringify(b.choices),actualDrawsEqual:JSON.stringify(a.actualDraws)===JSON.stringify(b.actualDraws)});console.log(JSON.stringify(pairs.at(-1)));
 }
 assert.deepEqual(fingerprint(),before);
 fs.writeFileSync(output,JSON.stringify({status:'RESEARCH OBSERVATIONS; NO PREDETERMINED RETAINED VERDICT',sourceFingerprints:before,intervention:'Public baseline versus frozen standing-access-off differs only at RawSignalDefinition/436 StandingEnabled; distinct ModelIdentity retained. Full typed draws compared, not seed equality assumed.',pairs,results,component,limits:['Four seeds and fixed six original events only.','Complete outputs/trace differ legitimately at raw/read/fold evidence; behavioral projection equality is narrower.','standing-integer vs its ablated pure operands is component scope, not an admitted new public combined recipe.','No whole PHEN-BIO pass, calibrated-general equivalence or identity retraction follows.']},null,2)+'\n');
}finally{await server.close();}
