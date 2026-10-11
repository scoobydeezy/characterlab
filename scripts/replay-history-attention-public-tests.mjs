// Focus current sources explicitly: positional Vitest filters also match archived copies.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const files=['src/test/attentionSelection.test.ts','src/test/attentionPublic.test.ts','src/test/attentionBoundaries.test.ts'];
const outputFile='docs/planning/campaign3-history-attention-public-rev1/current-tests.json';
assert(!fs.existsSync(outputFile),'Preserve existing audit receipt; choose a new audit revision for another run.');
const ctx=await startVitest('test',files,{config:false,include:files,run:true,watch:false,maxWorkers:1,minWorkers:1,reporters:['default','json'],outputFile});
await ctx?.close();
