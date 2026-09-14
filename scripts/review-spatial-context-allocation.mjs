import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const output='docs/planning/SPATIAL_CONTEXT_ALLOCATION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const faults=[
 ['exclusive-boundary','x >= calibration.minX','x > calibration.minX','boundary'],
 ['unknown-consumes-pool',"rows.filter(r => r.spatialClass === 'SpatialPeripheral').length","rows.filter(r => r.spatialClass !== 'SpatialFocal').length",'residual'],
 ['no-footprint-division','pool.divide(Q.of(BigInt(peripheralCount)))','pool','dense'],
 ['unknown-as-zero',"r.spatialClass === 'SpatialUnknown' ? r :", "r.spatialClass === 'SpatialUnknown' ? {...r,allocation:Q.of(0n)} :",'unknown'],
 ['coordinate-alias','position:{x,y},spatialClass:inside','position:d.position!,spatialClass:inside','detached'],
];
async function probe(fault){let substitutions=0;const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',plugins:fault?[{name:'spatial-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/src/campaign3/spatialContextAllocation.ts')){assert.equal(code.split(fault[1]).length-1,1);substitutions++;return code.replace(fault[1],fault[2]);}}}]:[]});try{
 const {allocateSpatialContext:a}=await server.ssrLoadModule('/src/campaign3/spatialContextAllocation.ts'),{ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const c={minX:2n,maxX:5n,minY:2n,maxY:5n,focalWeight:Q.of(3n,4n),residualPool:Q.of(1n,5n)},d=(id,x,y)=>({detectionId:BigInt(id),position:{x:BigInt(x),y:BigInt(y)}}),q=r=>r.allocation.numerator+'/'+r.allocation.denominator;
 const boundary=a([d(0,2,3)],c)[0].spatialClass,mixed=a([d(0,0,0),{detectionId:1n}],c),residual=q(mixed[0]),unknown=Object.hasOwn(mixed[1],'allocation'),dense=q(a([d(0,0,0),d(1,7,7)],c)[0]);
 const input=[d(0,3,3)],out=a(input,c);out[0].position.x=0n;const detached=input[0].position.x===3n;
 return {boundary,residual,unknown,dense,detached,substitutions};
 }finally{await server.close();}}
const baseline=await probe();assert.deepEqual(baseline,{boundary:'SpatialFocal',residual:'1/5',unknown:false,dense:'1/10',detached:true,substitutions:0});const results=[];
for(const fault of faults){const actual=await probe(fault);assert.equal(actual.substitutions,1);assert.notDeepEqual(actual[fault[3]],baseline[fault[3]]);results.push({name:fault[0],removed:fault[1],inserted:fault[2],baseline:baseline[fault[3]],actual:actual[fault[3]],detected:true});}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),testPath='docs/planning/SPATIAL_CONTEXT_ALLOCATION_TESTS_REV1.json',tests=JSON.parse(fs.readFileSync(testPath));assert(tests.success&&tests.numPassedTests===8);
fs.writeFileSync(output,JSON.stringify({status:'SCA-A..H QUALIFIED AT COMPONENT SCOPE',tests:8,faults:results,baseline,sources:['src/campaign3/spatialContextAllocation.ts','src/test/spatialContextAllocation.test.ts','docs/formal/SPATIAL_CONTEXT_ALLOCATION_COMPONENT.md','scripts/review-spatial-context-allocation.mjs'].map(fp),evidence:fp(testPath),limits:['Positive spatial classification only; no CausalRoleEvidence, Incidental derivation, authenticated public source or persistent encoding. MEC-005 historical membership control remains required. General ATTN and corpus remain open.']},null,2)+'\n');console.log({tests:8,faults:results.length});
