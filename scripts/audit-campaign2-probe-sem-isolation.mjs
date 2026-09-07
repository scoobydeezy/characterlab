// Closed first-probe SEM construction; no general restriction on future SEM contracts.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import ts from 'typescript';
const path='src/campaign2/probeExecution.ts',source=fs.readFileSync(path,'utf8');
function audit(code){
 const tree=ts.createSourceFile(path,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS),printer=ts.createPrinter({removeComments:true}),calls=[];
 function visit(n){if(ts.isCallExpression(n)&&ts.isIdentifier(n.expression)&&n.expression.text==='assemblePreRecognitionExperience')calls.push(n);ts.forEachChild(n,visit);}visit(tree);
 assert.equal(calls.length,1);assert.equal(calls[0].arguments.length,1);const input=calls[0].arguments[0];assert(ts.isObjectLiteralExpression(input));
 const actual=Object.fromEntries(input.properties.map(p=>{assert(ts.isPropertyAssignment(p));return [p.name.getText(tree),printer.printNode(ts.EmitHint.Unspecified,p.initializer,tree).replace(/\s+/g,'')];}));
 const expected={experienceId:'reservation.experienceId',observerId:'observer',occurredAt:'instant',perceptualEventReferentIds:'[]',perceivedBindings:'[]',perceptualClassifications:'[]',perceptualEventClassifications:'[]',supportingObservationIds:'[{observerId:observer,observationId:ordinal.value}]',transformationVersion:"'semantic-binding/0.1-candidate#SEM-001H'"};
 assert.equal(input.properties.length,Object.keys(expected).length);assert.deepEqual(actual,expected);
 return true;
}
assert(audit(source));
const mutants=[
 ['classify scalar','perceptualClassifications:[]','perceptualClassifications:[classifyScalar(q)]'],
 ['classify event scalar','perceptualEventClassifications:[]','perceptualEventClassifications:[classifyScalar(q)]'],
 ['dereference scalar','observationId:ordinal.value','observationId:observations.get(ordinal.value).scalar'],
 ['hash scalar','observationId:ordinal.value','observationId:hashScalar(q)'],
 ['embed scalar','supportingObservationIds:[','scalar:q,supportingObservationIds:['],
 ['encode scalar in version',"transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'","transformationVersion:String(q)"],
].map(([name,from,to])=>{assert.equal(source.split(from).length-1,1);assert.throws(()=>audit(source.replace(from,to)));return {name,status:'REJECTED'};});
const report={status:'PASS',scope:'PROBE-M source qualification of this closed first-profile SEM constructor; paired public runtime and admitted EVID controls remain separate evidence.',source:{path,sha256:crypto.createHash('sha256').update(source).digest('hex')},checks:['one fixed SEM assembly call','exact declared fields','empty classification/event/binding surfaces','support identity only, without scalar lookup','fixed provenance version'],mutants};
fs.writeFileSync('docs/planning/CAMPAIGN2_PROBE_SEM_ISOLATION_AUDIT.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
