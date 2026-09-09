// Re-execute historical finite assays against current source, preserving original reports.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),hash=b=>createHash('sha256').update(b).digest('hex');
const assays=[['independent-content','INDEPENDENT_CONTENT'],['independent-roles','INDEPENDENT_ROLE'],['declaration-coverage','DECLARATION_COVERAGE'],['forbidden-dependencies','FORBIDDEN_DEPENDENCY'],['reg-persistence','REG_PERSISTENCE_MUTATION']];
const results=[];
for(const [script,report] of assays){
 const old=`docs/planning/CAMPAIGN2_${report}_PROOF.json`,fresh=`docs/planning/CAMPAIGN2_${report}_VAL_REFRESH.json`;
 const fingerprint=hash(fs.readFileSync(new URL(old,root)));
 const sourcePath=`scripts/prove-campaign2-${script}.mjs`,source=fs.readFileSync(new URL(sourcePath,root),'utf8');
 assert.equal(source.split(old).length-1,1);
 const temp=new URL(`scripts/.val-refresh-${script}.mjs`,root);assert(!fs.existsSync(temp),'temporary assay path must be unused');
 fs.writeFileSync(temp,source.replace(old,fresh).replaceAll('createServer({','createServer({configFile:false,'));
 try{await import(temp.href);}finally{fs.unlinkSync(temp);}
 assert.equal(hash(fs.readFileSync(new URL(old,root))),fingerprint);
 const result=JSON.parse(fs.readFileSync(new URL(fresh,root)));
 results.push({assay:sourcePath,assaySha256:hash(Buffer.from(source)),historical:old,historicalSha256:fingerprint,current:fresh,status:result.status,mutants:result.mutations.length});
 console.log(`REFRESH COMPLETE ${report}`);
}
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_VAL_EVIDENCE_REFRESH.json',root),JSON.stringify({status:'FINITE ASSAYS REFRESHED',results,scope:'Same historical assay semantics against current production sources; separate reports. No new gate verdict or independent compiler claim.'},null,2)+'\n');
