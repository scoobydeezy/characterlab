import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const P='docs/planning/',O=P+'campaign3-history-disposition-public-rev1/',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex'),ref=path=>({path,sha256:sha(fs.readFileSync(path))});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/dispositionPublicModel.ts'),fx=await server.ssrLoadModule('/src/test/dispositionPublicFixtures.ts'),codec=await server.ssrLoadModule('/src/campaign3/dispositionPublicCodecs.ts'),old=await server.ssrLoadModule('/src/campaign3/identityPublicCodecs.ts');
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),math=await server.ssrLoadModule('/src/campaign3/identityPublicMath.ts'),state=await server.ssrLoadModule('/src/substrate/state.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts');
 const {canonicalEncode:enc,list,text,unsigned:u,rational:q,typedIdentifier}=c,{dataRecord:rec,dataField:f,dataItems:items,dataKey:key}=d,r=old.identityPublicRecord,dr=codec.dispositionPublicRecord,decode=codec.decodeDispositionPublic,Q=s=>q(...s.split('/').map(BigInt)),hex=b=>Buffer.from(b).toString('hex');
 const plan=read(P+'DISPOSITION_PUBLIC_PLAN_REV1.json'),models=[],runs=[];let rows=0,views=0,authorityRejections=0;
 assert.deepEqual(m.stages,[['context',40],['reasons',52],['decision',60],['intent',70],['expression',80],['attempt',100],['execution',110],['qualify',130],['identity',140],['adapt',140]]);
 for(const entry of plan.runs){
  const fc=fx.nativeCase(entry),model=await m.compileDispositionModel(fc.source),input=await m.compileDispositionInputs(model,fc.initialState,fc.orderedInputs,fc.runSeed);
  assert.equal(hex(model.modelIdentity.canonicalBytes),entry.modelIdentity);assert.equal(hex(input.runIdentity.canonicalBytes),entry.runIdentity);assert.equal(sha(fc.orderedInputs),entry.inputsSha256);
  if(!models.some(x=>hex(x.canonicalBytes)===entry.modelIdentity))models.push(model.modelIdentity);runs.push(input.runIdentity);
  for(const root of m.roots(entry.law))for(const writer of ['identity','execution','adapt']){
   if(root===1436&&writer==='identity'||root===1441&&writer==='execution'||root===1458&&writer==='adapt')continue;
   const path=m.path(root),prior=input.state.read(path).value;
   assert.throws(()=>state.applyStatePatch(input.state,{operations:[{kind:'set',path,expected:{presence:true,value:prior},newValue:prior}]},m.owner(writer),model.authority));authorityRejections++;
  }
  assert.equal(input.state.read(m.path(1458)).presence,entry.law!=='Refold');
  const changed=new state.AuthoritativeState(input.state.entries().map(e=>e.path.rootStateTypeId===1457n?{...e,value:dr(1453,[q(entry.constitution===1?0:1,8)])}:e));assert.throws(()=>model.validateState(changed));authorityRejections++;
  const receipt=read(P+`DISPOSITION_PUBLIC_RUN_${entry.index}_REV1.json`),component=read(P+`DISPOSITION_RUN_${entry.index}_REV2.json`),projection=[];
  assert.equal(receipt.traceCount,180);assert.equal(receipt.rows.length,18);assert.equal(receipt.prefixes.length,19);
  let priorJournal=r(1435,[list([])]),priorStrength='0/1';
  for(const [i,row] of receipt.rows.entries()){
   rows++;const {addresses,...expected}=structuredClone(component.rows[i]);
   if(!row.frame.active){expected.state.constitution=null;expected.state.effectiveBefore=null;}
   assert.deepEqual(row,expected);
   const at=i+1,occ=offset=>typedIdentifier(1155,u(at*100+offset)),context=f(rec(input.events[i].payload,1452n),2n),journal=decode(Buffer.from(row.journal,'hex'));
   projection.push(context);
   if(row.expression!==null){
    const expression=decode(Buffer.from(row.expression,'hex')),intent=f(rec(expression,1433n),5n),decision=f(rec(intent,1432n),2n),reasons=f(rec(decision,1431n),2n);
    assert.equal(key(f(rec(reasons,1430n),2n)),key(context));
    const qualification=math.qualifyExpression(expression,'Threshold',typedIdentifier(1138,u(at)));
    assert.equal(key(math.appendQualification(priorJournal,qualification)),key(journal));
    projection.push(dr(1455,[occ(11),dr(1453,[q(entry.constitution,8)]),Q(row.state.before),Q(priorStrength),Q(row.state.effectiveBefore),Q(row.state.feedback),priorJournal,reasons]),reasons,decision,intent,expression,qualification);
   }else assert.equal(key(journal),key(priorJournal));
   projection.push(r(1437,[occ(18),priorJournal,journal]),dr(1456,[occ(19),journal,Q(row.state.before),Q(row.state.after)]));
   priorJournal=journal;priorStrength=row.strength;
  }
  assert.equal(sha(enc(list(projection))),receipt.projectionSha256);views++;
  for(let i=0;i<19;i++){assert.equal(receipt.prefixes[i].at,i);assert.equal(receipt.prefixes[i].nextSha256,receipt.prefixes[Math.min(i+1,18)].saveSha256);}
  console.log(`Native disposition case ${entry.index}: identities, ownership and complete recorded projection check.`);
 }
 const experiment=await ids.createExperimentIdentity('corpus/0.29.0','disposition-public/0.1-candidate','disposition-public-harness/0.1'),comparison=await ids.createComparisonCase(models,runs,text('Native counterpart of frozen component nine-model fifteen-case disposition roster. Exact original expressions/journals, separately admitted operands, ten actual phases, independent authority, all nineteen native prefixes; no general fusion or universal plasticity claim.'));
 assert.deepEqual(read(P+'DISPOSITION_PUBLIC_EXPERIMENT_REV1.json'),{status:'Canonical binding of already frozen plan; no change of roster or comparator',planSha256:sha(fs.readFileSync(P+'DISPOSITION_PUBLIC_PLAN_REV1.json')),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes)});
 assert.equal(models.length,9);assert.equal(rows,270);assert.equal(views,15);
 const receipt={status:'PASS',scope:'Read-only original native model/run/input and experiment/comparison identity recomputation; fresh pure mutation-authority rejection checks; component correspondence and reconstruction of complete typed mechanism-side projection from original expressions/journals and distinct operands. No fresh native scheduler execution, Save132 restore or tests/build.',models:9,runs:15,rows,projections:views,authorityRejections,historicalNativePrefixes:285,checker:ref('scripts/check-history-disposition-public-schema.mjs')};
 const out=O+'schema-check.json';if(fs.existsSync(out))assert.deepEqual(read(out),receipt);else fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
}finally{await server.close();}
