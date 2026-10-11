import {expect,it} from 'vitest';
import {AffectWorkbenchRun} from '../workbench/affectAdapter';
it('preserves frozen initial task records and detaches inspection state',async()=>{
 const a=await AffectWorkbenchRun.create('baseline');const s=a.snapshot();
 expect(s.fields.map(f=>f.root)).toEqual(['373','373']);expect(s.timeline).toHaveLength(0);
 s.fields.length=0;expect(a.snapshot().fields).toHaveLength(2);
 await expect(AffectWorkbenchRun.create('invented')).rejects.toThrow('Unknown frozen');
});
it('authenticates and resumes original AFFECT prefixes including feedback and addressed draws',async()=>{
 const a=await AffectWorkbenchRun.create('feedback-2');const step=a.advance();
 expect(()=>a.snapshot()).toThrow('advancing');await expect(a.advance()).rejects.toThrow('in flight');await step;
 const c=a.checkpoint(),b=await AffectWorkbenchRun.restore(c);
 let more=true;while(more){more=await a.advance();expect(await b.advance()).toBe(more);expect(b.checkpoint()).toEqual(a.checkpoint());}
 expect(b.snapshot().complete).toBe(true);expect(b.snapshot()).toEqual(a.snapshot());
 await expect(AffectWorkbenchRun.restore({...c,program:'feedback-1'})).rejects.toThrow('mismatch');
 await expect(AffectWorkbenchRun.restore({...c,prefix:18})).rejects.toThrow('Invalid');
 await expect(AffectWorkbenchRun.restore({...c,saveHash:'0'.repeat(64)})).rejects.toThrow('digest');
 const done=await AffectWorkbenchRun.restore(a.checkpoint());expect(await done.advance()).toBe(false);expect(done.checkpoint()).toEqual(a.checkpoint());
},600000);
