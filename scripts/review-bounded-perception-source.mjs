import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/BOUNDED_PERCEPTION_SOURCE_REVIEW_REV1.json';assert(!fs.existsSync(output));
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
  ],
  [
    "panel-after-left-open",
    "src/campaign3/panelWindowPerception.ts",
    "src/test/panelWindowPerception.test.ts",
    "if(panel.sample.stage==='After')endActive();",
    "",
    "PW-A"
  ],
  [
    "unsampled-context-closed",
    "src/campaign3/panelWindowPerception.ts",
    "src/test/panelWindowPerception.test.ts",
    "if(!panel&&active)fail('UNSAMPLED_ACTIVE_CONTEXT');",
    "",
    "PW-C"
  ],
  [
    "event-numeric-namespace-collision",
    "src/campaign3/panelWindowPerception.ts",
    "src/test/panelWindowPerception.test.ts",
    "ordinal(visual.detection);",
    "ordinal(visual.detection);if(visual.detection===visual.observation)fail('ALIAS');",
    "PW-E"
  ],
  [
    "ignore-event-ceiling",
    "src/campaign3/panelWindowPerception.ts",
    "src/test/panelWindowPerception.test.ts",
    "if((files.nextEventSequenceByObserver.get(observer)??0n)>26n)fail('FILE_BOUND');",
    "",
    "PW-E"
  ],
  [
    "skip-panel-window-publication",
    "src/campaign3/generalSourceOpportunity.ts",
    "src/test/generalSourceOpportunity.test.ts",
    "tx?.commit();",
    "if(!isWindowPanelManager(perception))tx?.commit();",
    "GSO-J"
  ],
  [
    "reserve-experience-after-binding",
    "src/campaign3/generalSourceOpportunity.ts",
    "src/test/generalSourceOpportunity.test.ts",
    " const reservation=admitObservationLane({observerId,lane,dueAt:at,emitsCharacterAccessibleEvidence:support.length>0},next).reservation;\n const sweep={observerId,observationId:visualObservation!,occurredAt:at,detections:detected.map(i=>({detectionId:i.detectionId,glyph:i.glyph}))};\n const windowTracker=isWindowMarkerManager(tracker)?tracker:undefined,historyTracker=windowTracker?undefined:tracker as MarkerTransactionManager;\n const windowTx=planned.visual&&windowTracker?prepareWindowMarkerSweep(windowTracker,sweep):undefined;\n const proposal=planned.visual&&historyTracker?beginMarkerTransaction(historyTracker,sweep):undefined;\n let committed=false,tx:ReturnType<typeof prepareTrialPanelConsumption>|ReturnType<typeof prepareUncontextualizedVisualConsumption>|ReturnType<typeof prepareWindowPanel>|undefined;\n try{\n  const tracks=windowTx?.result.transitions??(proposal?previewMarkerTransaction(historyTracker!,proposal).transitions:[]);\n  const visualEvent=detected.length?{observer:observerId,observation:visualObservation!,detection:eventDetection!,at}:undefined;\n  const panelInput=p?{observer:observerId,observation:p.observation,sample:p.sample,...(p.sample.kind==='Present'?{detection:eventDetection}: {})}:undefined;\n  if(isWindowPanelManager(perception)){if(panelInput||visualEvent)tx=prepareWindowPanel(perception,panelInput,visualEvent);}\n  else if(panelInput)tx=prepareTrialPanelConsumption(perception,panelInput,visualEvent);\n  else if(visualEvent)tx=prepareUncontextualizedVisualConsumption(perception,visualEvent);\n  const perceived=tx?.result,event=perceived&&'visualEventTransition'in perceived?perceived.visualEventTransition??perceived.transition:perceived?.transition;\n  const bindings=compilePerceivedBindings(tracks.map(t=>({observerId,perceptualEventReferentId:event!.perceptualEventReferentId,perceptualReferentId:t.perceptualReferentId,eventRoleEvidence:detected.find(i=>i.detectionId===t.currentDetectionId.detectionOccurrenceId)!.role,supportingObservationIds:[{observerId,observationId:visualObservation!}],occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'})),0n).bindings.map(b=>({...b,perceivedBindingId:next()}));\n\n",
    " const sweep={observerId,observationId:visualObservation!,occurredAt:at,detections:detected.map(i=>({detectionId:i.detectionId,glyph:i.glyph}))};\n const windowTracker=isWindowMarkerManager(tracker)?tracker:undefined,historyTracker=windowTracker?undefined:tracker as MarkerTransactionManager;\n const windowTx=planned.visual&&windowTracker?prepareWindowMarkerSweep(windowTracker,sweep):undefined;\n const proposal=planned.visual&&historyTracker?beginMarkerTransaction(historyTracker,sweep):undefined;\n let committed=false,tx:ReturnType<typeof prepareTrialPanelConsumption>|ReturnType<typeof prepareUncontextualizedVisualConsumption>|ReturnType<typeof prepareWindowPanel>|undefined;\n try{\n  const tracks=windowTx?.result.transitions??(proposal?previewMarkerTransaction(historyTracker!,proposal).transitions:[]);\n  const visualEvent=detected.length?{observer:observerId,observation:visualObservation!,detection:eventDetection!,at}:undefined;\n  const panelInput=p?{observer:observerId,observation:p.observation,sample:p.sample,...(p.sample.kind==='Present'?{detection:eventDetection}: {})}:undefined;\n  if(isWindowPanelManager(perception)){if(panelInput||visualEvent)tx=prepareWindowPanel(perception,panelInput,visualEvent);}\n  else if(panelInput)tx=prepareTrialPanelConsumption(perception,panelInput,visualEvent);\n  else if(visualEvent)tx=prepareUncontextualizedVisualConsumption(perception,visualEvent);\n  const perceived=tx?.result,event=perceived&&'visualEventTransition'in perceived?perceived.visualEventTransition??perceived.transition:perceived?.transition;\n  const bindings=compilePerceivedBindings(tracks.map(t=>({observerId,perceptualEventReferentId:event!.perceptualEventReferentId,perceptualReferentId:t.perceptualReferentId,eventRoleEvidence:detected.find(i=>i.detectionId===t.currentDetectionId.detectionOccurrenceId)!.role,supportingObservationIds:[{observerId,observationId:visualObservation!}],occurredAt:at,transformationVersion:'semantic-binding/0.1-candidate#SEM-001C'})),0n).bindings.map(b=>({...b,perceivedBindingId:next()}));\n\n  const reservation=admitObservationLane({observerId,lane,dueAt:at,emitsCharacterAccessibleEvidence:support.length>0},next).reservation;\n",
    "GSO-K"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'BOUNDED PERCEPTION SOURCE REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'src/campaign3/panelWindowPerception.ts','src/test/panelWindowPerception.test.ts','src/campaign3/windowPanelTransaction.ts','src/campaign3/generalSourceOpportunity.ts','src/test/generalSourceOpportunity.test.ts','scripts/review-bounded-perception-source.mjs'].map(fp),limits:['Bounded source/window component; public state admission and whole-prefix restoration remain open.','Source replay protection and ten-sweep admission stay with runtime and compiled schedule.']},null,2)+'\n');process.exitCode=0;
