import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {createServer} from 'vite';

const root='docs/planning/workbench-bio-comparison-rev2';
const prior='docs/planning/workbench-bio-parity-rev1';
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(root),'Never replace an existing audit');
fs.mkdirSync(root,{recursive:true});
const parity=read(prior+'/receipt.json');
const paths=[...new Set([...parity.sources.map(s=>s.path),
  'src/workbench/bioComparison.ts','src/test/workbenchBioComparison.test.ts',
  'scripts/check-workbench-bio-comparison-full.mjs',prior+'/receipt.json'])];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
for(const source of sources){
  const target=root+'/sources/'+source.path;
  fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});
  fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});
}
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const inputs=parity.cases.map(c=>{
  const path=prior+'/'+c.path;
  assert.equal(sha(fs.readFileSync(path)),c.sha256);
  return {...c,data:read(path)};
});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
  const {BioWorkbenchRun,BIO_CASES}=await server.ssrLoadModule('/src/workbench/bioAdapter.ts');
  const {compareBioSnapshots,BIO_COMPARISONS}=await server.ssrLoadModule('/src/workbench/bioComparison.ts');
  assert.equal(BIO_CASES.length,13);assert.equal(BIO_COMPARISONS.length,19);
  const snapshots=new Map(),cases=[];
  for(const [index,name] of BIO_CASES.entries()){
    const run=await BioWorkbenchRun.create(name),original=inputs.find(c=>c.name===name).data,rows=[];
    for(let prefix=0;prefix<=19;prefix++){
      const before=run.checkpoint(),snapshot=run.snapshot(),expected=original.prefixes[prefix];
      assert.equal(snapshot.prefix,prefix);assert.equal(snapshot.complete,prefix===19);
      for(const key of ['modelHash','runHash','stateHash','saveHash'])assert.equal(snapshot[key],expected[key]);
      assert.deepEqual(snapshot.records,original.finalRecords.slice(0,prefix));
      assert.equal(sha(JSON.stringify(snapshot.records)),expected.recordsHash);
      assert.deepEqual(run.checkpoint(),before);rows.push(snapshot);
      assert.equal(await run.advance(),prefix<19);
    }
    const path=`case-${String(index).padStart(2,'0')}.json.gz`;
    fs.writeFileSync(root+'/'+path,gzipSync(JSON.stringify(rows),{level:9}),{flag:'wx'});
    snapshots.set(name,rows);cases.push({name,path,sha256:sha(fs.readFileSync(root+'/'+path))});
    console.log(`PASS BIO full comparison source ${index+1}/13 ${name}`);
  }
  const reports=[];
  let observations=0,unaligned=0;
  for(const [index,spec] of BIO_COMPARISONS.entries()){
    const aa=snapshots.get(spec.control),bb=snapshots.get(spec.candidate),rows=[];
    for(let prefix=0;prefix<=19;prefix++){
      const a=aa[prefix],b=bb[prefix],before=JSON.stringify([a,b]);
      const report=await compareBioSnapshots(spec.id,a,b);
      assert.equal(report.status,'ALIGNED_COMPONENT_PREFIX');assert.equal(report.records.length,prefix);
      for(const [flag,key] of [['modelEqual','modelHash'],['runEqual','runHash'],['stateEqual','stateHash'],['saveEqual','saveHash']])assert.equal(report.identity[flag],a[key]===b[key]);
      assert.equal(report.currentHistoryEqual,a.history===b.history);assert.equal(report.currentArchiveEqual,a.archive===b.archive);
      for(let i=0;i<prefix;i++){
        const x=a.records[i],y=b.records[i],r=report.records[i];
        assert.equal(r.ordinal,i+1);assert.equal(r.recordEqual,x.canonicalHex===y.canonicalHex);
        for(const [field,key] of [['choice','chosen'],['probabilities','probabilities'],['modifiers','modifiers'],['strength','strength'],['authorship','authorship']]){
          assert.deepEqual(r[field].control,x.summary[key]);assert.deepEqual(r[field].candidate,y.summary[key]);
          assert.equal(r[field].equal,JSON.stringify(x.summary[key])===JSON.stringify(y.summary[key]));
        }
        for(const key of ['history','archive','expression','display','context','raw','reasons'])assert.equal(r[key+'Equal'],x.summary[key]===y.summary[key]);
        assert.equal(r.rng.controlSeed,x.summary.seed);assert.equal(r.rng.candidateSeed,y.summary.seed);
        for(const [field,key] of [['AddressKeys','addresses'],['Draws','draws']]){
          assert.deepEqual(r.rng['control'+field],x.summary[key]);assert.deepEqual(r.rng['candidate'+field],y.summary[key]);
        }
        assert.equal(r.rng.addressKeysEqual,JSON.stringify(x.summary.addresses)===JSON.stringify(y.summary.addresses));
        assert.equal(r.rng.drawRecordsEqual,JSON.stringify(x.summary.draws)===JSON.stringify(y.summary.draws));
        assert.equal(r.rng.nondecisionEqual,x.summary.nondecision===y.summary.nondecision);
        observations++;
      }
      assert.deepEqual(await compareBioSnapshots(spec.id,a,b),report);
      assert.equal(JSON.stringify([a,b]),before);rows.push(report);
      if(prefix<19){
        const unequal=await compareBioSnapshots(spec.id,a,bb[prefix+1]);
        assert.equal(unequal.status,'UNALIGNED_PREFIXES');assert(!('records' in unequal));unaligned++;
      }
    }
    const path=`pair-${String(index).padStart(2,'0')}.json.gz`;
    fs.writeFileSync(root+'/'+path,gzipSync(JSON.stringify(rows),{level:9}),{flag:'wx'});
    reports.push({id:spec.id,path,sha256:sha(fs.readFileSync(root+'/'+path)),prefixes:rows.length});
    console.log(`PASS BIO comparison ${index+1}/19 ${spec.id}`);
  }
  for(const source of sources)assert.equal(sha(fs.readFileSync(source.path)),source.sha256,source.path);
  fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL RETAINED BIO COMPARISON COHORT',sources,cases,reports,
    nativeInputs:inputs.map(({data,...input})=>input),counts:{cases:cases.length,nativePrefixes:260,pairs:reports.length,alignedPrefixes:380,recordObservations:observations,unalignedChecks:unaligned},
    scope:'All13 original composed-component runs/260 prefixes match prior native parity identities, save/state hashes and exact records. All19 declared comparisons/380 aligned prefixes verify every projected field and RNG distinction against those records, repeat deterministically without input mutation; 361 unequal horizons withhold record equality. No observer-safe language, full browser coverage, public-factory admission, causal necessity, reduction or Campaign4 entry claim.'},null,2)+'\n',{flag:'wx'});
  console.log('PASS full BIO comparison cohort');
}catch(error){fs.writeFileSync(root+'/failure.json',JSON.stringify({error:String(error),stack:error.stack},null,2)+'\n',{flag:'wx'});throw error;}
finally{await server.close();}
