import {expect,it} from 'vitest';
import {SkillWorkbenchRun} from '../workbench/skillAdapter';
import {projectSkillCharacter} from '../workbench/skillCharacter';
import {skillRecord} from '../campaign3/skillCodecs';
import {signed,rational} from '../substrate/canonicalEncoding';
it('rejects physical ingress and suppresses retained violating controls',async()=>{
 expect(()=>projectSkillCharacter([skillRecord(783,[signed(1),rational(0,1),rational(1,2),true,false,false,{kind:'unsigned',value:0n}])],{executionLaw:1,permanent:false})).toThrow('Unknown');
 for(const id of ['confidence-as-skill','intent-as-success','permanent-recovery']){const r=await SkillWorkbenchRun.create(id);await r.advance();expect(r.snapshot().character.suppressed).toBe(true);expect(r.snapshot().character.entries).toEqual([]);}
},600000);
it('preserves hidden-competence invariance and evaluation-time history',async()=>{
 const a=await SkillWorkbenchRun.create('physical-0'),b=await SkillWorkbenchRun.create('physical-1');await a.advance();await b.advance();expect(a.snapshot().character).toEqual(b.snapshot().character);const before=a.snapshot().character.entries;await a.advance();await b.advance();expect(a.snapshot().character).toEqual(b.snapshot().character);expect(a.snapshot().character.entries.slice(0,before.length)).toEqual(before);expect(a.snapshot().character.entries.some(e=>e.kind==='Admitted performance'&&e.human.includes('no performance result'))).toBe(true);expect(a.snapshot().character.entries.every(e=>!e.exact.includes('SkillOutcome#796')&&!e.exact.includes('SkillValue#784'))).toBe(true);
},600000);
