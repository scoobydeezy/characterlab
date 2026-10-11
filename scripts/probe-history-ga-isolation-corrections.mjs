/** Direct before/after witnesses using exact pre-correction sources; no production edit. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/campaign3-history-ga-corrections-rev1/',read=p=>JSON.parse(fs.readFileSync(p));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const recovery=read(root+'source-recovery.json');
async function probe(old){
 const pins=Object.fromEntries((old?recovery.found:[]).map(x=>['/'+x.path,x.resolvedPath]));
 pins['/src/campaign3/attentionSelection.ts']='docs/planning/campaign3-history-attention-public-rev1/attentionSelection.original.ts';
 const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',plugins:[{name:'historical-correction-control',enforce:'pre',load(id){const p=Object.entries(pins).find(([s])=>id.replaceAll('\\','/').endsWith(s));if(p)return fs.readFileSync(p[1],'utf8');}}]});
 try {
  const m=await server.ssrLoadModule('/src/campaign3/encodingAccessMath.ts'),{ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
  const a=await server.ssrLoadModule('/src/campaign3/attentionSelection.ts'),{encodeSelectedEvidence:encode}=await server.ssrLoadModule('/src/campaign3/selectedEncoding.ts'),{attentionFixture}=await server.ssrLoadModule('/src/test/attentionFixtures.ts');
  const q=x=>x.numerator+'/'+x.denominator;
  const fixture=attentionFixture(),pool=a.prepareAttentionPool(fixture.experience,fixture.claims),view=()=>a.selectAttention(pool,2).view;
  const first=encode(view(),'independent','role-calibrated');assert.equal(q(first.rows[1].strength),'243/1243');
  const roleMutation=Reflect.set(first.rows[1].role,'numerator',0n),laterRoleStrength=q(encode(view(),'independent','role-calibrated').rows[1].strength);
  let sparse;
  try{const r=m.encodingBudget(['a'],new Array(1),'independent');sparse={accepted:true,length:r.length,hasFirst:Object.hasOwn(r,0)};}catch(e){sparse={accepted:false,error:String(e)};}
  const one=m.encodingBudget(['a'],[Q.of(1n)],'retired-flat')[0],oneMutation=Reflect.set(one,'numerator',99n),afterOne=q(m.boundedEncodingResponse(Q.of(1n)));
  const zero=m.residualAttention(Q.of(1n),0),zeroMutation=Reflect.set(zero,'numerator',99n),afterZero=q(m.presentationAccessibility([],0n,Q.of(1n),1));
  const t=await server.ssrLoadModule('/src/campaign3/observedMarkerTracking.ts'),tracker=t.createMarkerTracker('observer/a'),before=t.markerTrackingSnapshot(tracker);
  const detections=new Array(2);detections[1]={detectionId:2n,glyph:1n};let trackingError;
  try{t.applyMarkerSweep(tracker,{observerId:'observer/a',observationId:0n,occurredAt:1n,detections});assert.fail('sparse tracking unexpectedly accepted');}catch(e){trackingError=String(e);}
  assert.deepEqual(t.markerTrackingSnapshot(tracker),before);
  assert.deepEqual(t.applyMarkerSweep(tracker,{observerId:'observer/a',observationId:0n,occurredAt:1n,detections:[]}),[]);
  const sourcePaths=['src/campaign3/encodingAccessMath.ts','src/campaign3/selectedEncoding.ts','src/campaign3/observedMarkerTracking.ts','src/substrate/exactMath.ts','src/semanticBinding/perceptualContinuantFiles.ts','src/test/attentionFixtures.ts'];
  return {condition:old?'original':'corrected',roleMutation,laterRoleStrength,sparse,oneMutation,afterOne,zeroMutation,afterZero,trackingError,trackingUnchangedAfterFailure:true,emptyRetryAccepted:true,sourceBindings:sourcePaths.map(p=>({originalPath:p,...fp(pins['/'+p]??p)})),attention:fp(pins['/src/campaign3/attentionSelection.ts'])};
 }finally{await server.close();}
}
const before=await probe(true),after=await probe(false);
assert(before.roleMutation&&after.roleMutation);assert.equal(before.laterRoleStrength,'0/1');assert.equal(after.laterRoleStrength,'243/1243');
assert.deepEqual(before.sparse,{accepted:true,length:1,hasFirst:false});assert.equal(after.sparse.accepted,false);assert.match(after.sparse.error,/plain dense array/);
assert.equal(before.oneMutation,true);assert.equal(after.oneMutation,false);assert.equal(before.afterOne,'1/100');assert.equal(after.afterOne,'1/2');
assert.equal(before.zeroMutation,true);assert.equal(after.zeroMutation,false);assert.equal(before.afterZero,'99/1');assert.equal(after.afterZero,'0/1');
assert.match(before.trackingError,/TypeError/);assert.match(after.trackingError,/dense detection array/);
const result={status:'PASS',scope:'Five paired direct witnesses:role alias,sparse raw,sharedone,sharedzero,andtracking rejection boundary. Original snapshots SHA-authenticated; no production changes.',before,after,sourceRecovery:fp(root+'source-recovery.json'),checker:fp('scripts/probe-history-ga-isolation-corrections.mjs')};
const path=root+'paired-witnesses.json';if(fs.existsSync(path))assert.deepEqual(read(path),result);else fs.writeFileSync(path,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',pairedWitnesses:5,trackingStateUnchangedInBoth:true}));
