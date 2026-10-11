import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const O='docs/planning/campaign3-history-disposition-rev1/';fs.mkdirSync(O,{recursive:true});const checks=[];
const p='docs/planning/',file=p+'DISPOSITION_PLAN_REV2.json',sha=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex'),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/dispositionAdaptation.ts'),fx=await server.ssrLoadModule('/src/test/dispositionAdaptationFixtures.ts'),binding=await server.ssrLoadModule('/src/campaign3/dispositionIdentity.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),data=await server.ssrLoadModule('/src/campaign3/biologyPublicData.ts');
  const plan=JSON.parse(fs.readFileSync(file));for(const a of plan.artifacts)assert.equal(sha(fs.readFileSync(a.path)),a.sha256,a.path);const part=Number(process.argv.find(a=>a.startsWith('--part='))?.split('=')[1]??0);assert(Number.isInteger(part)&&part>=0&&part<3);
  const exploration=JSON.parse(fs.readFileSync(p+'DISPOSITION_EXPLORATION_REV1.json'));
  for(const row of plan.runs.filter(r=>r.index%3===part)){
   const target=p+'DISPOSITION_RUN_'+row.index+'_REV2.json';assert(fs.existsSync(target));
   try{
    const x=fx.dispositionCase(row),identity=await binding.dispositionIdentities(x.profile,x.frames);assert.equal(hex(identity.modelIdentity.canonicalBytes),row.modelIdentity);assert.equal(hex(identity.runIdentity.canonicalBytes),row.runIdentity);assert.equal(sha(c.canonicalEncode(data.data(x.frames))),row.inputsSha256);
    const run=m.createDispositionRun(x.profile,x.frames),saves=[run.save()];let before=[];while(await run.step()){const now=m.dispositionRows(run.snapshot()),expressions=now.map(r=>r.expression);assert.deepEqual(expressions.slice(0,before.length),before);before=expressions;saves.push(run.save());}assert.equal(saves.length,19);const rows=m.dispositionRows(run.snapshot());
    if(row.name==='Main')assert.deepEqual(rows,exploration.results.find(r=>r.law===row.law).rows,'pre-optimization source correspondence');
    const prefixes=[];for(let i=0;i<19;i++){const restored=await m.restoreDispositionRun(x.profile,x.frames,saves[i]);assert.deepEqual(restored.save(),saves[i]);assert.equal(await restored.step(),i<18);assert.deepEqual(restored.save(),saves[Math.min(i+1,18)]);prefixes.push({at:i,saveSha256:sha(saves[i]),nextSha256:sha(restored.save())});}
    for(const [i,r]of rows.entries()){assert.equal(r.state.before,i?rows[i-1].state.after:'0/1');assert.equal(r.state.constitution,row.constitution===0?'0/1':row.constitution+'/8');if(r.state.count%4!==0||r.state.count===(i?rows[i-1].state.count:0))assert.equal(r.state.after,r.state.before);}
    const actual={status:'PASS',planSha256:sha(fs.readFileSync(file)),...row,rows,prefixes,historyPreserved:true,saveSha256:sha(run.save())};assert.deepEqual(actual,JSON.parse(fs.readFileSync(target)));checks.push({index:row.index,runIdentity:row.runIdentity,prefixes:prefixes.length,resultSha256:sha(fs.readFileSync(target))});console.log(row.index+' '+row.name+'/'+row.law+':19 component prefixes');
   }catch(error){write(O+'failure_'+row.index+'.json',{status:'FAIL',row,error:String(error),planSha256:sha(fs.readFileSync(file))});throw error;}
  }
 const receipt={status:'PASS',scope:'Fresh exact component execution and all original-prefix restores, one successor per prefix; no native Save132 claim.',part,cases:checks.length,prefixes:checks.reduce((n,r)=>n+r.prefixes,0),checks,checkerSha256:sha(fs.readFileSync('scripts/replay-history-disposition.mjs'))};const out=O+'replay-part'+part+'.json';if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),receipt);else write(out,receipt);
}finally{await server.close();}
