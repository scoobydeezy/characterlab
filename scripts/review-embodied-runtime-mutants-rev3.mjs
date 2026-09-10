// Current-source substitutions in isolated Vite module graphs; never edits runtime files.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/EMBODIED_RUNTIME_MUTANTS_REV3.json';assert(!fs.existsSync(output));
const folder='docs/planning/campaign3-embodied-model-rev2',freeze=JSON.parse(fs.readFileSync(folder+'/FREEZE.json'));
const bytes=p=>Uint8Array.from(Buffer.from(fs.readFileSync(folder+'/'+p,'utf8').trim(),'hex'));
const hex=b=>Buffer.from(b).toString('hex'),fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const mutations=[
 ['extra-delivery-allocation','embodiedRuntime.ts','ingress.admitDelivery(event);','allocate();ingress.admitDelivery(event);','baseline'],
 ['pressure-body-read','embodiedRuntime.ts','const admitted=ingress.admitPressure(event),','bodyRead(state,C,bodyDomain);const admitted=ingress.admitPressure(event),','baseline'],
 ['reuse-sample-occurrence','embodiedRuntime.ts','const observation=typedIdentifier(1115,unsigned(allocate()));','const observation=typedIdentifier(1115,unsigned((allocate(),0n)));','baseline'],
 ['stored-current-level','embodiedMath.ts','const remaining=amount.subtract(rate.multiply(Q.of(time-anchor)))','const remaining=amount','baseline'],
 ['direct-lower-pressure','embodiedRuntime.ts','deficitPressure(exact(f(rec(f(sample,5n),462n),2n)),threshold)','deficitPressure(exact(f(rec(f(sample,5n),462n),1n)),threshold)','baseline'],
 ['skip-absence-padding','embodiedRuntime.ts',');allocate();carrier=',');carrier=','denied'],
 ['omit-quantization','embodiedRuntime.ts','quantization=[r(484,[atom(body.level),atom(capacity),atom(width),unsigned(bin.index)])]','quantization=[]','baseline'],
 ['read-then-redact','embodiedRuntime.ts','}else{sample=r(463,','}else{bodyRead(state,subject,bodyDomain);sample=r(463,','denied'],
 ['omit-live-child-binding','embodiedRuntime.ts','if(children.length)ingress!.bindChild(event,children[0]);','/* missing binding */','baseline'],
 ['omit-SEM-settlement','embodiedRuntime.ts','ingress.settled(event,experience);','/* missing settlement */','baseline'],
 ['retain-consumption-debt','embodiedMath.ts','return remaining.compare(zero)<0?zero:remaining','return remaining','baseline'],
 ['drop-overflow','embodiedMath.ts','overflow:delivered.subtract(applied)','overflow:zero','overflow'],
];
async function execute(name,mutation){let replacements=0;const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',plugins:mutation?[{name:'isolated-EMB-mutant',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/src/campaign3/'+mutation[1])){assert.equal(code.split(mutation[2]).length-1,1,mutation[0]+' exact substitution');replacements++;return code.replace(mutation[2],mutation[3]);}}}]:[]});
 try{const api=await server.ssrLoadModule('/src/campaign3/embodiedFactory.ts'),source={...freeze.versions,...Object.fromEntries(['content','registry','parameters'].map(f=>[f,bytes(name+'/'+f+'.cenc.hex')]))},model=await api.prepareEmbodiedModel(source),run=await api.createEmbodiedRun(model,{initialState:bytes('runs/'+name+'/initial-state.cenc.hex'),orderedInputs:bytes('runs/'+name+'/ordered-inputs.cenc.hex'),runSeed:new Uint8Array(32)});
  try{while(await run.settleNextInstant()){}return {result:hex(run.snapshot().outputs),replacements};}catch(error){return {failure:error.code??error.name,message:error.message,replacements};}
 }finally{await server.close();}
}
const baseline=new Map();for(const name of ['baseline','denied','overflow']){const value=await execute(name);assert(value.result);baseline.set(name,value.result);}
const results=[];for(const mutation of mutations){const result=await execute(mutation[4],mutation);assert.equal(result.replacements,1);assert(result.failure||result.result!==baseline.get(mutation[4]),'surviving mutant '+mutation[0]);results.push({name:mutation[0],model:mutation[4],source:mutation[1],removed:mutation[2],inserted:mutation[3],detectedBy:result.failure?'production rejection':'canonical output comparison',failure:result.failure,message:result.message});}
fs.writeFileSync(output,JSON.stringify({status:'TWELVE CURRENT-SOURCE ALTERNATIVES DETECTED',results,sources:['src/campaign3/embodiedRuntime.ts','src/campaign3/embodiedMath.ts','src/campaign3/embodiedTrace.ts','src/campaign3/embodiedAdmission.ts','src/campaign3/embodiedBodyTarget.ts','src/campaign3/embodiedReplenishment.ts','scripts/review-embodied-runtime-mutants-rev3.mjs'].map(fp),cohort:fp(folder+'/FREEZE.json'),limits:['Fault sensitivity, not a reduction verdict.','No receiving/action-knowledge or whole BODY claim.']},null,2)+'\n');console.log(JSON.stringify(results.map(r=>({name:r.name,detectedBy:r.detectedBy,failure:r.failure}))));
