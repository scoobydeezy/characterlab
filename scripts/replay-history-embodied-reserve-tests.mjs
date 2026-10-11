// Focus current sources explicitly: positional Vitest filters also match archived copies.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const files=["src/test/embodiedAdmission.test.ts", "src/test/embodiedBinding.test.ts", "src/test/embodiedCodecs.test.ts", "src/test/embodiedContrasts.test.ts", "src/test/embodiedDeclarations.test.ts", "src/test/embodiedFactory.test.ts", "src/test/embodiedOwnership.test.ts", "src/test/embodiedRuntime.test.ts", "src/test/embodiedTrace.test.ts"];
const outputFile='docs/planning/campaign3-history-embodied-reserve-rev1/current-tests.json';
assert(!fs.existsSync(outputFile),'Preserve existing audit receipt; choose a new audit revision for another run.');
const ctx=await startVitest('test',files,{config:false,include:files,run:true,watch:false,maxWorkers:1,minWorkers:1,reporters:['default','json'],outputFile});
await ctx?.close();
