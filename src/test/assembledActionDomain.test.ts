import {replay271,candidate271,correspondence271,track271,failure271} from './fixtures/assembledActivationBody';
import {it,expect,afterEach} from 'vitest';
// @ts-expect-error Node-only test evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {fixture as originalFixture,registryChange,dose,decode,items,key,enc,list,text,u,signed,C,rec,f,uint,at,start as originalStart,state,labels,through,currentSleep,type Run} from './fixtures/assembledActionDomain';
import {hash,eqbytes,safe} from './assembledIntoxicationCohort.test';
import {compileCharacterModel,REWARD_EVIDENCE_RULES,REWARD_EVIDENCE_REGISTRY} from '../assembled/model';
import {prepareCharacterModel,createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {walk} from './fixtures/campaign2Cognitive';
import {record,set,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {readQ} from '../campaign2/cognitiveMath';
import {cognitiveRecord as r} from '../assembled/codecs';
import {arbitrationOutput} from '../assembled/arbitration';
import {createAssembledRandomSession} from '../assembled/random';
import {sid,compileProcedures} from '../assembled/skill';
import {compileActionBody,ACTION_BODY,ACTION_BODY_RECEIPT_EVENT} from '../assembled/actionBody';
import {opportunitySource,OPPORTUNITY} from '../assembled/externalObstruction';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {tolerancePath,TOLERANCE_EFFECT} from '../assembled/tolerance';
const fixture=(...args:Parameters<typeof originalFixture>)=>candidate271(originalFixture(...args));
const start=async(...args:Parameters<typeof originalStart>)=>track271(await originalStart(...args));
afterEach(c=>{if(c.task.result?.state==='fail')failure271(c.task.name);});
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test replacement requires record');return record(v.schema,new Map([...v.fields].map(([k,value])=>[k,k===n?x:value])));};
const file=replay271?'docs/planning/ASSEMBLED_CHARACTER_M271_TOLERANCE_EVIDENCE.json':'docs/planning/ASSEMBLED_CHARACTER_M219_EVIDENCE.json',fraction=(v:CanonicalValue)=>{const x=readQ(v);return x.numerator+'/'+x.denominator;};
const put=(name:string,value:unknown)=>{const d=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};expect(d[name]).toBeUndefined();d[name]=value;writeFileSync(file,JSON.stringify(d,null,2)+'\n');if(replay271){d[name]={...value as object,correspondence:correspondence271('TOLERANCE',name,value)};writeFileSync(file,JSON.stringify(d,null,2)+'\n');}};
const records=(run:Run,id:bigint)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===id).map(v=>rec(v,id));
const traces=(run:Run,t:bigint)=>items(decode(run.snapshot().trace),'list').map(v=>rec(v,160n)).filter(v=>at(f(rec(f(v,4n),130n),2n))===t);
function view(run:Run,t:bigint,target:CanonicalValue,unavailable=false){
 const ts=traces(run,t),out=ts.flatMap(v=>{const x=f(v,13n);return typeof x!=='boolean'&&x.kind==='list'?x.items:[x];}),joint=out.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(JOINT_APPRAISAL))).map(v=>items(v,'list'));
 const row=joint.flatMap(v=>items(v[4],'list').map(v=>items(v,'list'))).find(v=>key(v[0])===key(target));
 if(unavailable)expect(row).toEqual([target,text('Unavailable')]);else expect(row,'compared physical task must be live').toHaveLength(5);
 const reason=out.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===408n)!;expect(reason).toBeDefined();const ns=items(f(rec(reason,408n),3n),'list');if(!unavailable)expect(ns.length,'live actual reason required').toBeGreaterThan(0);
 return {at:Number(t),factors:unavailable?['Unavailable']:row!.slice(1).map(fraction),net:ns.map(v=>fraction(f(rec(f(rec(v,407n),2n),406n),3n))),reason};
}
async function finish(run:Run){for(let n=0;await run.settleNextInstant();n++)expect(n).toBeLessThan(64);expect(run.snapshot().clock).toBe(101n);}
const variable=sid(1029,'variable/fixture-regulation');

it('domain219 closed admission and unchanged role constraints',async()=>{
 const b=fixture(),m=await compileCharacterModel(b.s);expect(m.actionLimit).toBe(4);expect(m.actionBody!.entries).toHaveLength(4);expect(m.procedures).toHaveLength(4);expect(m.actionBody!.entries.find(e=>key(e.action)===key(dose))!.delay).toBe(2n);
 await expect(compileCharacterModel({...b.s,rulesVersion:REWARD_EVIDENCE_RULES,registrySchemaVersion:REWARD_EVIDENCE_REGISTRY})).rejects.toThrow('cardinality');
 const mutate=(fn:(s:CanonicalValue[])=>void)=>compileCharacterModel(registryChange(b,fn));
 await expect(mutate(s=>{const ds=items(s[0],'set'),d=ds.find(v=>key(f(rec(v,171n),1n))===key(dose))!;s[0]=set([...ds,replace(d,1n,sid(1027,'definition/fifth-dose'))]);})).rejects.toThrow('cardinality');
 await expect(mutate(s=>{const a=items(s[10],'list');s[10]=list([a[0],a[1],set(items(a[2],'set').slice(1))]);})).rejects.toThrow('coverage');
 await expect(mutate(s=>{const a=items(s[11],'list');s[11]=list([a[0],list(items(a[1],'list').slice(1))]);})).rejects.toThrow('coverage');
 for(const [name,amount,delay,message]of [['protocol-contact-two',1,0,'withholding'],['protocol-contact-one',0,2,'reward action']]as const)await expect(mutate(s=>{const a=items(s[10],'list');s[10]=list([a[0],a[1],set(items(a[2],'set').map(v=>key(items(v,'list')[0])===key(sid(1027,'definition/'+name))?list([items(v,'list')[0],q(amount,1),u(delay)]):v))]);})).rejects.toThrow(message);
 const slots=items(decode(b.s.registry),'list'),actions=m.actionBody!.entries.map(e=>e.action),p=items(slots[11],'list');
 expect(()=>compileProcedures(list([p[0],list([...items(p[1],'list').slice(1),items(p[1],'list')[1]])]),actions,4)).toThrow('duplicate');
 expect(()=>opportunitySource(list([text(OPPORTUNITY),C,set(actions.map(a=>list([a,true])))]),C,actions)).toThrow('coverage');
 expect(opportunitySource(list([text(OPPORTUNITY),C,set(actions.map(a=>list([a,true])))]),C,actions,4)).toHaveLength(4);
 expect(()=>opportunitySource(list([text(OPPORTUNITY),C,set([...actions.slice(1).map(a=>list([a,true])),list([sid(1027,'definition/foreign'),true])])]),C,actions,4)).toThrow('declared action');
 put('admission',{pass:true,model:'0.144',actions:4,predecessorRejectsFourth:true});
},600000);

it('tolerance219 independent action earns and receives tolerance',async()=>{
 const result:any={};for(const law of ['Reciprocal','Unattenuated']as const){const x=await start(fixture(law));await through(x.run,7n);const views=[3n,5n,7n].map(t=>view(x.run,t,fixture(law).target));
 const effects=labels(x.run,TOLERANCE_EFFECT).map(a=>({at:Number(at(a[1])),magnitude:Number(uint(a[4])),requested:fraction(a[5]),potential:fraction(a[6])}));console.info('M219 TOLERANCE',law,JSON.stringify({effects,views:views.map(({reason,...v})=>v)}));
 expect(effects.length).toBeGreaterThanOrEqual(3);expect(effects[0].magnitude).toBeGreaterThan(0);expect(effects[1].magnitude).toBeGreaterThan(effects[0].magnitude);for(const e of effects){expect(e.requested).toBe('40/1');expect(traces(x.run,BigInt(e.at)).some(t=>key(f(rec(f(t,4n),130n),5n))===key(ACTION_BODY_RECEIPT_EVENT)&&items(f(t,11n),'list').some(v=>uint(f(rec(f(rec(v,147n),2n),140n),1n))===302n))).toBe(true);}
 expect(labels(x.run,ACTION_BODY).filter(a=>key(a[3])===key(dose)).length).toBeGreaterThan(0);
 if(law==='Reciprocal'){
  const context=views[0].reason,raw=rec(f(rec(context,408n),2n),403n),options=rec(f(raw,2n),398n),base=items(f(options,3n),'list')[0],m=await compileCharacterModel(x.b.s),actions=m.actionBody!.entries.map(e=>e.action),ns=items(f(rec(context,408n),3n),'list');
  const remap=(v:CanonicalValue,a:CanonicalValue)=>walk(v,x=>key(x)===key(dose)?a:x),four=replace(context,2n,replace(raw,2n,replace(options,3n,list(actions.map(a=>remap(base,a)))))),expanded=replace(four,3n,list(actions.flatMap(a=>ns.map(n=>remap(n,a))))),decision=records(x.run,409n).find(d=>at(f(d,2n))===3n)!,occ=f(decision,1n),defs=items(items(decode(x.b.s.registry),'list')[0],'set'),definition=f(rec(defs.find(v=>key(f(rec(v,171n),1n))===key(sid(1027,'definition/task-arbitration')))! ,171n),4n);
  const rng=createAssembledRandomSession(new Uint8Array(32),undefined,m.taskLimit,true,true);rng.begin();const out=await arbitrationOutput(occ,3n,expanded,definition,rng.forResolution(occ,expanded),m.actionLimit),data=rec(f(rec(f(rec(out,409n),4n),419n),2n),420n),ps=items(f(data,2n),'list').map(v=>fraction(f(rec(v,421n),2n)));expect(ps).toEqual(['1/4','1/4','1/4','1/4']);expect(items(f(data,9n),'list').length).toBeGreaterThanOrEqual(4);rng.close();
  const rejected=createAssembledRandomSession(new Uint8Array(32),undefined,5,true,true);rejected.begin();await expect(arbitrationOutput(occ,3n,expanded,definition,rejected.forResolution(occ,expanded),3)).rejects.toThrow('candidate domain');rejected.close();result.arbitration={probabilities:ps,scope:'exact production arbitration of four equal captured reason bundles; not four simultaneously native eligible roles'};
 }
 await finish(x.run);result[law]={effects,views:views.map(({reason,...v})=>v),input:hash(x.b.d.orderedInputs),initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),terminal:hash(x.run.save())};}
 expect(result.Reciprocal.effects.map((e:any)=>e.magnitude)).toEqual(result.Unattenuated.effects.map((e:any)=>e.magnitude));expect(result.Reciprocal.effects[0].potential).not.toBe(result.Unattenuated.effects[0].potential);expect(result.Reciprocal.views[1].net).not.toEqual(result.Unattenuated.views[1].net);put('tolerance',result);
},600000);

it('continuation219 earned adaptation and pending receipt',async()=>{
 const b=fixture(),x=await start(b),y=await start(b);await through(x.run,3n);await through(y.run,3n);eqbytes(x.run.save(),y.run.save());const t=state(x.run).read(tolerancePath(C,variable)).value;expect(t).toBeDefined();expect(uint(f(rec(t!,297n),1n))).toBeGreaterThan(0);expect(labels(x.run,TOLERANCE_EFFECT)).toHaveLength(0);expect(labels(x.run,ACTION_BODY).some(a=>key(a[3])===key(dose)&&key(a[5])===key(text('Queued')))).toBe(true);
 const save=x.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.handle,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save}));eqbytes(save,restored.save());await finish(x.run);await finish(restored);eqbytes(x.run.save(),restored.save());await expect(createCharacterRun(x.handle,{...b.d,initialState:x.run.snapshot().state})).rejects.toThrow('initial');put('continuation',{pass:true,checkpoint:hash(save),terminal:hash(x.run.save()),earned:String(uint(f(rec(t!,297n),1n)))});
},600000);

it('hidden219 unseen later reserve stays outside cognition',async()=>{
 const xs=[];for(const law of ['Reciprocal','Unattenuated']as const){const b=fixture(law,true),x=await start(b);await through(x.run,7n);const v=view(x.run,7n,b.target,true),out=items(decode(x.run.snapshot().outputs),'list');xs.push({safe:safe(x.run,out),view:{factors:v.factors,net:v.net},effects:labels(x.run,TOLERANCE_EFFECT).map(a=>fraction(a[6]))});}expect(xs[0].effects).not.toEqual(xs[1].effects);expect(xs[0].view).toEqual(xs[1].view);eqbytes(xs[0].safe,xs[1].safe);put('hidden',{pass:true,safe:hash(xs[0].safe),effects:xs.map(x=>x.effects),view:xs[0].view});
},600000);

it('legacy219 exact previous sleep terminal',async()=>{const b=currentSleep({scenario:'Rested',law:'Full',seed:0}),x=await start(b);await finish(x.run);const old=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M218_SLEEP_EVIDENCE.json','utf8')).runs['Full/Rested/0'];expect(hash(b.d.orderedInputs)).toBe(old.input);expect(hash(b.d.initialState)).toBe(old.initial);expect(hash(x.run.save())).toBe(old.prefixes.find((p:any)=>p.terminal).save);put('legacy',{pass:true,candidate:'0.143',terminal:hash(x.run.save())});},600000);
