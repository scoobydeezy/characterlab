import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/MARKER_WINDOW_SOURCE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/markerWindowTracking.ts',tests='src/test/markerWindowTracking.test.ts',panel='src/campaign3/windowMarkerTransaction.ts',panelTests='src/test/windowMarkerTransaction.test.ts';
const faults=[
  [
    "false-continuity-with-ambiguous-current-glyph",
    "src/campaign3/markerWindowTracking.ts",
    "src/test/markerWindowTracking.test.ts",
    "const unique=d.glyph!==undefined&&old.length===1&&detections.filter(p=>p.glyph===d.glyph).length===1;",
    "const unique=old.length===1;",
    "MW-A"
  ],
  [
    "namespace-collision",
    "src/campaign3/markerWindowTracking.ts",
    "src/test/markerWindowTracking.test.ts",
    "if(d.detectionId<=last)fail('DETECTION_ORDER');",
    "if(d.detectionId<=last||d.detectionId===input.observationId)fail('DETECTION_ORDER');",
    "MW-C"
  ],
  [
    "ignore-file-ceiling",
    "src/campaign3/markerWindowTracking.ts",
    "src/test/markerWindowTracking.test.ts",
    "if((state.nextTrackSequenceByObserver.get(observer)??0n)>30n)fail('FILE_BOUND');",
    "",
    "MW-G"
  ],
  [
    "preview-aliases-owner-candidate",
    "src/campaign3/windowMarkerTransaction.ts",
    "src/test/windowMarkerTransaction.test.ts",
    "result:structuredClone(r)",
    "result:r",
    "WMT-A"
  ],
  [
    "skip-source-window-commit",
    "src/campaign3/generalSourceOpportunity.ts",
    "src/test/generalSourceOpportunity.test.ts",
    "windowTx?.commit();",
    "",
    "GSO-H"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'MARKER WINDOW SOURCE REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'src/campaign3/generalSourceOpportunity.ts','src/test/generalSourceOpportunity.test.ts','scripts/review-marker-window-source.mjs'].map(fp),limits:['Bounded source/window component; public state admission and whole-prefix restoration remain open.','Source replay protection and ten-sweep admission stay with runtime and compiled schedule.']},null,2)+'\n');process.exitCode=0;
