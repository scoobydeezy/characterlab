import {it,expect} from 'vitest';
import {runSemAuthorityControls} from '../workbench/semAuthorityControls';
import {createAuthorityRecorder} from '../workbench/semAuthorityRecorder';
it('executes original authority cases with fresh ordinals and exact refusals',async()=>{
 const r=await runSemAuthorityControls();expect(await runSemAuthorityControls()).toEqual(r);expect(r.cases).toHaveLength(8);
 expect(r.cases.map(c=>c.failures.map(f=>f.code))).toEqual([[],['INVALID_PATH','OWNERSHIP_OVERLAP','UNCOVERED_WRITABLE_PATH'],[],[],['NON_OWNING_AUTHORITY','UNKNOWN_AUTHORITY'],['REMOVE_FORBIDDEN','INVALID_VALUE','INVALID_VALUE'],[],['NON_OWNING_AUTHORITY','NON_OWNING_AUTHORITY','REMOVE_FORBIDDEN']]);expect(JSON.parse(r.registry.exact).leaves).toHaveLength(7);
});
it('fails closed on false subset assertions, including after an await',async()=>{
 for(const actual of [{presence:false},{presence:true,value:2}]){const r=createAuthorityRecorder();r.it('bad',async()=>{await Promise.resolve();r.expect(actual).toMatchObject({presence:true,value:1});});await expect(r.finish()).rejects.toThrow('Authority subset assertion failed');}
 const r=createAuthorityRecorder();r.it('valid',async()=>{await Promise.resolve();r.expect({presence:true,value:1}).toMatchObject({presence:true});});expect((await r.finish())[0].assertions[0].passed).toBe(true);
});
