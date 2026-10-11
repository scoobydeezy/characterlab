import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const P='docs/planning/',O=P+'campaign3-history-identity-public-rev1/',read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),ref=path=>({path,sha256:sha(path)}),bytes=s=>Uint8Array.from(Buffer.from(s,'hex'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/identityPublicModel.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),math=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const Q=math.ExactRational,F=s=>Q.of(...s.split('/').map(BigInt)),str=x=>`${x.numerator}/${x.denominator}`,f=d.dataField,zero=Q.of(0n),one=Q.of(1n),rat=v=>Q.of(v.numerator,v.denominator);
 const plan=read(P+'IDENTITY_PUBLIC_PLAN_REV1.json'),compiled=[];
 for(const p of plan.models){const model=await m.compileIdentityModel({parameters:bytes(p.source.parameters),registry:bytes(p.source.registry)});assert.equal(Buffer.from(model.modelIdentity.canonicalBytes).toString('hex'),p.modelIdentity);assert.equal(model.family,p.family);assert.equal(model.law,p.law);assert.equal(model.standingDenominator,p.unit);compiled.push(model);}
 const runs=[];let taskRows=0,bioRows=0,prefixes=0;
 for(const p of plan.runs){
  const input=await m.compileIdentityInputs(compiled[p.model],bytes(p.initialState),bytes(p.orderedInputs),new Uint8Array(32).fill(p.seed));assert.equal(Buffer.from(input.runIdentity.canonicalBytes).toString('hex'),p.runIdentity);
  const r=read(P+`IDENTITY_PUBLIC_RUN_${p.index}_REV1.json`);runs.push(r);
  assert.deepEqual(Object.keys(r).sort(),['status','planSha256','index','family','law','scenario','seed','unit','runIdentity','prefixes','saveSha256','observerSha256','stateSha256','priorMatch','semantic'].sort());
  for(const k of ['index','family','law','scenario','seed','unit','runIdentity'])assert.deepEqual(r[k],p[k]);assert.equal(r.status,'PASS');assert.equal(r.planSha256,sha(P+'IDENTITY_PUBLIC_PLAN_REV1.json'));
  assert.deepEqual(r.prefixes.map(x=>x.at),p.prefixes);prefixes+=r.prefixes.length;assert.equal(r.semantic.length,p.count);
  if(p.family==='Task'){
   const prior=read(P+`IDENTITY_ELIGIBILITY_RUN_${p.index}_REV2.json`);assert.deepEqual(r.semantic,prior.rows.map(({at,chosen,authorship,probabilities,contribution,strength,executed})=>({at,chosen,authorship,probabilities,contribution,strength,executed})));taskRows+=r.semantic.length;
  }else for(const [i,row] of r.semantic.entries()){
   bioRows++;assert.equal(row.at,i+1);const ctx=input.contexts[i],gs=row.appraisal.grounds,options=row.appraisal.options,chosen=row.choice.chosen;
   const protective=g=>['protection','protective-goal'].includes(g.domain);
   const meanings=new Map(options.map(option=>[option,gs.filter(g=>g.option===option&&protective(g)).reduce((s,g)=>s.add(Q.of(BigInt(g.strength),1000n)),zero)]));
   const own=chosen?meanings.get(chosen)??zero:zero,delta=own.subtract([...meanings].filter(([o])=>o!==chosen).reduce((s,[,v])=>s.add(v),zero));
   const alignment=chosen?delta.divide(one.add(Q.of(delta.numerator<0n?-delta.numerator:delta.numerator,delta.denominator))):zero;
   assert.equal(row.qualification.alignment,str(alignment));let contribution=alignment.multiply(F(row.choice.authorship)),status=1;
   if(f(ctx,6n)!==true){status=6;contribution=zero;}
   else if(!gs.some(g=>g.strength!==0&&protective(g))){status=5;contribution=zero;}
   else if(p.law==='Frequency')contribution=Q.of(alignment.numerator>0n?1n:alignment.numerator<0n?-1n:0n);
   else if(p.law==='Graded')contribution=contribution.multiply(rat(f(ctx,2n))).multiply(one.subtract(rat(f(ctx,3n))));
   else if(rat(f(ctx,2n)).compare(Q.of(1n,2n))<0){status=2;contribution=zero;}
   else if(p.law!=='IgnorePressure'&&rat(f(ctx,3n)).compare(Q.of(1n,2n))>=0){status=3;contribution=zero;}
   if(contribution.numerator===0n&&status===1)status=4;
   assert.deepEqual(row.qualification,{status,contribution:str(contribution),alignment:str(alignment)});
  }
 }
 const get=(law,seed,unit=16)=>runs.find(r=>r.family==='Biological'&&r.scenario==='matched'&&r.law===law&&r.seed===seed&&r.unit===unit);
 const projection=r=>({seed:r.seed,law:r.law,qualifications:r.semantic.map(v=>({status:String(v.qualification.status),contribution:v.qualification.contribution})),strength:r.semantic.at(-1).strength,choices:r.semantic.map(v=>v.choice)});
 const coarse=read(P+'IDENTITY_PUBLIC_BIOLOGY_EXPLORATION_REV1.json').rows,fine=read(P+'IDENTITY_PUBLIC_BIOLOGY_EXPLORATION_REV2.json').rows;assert.equal(coarse.length,16);assert.equal(fine.length,16);
 for(const r of fine)assert.deepEqual(r,projection(get(r.law,r.seed)));
 for(let seed=0;seed<8;seed++){const a=coarse.find(r=>r.seed===seed&&r.law==='Threshold'),b=coarse.find(r=>r.seed===seed&&r.law==='NoFeedback');assert.deepEqual(a,b?{...b,law:'Threshold'}:null);assert.deepEqual(b,fine.find(r=>r.seed===seed&&r.law==='NoFeedback'));}
 for(const law of ['Threshold','NoFeedback'])assert.deepEqual(coarse.find(r=>r.seed===7&&r.law===law),projection(get(law,7,1)));
 assert.equal(taskRows,260);assert.equal(bioRows,384);assert.equal(prefixes,428);
 const receipt={status:'PASS',scope:'Read-only16 model/84 run identity recomputations,52 component semantic projections,384 biological meaning/qualification rows and both16-row explorations; no native execution or prefix replay.',models:16,runs:84,taskRows,bioRows,prefixesRepresented:prefixes,explorationRows:32,checker:ref('scripts/check-history-identity-public-schema.mjs'),plan:ref(P+'IDENTITY_PUBLIC_PLAN_REV1.json')};
 fs.writeFileSync(O+'schema-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
}finally{await server.close();}
