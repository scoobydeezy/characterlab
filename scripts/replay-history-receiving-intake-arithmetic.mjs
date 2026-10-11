// Research arithmetic only: no new codec, ID allocation, model or runtime authority.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const output='docs/planning/EMBODIED_RECEIVING_ARITHMETIC_REV1.json';
// Audit copy compares the original receipt; no original write.
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try {
 const {ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const {unsigned}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {bounded,convolve,expectation,analyzeOptions,ONE,ZERO}=await server.ssrLoadModule('/src/campaign2/cognitiveMath.ts');
 const str=q=>`${q.numerator}/${q.denominator}`;
 const cutoffs=[Q.of(1n,20n),Q.of(1n,10n),Q.of(1n,5n),Q.of(3n,10n),Q.of(2n,5n)];
 const die=p=>{const b=bounded(p);let d=4n;cutoffs.forEach((c,i)=>{if(b.compare(c)>=0)d=[4n,6n,8n,10n,12n][i];});return d;};
 const fair=d=>new Map(Array.from({length:Number(d)},(_,i)=>[BigInt(i+1),Q.of(1n,d)]));
 const p=Q.of(1n,3n),task=Q.of(1n,4n);
 function compare(name,a,b){
  const option=(i,dice)=>({key:unsigned(i),distribution:dice.reduce((d,n)=>convolve(d,fair(n)),new Map([[0n,ONE]])),reasonMass:dice.reduce((v,n)=>v.add(expectation(fair(n))),ZERO)});
  const result=analyzeOptions([option(1,a),option(2,b)],Q.of(1n,10n),Q.of(1n,10n));
  return {name,dice:[a.map(String),b.map(String)],probabilities:result.probabilities.map(v=>str(v.probability)),margin:str(result.margin),contest:str(result.contest),stake:str(result.stake),authorship:str(result.authorshipPotential),mode:result.mode};
 }
 const contrasts=[
  compare('independent task+body on A versus body on B',[die(task),die(p)],[die(p)]),
  compare('drop task independent ground',[die(p)],[die(p)]),
  compare('drop body shared ground',[die(task)],[die(p)]),
  compare('duplicate descriptions consolidated on A versus task on B',[die(p)],[die(task)]),
  compare('no-overlap alternative incorrectly sums descriptions',[die(p.add(p))],[die(task)]),
  compare('one-die-per-description alternative',[die(p),die(p)],[die(task)]),
 ];
 assert.notDeepEqual(contrasts[0].probabilities,contrasts[1].probabilities);
 assert.notDeepEqual(contrasts[0].probabilities,contrasts[2].probabilities);
 assert.notDeepEqual(contrasts[3].probabilities,contrasts[4].probabilities);
 assert.notDeepEqual(contrasts[3].probabilities,contrasts[5].probabilities);
 assert.equal(die(Q.of(1n,6n)),6n);assert.equal(die(p),8n);assert.equal(die(Q.of(5n,6n)),12n);
 const fingerprint=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
 compareAudit(output,JSON.stringify({status:'FINITE RECEIVING CALIBRATION DISTINGUISHES THE PROPOSED ALTERNATIVES; NOT RUNTIME PROOF',calibration:{taskPressure:str(task),bodyPressure:str(p),cutoffs:cutoffs.map(str),activationThreshold:'0/1',thetaRoll:'1/10',thetaPlayer:'1/10'},contrasts,sources:['scripts/explore-embodied-receiving.mjs','src/campaign2/cognitiveMath.ts','src/substrate/exactMath.ts'].map(fingerprint),limits:['Uses the actual shared exact arbitration kernel with mathematical option labels, not canonical mixed records.','Body/task source authenticity, overlap admission, public runtime and RNG are not exercised.','No allocation, model commitment, reduction verdict or EMB-M..O pass.']},null,2)+'\n');
 console.log(JSON.stringify({status:'PASS',contrasts:contrasts.length,scope:'arithmetic only'}));
} finally {await server.close();}

function compareAudit(original,json){
 assert.deepEqual(JSON.parse(json),JSON.parse(fs.readFileSync(original)));
 const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
 const dir='docs/planning/campaign3-history-receiving-intake-rev1';fs.mkdirSync(dir,{recursive:true});
 const result={status:'PASS',contrasts:6,scope:'Actual shared exact arbitration kernel with mathematical labels; no public source, RNG or new model',original:fp(original),checker:fp('scripts/replay-history-receiving-intake-arithmetic.mjs')};
 const target=dir+'/arithmetic.json';if(fs.existsSync(target))assert.deepEqual(JSON.parse(fs.readFileSync(target)),result);else fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n');
}
