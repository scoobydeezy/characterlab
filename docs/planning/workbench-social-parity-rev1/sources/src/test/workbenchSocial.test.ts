import {it,expect} from 'vitest';
import {SocialWorkbenchRun,SOCIAL_PROGRAMS} from '../workbench/socialAdapter';
import history from '../../docs/planning/SOCIAL_PUBLIC_EXPERIMENT_REV1.json';
it('authenticates SOCIAL checkpoints and detached observer diagnostics',async()=>{
 expect(SOCIAL_PROGRAMS).toHaveLength(26);const a=await SocialWorkbenchRun.create(),old=history.results.find(r=>r.name===a.snapshot().program)!;
 const pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');await pending;const c=a.checkpoint(),before=a.snapshot(),b=await SocialWorkbenchRun.restore(c);expect(b.snapshot()).toEqual(before);const detached=a.snapshot();detached.observerViews.length=0;detached.fields.length=0;expect(a.snapshot()).toEqual(before);
 while(await a.advance()){await b.advance();expect(b.snapshot()).toEqual(a.snapshot());expect(a.snapshot().saveHash).toBe(old.prefixes[a.snapshot().prefix]);}expect(await b.advance()).toBe(false);expect(a.snapshot().observerViews.map(v=>v.hash)).toEqual(old.views);
 await expect(SocialWorkbenchRun.restore({...c,prefix:0})).rejects.toThrow('prefix mismatch');await expect(SocialWorkbenchRun.restore({...c,saveHash:'0'.repeat(64)})).rejects.toThrow('digest');await expect(SocialWorkbenchRun.create('invented')).rejects.toThrow('Unknown');
},600000);
it('retains private-truth invariance and observer-specific access differences',async()=>{
 const names=['private-1-law-1-reverse-0','private-0-law-1-reverse-0','denied'];const runs=await Promise.all(names.map(n=>SocialWorkbenchRun.create(n)));for(const r of runs)while(await r.advance()){}const [a,b,c]=runs.map(r=>r.snapshot());expect(a.observerViews).toEqual(b.observerViews);expect(a.stateHash).not.toBe(b.stateHash);expect(a.observerViews[1]).toEqual(c.observerViews[1]);expect(a.observerViews[0]).not.toEqual(c.observerViews[0]);
},600000);
