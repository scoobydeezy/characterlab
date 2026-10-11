import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const P='docs/planning/',O=P+'campaign3-history-identity-eligibility-rev1/',read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),ref=path=>({path,sha256:sha(path)});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const codec=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),math=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const dec=s=>codec.decodeReceiving(Uint8Array.from(Buffer.from(s,'hex'))),items=v=>data.dataItems(v,'list'),f=data.dataField,rec=data.dataRecord,Q=math.ExactRational;
 const rat=v=>{assert.equal(v.kind,'rational');return Q.of(v.numerator,v.denominator);},str=q=>`${q.numerator}/${q.denominator}`;
 const plans=[1,2].map(rev=>read(P+`IDENTITY_ELIGIBILITY_PLAN_REV${rev}.json`));let rows=0,prefixes=0;
 for(const rev of [1,2]){
  const plan=plans[rev-1],completed=[];
  for(let part=0;part<4;part++){
   const w=read(P+`IDENTITY_ELIGIBILITY_PART${part}_REV${rev}.json`);assert.equal(w.status,'PASS');assert.equal(w.planSha256,sha(P+`IDENTITY_ELIGIBILITY_PLAN_REV${rev}.json`));
   assert.deepEqual(w.completed,plan.runs.filter(r=>r.index%4===part).map(r=>P+`IDENTITY_ELIGIBILITY_RUN_${r.index}_REV${rev}.json`));completed.push(...w.completed);
  }
  assert.equal(completed.length,52);assert.equal(new Set(completed).size,52);
  for(const input of plan.runs){
   const result=read(P+`IDENTITY_ELIGIBILITY_RUN_${input.index}_REV${rev}.json`);
   assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(P+`IDENTITY_ELIGIBILITY_PLAN_REV${rev}.json`));
   for(const k of ['index','law','scenario','seed','runIdentity'])assert.deepEqual(result[k],input[k]);
   assert.equal(result.rows.length,5);assert.equal(result.prefixes.length,6);prefixes+=6;
   for(let i=0;i<6;i++){assert.equal(result.prefixes[i].at,i);assert.equal(result.prefixes[i].nextSha256,result.prefixes[Math.min(i+1,5)].sha256);}
   assert.equal(result.saveSha256,result.prefixes[5].sha256);
   let journal=[];
   for(const [i,row] of result.rows.entries()){
    rows++;assert.equal(row.at,i+1);const x=input.input[i],full=items(dec(row.input));assert.equal(full.length,6);
    assert.equal(full[0].value,x.setting);assert.equal(str(rat(full[1])),str(Q.of(BigInt(x.significance),4n)));assert.equal(str(rat(full[2])),str(Q.of(BigInt(x.pressure),4n)));assert.equal(full[3],x.instructed);assert.equal(full[4].value,x.movement);assert.equal(full[5],x.permitted);
    let contribution=Q.of(0n),status='NoQualification';
    if(x.movement==='Forced'){assert.equal(row.expression,null);assert.equal(row.resolution,null);assert.deepEqual(row.addresses,[]);assert.equal(row.executed,1);}
    else{
     const expression=items(dec(row.expression));assert.equal(expression.length,4);assert.deepEqual(items(expression[3]),full.slice(0,5));
     assert.deepEqual(f(rec(expression[1],425n),2n),dec(row.resolution));
     if(i<4){
      contribution=Q.of(...row.authorship.split('/').map(BigInt)).multiply(rat(expression[2]));status='Accepted';
      if(input.law==='Frequency')contribution=Q.of(row.chosen==='A'?1n:-1n);
      else if(input.law==='Graded')contribution=contribution.multiply(Q.of(BigInt(x.significance),4n)).multiply(Q.of(BigInt(4-x.pressure),4n));
      else if(x.significance<2){status='Insignificant';contribution=Q.of(0n);}
      else if(input.law!=='IgnorePressure'&&x.pressure>=2){status='Constrained';contribution=Q.of(0n);}
      if(contribution.numerator===0n&&status==='Accepted')status='ZeroContribution';
     }
     assert.equal(row.executed,x.permitted?(row.chosen==='A'?1:2):0);
    }
    assert.equal(row.contribution,str(contribution));assert.equal(row.disposition,status);
    const now=items(dec(row.journal));assert.equal(now.length,journal.length+(contribution.numerator!==0n?1:0));assert.deepEqual(now.slice(0,journal.length),journal);
    if(contribution.numerator!==0n){const q=items(now.at(-1));assert.equal(q.length,5);assert.equal(q[0].value,BigInt(i+1));assert.deepEqual(items(q[1]),full.slice(0,5));assert.deepEqual(q[2],dec(row.expression));assert.equal(q[3].value,status);assert.equal(str(rat(q[4])),str(contribution));}journal=now;
   }
  }
 }
 for(let i=0;i<52;i++){
  const a=plans[0].runs[i],b=plans[1].runs[i];for(const k of ['index','law','scenario','seed','input'])assert.deepEqual(a[k],b[k]);assert.notEqual(a.runIdentity,b.runIdentity);
  const ar=read(P+`IDENTITY_ELIGIBILITY_RUN_${i}_REV1.json`),br=read(P+`IDENTITY_ELIGIBILITY_RUN_${i}_REV2.json`);assert.deepEqual(ar.rows,br.rows);assert.deepEqual(ar.prefixes,br.prefixes);assert.equal(ar.saveSha256,br.saveSha256);
 }
 const receipt={status:'PASS',scope:'Read-only decoding and independent qualification arithmetic of104 historical worker records;52 same cases with distinct successor identities and identical rows/prefixes. No fresh runtime/tests/build.',workers:104,rows,prefixChecksRepresented:prefixes,finalCases:52,finalPrefixes:312,checker:ref('scripts/check-history-identity-eligibility.mjs'),plans:[1,2].map(i=>ref(P+`IDENTITY_ELIGIBILITY_PLAN_REV${i}.json`))};
 fs.writeFileSync(O+'schema-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
}finally{await server.close();}
