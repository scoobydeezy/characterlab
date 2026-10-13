import {it,expect} from 'vitest';
import {SKILL_CONTRASTS,compareSkill} from '../workbench/skillComparison';
import {SkillWorkbenchRun} from '../workbench/skillAdapter';
import catalog from '../workbench/skillCatalog.json';
it('binds every declaration to frozen originals and exactly one model setting',()=>{
 expect(new Set(SKILL_CONTRASTS.map(c=>c.id)).size).toBe(SKILL_CONTRASTS.length);
 for(const c of SKILL_CONTRASTS){const a=catalog.programs.find(p=>p.name===c.a)!,b=catalog.programs.find(p=>p.name===c.b)!;expect(a).toBeDefined();expect(b).toBeDefined();expect(a.seed).toBe(b.seed);const ma=catalog.models.find(m=>m.name===a.model)!,mb=catalog.models.find(m=>m.name===b.model)!;if(c.kind==='input')expect(a.model).toBe(b.model);else{expect(a.orderedInputs).toBe(b.orderedInputs);expect(Object.keys(ma.settings).filter(k=>ma.settings[k as keyof typeof ma.settings]!==mb.settings[k as keyof typeof mb.settings])).toHaveLength(1);}}
});
it('keeps changed initial competence explicit and refuses unequal-prefix equality',async()=>{
 const a=await SkillWorkbenchRun.create('physical-0'),b=await SkillWorkbenchRun.create('physical-1');let r=compareSkill('hidden-competence',a.snapshot(),b.snapshot());expect(r.changedSettings).toEqual(['initial']);expect(r.models[0].initialState).not.toBe(r.models[1].initialState);expect(r.stateEqual).toBe(false);await a.advance();r=compareSkill('hidden-competence',a.snapshot(),b.snapshot());expect(r.aligned).toBe(false);expect(r.outputsEqual).toBeNull();await b.advance();expect(compareSkill('hidden-competence',a.snapshot(),b.snapshot()).aligned).toBe(true);expect(()=>compareSkill('hidden-competence',b.snapshot(),a.snapshot())).toThrow('ordered pair');
},600000);
