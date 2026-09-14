import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/SELECTED_SPATIAL_ENCODING_REVIEW_REV1.json';assert(!fs.existsSync(output));
const binding='src/campaign3/spatialEvidenceBinding.ts',encoding='src/campaign3/selectedSpatialEncoding.ts',tests='src/test/spatialEvidenceBinding.test.ts';
const faults=[
 ['join-by-array-index',binding,'const t=tracks.get(a.detectionId);','const t=input.tracks[Number(a.detectionId-1n)];','SEB-A'],
 ['ignore-event-detection',binding,'||e.currentEventDetectionId.eventDetectionOccurrenceId!==o.eventDetectionId','','SEB-C'],
 ['ignore-current-binding-support',binding,'||!b.supportingObservationIds.some(support)','','SEB-E'],
 ['allow-unbound-track',binding,"if(bound.size!==files.size)fail('UNBOUND_TRACK');",'','SEB-E'],
 ['role-is-spatial-attention',encoding,'raw:row.base.multiply(row.role).multiply(witness.allocation)','raw:row.base.multiply(row.role).multiply(row.role)','SSE-A'],
 ['unknown-is-numeric-zero',encoding,"...(witness.spatialClass==='SpatialUnknown'?{}:{attention:witness.allocation,raw:row.base.multiply(row.role).multiply(witness.allocation)})","...(witness.spatialClass==='SpatialUnknown'?{attention:Q.of(0n),raw:Q.of(0n)}:{attention:witness.allocation,raw:row.base.multiply(row.role).multiply(witness.allocation)})",'SSE-B'],
 ['ignore-experience-binding',encoding,"key(f(claim,2n))!==key(typedIdentifier(1106,unsigned(source.experience.experienceId)))||",'','SSE-C'],
 ['reusable-failed-join',encoding,'finally{closeSelectedView(view);}','finally{}','SSE-C'],
 ['ignore-selected-binding-bytes',encoding,"if(e.ref.kind==='perceived-binding'&&!bindings.has(bytesToHex(e.bytes)))","if(false)",'SSE-E']
];const results=[];
for(const [name,file,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.selected-spatial-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'selected-spatial-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'SELECTED SPATIAL COMPONENT REVIEW PASS',faults:results,sources:[binding,encoding,tests,'scripts/review-selected-spatial-encoding.mjs'].map(fp),limits:['Actual selected capability and SEM structural joins; source completion, public registration and owner qualification remain open.']},null,2)+'\n');process.exitCode=0;
