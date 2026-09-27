import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {dataField as f,dataItems as items,dataKey as key,dataRecord as rec} from '../campaign2/canonicalData';
import {compileDelayedModel,compileDelayedInputs,delayedRecipe,STAGES,eventId,owner,path,OPTIONS} from '../campaign3/delayedModel';
import {createDelayedRuntime} from '../campaign3/delayedRuntime';
import {delayedObserverView} from '../campaign3/delayedMath';
import {delayedRecord as r} from '../campaign3/delayedCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,original,offer,ordered,initialState,seed,records} from './delayedFixtures';
async function run(name:keyof ReturnType<typeof cases>='main',law=1){const model=await compileDelayedModel(delayedRecipe(law)),input=await compileDelayedInputs(model,initialState,ordered(cases()[name]),seed),runtime=createDelayedRuntime(model,input);while(await runtime.settle()){}return runtime;}
const outputs=(s:Awaited<ReturnType<typeof run>>)=>s.snapshot().outputs;
const app=(s:Awaited<ReturnType<typeof run>>)=>records(outputs(s),1386n)[1];
const chosen=(s:Awaited<ReturnType<typeof run>>)=>f(records(outputs(s),1390n)[1],7n);
const knowledge=(s:Awaited<ReturnType<typeof run>>)=>rec(s.snapshot().state.read(path(1385)).value!,1384n);
it('separates anticipated value, actual choice, waiting, physical delivery and single retained receipt',async()=>{
 const s=await run();expect(f(app(s),5n)).toEqual(q(1,8));expect(f(app(s),6n)).toEqual(q(1,2));
 expect(chosen(s)).toEqual(OPTIONS[1]);
 const truth=records(outputs(s),1399n);expect(items(f(truth[1],3n),'list')).toHaveLength(0);expect(items(f(truth[2],3n),'list')).toHaveLength(1);
 expect(f(rec(items(f(truth[2],3n),'list')[0],1397n),2n)).toEqual(q(1,1));
 expect(items(f(knowledge(s),2n),'list')).toHaveLength(1);expect(records(outputs(s),1383n)).toHaveLength(6);
 const apps=records(outputs(s),1386n);expect(items(f(rec(f(apps[2],3n),1384n),2n),'list')).toHaveLength(0);expect(items(f(rec(f(apps[3],3n),1384n),2n),'list')).toHaveLength(1);
});
it('holds amount fixed while delay and discount-law interventions change exact anticipation',async()=>{
 const a=await run('delay2'),b=await run('delay2',2),c=await run('delay2',3),d=await run('delay4');
 expect(f(app(a),6n)).toEqual(q(1,3));expect(f(app(b),6n)).toEqual(q(1,1));expect(f(app(c),6n)).toEqual(q(1,4));expect(f(app(d),6n)).toEqual(q(1,5));
 for(const s of [a,b,c,d])expect(f(app(s),5n)).toEqual(q(1,8));
 expect(records(outputs(a),1390n)[1]).not.toEqual(records(outputs(b),1390n)[1]);
},60000);
it('cost and uncertainty are independent; unknown, unavailable and absent remain distinguishable',async()=>{
 expect(f(app(await run('cost')),6n)).toEqual(q(1,4));expect(f(app(await run('uncertain')),6n)).toEqual(q(1,4));
 const unknown=await run('unknown'),unavailable=await run('unavailable'),absent=await run('absentOffer');
 expect(chosen(unknown)).toEqual(OPTIONS[0]);expect(chosen(unavailable)).toEqual(OPTIONS[0]);expect(chosen(absent)).toEqual(OPTIONS[2]);
 expect(knowledge(unknown)).not.toEqual(knowledge(unavailable));expect(absent.snapshot().state.read(path(1385)).presence).toBe(false);
},60000);
it('genuinely chooses the immediate benefit in a competing immediate-value case',async()=>{
 const s=await run('immediateLarge');expect(chosen(s)).toEqual(OPTIONS[0]);const d=rec(items(f(records(outputs(s),1399n)[1],3n),'list')[0],1397n);expect(f(d,3n)).toEqual(u(1));
});
it('failed promise supplies known zero only when observed; missing receipt stays unknown',async()=>{
 const failed=await run('failed'),missing=await run('missing');expect(chosen(failed)).toEqual(OPTIONS[1]);
 expect(f(rec(items(f(knowledge(failed),2n),'list')[0],1383n),5n)).toEqual(q(0,1));expect(items(f(knowledge(missing),2n),'list')).toHaveLength(0);
 expect(records(outputs(failed),1392n).slice(0,2)).toEqual(records(outputs(missing),1392n).slice(0,2));
});
it('whole observer views survive hidden delivery and denied-source interventions including later common receiving',async()=>{
 const view=(s:Awaited<ReturnType<typeof run>>)=>delayedObserverView(outputs(s));
 for(const [a,b] of [['missing','hiddenMissing'],['truePromised','falseReceipt'],['lateReceipt','hiddenLate'],['deniedOffer','hiddenOffer'],['main','lateWorldChange']] as const)expect(view(await run(a))).toEqual(view(await run(b)));
},120000);
it('misleading zero receipt changes later retained outcome without rewriting prior expression or world',async()=>{
 const a=await run(),b=await run('zeroReceipt');expect(records(outputs(a),1399n)).toEqual(records(outputs(b),1399n));expect(records(outputs(a),1392n).slice(0,3)).toEqual(records(outputs(b),1392n).slice(0,3));expect(knowledge(a)).not.toEqual(knowledge(b));
});
it('checks actual intent/expression/consequence phases and prefix immutability',async()=>{
 const model=await compileDelayedModel(delayedRecipe()),input=await compileDelayedInputs(model,initialState,ordered(cases().main),seed),runtime=createDelayedRuntime(model,input);await runtime.settle();await runtime.settle();const before=runtime.snapshot().outputs.slice();while(await runtime.settle()){}expect(runtime.snapshot().outputs.slice(0,before.length)).toEqual(before);
 for(const [type,phase] of [[1386n,40n],[1390n,60n],[1391n,70n],[1392n,80n],[1395n,90n],[1396n,100n],[1399n,110n],[1383n,120n],[1400n,140n]])for(const t of runtime.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length))expect(f(rec(f(t,4n),130n),3n)).toEqual(u(phase));
});
for(const stage of [...STAGES.map(([name])=>name),'commit'])it(`rolls back ${stage} including a contested choice or delivery`,async()=>{
 const model=await compileDelayedModel(delayedRecipe()),input=await compileDelayedInputs(model,initialState,ordered(cases().main),seed),runtime=createDelayedRuntime(model,input);await runtime.settle();const before=runtime.snapshot();let reached=false;
 await expect(runtime.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('delayed fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=runtime.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const field of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[field]).toEqual(before[field]);expect(()=>runtime.save()).toThrow();
},30000);
it('rejects incomplete delivery window, late/zero offers, changing receipt convention and foreign writes',async()=>{
 const m=await compileDelayedModel(delayedRecipe()),xs=cases().main;
 await expect(compileDelayedInputs(m,initialState,ordered(xs.slice(0,4)),seed)).rejects.toThrow('DELIVERY_WINDOW');
 await expect(compileDelayedInputs(m,initialState,ordered(xs.map((v,i)=>i===1?original(2,{offers:[offer()]}):v)),seed)).rejects.toThrow('OFFER_WINDOW');
 await expect(compileDelayedInputs(m,initialState,ordered(xs.map((v,i)=>i===0?original(1,{offers:[offer(1,3,0,0)]}):v)),seed)).rejects.toThrow('POSITIVE_OFFER');
 await expect(compileDelayedInputs(m,initialState,ordered(xs.map((v,i)=>i===4?original(5,{mode:1}):v)),seed)).rejects.toThrow('CONFLICT');
 expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(1385),expected:{presence:false},newValue:r(1384,[list([]),list([])])}]},owner('execution'),m.authority)).toThrow();
});

it('discount competitors change the actual decision distribution, not only appraisal labels',async()=>{
 const a=await run('delay4'),b=await run('delay4',2),c=await run('delay4',3);
 const probabilities=(s:Awaited<ReturnType<typeof run>>)=>f(records(outputs(s),1390n)[1],4n);
 expect(probabilities(a)).not.toEqual(probabilities(b));expect(probabilities(c)).not.toEqual(probabilities(b));
 const nuclei=items(f(records(outputs(a),1389n)[1],3n),'list');expect(nuclei).toHaveLength(2);
 const grounds=nuclei.map(v=>f(rec(f(rec(v,407n),1n),404n),3n));expect(grounds[0]).toEqual(grounds[1]);
},60000);
for(const boundary of ['execution','commit'])it(`rolls back actual due delivery at ${boundary}`,async()=>{
 const model=await compileDelayedModel(delayedRecipe()),input=await compileDelayedInputs(model,initialState,ordered(cases().main),seed),runtime=createDelayedRuntime(model,input);await runtime.settle();await runtime.settle();const before=runtime.snapshot();let reached=false;
 await expect(runtime.settleForConformance({onBoundary(b,event){if(boundary==='commit'?b==='before-commit':b==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId('execution'))){reached=true;throw Error('delivery rollback');}}})).rejects.toThrow();expect(reached).toBe(true);expect(enc(runtime.snapshot().state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(runtime.snapshot().outputs).toEqual(before.outputs);expect(runtime.snapshot().allocators).toEqual(before.allocators);
},30000);
