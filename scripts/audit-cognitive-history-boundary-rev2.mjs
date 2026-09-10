// Genuine public65th append failure. No imported learned S0 or synthetic history.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {createServer} from 'vite';import {cognitiveDeclarationTools} from './cognitive-model-declarations.mjs';
const output='docs/planning/COGNITIVE_HISTORY_BOUNDARY_REV2.json';assert(!fs.existsSync(output),'preserve existing receipt');
const paths=fs.readdirSync('src/campaign2').filter(n=>n.endsWith('.ts')).map(n=>'src/campaign2/'+n);paths.push('scripts/audit-cognitive-history-boundary-rev2.mjs');const fingerprint=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),sourceFingerprints=paths.map(fingerprint);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const t=await cognitiveDeclarationTools(server),{c,r,id,f}=t,{canonicalEncode:enc,list,unsigned:u,signed}=c;
 const {prepareCognitiveModel,createCognitiveRun}=await server.ssrLoadModule('/src/campaign2/cognitiveFactory.ts');
 const {decodeCognitive:decode}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts');
 const {AuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {semanticReferentFromAuthoredContent:ref}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts');
 const {governedContentDefinitionId:def}=await server.ssrLoadModule('/src/substrate/contentDefinitionId.ts');
 const C=ref(def('character/bridge-subject')),observer=id(1000,'observer/bridge-subject');
 const initial=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:observer}]},value:r(267,[C])},{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r(294,[C,id(1029,'variable/fixture-regulation')])}]},value:r(299,[signed(-50)])},...['a','b'].flatMap((n,i)=>{const key=r(371,[C,ref(def('content/task-'+n))]);return [{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key}]},value:r(372,[u(1)])},{path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey',key}]},value:r(390,[id(1027,'definition/task-instruction-'+(i?'two':'one'))])}];})]);
 const data={initialState:enc(initial.canonicalValue()),runSeed:new Uint8Array(32),orderedInputs:enc(list(Array.from({length:66},(_,i)=>{const at=i+1,probe=at===1;return list([signed(at),u(probe?110:40),id(1001,probe?'event/regulatory-diagnostic-probe':'event/deliberation-opportunity'),probe?r(333,[id(1027,'definition/regulatory-diagnostic-probe')]):r(377,[observer,id(1027,'definition/task-workspace')]),list([])]);})))};
 const run=await createCognitiveRun(await prepareCognitiveModel(t.source('history-boundary')),data);
 const history=()=>decode(run.snapshot().state).items.map(v=>f(v,2)).filter(v=>v.schema?.typeId===414n).flatMap(v=>f(v,1).items);
 await run.settleNextInstant();for(let i=1;i<=64;i++){assert(await run.settleNextInstant());assert.equal(history().length,i);if(i%8===0)console.log(JSON.stringify({qualifiedEntries:i,clock:String(run.snapshot().clock)}));}
 const before=run.save(),snapshot=run.snapshot();await assert.rejects(run.settleNextInstant(),e=>e.code==='IDENTITY_EVIDENCE_LIMIT_EXCEEDED');
 const after=run.snapshot();for(const field of ['clock','state','trace','outputs'])assert.deepEqual(after[field],snapshot[field]);assert.equal(history().length,64);await assert.rejects(run.settleNextInstant(),e=>e.code==='RUN_NOT_ACTIVE');
 assert.deepEqual(paths.map(fingerprint),sourceFingerprints);fs.writeFileSync(output,JSON.stringify({sourceFingerprints,status:'PUBLIC64 SUCCEEDS / NOVEL65 REJECTS ATOMICALLY',modelRecipe:'history-boundary',entries:64,clock:String(after.clock),failure:'IDENTITY_EVIDENCE_LIMIT_EXCEEDED',preFailureSaveDigest:createHash('sha256').update(before).digest('hex'),limits:['No identity entry was supplied in S0.','Failed run remains terminal.','Save digest covers queue and allocator before failure; full private-ledger rollback is separately exercised by the final-trace control.']},null,2)+'\n');
}finally{await server.close();}

