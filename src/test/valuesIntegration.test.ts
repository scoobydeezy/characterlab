import {describe,it,expect} from 'vitest';
import {createValuesIntegration,restoreValuesIntegration,appraiseValues,emptyGoal,type IntegrationFrame,type IntegrationProfile} from '../campaign3/valuesIntegration';
const profile:IntegrationProfile={law:'Accumulated',appraisal:'ValueRelative',seed:0};
const frame=(instant:number,changes:Partial<IntegrationFrame>={}):IntegrationFrame=>({instant,opportunity:true,linked:true,need:0,direction:1,mode:'ValuesOnly',command:'None',world:{permitted:true,outcome:1},observation:{visible:true,category:true,display:'Actual',goalVisible:true,goalDisplay:'Actual',forecast:1},...changes});
const original=()=>[frame(1,{opportunity:false,command:'Adopt'}),frame(2),frame(3),frame(4)];
const all=async(p:IntegrationProfile,xs:IntegrationFrame[])=>{const r=createValuesIntegration(p,xs);while(await r.step());return r;};
describe('Values integration component boundaries',()=>{
 it('actual chosen execution supplies observed learning and fulfills the concrete goal',async()=>{
  const r=await all(profile,original()),s=r.snapshot();
  expect(s.rows[0].chosen).toBeNull();expect(s.rows[1].chosen).toBe('B');
  expect(s.rows[1].goal.status).toBe('Fulfilled');expect(s.rows[1].after.preference).toBe('1/2');
  expect(s.rows[1].appraisal.valueMeaning).toBe('0/1');expect(s.rows[2].appraisal.valueMeaning).toBe('1/2');
  expect(s.rows[2].chosen).toBe('A');expect(s.world.executions).toBe(3);
 });
 it('same physical outcomes with withheld evidence acquire no Value',async()=>{
  const xs=original().slice(0,2),ys=structuredClone(xs);ys[1].observation.visible=false;
  const a=await all(profile,xs),b=await all(profile,ys);
  expect(a.snapshot().world).toEqual(b.snapshot().world);expect(a.snapshot().view.preference).toBe('1/2');expect(b.snapshot().view.mean).toBeNull();
 });
 it('different physical outcomes and execution failure preserve the entire fixed safe view',async()=>{
  const xs=original();for(const x of xs){x.observation.display='Positive';x.observation.goalDisplay='Present';}
  const ys=structuredClone(xs);ys.forEach(x=>{x.world.permitted=false;x.world.outcome=-1;});
  const a=await all(profile,xs),b=await all(profile,ys);
  expect(a.observerView()).toEqual(b.observerView());expect(a.snapshot().world).not.toEqual(b.snapshot().world);
  expect(b.snapshot().goal.status).toBe('Fulfilled');expect(b.snapshot().world.executions).toBe(0);
 });
 it('no opportunity, no admitted evidence, observed neutral and missing category stay distinct',async()=>{
  const base=original().slice(0,2);
  for(const mode of ['opportunity','hidden','neutral','unlinked'] as const){
   const xs=structuredClone(base);if(mode==='opportunity')xs[1].opportunity=false;
   if(mode==='hidden')xs[1].observation.visible=false;if(mode==='neutral')xs[1].observation.display='Neutral';if(mode==='unlinked')xs[1].observation.category=false;
   const s=(await all(profile,xs)).snapshot();expect(s.view.mean).toBe(mode==='neutral'?'0/1':null);
   expect(s.view.count).toBe(mode==='neutral'?1:0);
   if(mode==='opportunity'||mode==='hidden')expect(s.rows[1].observation.receipt).toBeNull();
   if(mode==='unlinked')expect(s.rows[1].observation.receipt?.category).toBeNull();
  }
 });
 it('retirement preserves Value and affects later goal relevance without replacing the goal identity',async()=>{
  const xs=original();xs[1].observation.goalVisible=false;xs[2].opportunity=false;xs[2].command='Retire';
  const ys=structuredClone(xs);ys[2].command='None';
  const a=(await all(profile,xs)).snapshot(),b=(await all(profile,ys)).snapshot();
  expect(a.rows[2].after).toEqual(b.rows[2].after);expect(a.goal.status).toBe('Retired');
  expect(a.rows[3].appraisal.valueMeaning).toEqual(b.rows[3].appraisal.valueMeaning);
  expect(a.rows[3].appraisal.goalRelevance).toBe(0);expect(b.rows[3].appraisal.goalRelevance).toBe(1);
 });
 it('appraisal ablation changes meaning but not belief, Value learning or choices',async()=>{
  const a=(await all(profile,original())).snapshot(),b=(await all({...profile,appraisal:'NoValueAppraisal'},original())).snapshot();
  expect(a.view).toEqual(b.view);expect(a.forecast).toBe(b.forecast);expect(a.rows.map(x=>x.chosen)).toEqual(b.rows.map(x=>x.chosen));
  expect(a.rows[3].appraisal.valueMeaning).not.toBe(b.rows[3].appraisal.valueMeaning);
 });
 it('Value meaning, forecast and goal relevance have independent operands',()=>{
  const v={count:3,mean:'1/1',weight:'3/4',preference:'3/4'},g=emptyGoal();
  const a=appraiseValues(v,1,g,{linked:true,direction:1},'ValueRelative');
  expect(appraiseValues({...v,preference:'1/2'},1,g,{linked:true,direction:1},'ValueRelative').valueMeaning).not.toBe(a.valueMeaning);
  expect(appraiseValues(v,0,g,{linked:true,direction:1},'ValueRelative').valueMeaning).toBe('0/1');
  expect(appraiseValues(v,null,g,{linked:true,direction:1},'ValueRelative').valueMeaning).toBeNull();
  expect(appraiseValues(v,1,g,{linked:true,direction:-1},'ValueRelative').anticipatedCost).toBe('3/4');
  expect(appraiseValues(v,1,{...g,status:'Open',adoptedAt:1,changedAt:1},{linked:true,direction:1},'ValueRelative').valueMeaning).toBe(a.valueMeaning);
 });
 it('Stored and Refold match all safe rows while latest and no-consolidation remain distinct',async()=>{
  const xs=original();xs[3].observation.display='Negative';
  const a=await all(profile,xs),b=await all({...profile,law:'Refold'},xs);
  expect(a.observerView()).toEqual(b.observerView());
  const latest=await all({...profile,law:'Latest'},xs);expect(latest.snapshot().view.preference).toBe('-1/2');
  const none=await all({...profile,law:'NoConsolidation'},xs);expect(none.snapshot().view.preference).toBe('0/1');
 });
 it('every original prefix restores, advances and terminates exactly',async()=>{
  const xs=original(),r=createValuesIntegration(profile,xs);
  for(let i=0;i<=xs.length;i++){
   const restored=await restoreValuesIntegration(profile,xs,i,r.save());expect(restored.save()).toEqual(r.save());
   expect(await restored.step()).toBe(await r.step());expect(restored.save()).toEqual(r.save());
  }
  const other=structuredClone(xs);other[1].world.outcome=-1;
  await expect(restoreValuesIntegration(profile,other,xs.length,r.save())).rejects.toThrow('ORIGINAL_MISMATCH');
 });
 it('failures at choice, world and precommit roll back all owners and permit exact retry',async()=>{
  for(const fault of ['after-choice','after-world','before-commit'] as const){
   const xs=original(),r=createValuesIntegration(profile,xs),control=createValuesIntegration(profile,xs);await r.step();await control.step();const before=r.save();
   await expect(r.step(fault)).rejects.toThrow('INJECTED');expect(r.save()).toEqual(before);await r.step();await control.step();expect(r.save()).toEqual(control.save());
  }
 });
 it('caller mutation, getters, hidden fields and terminal goal reuse reject or remain isolated',async()=>{
  const xs=original(),r=createValuesIntegration(profile,xs);xs[1].world.outcome=-1;while(await r.step());expect(r.snapshot().world.total).toBe(3);
  expect(()=>createValuesIntegration(profile,[{...frame(1),truth:1} as any])).toThrow();
  const x=frame(1);Object.defineProperty(x.world,'outcome',{get(){throw Error('GETTER_RAN');}});expect(()=>createValuesIntegration(profile,[x])).toThrow();
  const ys=original();ys[3].command='Adopt';const q=createValuesIntegration(profile,ys);for(let i=0;i<3;i++)await q.step();const before=q.save();await expect(q.step()).rejects.toThrow('GOAL_REUSE');expect(q.save()).toEqual(before);
 });
});
