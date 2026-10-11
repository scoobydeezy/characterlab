// Recompile existing sources; never invoke the original freeze writers.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),hex=b=>Buffer.from(b).toString('hex');
const base='docs/planning/',out=base+'campaign3-history-common-freezes-rev1/';
const artifacts=read(base+'public-wrapper-quiescence-rev1/PRESERVATION.json').artifacts;
const candidates=artifacts.filter(a=>a.original.endsWith('/FREEZE.json')).filter(a=>Object.keys(read(a.original)).sort().join(',')==='allocationSha256,contractSha256,date,models,status');assert.equal(candidates.length,41);
const writers=fs.readdirSync('scripts').filter(n=>/^freeze-.*-models.*\.mjs$/.test(n)).map(n=>'scripts/'+n);
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'}),rows=[];
try{
 const canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 for(const a of candidates){
  assert.equal(sha(a.original),a.sha256);assert.equal(sha(a.archive),a.sha256);
  const v=read(a.original),directory=path.posix.dirname(a.original),lookup=directory.replace('longitudinal-model-rev1','longitudinal-model-rev2').replace('relationship-model-rev1','relationship-model-rev2');
  const matches=writers.filter(p=>fs.readFileSync(p,'utf8').includes(lookup));assert.equal(matches.length,1,directory);
  const writer=matches[0],text=fs.readFileSync(writer,'utf8'),modules=[...text.matchAll(/ssrLoadModule\(['"](\/src\/campaign3\/\w+Model.ts)/g)].map(m=>m[1]);assert.equal(modules.length,1);
  const modulePath=modules[0].slice(1),mod=await server.ssrLoadModule(modules[0]),compilers=Object.keys(mod).filter(n=>/^compile\w+Model$/.test(n));assert.equal(compilers.length,1);
  const old=artifacts.find(x=>x.original===modulePath);assert(old);assert.equal(sha(modulePath),old.sha256);
  const names=new Set(),models=[];
  for(const m of v.models){
   assert(!names.has(m.name));names.add(m.name);const source={};
   for(const f of m.files){assert.equal(sha(f.path),f.sha256);const name=path.basename(f.path,'.cenc.hex'),s=fs.readFileSync(f.path,'utf8').trim();assert(/^(?:[0-9a-f]{2})+$/.test(s));source[name]=new Uint8Array(Buffer.from(s,'hex'));}
   assert.equal(hex(source['model-identity']),m.modelIdentity);
   const compiled=await mod[compilers[0]]({parameters:source.parameters,content:source.content,registry:source.registry});assert.equal(hex(compiled.modelIdentity.canonicalBytes),m.modelIdentity,m.name);
   const claims=Object.fromEntries(Object.entries(m).filter(([k])=>!['name','modelIdentity','files'].includes(k)));
   for(const[k,value]of Object.entries(claims)){const actual=k==='settings'?compiled.settings:compiled[k]??compiled.settings?.[k];if(actual?.kind==='rational'&&typeof value==='number'){assert(Number.isSafeInteger(value));assert.equal(actual.numerator,BigInt(value)*actual.denominator);}else if(k==='settings'&&actual?.revision!==undefined&&value.revision===undefined){assert(directory.endsWith('longitudinal-model-rev1')||directory.endsWith('relationship-model-rev1'));assert.equal(actual.revision,1);const {revision,...original}=actual;assert.deepEqual(original,value);}else assert.deepEqual(actual,value,directory+'/'+m.name+'/'+k);}
   if(source['initial-state'])assert.equal(hex(canonical.canonicalEncode(compiled.initial.canonicalValue())),hex(source['initial-state']),m.name+'/initial');
   models.push({name:m.name,claims,files:m.files.length,initialStateChecked:!!source['initial-state']});
  }
  rows.push({...a,writer:{path:writer,sha256:sha(writer)},module:{path:modulePath,sha256:sha(modulePath)},models});console.log(directory,models.length,'identities/settings PASS');
 }
 const result={status:'41 COMMON FREEZE COHORTS RECOMPILED',rows,models:rows.reduce((n,r)=>n+r.models.length,0),initialStates:rows.reduce((n,r)=>n+r.models.filter(m=>m.initialStateChecked).length,0),scope:'Exact frozen file hashes,compiled identities,declared settings and included initial states. No fresh behavioral trajectory,public restore matrix,independent chronology or universal model uniqueness claim.',checkerSha256:sha('scripts/check-history-common-freezes.mjs')};
 fs.mkdirSync(out,{recursive:true});const file=out+'canonical-check.json';if(fs.existsSync(file))assert.deepEqual(read(file),result);else fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
}catch(e){console.error(e.message);process.exitCode=1;}finally{await server.close();}
