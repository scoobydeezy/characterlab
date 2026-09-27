import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';

const root='docs/planning/public-wrapper-quiescence-rev1';
const sha=b=>createHash('sha256').update(b).digest('hex');
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const candidates=fs.readdirSync('src/campaign3').filter(n=>n.endsWith('Runtime.ts')&&fs.readFileSync('src/campaign3/'+n,'utf8').includes('createCanonicalSave')).sort();
if(process.argv.includes('--preserve')){
 assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
 const seen=new Set();
 function visit(p){p=p.replaceAll('\\','/');if(seen.has(p))return;seen.add(p);if(!p.endsWith('.ts'))return;
  for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){
   const base=path.resolve(path.dirname(p),m[1].split('?')[0]),found=[base,base+'.ts',base+'.json',path.join(base,'index.ts')].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());assert(found,p);visit(path.relative(process.cwd(),found));
  }
 }
 for(const dir of ['src/campaign3','src/campaign2','src/substrate','src/test'])for(const name of fs.readdirSync(dir))if(name.endsWith('.ts'))visit(dir+'/'+name);
 const artifacts=[...seen].sort().map(original=>{const archive=root+'/'+original;fs.mkdirSync(path.dirname(archive),{recursive:true});fs.copyFileSync(original,archive,fs.constants.COPYFILE_EXCL);return {original,archive,sha256:sha(fs.readFileSync(original))};});
 write(root+'/PRESERVATION.json',{status:'PRE-REPAIR SOURCE GRAPH',artifacts});
 const inventory=candidates.map(n=>{const p='src/campaign3/'+n,s=fs.readFileSync(p,'utf8');return {path:p,sha256:sha(fs.readFileSync(p)),ledgerAfterScheduler:/random.commit\(\)|committed.push/.test(s),serializedLedger:/continuingRunInputs:list\((?:random|committed)/.test(s),alreadyGuarded:s.includes('guardIdentityBeliefSettlement'),settlement:s.match(/async function settle[^\n]*/)?.[0],publication:s.split('\n').filter(l=>/snapshot[:(]|save:|committedRandomAddressKeys:|view,/.test(l))};});
 write(root+'/INVENTORY.json',{scope:'All Campaign3 native createCanonicalSave runtimes; Campaign2 adaptation and generic substrate separately reviewed.',inventory});
 console.log('Preserved '+artifacts.length+' artifacts; '+inventory.length+' native runtimes.');
}else{
 const revision=process.argv.find(x=>x.startsWith('--revision='))?.split('=')[1]??'1';
 const only=process.argv.find(x=>x.startsWith('--only='))?.slice(7);
 const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
 const load=n=>server.ssrLoadModule('/'+n);
 try{
  const names=['identityTask','identityBiology','biologyPublic',...candidates.filter(n=>fs.readFileSync('src/campaign3/'+n,'utf8').includes('random.commit()')).map(n=>n.replace('Runtime.ts','')).filter(n=>!['multisource','receiving','longitudinal'].includes(n))];
  for(const name of names.filter(n=>!only||n===only)){
   const out=root+'/'+name+'-probe-rev'+revision+'.json';if(fs.existsSync(out)){console.log('Retained '+out);continue;}
   try{
    let runtime,model,input;
    if(name.startsWith('identity')){const fx=await load('src/test/identityPublicFixtures.ts');({runtime,model,input}=await fx.runtime(name==='identityTask'?fx.taskCase():fx.bioCase()));}
    else if(name==='biologyPublic'){
     const fx=await load('src/test/biologyPublicFixtures.ts'),m=await load('src/campaign3/biologyPublicModel.ts'),r=await load('src/campaign3/biologyPublicRuntime.ts'),c=fx.matchedBiology();
     model=await m.compileBiologyModel(m.biologyRecipe(c.law,c.config));input=await m.compileBiologyInputs(model,m.initialBytes(c.config.initial),m.orderedBytes(c.frames),new Uint8Array(32).fill(7));runtime=r.createBiologyRuntime(model,input);
    }else{
     const fx=await load('src/test/'+name+'Fixtures.ts'),m=await load('src/campaign3/'+name+'Model.ts'),r=await load('src/campaign3/'+name+'Runtime.ts'),cap=name==='personstate'?'PersonState':name[0].toUpperCase()+name.slice(1),cases=fx.cases();
     const selected=Array.isArray(cases)?cases.find(c=>c.name==='continued')??cases[0]:cases.main??Object.values(cases)[0];
     model=await m['compile'+cap+'Model'](m[name+'Recipe']());input=await m['compile'+cap+'Inputs'](model,fx.initialState,fx.ordered(selected.inputs??selected),typeof fx.seed==='function'?fx.seed(selected.seed??0):fx.seed);runtime=r['create'+cap+'Runtime'](model,input);
    }
    const rows=[];
    for(let at=1;at<=64;at++){
     let observed;
     const result=await runtime.settleForConformance({onBoundary(b){if(b==='before-commit')queueMicrotask(()=>{
      try{observed={accepted:true,saveSha256:sha(runtime.save())};}catch(e){observed={accepted:false,error:String(e)};}
      try{runtime.snapshot();observed.snapshotAccepted=true;}catch(e){observed.snapshotAccepted=false;}
     });}});
     if(!result)break;assert(observed);const final=sha(runtime.save());rows.push({at,observed,final,partialSave:observed.accepted&&observed.saveSha256!==final});
    }
    write(out,{name,status:'PROBED',modelIdentitySha256:sha(model.modelIdentity.canonicalBytes),runIdentitySha256:sha(input.runIdentity.canonicalBytes),rows,torn:rows.some(r=>r.partialSave)});console.log(name+': '+rows.length+' instants; torn='+rows.some(r=>r.partialSave));
   }catch(e){write(out,{name,status:'HARNESS_ERROR',error:String(e)});console.error(name+': '+String(e));}
  }
 }finally{await server.close();}
}
