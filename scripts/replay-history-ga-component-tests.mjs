// Focus current sources explicitly: positional Vitest filters also match archived copies.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const files=["src/test/attentionBoundaries.test.ts", "src/test/attentionPublic.test.ts", "src/test/attentionSelection.test.ts", "src/test/encodingAccessMath.test.ts", "src/test/encodingAssociationComposition.test.ts", "src/test/encodingIsolation.test.ts", "src/test/observedMarkerTracking.test.ts", "src/test/observedMarkerTrackingShape.test.ts", "src/test/selectedEncoding.test.ts", "src/test/selectedEncodingBudgetControl.test.ts", "src/test/spatialContextAllocation.test.ts"];
const outputFile='docs/planning/campaign3-history-ga-components-rev1/current-tests.json';
assert(!fs.existsSync(outputFile),'Preserve existing audit receipt; choose a new audit revision for another run.');
const ctx=await startVitest('test',files,{config:false,include:files,run:true,watch:false,maxWorkers:1,minWorkers:1,reporters:['default','json'],outputFile});
await ctx?.close();
