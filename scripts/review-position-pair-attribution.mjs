import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/RETAINED_POSITION_PAIR_ATTRIBUTION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/retainedAttributionUse.ts',tests='src/test/retainedPositionPairAttribution.test.ts',oldTests='src/test/retainedAttributionUse.test.ts';
const faults=[
 ['always-use-end','if(start.position?.[0]===0&&start.position[1]===0)','if(true)','PP-B'],
 ['unordered-observations','start.at>=end.at','false','PP-C'],
 ['future-observation','p.at>a.acquiredAt','false','PP-C'],
 ['unadmitted-position','!admitted.has(key(ref.address))','false','PP-D'],
 ['invalid-unread-position','p.position!==null&&','false&&','PP-F'],
 ['bound-is-used','consumed:[...consumed.values()]','consumed:bound.flatMap(b=>Object.values(b).flat())','RU-B'],
 ['supported-only',"memory:applyQualifiedUnitUse(memory,result.consumed,now)","memory:applyQualifiedUnitUse(memory,result.assessment.kind==='Supported'?result.consumed:[],now)",'RU-B'],
 ['omit-consumption','for(const address of bound[i][field]??[])consumed.set(key(address),address);','','RU-A'],
 ['allow-same-instant','acquisition.acquiredAt>=now','acquisition.acquiredAt>now','RU-D'],
 ['ignore-old-read-domain','!admitted.has(key(operand.address))','false','RU-D'],
 ['keep-rational-alias','Object.freeze(Q.of(v.lower.numerator,v.lower.denominator))','v.lower','RU-I']
];const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.position-pair-fault-${name}.json`;assert(!fs.existsSync(temp));const v=await startVitest('test',[witness.startsWith('RU')?oldTests:tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'position-pair-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'POSITION PAIR AND PRIOR CONSUMPTION FAULTS DETECTED',faults:results,sources:[source,tests,oldTests,'scripts/review-position-pair-attribution.mjs'].map(fp),baseline:fp('docs/planning/RETAINED_POSITION_PAIR_ATTRIBUTION_TESTS_REV1.json'),limits:['Trusted projection/admission inputs. Public source authenticity and persistence remain unqualified.']},null,2)+'\n');process.exitCode=0;
