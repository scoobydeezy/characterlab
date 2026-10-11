import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),ref=path=>({path,sha256:sha(path)}),root='docs/planning/';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/campaign3/interpretationCodecs.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),m=await server.ssrLoadModule('/src/campaign3/interpretationModel.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const f=d.dataField,items=x=>d.dataItems(x,'list'),uint=x=>Number(d.dataUnsigned(x)),key=d.dataKey,holder=x=>{const i=m.HOLDERS.findIndex(h=>key(h)===key(x));assert(i>=0);return i;},decode=h=>c.decodeInterpretation(Uint8Array.from(Buffer.from(h,'hex')));
 const obs=v=>({id:key(f(v,1n)),holder:holder(f(v,2n)),at:Number(f(v,3n).value),value:items(f(v,4n)).map(x=>typeof x==='boolean'?x:uint(x)),context:uint(f(v,5n))});
 const meaning=v=>({id:key(f(v,1n)),observation:obs(f(v,2n)),meaning:items(f(v,3n))});
 const history=(v,i)=>{d.dataRecord(v,1117n);return items(f(v,1n)).map(i===0?obs:meaning);};
 const estimate=(xs,latest)=>{let values=xs.flatMap(x=>x.meaning);if(latest)values=values.slice(-1);if(!values.length)return canonical.list([]);let n=values.filter(x=>x===true).length,z=values.length;const gcd=(a,b)=>b?gcd(b,a%b):a,g=gcd(n,z);return canonical.list([canonical.rational(n/g,z/g)]);};
 let updates=0,interpretations=0,probes=0,intents=0,executions=0;const sources=[],runs=[];
 for(let worker=0;worker<4;worker++){
  const path=root+'interpretation-public-workers-rev1/'+worker+'.json',w=JSON.parse(fs.readFileSync(path));sources.push(ref(path));
  for(const [name,v] of w.views){
   const row=w.results.find(r=>`${r.law}/${r.pressure}/${r.name}`===name);assert(row);const originals=new Map(items(decode(row.orderedInputs)).map(x=>[Number(f(x,1n).value),x])),states=[[],[],[]],pending=new Map(),observed=new Map();let intended=[],signal=[],privateContext=0,at=0,n=0;
   for(const value of items(decode(v.outputs))){
    if(typeof value==='boolean'||value.kind!=='record')continue;const type=value.schema.typeId;
    if(type===1116n){const o=obs(value);at=o.at;const source=originals.get(at);assert.deepEqual(o.value,f(source,4n)?[f(source,3n)]:[]);assert.equal(o.context,f(source,4n)?uint(f(source,8n)):0);pending.set(0,o);}
    if(type===1126n){const i=holder(f(value,2n)),e=pending.get(i);assert(e);assert.deepEqual(history(f(value,3n),i),states[i]);const present=i===0?e.value.length:e.observation.value.length,next=[...states[i],...(present&&(i===0||row.law!==4)?[e]:[])];assert.deepEqual(history(f(value,4n),i),next);states[i]=next;pending.delete(i);updates++;n++;}
    if(type===1119n){const i=holder(f(value,3n));assert(i>0);assert.deepEqual(history(f(value,4n),i),states[i]);assert.equal(key(f(value,5n)),key(estimate(states[i],row.law===5)));probes++;}
    if(type===1120n){assert.deepEqual(history(f(value,2n),0),states[0]);privateContext=states[0].length?states[0].at(-1).context:0;}
    if(type===1121n){intended=uint(f(value,4n))===1&&states[0].length?states[0].at(-1).value:[];assert.deepEqual(items(f(value,5n)),intended);intents++;}
    if(type===1124n){const produced=intended.length&&privateContext?[Number((intended[0]===true)===(privateContext===1)?1:2)]:[],delivered=!!produced.length&&f(originals.get(at),5n)===true;assert.equal(f(value,4n),delivered);signal=delivered?produced:[];assert.deepEqual(items(f(value,5n)).map(uint),signal);executions++;}
    if(type===1129n){const o=obs(value),i=o.holder,source=originals.get(at);assert(i>0);assert.deepEqual(o.value,f(source,BigInt(i+5))?signal:[]);assert.equal(o.context,f(source,BigInt(i+10))?uint(f(source,BigInt(i+8))):0);observed.set(i,o);}
    if(type===1130n){const e=meaning(value),i=e.observation.holder,o=observed.get(i);assert.deepEqual(e.observation,o);const context=row.law===2?1:o.context,expected=!o.value.length||row.law===6?[]:row.law===3?intended:context===0?[]:[(o.value[0]===1)===(context===1)];assert.deepEqual(e.meaning,expected);pending.set(i,e);interpretations++;}
   }
   assert.equal(pending.size,0);assert.equal(n,9);runs.push({runIdentity:row.runIdentity,law:row.law,pressure:row.pressure,name:row.name,final:states});
  }
 }
 assert.equal(runs.length,29);assert.equal(updates,261);assert.equal(interpretations,174);assert.equal(probes,174);assert.equal(intents,87);assert.equal(executions,87);
 const result={status:'PASS',scope:'Independent decoded admitted inputs, encoding/delivery, interpretation, learning and probe arithmetic; reason-dice choices verified by original replay rather than independently derived',updates,interpretations,probes,intents,executions,sources,artifacts:['src/campaign3/interpretationCodecs.ts','src/campaign3/interpretationModel.ts','src/campaign2/canonicalData.ts'].map(ref),checker:ref('scripts/check-history-interpretation-learning.mjs'),runs},out=root+'campaign3-history-interpretation-rev1/learning.json';
 if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:'PASS',runs:29,updates,interpretations,probes,intents,executions}));
}finally{await server.close();}
