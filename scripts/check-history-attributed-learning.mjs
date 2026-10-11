import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),ref=path=>({path,sha256:sha(path)}),root='docs/planning/';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/campaign3/attributedCodecs.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),m=await server.ssrLoadModule('/src/campaign3/attributedModel.ts');
 const f=d.dataField,items=x=>d.dataItems(x,'list'),uint=x=>Number(d.dataUnsigned(x)),key=d.dataKey,holder=x=>{const i=m.HOLDERS.findIndex(h=>key(h)===key(x));assert(i>=0);return i;};
 const decode=h=>c.decodeAttributed(Uint8Array.from(Buffer.from(h,'hex')));
 const obs=v=>({id:key(f(v,1n)),holder:holder(f(v,2n)),at:Number(f(v,3n).value),own:items(f(v,4n)),report:items(f(v,5n)).map(uint),channel:uint(f(v,6n))});
 const knowledge=(v,i)=>{d.dataRecord(v,1134n);const person=d.dataRecord(f(v,2n),1147n);assert.equal(holder(f(person,1n)),i);assert.equal(holder(f(person,2n)),1);assert.equal(key(f(person,3n)),key(m.PROPOSITION));return {own:items(f(v,1n)).map(obs),reports:items(f(person,4n)).map(r=>{d.dataRecord(r,1146n);assert.equal(holder(f(r,2n)),1);assert.equal(key(f(r,3n)),key(m.PROPOSITION));return {observation:obs(f(r,1n)),status:uint(f(r,4n))};})};};
 const claim=k=>k.own.length?k.own.at(-1).own:[];
 const attributed=(k,law)=>{if(!k.reports.length||law===3)return 0;if(law!==2)return k.reports.at(-1).status;const counts=[1,2,3].map(s=>k.reports.filter(x=>x.status===s).length),maximum=Math.max(...counts),winners=counts.flatMap((n,i)=>n===maximum?[i+1]:[]);return winners.length===1?winners[0]:0;};
 let updates=0,probes=0,contexts=0,intents=0;const sources=[],runs=[];
 for(let worker=0;worker<4;worker++){
  const path=root+'attributed-public-workers-rev1/'+worker+'.json',w=JSON.parse(fs.readFileSync(path));sources.push(ref(path));
  for(const [name,v] of w.views){
   const row=w.results.find(r=>`${r.law}/${r.pressure}/${r.name}`===name);assert(row);const states=Array.from({length:3},()=>({own:[],reports:[]})),pending=new Map();let n=0;
   const status=i=>row.law===4&&i!==1?(claim(states[1]).length?(claim(states[1])[0]?3:2):1):attributed(states[i],row.law);
   for(const value of items(decode(v.outputs))){
    if(typeof value==='boolean'||value.kind!=='record')continue;const type=value.schema.typeId;
    if(type===1133n){const o=obs(value);pending.set(o.holder,o);}
    if(type===1143n){const i=holder(f(value,2n)),o=pending.get(i);assert(o);assert.deepEqual(knowledge(f(value,3n),i),states[i]);const next={own:[...states[i].own,...(o.own.length?[o]:[])],reports:[...states[i].reports,...(i!==1&&row.law!==3&&o.report.length?[{observation:o,status:o.report[0]}]:[])]};assert.deepEqual(knowledge(f(value,4n),i),next);states[i]=next;pending.delete(i);updates++;n++;}
    if(type===1136n){const i=holder(f(value,3n));assert.deepEqual(knowledge(f(value,4n),i),states[i]);assert.deepEqual(items(f(value,5n)),claim(states[i]));assert.equal(uint(f(value,6n)),status(i));probes++;}
    if(type===1137n){assert.deepEqual(knowledge(f(value,2n),0),states[0]);assert.equal(uint(f(value,4n)),status(0));contexts++;}
    if(type===1138n){assert.deepEqual(items(f(value,5n)),uint(f(value,4n))===1?claim(states[0]):[]);intents++;}
   }
   assert.equal(pending.size,0);assert.equal(n,12);runs.push({runIdentity:row.runIdentity,law:row.law,pressure:row.pressure,name:row.name,updates:n,final:states});
  }
 }
 assert.equal(runs.length,30);assert.equal(updates,360);assert.equal(probes,270);assert.equal(contexts,90);assert.equal(intents,90);
 const result={status:'PASS',scope:'Independent decoded own/report accumulation and projections; not independent reason-dice or physical execution reconstruction',updates,probes,contexts,intents,sources,artifacts:['src/campaign3/attributedCodecs.ts','src/campaign3/attributedModel.ts','src/campaign2/canonicalData.ts'].map(ref),checker:ref('scripts/check-history-attributed-learning.mjs'),runs},out=root+'campaign3-history-attributed-rev1/learning.json';
 if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:'PASS',runs:30,updates,probes,contexts,intents}));
}finally{await server.close();}
