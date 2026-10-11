import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const sha=b=>createHash('sha256').update(b).digest('hex'),references=[],read=path=>{const b=fs.readFileSync(path);references.push({path,sha256:sha(b)});return JSON.parse(b);};
const timing=read('docs/planning/AFFECT_PREFIX_CONTRAST_PLAN_REV1.json'),feedback=read('docs/planning/AFFECT_INTERIOR_FEEDBACK_PLAN_REV1.json'),timingResult=read('docs/planning/AFFECT_PREFIX_CONTRASTS_REV1.json'),feedbackResult=read('docs/planning/AFFECT_INTERIOR_FEEDBACK_REV1.json'),fixtures=read('src/workbench/affectFixtures.json');
assert.equal(timingResult.planSha256,references[0].sha256);assert.equal(feedbackResult.planSha256,references[1].sha256);
for(const r of fixtures.references)assert.equal(sha(fs.readFileSync(r.path)),r.sha256);
const runs=timing.pairs.flatMap(p=>['a','b'].map(side=>({id:`timing/${p.name}/${side}`,...p[side]}))).concat(feedback.models.map(model=>({id:`interior/${model}`,name:model,model,seed:feedback.seed,orderedInputs:feedback.orderedInputs})));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {affectRecipe}=await server.ssrLoadModule('/src/campaign3/affectModel.ts'),{prepareAffectModel,createAffectRun}=await server.ssrLoadModule('/src/campaign3/affectFactory.ts');
 const hex=s=>new Uint8Array(Buffer.from(s,'hex'));
 for(const row of runs){const model=fixtures.models.find(m=>m.name===row.model);assert(model);const run=await createAffectRun(await prepareAffectModel(affectRecipe(model.settings)),{initialState:hex(model.initialState),orderedInputs:hex(row.orderedInputs),runSeed:new Uint8Array(32).fill(row.seed)});row.runIdentity=Buffer.from(run.runIdentity()).toString('hex');}
 const data=JSON.stringify({version:'affect-supplement-fixtures/0.1',identityScope:'Run identities reconstructed from exact frozen original inputs and public model; historical supplementary receipts did not record run identities.',references,runs},null,2)+'\n',path='src/workbench/affectSupplementFixtures.json';
 if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),data);else fs.writeFileSync(path,data,{flag:'wx'});console.log('PASS14 frozen supplementary execution roles; exact public run identities');
}finally{await server.close();}
