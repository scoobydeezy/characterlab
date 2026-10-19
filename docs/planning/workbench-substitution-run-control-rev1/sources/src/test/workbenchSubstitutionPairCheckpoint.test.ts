import {it,expect} from 'vitest';
import {SubstitutionWorkbenchRun} from '../workbench/substitutionAdapter';
import {captureSubstitutionPair,restoreSubstitutionPair} from '../workbench/substitutionPairCheckpoint';
import {compareSubstitution} from '../workbench/substitutionComparison';
it('authenticates both component prefixes before replacement and disposes a partially restored pair',async()=>{
 const a=await SubstitutionWorkbenchRun.create(),b=await SubstitutionWorkbenchRun.create('LatestHistory/falseTraining');
 for(let n=0;n<5;n++){await a.advance();await b.advance();}
 const saved=await captureSubstitutionPair('input/falseTraining',[a,b]),before=await compareSubstitution(saved.comparison,a.snapshot(),b.snapshot());
 const pair=await restoreSubstitutionPair(saved,SubstitutionWorkbenchRun.restore,()=>{});
 expect(await compareSubstitution(saved.comparison,pair[0].snapshot(),pair[1].snapshot())).toEqual(before);
 await a.advance();await pair[0].advance();expect(pair[0].checkpoint()).toEqual(a.checkpoint());
 const disposed:unknown[]=[];await expect(restoreSubstitutionPair({...saved,b:{...saved.b,saveHash:'00'.repeat(32)}},SubstitutionWorkbenchRun.restore,r=>disposed.push(r))).rejects.toThrow('digest');expect(disposed).toHaveLength(1);
 expect(b.checkpoint()).toEqual(saved.b);await expect(restoreSubstitutionPair({...saved,comparison:'privacy/denied-feedback'},SubstitutionWorkbenchRun.restore,()=>{})).rejects.toThrow('declaration');
},600000);
