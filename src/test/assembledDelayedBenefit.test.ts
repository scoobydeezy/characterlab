import {changeDefinition} from './fixtures/assembledCharacter';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {compileCharacterState} from '../assembled/state';
import {AuthoritativeState} from '../substrate/state';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
import {BENEFIT_SOURCE} from '../assembled/delayedBenefit';
import {POSITIVE_ACTIVATION_RULES,POSITIVE_ACTIVATION_REGISTRY} from '../assembled/model';
import {it,expect,afterEach} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless compression.
import {deflateSync} from 'node:zlib';
// @ts-expect-error Hashing.
import {createHash} from 'node:crypto';
import {fixture,start,through,finish,rec,f,uint,items,key,decode,enc,list,text,u,q,signed,sid,taskA,restorePreparedCharacterRun,cachedMemory,type Run} from './fixtures/assembledDelayedBenefit';
import {benefitPath,benefitKnowledge,benefitPlan,benefitWorld,compileBenefit,BENEFIT} from '../assembled/delayedBenefit';
import {compileCharacterModel} from '../assembled/model';
import {restoreAuthoritativeState} from '../substrate/state';
// @ts-expect-error Evidence decompression.
import {inflateSync} from 'node:zlib';
const file='docs/planning/ASSEMBLED_CHARACTER_M274_EVIDENCE.json',hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')});
const saved=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
function store(k:string,v:unknown){const d=saved();if(d[k])expect(d[k]).toEqual(v);else {d[k]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');}}
function capture(r:Run){const s=r.snapshot();return {clock:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:zip(r.save())};}
let active:Run|undefined;
afterEach(ctx=>{if(ctx.task.result?.state==='fail'&&active)store('failure-'+Object.keys(saved()).filter(k=>k.startsWith('failure')).length,{name:ctx.task.name,...capture(active)});active=undefined;});
const records=(r:Run,type:bigint)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
async function run(name:Parameters<typeof fixture>[0],curve=1,compact=false){
 const x=await start(fixture(name,curve));active=x.r;await through(x.r,2);const decisions=records(x.r,409n);expect(decisions).toHaveLength(1);const d=decisions[0],compiled=rec(f(d,3n),408n),raw=rec(f(compiled,2n),403n),nuclei=items(f(compiled,3n),'list'),status=rec(f(d,4n),419n);
 const state=restoreAuthoritativeState(decode(x.r.snapshot().state)),s=(await compileCharacterModel(x.b.s)).benefit!,pv=state.read(benefitPath(s,'plan')).value,p=pv?benefitPlan(pv,s):undefined;
 const row={name,curve,nuclei:nuclei.length,kind:String(uint(f(status,1n))),selected:p?String(p.selected):null,due:p?String(p.due):null,prob:uint(f(status,1n))===3n?items(f(rec(f(status,2n),420n),2n),'list').map(key):[],raw:zip(enc(raw)),original:zip(enc(list(x.b.originals))),source:{registry:hash(x.b.s.registry),inputs:hash(x.b.d.orderedInputs),initial:hash(x.b.d.initialState),seed:hash(x.b.d.runSeed)}};
 store(name+'-'+curve+'-choice',{...row,...(compact?{}:capture(x.r))});
 const reports=items(decode(x.r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list').map(v=>items(v,'list')),appraisal=reports.find(v=>key(v[0])===key(text(BENEFIT+'/appraisal'))),valuation=reports.find(v=>key(v[0])===key(text(BENEFIT+'/valuation')));expect(appraisal,'actual benefit appraisal').toBeDefined();expect(valuation,'actual valuation consumer').toBeDefined();expect(valuation![3]).toEqual(list(appraisal!));
 if(!['deniedOffer','hiddenOffer','absentOffer'].includes(name!))expect(items(appraisal![5],'list')).toHaveLength(2);

 if(p){expect(records(x.r,431n)).toHaveLength(1);expect(records(x.r,432n)).toHaveLength(1);expect(records(x.r,433n)).toHaveLength(1);expect(key(f(rec(f(records(x.r,431n)[0],2n),425n),2n))).toBe(key(d));}
 const checkpoints=[];for(let at=3;at<=8;at++){await through(x.r,at);const st=restoreAuthoritativeState(decode(x.r.snapshot().state)),wv=st.read(benefitPath(s,'world')).value,k=benefitKnowledge(st.read(benefitPath(s,'knowledge')).value);checkpoints.push({at,world:wv?key(wv):null,receipt:key(list(k.receipt))});if(p&&BigInt(at)<p.due)expect(wv&&benefitWorld(wv).settled).toBe(false);}
 store(name+'-'+curve+'-received',{checkpoints,...(compact?{outputs:hash(x.r.snapshot().outputs),state:hash(x.r.snapshot().state)}:capture(x.r))});await finish(x.r);store(name+'-'+curve+'-terminal',{...capture(x.r)});
 return {x,row,s,checkpoints};
}
const unpack=(b:{hash:string;bytes:number;deflate:string})=>{const v=new Uint8Array(inflateSync(Uint8Array.from(atob(b.deflate),c=>c.charCodeAt(0))));expect(hash(v)).toBe(b.hash);expect(v.length).toBe(b.bytes);return v;};
function capturedDecision(name:string){const row=saved()[name+'-1-choice'];expect(row).toBeDefined();const outputs=items(decode(unpack(row.outputs??saved()[name+'-1-terminal'].outputs)),'list'),decision=rec(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n)!,409n);return {row,decision,chosen:rec(f(rec(f(decision,4n),419n),2n),420n)};}
it('benefit274 first actual loop and retained probability finding',async()=>{
 await run('main',1,true);await run('immediateLarge',1,true);
 const a=capturedDecision('main'),b=capturedDecision('immediateLarge');expect(a.row.nuclei).toBe(2);expect(b.row.nuclei).toBe(2);expect(a.row.prob).not.toEqual(b.row.prob);expect(a.row.selected).toBe('2');expect(b.row.selected).toBe('2');
 const draws=(d:typeof a)=>items(f(d.chosen,9n),'list').map(v=>f(rec(v,422n),5n));const ad=draws(a),bd=draws(b);expect(ad).toHaveLength(2);for(const d of ad){const x=rec(d,411n),other=bd.map(v=>rec(v,411n)).find(v=>key(f(v,2n))===key(f(x,2n)));expect(other).toBeDefined();expect(f(other!,7n)).toEqual(f(x,7n));}
 const n=await run('unknown',1,true);expect(n.row.selected).toBe('1');expect(n.row.due).toBe('2');expect(n.row.nuclei).toBe(1);
 store('first-classification',{mainLater:true,competingValueLater:true,immediateProbability:['1/2','2/3'],sameAddressedBlocks:true,actualImmediate:'unknown-1',classification:'Shared-dice realization retained; exact native probability changes. Original competing-value actual-immediate requirement remains for final correspondence.'});
 console.info('M274 later delivery and original unknown-future immediate delivery; retained shared-dice probability finding PASS');
},590000);

it('benefit274 original primary boundary cohort',async()=>{
 const names=['delay2','delay4','cost','uncertain','unavailable','failed','missing','hiddenMissing','falseReceipt','truePromised','lateReceipt','hiddenLate','deniedOffer','hiddenOffer','absentOffer','lateWorldChange','zeroReceipt'] as const;
 const results=new Map<string,Awaited<ReturnType<typeof run>>>();for(const name of names){const x=await run(name,1,true);results.set(name,x);console.info('M274 primary',name,x.row.selected,x.row.nuclei);}
 const snapshot=(name:string)=>results.get(name)!.x.r.snapshot();
 for(const [a,b]of [['missing','hiddenMissing'],['falseReceipt','truePromised'],['lateReceipt','hiddenLate'],['deniedOffer','hiddenOffer']]){expect(snapshot(a).outputs,a+'/'+b+' full observer').toEqual(snapshot(b).outputs);const filter=(bytes:Uint8Array)=>restoreAuthoritativeState(decode(bytes)).entries().filter(e=>e.path.rootStateTypeId!==1610n);expect(filter(snapshot(a).state)).toEqual(filter(snapshot(b).state));}
 const knowledge=(name:string)=>{const x=results.get(name)!,st=restoreAuthoritativeState(decode(x.x.r.snapshot().state));return benefitKnowledge(st.read(benefitPath(x.s,'knowledge')).value);};
 const world=(name:string)=>{const x=results.get(name)!,st=restoreAuthoritativeState(decode(x.x.r.snapshot().state));return benefitWorld(st.read(benefitPath(x.s,'world')).value!);};
 expect(knowledge('failed').receipt[3]).toEqual({kind:'rational',numerator:0n,denominator:1n});expect(knowledge('missing').receipt).toHaveLength(0);expect(knowledge('hiddenMissing').receipt).toHaveLength(0);expect(world('missing').amount.numerator).toBeGreaterThan(0n);expect(world('hiddenMissing').amount.numerator).toBe(0n);
 expect(knowledge('falseReceipt').receipt[3]).toEqual(knowledge('truePromised').receipt[3]);expect(world('falseReceipt').amount.numerator).toBe(0n);
 expect(uint(knowledge('lateReceipt').receipt[1])).toBe(7n);expect(uint(knowledge('hiddenLate').receipt[1])).toBe(7n);
 expect(knowledge('zeroReceipt').receipt[3]).toEqual({kind:'rational',numerator:0n,denominator:1n});expect(world('zeroReceipt').amount.numerator).toBeGreaterThan(0n);
 for(const name of ['deniedOffer','hiddenOffer','absentOffer']){expect(results.get(name)!.row.nuclei).toBe(0);expect(results.get(name)!.row.selected).toBe(null);expect(knowledge(name).offer).toHaveLength(0);}
 expect(knowledge('unavailable').offer).toHaveLength(3);expect(results.get('unavailable')!.row.selected).toBe('1');
 const main=saved()['main-1-terminal'];expect(snapshot('lateWorldChange').outputs).toEqual(unpack(main.outputs));expect(snapshot('lateWorldChange').state).toEqual(unpack(main.state));
 store('primary-controls',{cases:names,wholeObserverPairs:4,wholeCognitionPairs:4,failedKnownZero:true,missingRemainsUnknown:true,falseReceiptSeparated:true,lateReceiptAt7:true,deniedOfferPrivateValues:true,onceOnlyDelivery:true});
 console.info('M274 all original primary delay/cost/uncertainty, receipt and whole-observer boundaries PASS');
},590000);
it('benefit274 pending-delivery repeat and exact continuation',async()=>{
 const b=fixture('main'),x=await start(b),repeat=await start(b);active=x.r;await through(x.r,2);await through(repeat.r,2);expect(repeat.r.save()).toEqual(x.r.save());const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:x.r.save()}));expect(restored.save()).toEqual(x.r.save());let steps=0;
 for(;;){const a=await x.r.settleNextInstant(),z=await restored.settleNextInstant(),r=await repeat.r.settleNextInstant();expect(z).toBe(a);expect(r).toBe(a);expect(restored.save()).toEqual(x.r.save());expect(repeat.r.save()).toEqual(x.r.save());steps++;if(!a)break;if(steps>128)throw Error('M274 continuation cap');}
 store('pending-continuation',{checkpoint:2,steps,fullStateOutputsTraceSave:true,...capture(x.r)});console.info('M274 actual pending future delivery restores/repeats all remaining bytes PASS');
},590000);

it('benefit274 admission criterion isolation and empty-binding compatibility',async()=>{
 const b=fixture('main'),x=await start(b);active=x.r;
 const slots=items(decode(b.s.registry),'list');
 for(const [field,value]of [[4,u(4)],[5,u(3)],[3,items(items(slots[61],'list')[1],'list').map(v=>items(v,'list'))[0][2]]] as const){const a=items(slots[61],'list'),row=[...items(items(a[1],'list')[0],'list')];row[field]=value;const registry=enc(list([...slots.slice(0,61),list([a[0],list([list(row)])])]));await expect(prepareCharacterModel({...b.s,registry})).rejects.toThrow();}
 const input=items(decode(b.d.orderedInputs),'list');
 await expect(createCharacterRun(x.m,{...b.d,orderedInputs:enc(list(input.filter(v=>!(key(items(v,'list')[2])===key(BENEFIT_SOURCE)&&key(items(v,'list')[0])===key(signed(8))))))})).rejects.toThrow('eight-frame');
 const late=input.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(BENEFIT_SOURCE)&&key(a[0])===key(signed(3))){const p=[...items(a[3],'list')],first=items(input.find(v=>key(items(v,'list')[2])===key(BENEFIT_SOURCE))!,'list');p[1]=items(first[3],'list')[1];a[3]=list(p);}return list(a);});
 await expect(createCharacterRun(x.m,{...b.d,orderedInputs:enc(list(late))})).rejects.toThrow('offer window');
 const model=await compileCharacterModel(b.s),component=await compileCharacterState(model),s=model.benefit!,initial=component.initialState(b.d.initialState),path=benefitPath(s,'world'),value=list([text(BENEFIT),{kind:'typedIdentifier',namespaceId:1141n,payload:u(1)},false,u(2),q(0,1)]);
 const forged=new AuthoritativeState([...initial.entries(),{path,value}]);
 await expect(createCharacterRun(x.m,{...b.d,initialState:enc(forged.canonicalValue())})).rejects.toThrow('world plan association');
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path,expected:{presence:false},newValue:value}]},KNOWLEDGE_OWNER)).toThrow();
 const guard=fixture('main');guard.s=changeDefinition(changeDefinition(guard.s,'definition/task-a',3n,q(0,1)),'definition/task-a',4n,q(10,1));const rows=items(decode(guard.d.orderedInputs),'list'),probe=items(rows.find(v=>key(items(v,'list')[2])===key(PROBE_SOURCE_EVENT))!,'list');guard.d={...guard.d,orderedInputs:enc(list([...rows,list([signed(3),...probe.slice(1)])]))};const g=await start(guard);active=g.r;await through(g.r,3);const state=restoreAuthoritativeState(decode(g.r.snapshot().state));expect(uint(f(rec(state.read({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:taskA}]}).value!,372n),1n))).toBe(1n);
 const trace=items(decode(g.r.snapshot().trace),'list').map(v=>rec(v,160n));expect(trace.some(v=>{const e=rec(f(v,4n),130n);return key(f(e,2n))===key(signed(3))&&key(f(e,5n))===key(sid(1001,'event/task-measurement-settlement'));})).toBe(true);store('criterion-isolation',{extraProbeAt3:true,ordinaryTargetWouldMatch:true,benefitGoalStillOpen:true,...capture(g.r)});
 const emptyRegistry=enc(list([...slots.slice(0,61),list([text(BENEFIT),list([])])])),plain={...b,s:{...b.s,registry:emptyRegistry},d:{...b.d,orderedInputs:enc(list(input.filter(v=>key(items(v,'list')[2])!==key(BENEFIT_SOURCE))))}},old={...plain,s:{...plain.s,rulesVersion:POSITIVE_ACTIVATION_RULES,registrySchemaVersion:POSITIVE_ACTIVATION_REGISTRY,registry:enc(list(slots.slice(0,61)))}};
 const current=await start(plain),prior=await start(old);active=current.r;await finish(current.r);await finish(prior.r);expect(current.r.snapshot().outputs).toEqual(prior.r.snapshot().outputs);expect(current.r.snapshot().state).toEqual(prior.r.snapshot().state);
 const semanticTrace=(r:Run)=>items(decode(r.snapshot().trace),'list').map(v=>{const t=rec(v,160n);return enc(list([...t.fields].filter(([n])=>n!==2n&&n!==3n).map(([n,v])=>list([u(n),v]))));});expect(semanticTrace(current.r)).toEqual(semanticTrace(prior.r));
 store('admission-compatibility',{invalidBindings:3,incompleteWindow:true,lateOffer:true,learnedS0:true,wrongOwner:true,emptyBindingSameStateOutputsTraceExceptIdentity:true,current:capture(current.r),prior:capture(prior.r)});
 console.info('M274 domains/ownership, unrelated probe exclusion and empty0.161/0.160 correspondence PASS');
},590000);

it('benefit274 zero later value and strict transaction domains',async()=>{
 const b=fixture('main'),input=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(BENEFIT_SOURCE)&&key(a[0])===key(signed(1))){const p=[...items(a[3],'list')],o=[...items(items(p[1],'list')[0],'list')];o[4]=q(1,1);p[1]=list([list(o)]);a[3]=list(p);}return list(a);});b.d={...b.d,orderedInputs:enc(list(input))};const x=await start(b);active=x.r;await through(x.r,2);const model=await compileCharacterModel(b.s),s=model.benefit!,state=restoreAuthoritativeState(decode(x.r.snapshot().state)),pv=state.read(benefitPath(s,'plan')).value!,p=benefitPlan(pv,s),world=benefitWorld(state.read(benefitPath(s,'world')).value!);
 expect(p.selected).toBe(1n);expect(p.due).toBe(2n);expect(world.settled).toBe(true);const d=records(x.r,409n)[0];expect(items(f(rec(f(d,3n),408n),3n),'list')).toHaveLength(1);
 const wrongDue=[...p.a];wrongDue[3]=u(3);expect(()=>benefitPlan(list(wrongDue),s)).toThrow();const wrongAction=[...p.a];wrongAction[1]=u(2);wrongAction[3]=u(3);expect(()=>benefitPlan(list(wrongAction),s)).toThrow('selected action');const wrongId=[...p.a];wrongId[4]=sid(1144,'foreign');expect(()=>benefitPlan(list(wrongId),s)).toThrow('plan occurrence');const worldId=[...world.a];worldId[1]=sid(1144,'foreign');expect(()=>benefitWorld(list(worldId))).toThrow();
 const component=await compileCharacterState(model),badWorld=[...world.a];badWorld[3]=u(3);expect(()=>component.stateModel.validateState(new AuthoritativeState(state.entries().map(e=>key(e.path.rootStateTypeId===1610n?e.value:list([]))===key(list(world.a))?{...e,value:list(badWorld)}:e)))).toThrow('world plan association');
 await finish(x.r);store('zero-later-control',{scenario:'main with legal waiting cost1; original remains unchanged',knownFuture:true,zeroLater:true,actualImmediate:true,strictTransactionRejections:5,...capture(x.r)});console.info('M274 known future with zero later net value executes now; strict domains PASS');
},590000);
