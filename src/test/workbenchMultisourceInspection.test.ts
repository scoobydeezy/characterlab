import {it,expect} from 'vitest';
import {MultisourceWorkbenchRun} from '../workbench/multisourceAdapter';
import {multisourceInspection} from '../workbench/multisourceInspection';
it('projects public checkpoint outputs without mutation and preserves restored descriptions',async()=>{
 const run=await MultisourceWorkbenchRun.create();await run.advance();const before=run.checkpoint(),view=multisourceInspection(run);expect(view.character.entries.length).toBeGreaterThan(0);expect(run.checkpoint()).toEqual(before);const restored=await MultisourceWorkbenchRun.restore(before);expect(multisourceInspection(restored)).toEqual(view);view.character.entries.length=0;expect(multisourceInspection(run).character.entries.length).toBeGreaterThan(0);await run.advance();expect(multisourceInspection(run).character.entries.slice(0,multisourceInspection(restored).character.entries.length)).toEqual(multisourceInspection(restored).character.entries);
},600000);
