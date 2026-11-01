import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {ELIGIBILITY,EXPRESSION,QUALIFICATION,IDENTITY_VERSION,IDENTITY_CONTEXT,identityContext,identityJournal,journalPath,qualificationParts,qualifyIdentity,frozenIdentityExpression} from '../assembled/identityEligibility';
import {list,text,unsigned,signed,rational as q,record,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataUnsigned as uint,dataText as txt,dataIdentity as id} from '../campaign2/canonicalData';
import {cognitiveRecord as r} from '../assembled/codecs';
import {qualifyExpression,taskReasons,taskDecision,taskIntent,expressionTask} from '../campaign3/identityPublicMath';
import {expressionOutput} from '../assembled/choice';
import {identityPublicRecord as native} from '../campaign3/identityPublicCodecs';
import {foldIdentityHistory,ONE,readQ} from '../campaign2/cognitiveMath';
import {source,data,context,decode,items,key,enc} from './fixtures/assembledIdentityEligibility';
import {outputs,draws,through,finish} from './fixtures/assembledComparison';
import {changeDefinition,workLimit} from './fixtures/assembledCharacter';
import {C} from './fixtures/campaign2Cognitive';
import {sid,SKILL_OWNER,PRACTICE_SETTING,SKILL_ACTUAL} from '../assembled/skill';
import {BODY_DELIVERY} from '../assembled/body';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label)));
const state=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state));
const jp=journalPath(r(412,[C,sid(1041,'CommitmentFidelity')]));
const journal=(run:Run)=>identityJournal(state(run).read(jp).value);
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('time');return v.value;};
const rawStanding=(run:Run)=>outputs(run.snapshot().outputs,403n).slice(1).map(x=>list(items(f(x,3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))===3n)));
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
it('positive: fixed first dice, qualified history and later standing',async()=>{
 const m=await prepareCharacterModel(source());let earned=0,changed=0,totalDraws=0;
 for(let seed=0;seed<8;seed++){const runs:Run[]=[];for(const pressure of [false,true]){const run=await createCharacterRun(m,data(pressure,seed));await through(run,3n);runs.push(run);}for(const type of [409n,425n,426n])expect(outputs(runs[0].snapshot().outputs,type)).toEqual(outputs(runs[1].snapshot().outputs,type));expect(draws(runs[0])).toEqual(draws(runs[1]));totalDraws+=draws(runs[0]).length;
  const first=reports(runs[0],QUALIFICATION)[0];expect(first).toBeDefined();const accepted=qualificationParts(first).accepted;expect(journal(runs[0])).toHaveLength(accepted?1:0);expect(journal(runs[1])).toHaveLength(0);if(accepted)earned++;
  for(const run of runs){await finish(run);expect(journal(run)).toHaveLength(run===runs[0]&&accepted?1:0);const ts=outputs(run.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text(IDENTITY_VERSION)));expect(ts.length).toBeGreaterThanOrEqual(9);for(const v of reports(run,QUALIFICATION))qualificationParts(v);}
  const differs=key(list(rawStanding(runs[0])))!==key(list(rawStanding(runs[1])));if(differs)changed++;if(accepted){expect(differs).toBe(true);const j=journal(runs[0]);expect(foldIdentityHistory(j.map(v=>qualificationParts(v).numeric),ONE).strength.equals(readQ(q(0,1)))).toBe(false);const reads=outputs(runs[0].snapshot().trace,160n).filter(t=>at(f(rec(f(t,4n),130n),2n))>3n).flatMap(t=>items(f(t,11n),'list'));expect(reads.some(v=>key(f(rec(v,147n),2n))===key(statePathValue({...jp,fieldId:1n})))).toBe(true);}
  console.info('M30 witness '+JSON.stringify({seed,accepted,firstDraws:draws(runs[0]).length,laterStandingDiffers:differs,terminal:10}));
 }
 expect(earned).toBeGreaterThan(0);expect(changed).toBeGreaterThan(0);expect(totalDraws).toBeGreaterThan(0);console.info('M30 roster '+JSON.stringify({earned,changed,matchedFirstDraws:totalDraws}));
},540000);

it('math: original qualification laws and restricted safe operands',async()=>{
 const occ=(ns:number,n=1)=>typedIdentifier(ns,unsigned(n)),empty=native(1435,[list([])]),base=native(1429,[unsigned(1),q(1,1),q(0,1),false,unsigned(1),true]);
 const reasons=taskReasons(1n,base,empty,'Threshold',occ(1155,1)),decision=await taskDecision(1n,0,reasons,occ(1155,2)),intent=taskIntent(decision.output,occ(1155,3)),original=rec(expressionOutput(occ(1137),f(rec(intent,1432n),3n)),426n);
 const statuses=['Accepted','Insignificant','Constrained','ZeroContribution','NoEligibleChannel','Probe'];let comparisons=0;
 for(const significance of [q(0,1),q(1,4),q(1,1)])for(const pressure of [q(0,1),q(1,2),q(1,1)])for(const instruction of [false,true]){
  const safe=list([text(ELIGIBILITY),significance,pressure,instruction]),ctx=native(1429,[unsigned(1),significance,pressure,instruction,unsigned(1),true]),nativeExpression=expressionTask(1n,intent,ctx,occ(1155)),oracle=qualifyExpression(nativeExpression,'Threshold',occ(1138)),result=items(qualifyIdentity(occ(1138),frozenIdentityExpression(original,1n,safe)),'list');
  expect(result[3]).toEqual(text(statuses[Number(uint(f(oracle,3n)))-1]));expect(result[4]).toEqual(f(oracle,4n));comparisons++;
 }
 const half=native(1429,[unsigned(1),q(1,1),q(1,2),false,unsigned(1),true]),e=expressionTask(1n,intent,half,occ(1155));expect(uint(f(qualifyExpression(e,'Threshold',occ(1138)),3n))).toBe(3n);for(const law of ['Graded','IgnorePressure','Frequency'] as const)expect(uint(f(qualifyExpression(e,law,occ(1138)),3n))).toBe(1n);for(const law of ['NoFeedback','Refold'] as const)expect(qualifyExpression(e,law,occ(1138))).toEqual(qualifyExpression(e,'Threshold',occ(1138)));
 const probeContext=native(1429,[unsigned(1),q(1,1),q(0,1),false,unsigned(1),false]);expect(uint(f(qualifyExpression(expressionTask(1n,intent,probeContext,occ(1155)),'Threshold',occ(1138)),3n))).toBe(6n);
 const noChannel=record(original.schema,new Map([...original.fields].map(([n,v])=>[n,n===3n?list([]):v])));expect(txt(items(qualifyIdentity(occ(1138),frozenIdentityExpression(noChannel,1n,context())),'list')[3])).toBe('NoEligibleChannel');
 const zero=record(original.schema,new Map([...original.fields].map(([n,v])=>[n,n===3n?list([r(427,[sid(1041,'CommitmentFidelity'),q(0,1)])]):v])));expect(txt(items(qualifyIdentity(occ(1138),frozenIdentityExpression(zero,1n,context())),'list')[3])).toBe('ZeroContribution');
 const oldIntent=rec(f(original,2n),425n),resolution=rec(f(oldIntent,2n),409n),result=rec(f(resolution,4n),419n),chosen=rec(f(result,2n),420n),replace=(v:typeof chosen,n:bigint,x:CanonicalValue)=>record(v.schema,new Map([...v.fields].map(([k,y])=>[k,k===n?x:y]))),zeroAuth=replace(original,2n,replace(oldIntent,2n,replace(resolution,4n,replace(result,2n,replace(chosen,7n,q(0,1))))));expect(txt(items(qualifyIdentity(occ(1138),frozenIdentityExpression(zeroAuth,1n,context())),'list')[3])).toBe('ZeroContribution');
 for(const bad of [list([text(ELIGIBILITY),q(1,2),q(0,1),false]),list([text(ELIGIBILITY),q(1,1),q(1,4),false]),list([...items(context(),'list'),true])])expect(()=>identityContext(bad)).toThrow();console.info('M30 original Threshold oracle '+comparisons+' exact safe-context cases; retained alternatives differ');
},120000);
it('privacy: instruction and world execution do not author qualification',async()=>{
 const s=source(),m=await prepareCharacterModel(s),physical=(permitted:boolean,instruction=false)=>{const d=data(false,0,{instruction});return {...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').map(v=>{const row=[...items(v,'list')];if(key(row[0])===key(signed(3))&&key(row[2])===key(PRACTICE_SETTING)){const p=[...items(row[3],'list')];p[3]=q(0,1);p[4]=permitted;row[3]=list(p);}return list(row);}))) };},a=await createCharacterRun(m,physical(true)),b=await createCharacterRun(m,physical(true,true)),denied=await createCharacterRun(m,physical(false));
 for(const run of [a,b,denied])await through(run,3n);
 for(const run of [b,denied]){for(const type of [409n,425n,426n])expect(outputs(a.snapshot().outputs,type)).toEqual(outputs(run.snapshot().outputs,type));expect(draws(a)).toEqual(draws(run));expect(journal(run)).toHaveLength(1);expect(qualificationParts(journal(a)[0]).contribution).toEqual(qualificationParts(journal(run)[0]).contribution);}
 expect(reports(a,SKILL_ACTUAL).map(v=>items(v,'list')[7])).toEqual([true]);expect(reports(denied,SKILL_ACTUAL).map(v=>items(v,'list')[7])).toEqual([false]);expect(qualificationParts(journal(a)[0]).expression).toEqual(qualificationParts(journal(denied)[0]).expression);
 const trivial=await createCharacterRun(m,data(false,0,{trivial:true}));for(const run of [trivial]){await through(run,3n);expect(journal(run)).toEqual([]);expect(outputs(run.snapshot().outputs,409n)).toEqual(outputs(a.snapshot().outputs,409n));}
 console.info('M30 instruction/permission/trivial first-choice and qualification separation PASS');
},300000);
it('persistence: exact repeat and restore retain qualified history',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);const c=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,c);while(a.snapshot().clock<10n){expect(await a.settleNextInstant()).toBe(await c.settleNextInstant());exact(a,c);}expect(await a.settleNextInstant()).toBe(false);expect(await c.settleNextInstant()).toBe(false);exact(a,c);console.info('M30 exact repeat3 and restore3 at every remaining settled instant PASS');
},300000);
it('admission: source completeness, owner and joint journal invariants',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),compiled=await compileCharacterModel(s),component=await compileCharacterState(compiled),run=await createCharacterRun(m,d);await through(run,3n);const current=state(run),initial=component.initialState(d.initialState),value=current.read(jp).value!,np={...jp,fieldId:1n},numeric=current.read(np).value!;
 const rows=items(decode(d.orderedInputs),'list'),contexts=rows.filter(v=>key(items(v,'list')[2])===key(IDENTITY_CONTEXT));for(const altered of [rows.filter(v=>v!==contexts[0]),[...rows,contexts[0]],rows.map(v=>v===contexts[0]?list([signed(4),...items(v,'list').slice(1)]):v),rows.map(v=>v===contexts[0]?list([items(v,'list')[0],unsigned(90),...items(v,'list').slice(2)]):v)])await expect(createCharacterRun(m,{...d,orderedInputs:enc(list(altered))})).rejects.toThrow('identity context');
 await expect(createCharacterRun(m,{...d,initialState:run.snapshot().state})).rejects.toThrow('initial');expect(()=>component.stateModel.validatePath({...jp,selectors:[{kind:'mapKey',key:list([])}]})).toThrow('foreign');
 const patch={operations:[{kind:'set' as const,path:jp,expected:{presence:false as const},newValue:value},{kind:'set' as const,path:np,expected:{presence:false as const},newValue:numeric}]};expect(()=>component.stateModel.applyPatch(initial,patch,SKILL_OWNER)).toThrow();const registration=rec(f(items(items(decode(compiled.baseRegistry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)).find(v=>key(f(v,1n))===key(sid(1009,'TaskIdentityApplicationTransition')))!,4n),450n),owner=id(f(rec(f(registration,6n),322n),2n));expect(()=>component.stateModel.applyPatch(initial,patch,owner)).not.toThrow();
 expect(()=>component.stateModel.validateState(new AuthoritativeState([...current.entries(),{path:{...jp,selectors:[{kind:'mapKey',key:list([])}]},value}]))).toThrow('foreign');
 const replaceJournal=(v:CanonicalValue)=>new AuthoritativeState([...current.entries().filter(e=>key(statePathValue(e.path))!==key(statePathValue(jp))),{path:jp,value:v}]);expect(()=>component.stateModel.validateState(new AuthoritativeState(current.entries().filter(e=>e.path.fieldId!==2n||e.path.rootStateTypeId!==415n)))).toThrow('presence');const qs=identityJournal(value),entry=items(qs[0],'list');for(const bad of [list([text(ELIGIBILITY),list([qs[0],qs[0]])]),list([text(ELIGIBILITY),list([list([...entry.slice(0,4),q(1,1)])])])])expect(()=>component.stateModel.validateState(replaceJournal(bad))).toThrow();expect(()=>component.stateModel.applyPatch(current,{operations:[{kind:'set',path:jp,expected:{presence:true,value},newValue:value}]},owner)).toThrow('joint');const trace=outputs(run.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text(IDENTITY_VERSION))),expression=trace.find(t=>uint(f(rec(f(t,4n),130n),3n))===90n)!,input=items(f(expression,12n),'list'),sourceEvent=trace.find(t=>key(f(rec(f(t,4n),130n),1n))===key(input[1]))!;expect(uint(f(rec(f(sourceEvent,4n),130n),3n))).toBe(30n);expect(input[2]).toEqual(f(sourceEvent,12n));expect(items(f(rec(f(expression,4n),130n),8n),'list')).toContainEqual(input[1]);
 console.info('M30 source completeness and one-owner full-journal/numeric invariants PASS');
},180000);

it('rollback: late work failure publishes no identity or draws',async()=>{
 const s=source(),d=data(),fault={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...Array.from({length:16},()=>list([signed(3),unsigned(110),BODY_DELIVERY,list([C,q(0,1)]),list([])]))]))},oracle=await createCharacterRun(await prepareCharacterModel(s),fault);await through(oracle,3n);expect(journal(oracle)).toHaveLength(1);
 const counts=new Map<bigint,Set<string>>();for(const t of outputs(oracle.snapshot().trace,160n)){const e=rec(f(t,4n),130n),time=at(f(e,2n)),ids=counts.get(time)??new Set<string>();ids.add(key(f(e,1n)));counts.set(time,ids);}const count=counts.get(3n)!.size;expect(Math.max(...[...counts].filter(([t])=>t<3n).map(([,v])=>v.size))).toBeLessThanOrEqual(count-1);const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(count-1))),fault);await through(failed,2n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(journal(failed)).toEqual([]);expect(draws(failed)).toEqual([]);console.info('M30 late3 rollback events='+count+' cap='+(count-1));
},180000);

it('standing: numeric change equals the earned fold with original qualification support',async()=>{
 const m=await prepareCharacterModel(source()),a=await createCharacterRun(m,data()),b=await createCharacterRun(m,data(true));await through(a,5n);await through(b,5n);const qual=qualificationParts(journal(a)[0]),declarations=items(items(decode(source().registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)),definition=rec(f(declarations.find(v=>key(f(v,1n))===key(sid(1027,'definition/task-reason-source')))!,4n),436n),scale=f(definition,2n),fold=foldIdentityHistory([qual.numeric],readQ(scale)).strength,left=items(rawStanding(a)[0],'list').map(v=>rec(v,402n)),right=items(rawStanding(b)[0],'list').map(v=>rec(v,402n));expect(scale).toEqual(q(1,10));expect(fold).not.toEqual(foldIdentityHistory([qual.numeric],ONE).strength);expect(left.length).toBeGreaterThan(0);
 for(const x of left){const y=right.find(y=>key(f(y,1n))===key(f(x,1n))),delta=readQ(f(x,2n)).subtract(readQ(y?f(y,2n):q(0,1)));expect(delta).toEqual(fold);const basis=f(rec(f(x,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');expect(basis.entries.some(([atom])=>{const v=rec(atom,399n);return uint(f(v,1n))===2n&&key(f(v,3n))===key(qual.id);})).toBe(true);}
 console.info('M30 exact standing delta '+fold.numerator+'/'+fold.denominator+' across '+left.length+' sources; qualification support joined');
},120000);
