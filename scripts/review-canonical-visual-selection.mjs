import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/CANONICAL_VISUAL_SELECTION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source="src/campaign3/canonicalVisualSelection.ts",tests="src/test/canonicalVisualSelection.test.ts",panel="src/test/concernSignificanceSourceComposition.test.ts",panelTests=panel;
const faults=[
  [
    "second-view-occurrence",
    "src/campaign3/canonicalVisualSelection.ts",
    "src/test/canonicalVisualSelection.test.ts",
    "const selected=record('SelectedEvidenceView',[identity,",
    "const selected=record('SelectedEvidenceView',[typedIdentifier(1143,unsigned(allocate())),",
    "CVS-A"
  ],
  [
    "discard-ineligible-selection",
    "src/campaign3/canonicalVisualSelection.ts",
    "src/test/canonicalVisualSelection.test.ts",
    "const selectionId=allocate();",
    "const selectionId=units.length?allocate():0n;",
    "CVS-B"
  ],
  [
    "audit-view-alias",
    "src/campaign3/canonicalVisualSelection.ts",
    "src/test/canonicalVisualSelection.test.ts",
    "audit:cloneCanonicalValue(audit) as typeof audit,selected:cloneCanonicalValue(selected) as typeof selected",
    "audit,selected",
    "CVS-E"
  ],
  [
    "acquisition-as-selection-source",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "selection===undefined?`fixture-selection/${id}`:`visual-selection/1143/${selection}`",
    "selection===undefined?`fixture-selection/${id}`:`visual-selection/1143/${id}`",
    "SC-U"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'CANONICAL VISUAL SELECTION REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-canonical-visual-selection.mjs'].map(fp),limits:['Actual component audit/view production and fixture source linkage; not registered public completion.','Body audit, PRJ/IDN and formation protocol hook admission remain public obligations.']},null,2)+'\n');process.exitCode=0;
