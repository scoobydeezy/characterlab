import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'EMOTIONAL_DISPLAY_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'EMOTIONAL_DISPLAY_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/emotionalDisplayModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/emotionalDisplayCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'emotionalDisplay-public-workers-rev1/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,pressure,severity,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.pressure===Number(pressure)&&r.severity===Number(severity)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodeEmotionalDisplay(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,32);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,32);assert.equal(views.size,32);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const math=await server.ssrLoadModule('/src/campaign3/emotionalDisplayMath.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts');
  const get=(name,law=1,pressure=2,severity=2)=>views.get(law+'/'+pressure+'/'+severity+'/'+name),f=data.dataField,items=data.dataItems;
  const records=(name,type,law=1,pressure=2,severity=2)=>get(name,law,pressure,severity).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational;
  const knowledge=(name,i,law=1,pressure=2,severity=2)=>f(records(name,1110n,law,pressure,severity).filter(v=>data.dataKey(f(v,2n))===data.dataKey(m.HOLDERS[i])).at(-1),4n);
  const value=(name,i,cue=false,law=1,pressure=2,severity=2)=>math.estimate(knowledge(name,i,law,pressure,severity),cue);
  eq(records('main',1113n),records('main',1113n,1,1));eq(f(records('main',1105n)[0],5n),list([false]));eq(f(records('main',1105n,1,1)[0],5n),list([true]));for(const v of records('calm',1105n))eq(f(v,5n),list([false]));
  eq(f(records('main',1113n)[0],8n),list([q(1,1),q(1,1)]));eq(f(records('calm',1113n)[0],8n),list([q(0,1),q(0,1)]));eq(f(records('main',1113n,1,2,0)[0],8n),list([q(0,1),q(0,1)]));eq(f(records('main',1113n,1,2,1)[0],8n),list([q(1,2),q(1,2)]));
  eq(f(records('reserve',1113n)[0],6n),list([q(0,1)]));eq(f(records('reserve',1113n)[0],8n),list([q(1,2),q(1,2)]));eq(f(records('control',1113n)[2],7n),list([q(1,1)]));eq(f(records('control',1113n)[2],8n),list([q(1,1),q(0,1)]));
  for(const name of ['unknown','missingContext','unknownControl'])for(const a of records(name,1113n))eq(f(a,8n),list([]));
  for(const t of [425n,426n,1105n])eq(records('main',t),records('failed',t));eq(value('failed',1),list([]));eq(value('failed',1,true),list([q(1,1)]));eq(value('noDisplay',1,true),list([]));eq(value('calm',1,true),list([q(0,1)]));
  eq(value('noChannels',1),list([]));eq(value('noChannels',1,true),list([]));eq(value('noChannels',1,true,4),list([q(1,1)]));eq(value('main',1,true,5),list([q(0,1)]));eq(value('main',1,true,3),list([]));
  eq(f(records('interior',1108n)[1],6n),list([q(1,4)]));eq(f(records('interior',1108n,2)[1],6n),list([q(0,1)]));
  eq(value('split',1),list([q(0,1)]));eq(value('split',1,true),list([]));eq(value('split',2),list([]));eq(value('split',2,true),list([q(1,1)]));eq(records('main',1100n),records('main',1100n,6));eq(value('main',1,true,6),list([]));
  for(const out of records('main',409n,1,3)){const d=choice.chosenData(out);assert.equal(items(f(d,9n),'list').length,2);for(const p of items(f(d,2n),'list'))eq(f(p,2n),q(1,2));}
  for(const pressure of [2,3]){eq(get('main',1,pressure).observerViews,get('hiddenTruth',1,pressure).observerViews);eq(get('main',1,pressure).observerViews[1],get('noA',1,pressure).observerViews[1]);eq(get('main',1,pressure).observerViews[0],get('noB',1,pressure).observerViews[0]);eq(get('unknown',1,pressure).observerViews,get('deniedChange',1,pressure).observerViews);}
const O=p+'campaign3-history-emotional-display-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original emotional-display assertions over all32 stored worker views; no fresh simulation/prefix restore.',runs:32,storedPrefixes:160,checkerSha256:hash(fs.readFileSync('scripts/check-history-emotional-display.mjs')),resultSha256:hash(fs.readFileSync(p+'EMOTIONAL_DISPLAY_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS32 stored views and original emotional-display contrasts.');
}finally{await server.close();}
