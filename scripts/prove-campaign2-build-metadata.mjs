import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),hash=b=>createHash('sha256').update(b).digest('hex');
const targets=['src/campaign2/adaptationRuntime.ts','src/campaign2/factory.ts'];
const paths=[...targets,'src/substrate/random.ts','src/test/fixtures/campaign2BuildMetadata.ts'];
const fingerprints=paths.map(path=>({path,sha256:hash(fs.readFileSync(new URL(path,root)))}));
const results=[];
for(const target of [undefined,...targets]){
 const pair=[];
 for(const exposed of [false,true]){
  let transformed=0;
  const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},plugins:[{name:'bounded-build-inventory-substitution',enforce:'pre',transform(code,id){
   const path=id.replaceAll('\\','/');
   if(path.endsWith('/src/substrate/random.ts'))return code+`\nexport const qualificationBuildSchemaInventory=${exposed?'Object.values(randomSchemas)':'[]'};\n`;
   if(target&&path.endsWith('/'+target)){
    const site='randomRelevantAuthoritativeIds:()=>list([])';assert.equal(code.split(site).length-1,1);transformed++;
    // Deliberately conflates available schema definitions with model random-address identity metadata.
    return `import {qualificationBuildSchemaInventory as qualificationInventory} from '../substrate/random';\n`+code.replace(site,"randomRelevantAuthoritativeIds:()=>list(qualificationInventory.map(s=>({kind:'unsigned',value:s.typeId})))");
   }
  }}]});
  try{
   const inventory=await server.ssrLoadModule('/src/substrate/random.ts');
   const types=inventory.qualificationBuildSchemaInventory.map(s=>String(s.typeId));assert.equal(types.length,exposed?8:0);
   const assay=await server.ssrLoadModule('/src/test/fixtures/campaign2BuildMetadata.ts'),result=await assay.buildMetadata();
   assert.equal(transformed,target?1:0);pair.push({exposed,inventoryTypes:types,...result});
  }finally{await server.close();}
 }
 const [a,b]=pair;assert.equal(a.model,b.model);assert.equal(a.field9,a.empty);assert.equal(a.restored,a.save);
 if(!target){assert.deepEqual(a.save,b.save);assert.equal(b.restored,b.save);assert.equal(b.field9,b.empty);}
 else if(target===targets[0]){assert.notEqual(b.field9,b.empty);assert.notEqual(a.save,b.save);assert.equal(b.restored,undefined);}
 else{assert.equal(a.save,b.save);assert.equal(b.field9,b.empty);assert.equal(b.restored,undefined);}
 results.push({target:target??'baseline',status:target?'DETECTED':'PASS',pair});
}
for(const p of fingerprints)assert.equal(hash(fs.readFileSync(new URL(p.path,root))),p.sha256);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_BUILD_METADATA_PROOF.json',root),JSON.stringify({status:'BOUNDED EXCLUSION COMPONENT PASS',sourceFingerprints:fingerprints,results,limitations:[
 'Inventory intervention exposes zero versus eight existing RNG schema definitions to an isolated build-global catalog; actual codec support is unchanged.',
 'No accepted RNG-consuming seam exists or is fabricated. No random draws, handlers, registry declarations or model changes are introduced.',
 'Two substitutions scan build-global schemas into field9; this is a concrete alternative, not exhaustive exclusion of all possible build dependencies.',
 'PERSIST-I remains FROZEN / DEFERRED / NOT PASSED; this is not its positive witness.',
 'Complete canonical bytes are compared; hashes are source-preservation diagnostics only.'
]},null,2)+'\n');
console.log(JSON.stringify(results.map(r=>({target:r.target,status:r.status}))));
