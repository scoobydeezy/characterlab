import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',dir=p+'defining-public-matrix-rev1',read=f=>JSON.parse(fs.readFileSync(f)),hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),hex=b=>Buffer.from(b).toString('hex'),unhex=s=>new Uint8Array(Buffer.from(s,'hex'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const ids=await server.ssrLoadModule('/src/substrate/identity.ts'),model=await server.ssrLoadModule('/src/campaign3/definingPublicModel.ts'),can=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 const manifest=read(dir+'/MANIFEST.json'),manifestHash=hash(dir+'/MANIFEST.json'),ms=[],rs=[],rows=[];
 for(let i=0;i<68;i++){
  const b=read(dir+'/CASE_'+String(i).padStart(2,'0')+'/BASELINE.json');assert.equal(b.manifestHash,manifestHash);assert.deepEqual(b.spec,manifest.cases[i]);
  const m=await ids.restoreModelIdentity(model.parseDefiningPublic(unhex(b.modelIdentity))),r=await ids.restoreRunIdentity(model.parseDefiningPublic(unhex(b.runIdentity))),rv=data.dataRecord(r.value,104n);
  assert.equal(hex(can.canonicalEncode(data.dataField(rv,1n))),b.modelIdentity);
  for(const [field,value]of [[2n,b.initialState],[3n,b.orderedInputs],[4n,'00'.repeat(32)]]){const v=data.dataField(rv,field);assert.equal(v.kind,'bytes');assert.equal(hex(v.value),value);}
  ms.push(m);rs.push(r);rows.push({index:i,modelIdentity:b.modelIdentity,runIdentity:b.runIdentity,modelDigest:hex(m.digest),runDigest:hex(r.digest)});
 }
 const experiment=await ids.createExperimentIdentity('0.29.0','defining-public-matrix/0.1-candidate;manifest-sha256='+manifestHash,'qualify-defining-public-matrix/0.1;sha256='+hash('scripts/qualify-defining-public-matrix.mjs'));
 const coupling=can.list([can.text('Same fixed zero32 seed; original acquired source; only the declared law/goal/rehearsal/capacity/horizon/cue/report/diagnostic interventions differ. No random readdressing.'),can.text(manifestHash),can.list(manifest.cases.map(s=>can.text(JSON.stringify(s))))]);
 const comparison=await ids.createComparisonCase(ms,rs,coupling);
 const result={status:'EXPLICIT IDENTITIES VERIFIED',scope:'Comparison identity derived from the pre-execution frozen recipe/source manifest and actual baseline IDs; not a separate pre-execution identity packet. Identity metadata never enters runtime execution.',corpusVersion:'0.29.0',manifestHash,experimentIdentity:hex(experiment.canonicalBytes),experimentDigest:hex(experiment.digest),comparisonCase:hex(comparison.canonicalBytes),comparisonDigest:hex(comparison.digest),runs:rows,derivationScript:hash('scripts/identify-defining-public-matrix.mjs')};
 const out=p+'DEFINING_PUBLIC_IDENTITIES_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),result);console.log('PASS explicit experiment/comparison and68 model/run identities.');
}finally{await server.close();}
