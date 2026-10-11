import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {startVitest} from 'vitest/node';
const dir='docs/planning/campaign3-history-ga-allocation-production-rev1';fs.mkdirSync(dir,{recursive:true});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const original=JSON.parse(fs.readFileSync('docs/planning/GA_REPLENISHMENT_PRODUCTION_REVIEW_REV1.json'));
const source='src/campaign3/localReserveSource.ts',commit='6d54d35f3c612154658c6f9316f6f7e04071865b';
const bytes=execFileSync('git',['show',commit+':'+source]);assert.equal(createHash('sha256').update(bytes).digest('hex'),original.sources[0].sha256);
const archive=dir+'/f91568689006686f-localReserveSource.ts';if(fs.existsSync(archive))assert.deepEqual(fs.readFileSync(archive),bytes);else fs.writeFileSync(archive,bytes);
for(const f of original.sources.slice(1))assert.deepEqual(fp(f.path),f);
const tests=['src/test/generalOutputAllocation.test.ts','src/test/localReserveReplenishmentProduction.test.ts'];
const faultSource=fs.readFileSync('scripts/review-ga-replenishment-production.mjs','utf8');
const faults=JSON.parse(faultSource.match(/const faults=(\[\[.*?\]\]),results=/s)[1]);assert.equal(faults.length,3);
const rows=[];
for(const [name,pinned,mutation] of [['current',false,null],['historical-source',true,null],...faults.map(f=>[f[0],true,f])]){
 const output=dir+'/'+name+'.json';assert(!fs.existsSync(output),'Do not rerun over an existing test receipt');let loads=0;
 const files=mutation?[tests[1]]:tests;
 const ctx=await startVitest('test',files,{config:false,include:files,run:true,watch:false,pool:'forks',maxWorkers:1,minWorkers:1,reporters:['json'],outputFile:output},{plugins:pinned?[{name:'exact-historical-source',enforce:'pre',load(id){if(id.replaceAll('\\','/').endsWith('/'+source)){loads++;let code=bytes.toString();if(mutation){assert.equal(code.split(mutation[3]).length-1,1);code=code.replace(mutation[3],mutation[4]);}return code;}}}]:[]});
 assert(ctx);await ctx.close();const r=JSON.parse(fs.readFileSync(output));
 if(pinned)assert.equal(loads,1);
 const failed=r.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');
 if(mutation){assert.equal(r.numTotalTests,3);assert(failed.some(t=>t.fullName.includes(mutation[5])));}else{assert.equal(r.numTotalTests,5);assert.equal(r.numPassedTests,5);assert.equal(r.numFailedTests,0);}
 rows.push({name,pinned,report:fp(output),total:r.numTotalTests,passed:r.numPassedTests,failed:r.numFailedTests,failedNames:failed.map(t=>t.fullName),mutation});
}
const out=dir+'/replay.json';assert(!fs.existsSync(out));
fs.writeFileSync(out,JSON.stringify({status:'PASS; CURRENT AND PINNED HISTORICAL SOURCE WITNESSES; THREE ORIGINAL MUTANTS DETECTED',checker:fp('scripts/replay-history-ga-allocation-production.mjs'),archive:{...fp(archive),originalPath:source,commit,method:'Exact git-show bytes matching original replenishment reviewer SHA'},inputs:[...tests,source,'scripts/review-ga-replenishment-production.mjs','docs/planning/GA_REPLENISHMENT_PRODUCTION_REVIEW_REV1.json'].map(fp),rows,limits:['Historical source is pinned; other imported modules are current. This does not reproduce the complete old dependency environment.','Five component assertions per source version; no native scheduler, public slot admission or full current source suite rerun. Original failed fixture reports remain separate evidence.']},null,2)+'\n');process.exitCode=0;
