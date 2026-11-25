import {it,expect,afterEach} from 'vitest';
import {acquired,lift,start,through,finish,restore,exact,capture,put,saved,gate,original,summary,semantic,records,tags,rec,f,items,key,uint,decode,list,text,q,signed,unpack,failure,type Run} from './fixtures/assembledActivationNative';
import {rows} from './fixtures/assembledMultiComparison';
import {RECEIPT_REASONS} from '../assembled/receiptReasonSources';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {sid} from '../assembled/skill';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
afterEach(c=>{if(c.task.result?.state==='fail')failure(c.task.name);});
function received(p:ReturnType<typeof gate>,at=8){const r=tags(p.os,RECEIPT_REASONS).find(v=>key(v[1])===key(signed(at)));expect(r,'live receipt receiver').toBeDefined();return {produced:items(r![2],'list'),rejected:items(r![3],'list')};}
async function native(name:string,mode:Parameters<typeof acquired>[0]='collective',permitted=true,truth=true,linked=true,positive=true){
 const b=lift(acquired(mode,permitted,truth,linked),positive),x=await start(b);await through(x.r,8);
 put(name,{...capture(x.r),mapping:b.mapping});
 const p=gate(x.r.snapshot().outputs,b.s,8),traces=records(items(decode(x.r.snapshot().trace),'list'),160n);
 const at=traces.filter(t=>key(f(rec(f(t,4n),130n),2n))===key(signed(8)));
 const app=at.flatMap(t=>{const v=f(t,13n);return typeof v!=='boolean'&&v.kind==='list'?[...v.items]:[];}).find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(JOINT_APPRAISAL)));
 expect(app,'live joint appraisal').toBeDefined();for(const task of [b.taskA,b.taskB])expect(items(items(app!,'list')[4],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(task))).toHaveLength(5);
 expect(p.result,'resolved decision8').toBeDefined();return {x,p,...received(p)};
}
it('activation267 acquired primary histories retain grounds and coverage',async()=>{
 for(const mode of ['first','last','collective','duplicate'] as const){
  const {x,p,produced}=await native(mode,mode),old=original(246,mode),prior=gate(old.outputs,x.b.prior,8);
  expect(semantic(p.raw),'same actually acquired semantics').toEqual(semantic(prior.raw));
  const obs=tags(p.os,PERFORMANCE_OBS);expect(obs.map(v=>[v[2],v[6]])).toEqual([[{kind:'unsigned',value:4n},true],[{kind:'unsigned',value:6n},true]]);
  for(const receipt of produced.flatMap(v=>items(items(v,'list')[2],'list')))expect(obs.map(list)).toContainEqual(receipt);
  const value=rows(p.raw).filter(r=>r.family===key(sid(1040,'Value')));expect(value).toHaveLength(1);expect(value[0].strength.compare(ZERO)).toBe(1);
  const first=rows(p.raw).find(r=>key(r.d[0])===key(text('receiptFirst')))!;expect(first.candidate).toEqual(value[0].candidate);expect(first.ground).not.toBe(value[0].ground);expect([...first.basis.keys()].some(k=>value[0].basis.has(k))).toBe(mode==='last');
  if(mode==='collective'||mode==='duplicate'){const coverage=items(items(p.compiled.report,'list')[1],'list').flatMap(v=>items(items(v,'list')[3],'list').map(v=>items(v,'list'))),r=coverage.find(v=>key(items(v[0],'list')[0])===key(text(mode==='collective'?'receiptUnion':'receiptDuplicate')))!;expect(r[4]).toEqual(q(1,1));expect(r[6]).toEqual(q(0,1));}
  expect(p.prob).toEqual(prior.prob);put(mode+'-finding',{...summary(p),original:old.source,classification:'Equivalent produced semantics and probability; distinct Commitment/Value grounds retained'});
 }
 console.info('M267 acquired primary4 PASS independent grounds/ancestry/covered duplicates/current execution');
},590000);
it('activation267 acquired controls classify negative history and preserve evidence boundaries',async()=>{
 const retained=(name:string,mode:Parameters<typeof acquired>[0])=>{const b=lift(acquired(mode));return gate(unpack(saved()[name].outputs),b.s,8);};
 const linked=retained('last','last'),first=retained('first','first');
 const no=await native('unlinked','last',true,true,false);expect(tags(no.p.os,PERFORMANCE_OBS)).toEqual(tags(linked.os,PERFORMANCE_OBS));expect(f(rec(no.p.raw,403n),3n)).toEqual(f(rec(linked.raw,403n),3n));expect(items(f(rec(no.p.raw,403n),5n),'set')).toHaveLength(0);expect(no.p.prob).not.toEqual(linked.prob);
 const hidden=await native('hidden','first',true,false);expect(hidden.p.raw).toEqual(first.raw);expect(hidden.p.result).toEqual(first.result);
 const denied=await native('denied','first',false);expect(tags(denied.p.os,PERFORMANCE_OBS)).toHaveLength(0);expect(denied.produced).toHaveLength(0);expect(denied.rejected.map(v=>items(v,'list')[1])).toContainEqual(text('MissingEvidence'));
 const zero=await native('zero','zero');expect(zero.produced).toHaveLength(0);expect(zero.rejected.map(v=>items(v,'list')[1])).toContainEqual(text('Zero'));
 const negative=await native('negative','negative');expect(rows(negative.p.raw).find(r=>key(r.d[0])===key(text('receiptFirst')))!.strength).toEqual(readQ(q(-3,4)));
 const absent=await native('none','none');expect(absent.produced).toHaveLength(0);expect(absent.rejected).toHaveLength(0);expect(items(f(rec(absent.p.raw,403n),5n),'set')).toHaveLength(1);
 for(const [name,x]of [['unlinked',no],['hidden',hidden],['denied',denied],['zero',zero],['negative',negative],['none',absent]] as const){
  const old=original(246,name),prior=gate(old.outputs,x.x.b.prior,8);
  put(name+'-finding',{...summary(x.p),original:old.source,originalProb:prior.prob.map(key),sameProducedSemantics:JSON.stringify(semantic(x.p.raw))===JSON.stringify(semantic(prior.raw)),classification:name==='negative'?'Activation-policy difference; prior null/opposition classification revisited':'Evidence/source boundary preserved'});
 }
 const control=await native('negative159','negative',true,true,true,false),old=original(246,'negative'),prior=gate(old.outputs,control.x.b.prior,8);
 expect(semantic(control.p.raw)).toEqual(semantic(prior.raw));expect(control.p.prob).toEqual(prior.prob);
 expect(negative.p.prob).not.toEqual(control.p.prob);
 for(const t of [4,6,8]){const a=gate(negative.x.r.snapshot().outputs,negative.x.b.s,t),b=gate(control.x.r.snapshot().outputs,control.x.b.s,t);put('negative-at'+t,{candidate:summary(a),control:summary(b),sameProducedSemantics:JSON.stringify(semantic(a.raw))===JSON.stringify(semantic(b.raw))});}
 negativeChain(negative.p,control.p,negative.x.r.snapshot().outputs,control.x.r.snapshot().outputs,negative.x.b.s,control.x.b.s);
 put('controls',{valueOnly:true,hiddenEqual:true,unknownZeroNegativeAbsentDistinct:true,negative159Matches155:true});
 console.info('M267 acquired controls PASS; negative0.159 control isolates activation difference');
},590000);
it('activation267 acquired repeat and save6 continue exactly',async()=>{
 const a=await start(lift(acquired())),b=await start(lift(acquired()));await through(a.r,6);await through(b.r,6);exact(a.r,b.r);const restored=await restore(a);exact(a.r,restored);const clocks=[];
 for(let n=0;n<128;n++){const more=await a.r.settleNextInstant();for(const r of [b.r,restored]){expect(await r.settleNextInstant()).toBe(more);exact(a.r,r);}clocks.push(String(a.r.snapshot().clock));if(!more)break;if(n===127)throw Error('queue cap');}
 put('acquired-continuation',{...capture(a.r),checkpoint:6,clocks,fullStateOutputTraceSave:true});console.info('M267 acquired exact repeat/save6 continuation PASS');
},590000);


function negativeChain(negative:ReturnType<typeof gate>,control:ReturnType<typeof gate>,negativeBytes:Uint8Array,controlBytes:Uint8Array,negativeSource:ReturnType<typeof lift>['s'],controlSource:ReturnType<typeof lift>['s']){
 const sameLater=JSON.stringify(semantic(negative.raw))===JSON.stringify(semantic(control.raw));
 if(!sameLater){
  const a6=gate(negativeBytes,negativeSource,6),b6=gate(controlBytes,controlSource,6);
  expect(semantic(a6.raw)).toEqual(semantic(b6.raw));expect(a6.result).toBeDefined();expect(b6.result).toBeUndefined();
  const new6=tags(negative.os,PERFORMANCE_OBS).filter(v=>key(v[2])===key({kind:'unsigned',value:6n}));expect(new6).toHaveLength(1);expect(tags(control.os,PERFORMANCE_OBS).filter(v=>key(v[2])===key({kind:'unsigned',value:6n}))).toHaveLength(0);
  const value=rows(negative.raw).filter(r=>r.family===key(sid(1040,'Value')));expect(value).toHaveLength(1);
  const basis=f(rec(f(value[0].s,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('Value basis');expect(basis.entries.some(([atom])=>typeof atom!=='boolean'&&atom.kind==='record'&&atom.schema.typeId===399n&&atom.schema.schemaVersion===2n&&key(f(atom,2n))===key(new6[0][1])),'new receipt consumed by Value source').toBe(true);
  const learning=tags(negative.os,'assembled-values/0.1').find(v=>key(v[1])===key({kind:'unsigned',value:6n}));expect(learning,'actual Value learning6').toBeDefined();expect(learning![2]).toEqual(list([list(new6[0]),true]));
  expect(negative.ns.some(n=>key(f(rec(f(rec(n,407n),1n),404n),2n))===key(sid(1040,'Value'))),'acquired Value actually active8').toBe(true);
  put('negative-history-chain',{sameSources6:true,oldNoReasons6:true,newExecutionAndPerceivedReceipt6:true,receiptConsumed8:true,classification:'Activation-policy change -> new attempt -> permitted receipt -> acquired source at8; not a same-history probability comparison'});
 }else put('negative-history-chain',{sameSources8:true,classification:'Direct activation-policy difference on matching produced sources'});
}

it('activation267 retained negative chain follows Value consumption',()=>{
 const data=saved(),n=lift(acquired('negative')),c=lift(acquired('negative'),false);
 for(const [name,b]of [['negative',n],['negative159',c]] as const)expect(data[name].mapping).toEqual(b.mapping);
 for(const name of ['unlinked','hidden','denied','zero','negative','none'])expect(data[name+'-finding']).toBeDefined();
 const nb=unpack(data.negative.outputs),cb=unpack(data.negative159.outputs);negativeChain(gate(nb,n.s,8),gate(cb,c.s,8),nb,cb,n.s,c.s);
 put('controls',{valueOnly:true,hiddenEqual:true,unknownZeroNegativeAbsentDistinct:true,negative159Matches155:true});
 console.info('M267 retained native chain PASS activation -> attempt6 -> observed receipt -> learned Value -> actual reason8; no native rerun');
});
