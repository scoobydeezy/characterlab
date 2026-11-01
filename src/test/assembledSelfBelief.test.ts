import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {SELF,SELF_OBS,SELF_APPRAISAL,SELF_VERSION,SELF_CONTEXT,selfPath,selfBelief,selfEvidence,appendSelf,appraiseSelf,projectSelf,selfContext,createSelfBeliefExecution} from '../assembled/selfBelief';
import {QUALIFICATION,identityJournal,journalPath,qualificationParts} from '../assembled/identityEligibility';
import {list,text,unsigned,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {cognitiveRecord as r} from '../assembled/codecs';
import {learnIdentityBelief,estimateIdentityBelief,identityBeliefAppraisal,type IdentityEvidence} from '../campaign3/identityBelief';
import {source,data,decode,items,key,enc} from './fixtures/assembledSelfBelief';
import {outputs,draws,through,finish,signedValue} from './fixtures/assembledComparison';
import {workLimit} from './fixtures/assembledCharacter';
import {C} from './fixtures/campaign2Cognitive';
import {sid,SKILL_OWNER,PRACTICE_SETTING,SKILL_ACTUAL} from '../assembled/skill';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {BODY_DELIVERY} from '../assembled/body';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label)));
const state=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state));
const bp=selfPath(C),jp=journalPath(r(412,[C,sid(1041,'CommitmentFidelity')]));
const belief=(run:Run)=>selfBelief(state(run).read(bp).value,C);
const journal=(run:Run)=>identityJournal(state(run).read(jp).value);
const frac=(x:ReturnType<typeof readQ>|undefined)=>x?x.numerator+'/'+x.denominator:null;
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const evidence=(ticket:number,polarity:number)=>list([text(SELF_OBS),C,C,text('positive-task-fidelity'),unsigned(ticket),signed(polarity)]);
it('positive: permitted self evidence changes later appraisal with all actual dice fixed',async()=>{
 const m=await prepareCharacterModel(source());let matched=0;
 for(let seed=0;seed<8;seed++){const a=await createCharacterRun(m,data(true,seed)),b=await createCharacterRun(m,data(false,seed));for(const run of [a,b])await finish(run);
  for(const type of [409n,425n,426n])expect(outputs(a.snapshot().outputs,type)).toEqual(outputs(b.snapshot().outputs,type));expect(journal(a)).toEqual(journal(b));expect(journal(a)).toHaveLength(1);
  for(const at of [3n,5n,7n]){expect(draws(a,at)).toEqual(draws(b,at));matched+=draws(a,at).length;}
  expect(belief(a).history).toHaveLength(1);expect(belief(b).mean).toBeUndefined();expect(reports(b,SELF_OBS)).toEqual([]);const polarity=readQ(qualificationParts(journal(a)[0]).contribution).numerator>0n?1:-1;expect(belief(a).mean).toEqual(readQ(q(polarity,1)));
  const aa=reports(a,SELF_APPRAISAL).map(v=>items(v,'list')),bb=reports(b,SELF_APPRAISAL).map(v=>items(v,'list'));expect(aa).toHaveLength(3);expect(aa[0][4]).toEqual(list([]));for(const row of bb){expect(row[4]).toEqual(list([]));expect(row[6]).toEqual(list([]));}for(const row of aa.slice(1)){expect(row[4]).toEqual(q(polarity,1));expect(row[6]).toEqual(q(polarity===1?0:1,1));expect(row[7]).toEqual(list([row[6],row[6]]));}
  const traces=outputs(a.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text(SELF_VERSION))),learn=traces.filter(t=>uint(f(rec(f(t,4n),130n),3n))===140n);expect(learn).toHaveLength(3);expect(items(f(learn[0],12n),'list')).toEqual(reports(a,SELF_OBS));for(const row of learn)for(const read of items(f(row,11n),'list'))expect(f(rec(read,147n),2n)).toEqual(statePathValue(bp));
  console.info('M31 witness '+JSON.stringify({seed,earnedEntries:journal(a).length,selfMean:frac(belief(a).mean),withheldMean:frac(belief(b).mean),laterAppraisals:aa.slice(1).map(x=>key(x[6])),choicesEqual:true}));
 }
 expect(matched).toBeGreaterThan(0);console.info('M31 eight visibility pairs, all three decisions, actual matched draws='+matched);
},540000);
it('math: exact original Mean and prospective appraisal with retained alternatives',()=>{
 let cases=0;
 for(let mask=0;mask<16;mask++){let v:CanonicalValue|undefined;let native:IdentityEvidence[]=[];
  for(let i=0;i<4;i++){const polarity=(mask&(1<<i)?1:-1) as 1|-1;v=appendSelf(v,evidence(i+1,polarity),C);native=learnIdentityBelief('self',native,{holder:'self',target:'target',proposition:'positive-task-fidelity',ticket:i+1,polarity},'Mean');const b=selfBelief(v,C),oracle=estimateIdentityBelief(native,'Mean');expect(frac(b.mean)).toBe(oracle.value);for(const goal of [1,-1] as const){const a=appraiseSelf(b.mean,BigInt(goal)),o=identityBeliefAppraisal(oracle,goal);expect(frac(a.adverse)).toBe(o.adverse);expect(a.affect.map(frac)).toEqual(o.affect);cases++;}}
 }
 const contrary=[1,1,1,-1].map((polarity,i)=>({holder:'self' as const,target:'target' as const,proposition:'positive-task-fidelity' as const,ticket:i+1,polarity:polarity as 1|-1}));expect(estimateIdentityBelief(contrary,'Mean').value).toBe('1/2');expect(estimateIdentityBelief(contrary,'Latest').value).toBe('-1/1');expect(learnIdentityBelief('self',[],contrary[0],'NoLearning')).toEqual([]);
 const neutral=selfBelief(appendSelf(undefined,evidence(1,0),C),C);expect(frac(neutral.mean)).toBe('0/1');expect(frac(appraiseSelf(neutral.mean,1n).adverse)).toBe('1/2');expect(appraiseSelf(undefined,1n).adverse).toBeUndefined();expect(learnIdentityBelief('self',[],null,'Mean')).toEqual([]);console.info('M31 original math oracle '+cases+' appraisal cases; Mean/Latest/NoLearning and unknown/neutral retained');
});
it('privacy: goal-only appraisal and actual execution are separate from self evidence',async()=>{
 const m=await prepareCharacterModel(source()),a=await createCharacterRun(m,data()),opposite=await createCharacterRun(m,data(true,0,-1)),pressured=await createCharacterRun(m,data(true,0,1,true));for(const run of [a,opposite,pressured])await through(run,5n);
 expect(belief(a)).toEqual(belief(opposite));expect(journal(a)).toEqual(journal(opposite));expect(outputs(a.snapshot().outputs,409n)).toEqual(outputs(opposite.snapshot().outputs,409n));for(const at of [3n,5n])expect(draws(a,at)).toEqual(draws(opposite,at));const x=items(reports(a,SELF_APPRAISAL)[1],'list'),y=items(reports(opposite,SELF_APPRAISAL)[1],'list');expect(readQ(x[6]).add(readQ(y[6]))).toEqual(readQ(q(1,1)));expect(x[6]).not.toEqual(y[6]);expect(belief(pressured).mean).toBeUndefined();expect(journal(pressured)).toEqual([]);
 const physical=(permitted:boolean)=>{const d=data();return {...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').map(v=>{const row=[...items(v,'list')];if(key(row[0])===key(signed(3))&&key(row[2])===key(PRACTICE_SETTING)){const p=[...items(row[3],'list')];p[3]=q(0,1);p[4]=permitted;row[3]=list(p);}return list(row);}))) };},ok=await createCharacterRun(m,physical(true)),denied=await createCharacterRun(m,physical(false));for(const run of [ok,denied])await through(run,3n);expect(reports(ok,SKILL_ACTUAL).map(v=>items(v,'list')[7])).toEqual([true]);expect(reports(denied,SKILL_ACTUAL).map(v=>items(v,'list')[7])).toEqual([false]);expect(reports(ok,SELF_OBS)).toEqual(reports(denied,SELF_OBS));expect(belief(ok)).toEqual(belief(denied));expect(draws(ok)).toEqual(draws(denied));
 console.info('M31 goal-only complementary appraisal, pressure exclusion and hidden execution separation PASS');
},300000);
it('persistence: exact repeat and restore through every remaining instant',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);const c=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,c);while(a.snapshot().clock<10n){expect(await a.settleNextInstant()).toBe(await c.settleNextInstant());exact(a,c);}expect(await a.settleNextInstant()).toBe(false);expect(await c.settleNextInstant()).toBe(false);exact(a,c);console.info('M31 repeat3/restore3 every remaining state/output/trace/save PASS');
},300000);
it('admission: safe grammar, original source, single authority and immutable belief history',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),compiled=await compileCharacterModel(s),component=await compileCharacterState(compiled),run=await createCharacterRun(m,d);await through(run,3n);const current=state(run),initial=component.initialState(d.initialState),value=current.read(bp).value!;
 const rows=items(decode(d.orderedInputs),'list'),contexts=rows.filter(v=>key(items(v,'list')[2])===key(SELF_CONTEXT));for(const altered of [rows.filter(v=>v!==contexts[0]),[...rows,contexts[0]],rows.map(v=>v===contexts[0]?list([signed(4),...items(v,'list').slice(1)]):v),rows.map(v=>v===contexts[0]?list([items(v,'list')[0],unsigned(90),...items(v,'list').slice(2)]):v)])await expect(createCharacterRun(m,{...d,orderedInputs:enc(list(altered))})).rejects.toThrow('self context');
 for(const bad of [list([text(SELF),true,signed(0)]),list([text(SELF),true,signed(1),true])])expect(()=>selfContext(bad)).toThrow();await expect(createCharacterRun(m,{...d,initialState:run.snapshot().state})).rejects.toThrow('initial');
 const patch={operations:[{kind:'set' as const,path:bp,expected:{presence:false as const},newValue:value}]};expect(()=>component.stateModel.applyPatch(initial,patch,SKILL_OWNER)).toThrow();expect(()=>component.stateModel.applyPatch(initial,patch,KNOWLEDGE_OWNER)).not.toThrow();expect(()=>component.stateModel.applyPatch(initial,patch,KNOWLEDGE_OWNER,{writableRoots:[415n],targetPaths:[bp]})).toThrow('scope');expect(()=>component.stateModel.validateState(new AuthoritativeState([...current.entries(),{path:{...bp,selectors:[{kind:'mapKey',key:list([])}]},value}]))).toThrow('foreign');
 expect(()=>component.stateModel.applyPatch(current,{operations:[{kind:'set',path:bp,expected:{presence:true,value},newValue:value}]},KNOWLEDGE_OWNER)).toThrow('append');expect(()=>component.stateModel.applyPatch(current,{operations:[{kind:'remove',path:bp,expectedOldValue:value}]},KNOWLEDGE_OWNER)).toThrow();
 const history=selfBelief(value,C).history;for(const bad of [list([text(SELF),list([...history,...history]),q(0,1)]),list([text(SELF),list(history),q(99,1)]),list([text(SELF),list([]),q(0,1)])])expect(()=>selfBelief(bad,C)).toThrow();for(const index of [1,2,3,4,5]){const o=[...items(history[0],'list')];o[index]=index===4?unsigned(0):index===5?signed(2):text('foreign');expect(()=>selfEvidence(list(o),C)).toThrow();}expect(()=>appendSelf(value,history[0],C)).toThrow('order');
 const q0=reports(run,QUALIFICATION)[0];expect(projectSelf(q0,false,C)).toBeUndefined();expect(()=>projectSelf(q0,true,list([]))).toThrow('subject');
 const binding=createSelfBeliefExecution(C,component.stateModel,[],compiled.modelIdentity.value,compiled.modelIdentity.value);binding.begin(3n);const forged={eventId:1n,eventSequence:1n,dueAt:3n as never,phase:30n,eventTypeId:SELF_CONTEXT,payload:list([text(SELF),true,signed(1)]),dependencies:list([]),causalParentEventIds:[]};expect(()=>binding.context(forged)).toThrow('unbound');binding.close();console.info('M31 admission/owner/safe evidence/append and source substitution negatives PASS');
},180000);
it('rollback: late failure publishes neither learned self belief nor earned history',async()=>{
 const s=source(),d=data(),fault={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...Array.from({length:16},()=>list([signed(3),unsigned(110),BODY_DELIVERY,list([C,q(0,1)]),list([])]))]))},oracle=await createCharacterRun(await prepareCharacterModel(s),fault);await through(oracle,3n);expect(belief(oracle).history).toHaveLength(1);const counts=new Map<bigint,Set<string>>();for(const t of outputs(oracle.snapshot().trace,160n)){const e=rec(f(t,4n),130n),at=signedValue(f(e,2n)),ids=counts.get(at)??new Set<string>();ids.add(key(f(e,1n)));counts.set(at,ids);}const count=counts.get(3n)!.size;expect(Math.max(...[...counts].filter(([t])=>t<3n).map(([,v])=>v.size))).toBeLessThanOrEqual(count-1);const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(count-1))),fault);await through(failed,2n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(belief(failed).history).toEqual([]);expect(journal(failed)).toEqual([]);expect(draws(failed)).toEqual([]);console.info('M31 atomic late3 rollback events='+count+' cap='+(count-1));
},180000);
