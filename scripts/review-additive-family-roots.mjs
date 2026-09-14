import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/ADDITIVE_FAMILY_ROOT_REVIEW_REV1.json';assert(!fs.existsSync(output));
const file='src/campaign3/additiveFamilyRoots.ts',tests='src/test/additiveFamilyRoots.test.ts';
const faults=[
 ['erase-additions','add(r,families.get(key(r.family)));','void r;','AFR-A'],
 ['allow-family-root-overwrite',"if(roots.has(extent.root))fail('DUPLICATE_ROOT');",'','AFR-B'],
 ['allow-protocol-overlap',"if(roots.has(p.root))fail('DUPLICATE_ROOT');",'','AFR-C'],
 ['ignore-route-override',"if(Object.keys(r).some(k=>!['family','root','leaves'].includes(k)))fail('ADDITIVE_FIELDS');",'','AFR-C'],
 ['return-live-identity','family:copy(result!.family),route:copy(result!.route),leaf:copy(result!.leaf)','family:result!.family,route:result!.route,leaf:result!.leaf','AFR-D'],
 ['drop-composed-root-bound',"if(roots.size>32)fail('BOUND');",'','AFR-G']
];const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.additive-root-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'additive-root-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'ADDITIVE ROOT COMPONENT REVIEW PASS',faults:results,sources:[file,tests,'scripts/review-additive-family-roots.mjs'].map(fp),limits:['Trusted descriptor component; public model/compiler activation remains open.','The independent authority check uses the actual state registry; this classifier itself grants no read or mutation permission.']},null,2)+'\n');process.exitCode=0;
