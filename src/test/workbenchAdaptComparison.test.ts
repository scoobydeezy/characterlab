import {it,expect} from 'vitest';
import {AdaptWorkbenchRun} from '../workbench/adaptAdapter';
import {compareAdapt} from '../workbench/adaptComparison';
it('keeps no-op dispatch and D-only dependency distinct from native scheduler ancestry',async()=>{
 const a=await AdaptWorkbenchRun.create('count-0'),b=await AdaptWorkbenchRun.create('count-1');expect(compareAdapt(a,b).exposure).toBeNull();await a.advance();expect(compareAdapt(a,b).stateEqual).toBeNull();await b.advance();let r=compareAdapt(a,b);expect(r.exposure).not.toBeNull();expect(r.reveal).toBeNull();expect(r.stateEqual).toBe(false);await a.advance();await b.advance();r=compareAdapt(a,b);const reveal=r.reveal as {dependencyKind:string;nativeChains:{event:string;parents:string[]}[][];probeRoots:string[]};expect(reveal.dependencyKind).toContain('not a scheduler-parent edge');expect(reveal.nativeChains).toHaveLength(2);for(let i=0;i<2;i++)expect(reveal.nativeChains[i][0].parents).toContain(reveal.probeRoots[i]);expect(()=>compareAdapt(b,a)).toThrow('ordered');
},600000);
