import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),ref=path=>({path,sha256:sha(path)}),read=n=>JSON.parse(fs.readFileSync(p+n));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const codec=await server.ssrLoadModule('/src/campaign3/communicationCodecs.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts'),m=await server.ssrLoadModule('/src/campaign3/crossContextIdentity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const original=read('CROSS_CONTEXT_IDENTITY_RESULT_REV1.json'),result=read('CROSS_CONTEXT_DOMAINS_RESULT_REV1.json');let count=0;const runs=[];
 for(const run of result.results){const old=original.results.find(x=>x.law===run.law&&x.seed===run.seed&&x.name===(run.name==='deniedExecution'?'hidden':'main'));assert(old);const actions=[];
  for(const [i,r] of run.receipts.entries()){
   const attempt=d.dataRecord(codec.decodeCommunication(new Uint8Array(Buffer.from(r.attempt,'hex'))),432n),plan=d.dataRecord(d.dataField(attempt,2n),431n),intent=d.dataRecord(d.dataField(plan,2n),425n),chosen=d.dataRecord(d.dataField(choice.chosenData(d.dataField(intent,2n)),1n),395n);
   assert.equal(d.dataKey(d.dataField(chosen,1n)),d.dataKey(m.ACTOR));assert.equal(r.actor,d.dataKey(m.ACTOR));assert.equal(d.dataKey(chosen),old.rows[i].chosen);
   const action=m.CONTEXTS[r.context].actions.find(a=>d.dataKey(d.dataField(chosen,2n))===d.dataKey(c.typedIdentifier(1027,c.text('action/cross-context/'+a))));assert(action);assert.equal(action,r.action);actions.push(action);count++;
  }runs.push({runIdentity:run.runIdentity,actions});
 }
 assert.equal(count,275);const value={status:'PASS',scope:'275 original Attempt432 -> Plan431 -> Intent425 -> Resolution409 action chains decoded; actor and selected option match original identity rows, no fresh choice execution.',count,runs,artifacts:['docs/planning/CROSS_CONTEXT_DOMAINS_RESULT_REV1.json','docs/planning/CROSS_CONTEXT_IDENTITY_RESULT_REV1.json','scripts/decode-history-cross-context-attempts.mjs','src/campaign3/crossContextIdentity.ts','src/campaign2/cognitiveChoice.ts','src/campaign3/communicationCodecs.ts'].map(ref)};
 const out=p+'campaign3-history-cross-context-successor-rev1/attempts.json';if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),value);else fs.writeFileSync(out,JSON.stringify(value,null,2)+'\n',{flag:'wx'});console.log('PASS275 original action chains.');
}finally{await server.close();}
