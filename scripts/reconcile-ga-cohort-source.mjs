import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/ATTENTION_MEMORY_COHORT_RECIPE_REV1.json',output='docs/planning/GA_COHORT_SOURCE_RECONCILIATION_REV1.json';assert(!fs.existsSync(output));
const original=JSON.parse(fs.readFileSync(source));
const recipes=original.models.map(model=>{
 const p=structuredClone(model.parameters),old=p.schedule;
 assert.equal(old.probe,0);assert.equal(old.concern,1);assert([0,50,100].includes(p.source.regReference));
 const {regReference,...sourceParameters}=p.source;
 // The old descriptive field denoted the probe's effective numerator. Preserve
 // that intended safe point through a separate admitted D, not by renaming R0.
 p.source={...sourceParameters,probeAuthoredReference:50,initialDisplacement:regReference-50,effectiveProbeNumerator:regReference};
 p.schedule={...old,initialClock:0,probe:old.probe+1,activeFrom:old.activeFrom+1,concern:old.concern+1,receivers:old.receivers.map(t=>t+1),deadline:old.deadline+1};
 const missingFacet=p.source.ports.some(port=>!port.glyph||!port.position);
 return {name:model.name,parameters:p,scope:missingFacet?'COMPONENT CONTROL + FIRST-SOURCE PROFILE EXCLUSION':'PUBLIC PACKAGING TARGET; NOT YET A MODEL',
  sourceObligations:['Actual admitted probe at1; no hand-authored forecast','Prediction application commits at140 before workspace at2','Separate GA terminal workspace40/appraisal50/concern50 registration','Actual observer-safe current cue; cuePort is historical recipe intent, not an identity/provenance accessor','Actual model-defined scene frames and strict later delivery; no source-array-index cue inference'],
  ...(missingFacet?{limit:'Current PositionSceneSource requires each admitted visible item to have glyph and position. Preserve the missing-facet component control and test exact public exclusion; do not pretend it is a materialized public model.'}:{})};
});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'CORRECTED SOURCE/CALENDAR RECIPE PROPOSAL; NO PUBLIC MODELIDENTITIES',recipes,comparisons:original.comparisons,
 invariants:['All original activity is strictly after initial clock0.','All later feedback targets remain strictly after concern production.','Authored R0, initial retained D and observed effective result remain distinct.','No full Campaign2 choice adapter is truncated or activated under these recipes.','This is a successor proposal; the historical32-recipe draft is unchanged.'],
 open:['Materialize exact scene frames and all requested uses from the actual source contracts.','Join inherited producer declarations with the complete GA registry and S0.','Exact model identities, workload bounds, source/feedback runtime qualification and corpus comparisons.'],
 numericAllocations:[],sources:[source,'src/campaign2/predictionExecution.ts','src/campaign2/cognitiveExecution.ts','src/campaign3/positionSceneSource.ts','scripts/reconcile-ga-cohort-source.mjs'].map(fp)},null,2)+'\n');
