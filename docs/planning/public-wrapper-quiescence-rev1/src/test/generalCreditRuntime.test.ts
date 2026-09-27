import {it,expect} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {createGeneralSourceRuntime} from '../campaign3/generalSourceRuntime';
import {generalSubject} from '../campaign3/generalBindingProfile';
import {unsigned as u} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
it.each(['credit-age-only','credit-use-only','credit-shared-protection','credit-significance-first'])('executes actual attribution, credit and later retention pressure for %s',async recipe=>{
 const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket(recipe)),run=createGeneralSourceRuntime(model),work:number[]=[];
 while(run.snapshot().queue.length){const result=await run.settleNextInstant();work.push(result!.executedEvents.length);}
 const snapshot=run.snapshot(),records=snapshot.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'),assessment=records.filter(v=>v.schema.typeId===568n),attribution=records.filter(v=>v.schema.typeId===575n),significance=records.filter(v=>v.schema.typeId===576n);
 expect(assessment).toHaveLength(1);expect((f(assessment[0],8n) as ReturnType<typeof rec>).schema.typeId).toBe(564n);
 expect(attribution).toHaveLength(1);expect(f(attribution[0],7n)).toEqual(u(1));expect(items(f(attribution[0],8n),'set')).toHaveLength(16);expect(items(f(attribution[0],9n),'set')).toHaveLength(1);expect(significance).toHaveLength(1);
 const who=generalSubject(),ledger=rec(snapshot.state.read({rootStateTypeId:630n,fieldId:1n,selectors:[{kind:'mapKey',key:who.character}]}).value!,555n),acquisitions=items(f(ledger,1n),'list').map(v=>rec(v,554n)),children=acquisitions.flatMap(a=>{const content=rec(f(a,6n),(f(a,6n) as ReturnType<typeof rec>).schema.typeId);return items(f(content,content.schema.typeId===552n?2n:1n),'list').map(v=>rec(v,(v as ReturnType<typeof rec>).schema.typeId));});
 expect(children.filter(c=>f(c,2n)===true)).toHaveLength(recipe==='credit-age-only'?14:16);expect(children.filter(c=>items(f(c,3n),'set').length)).toHaveLength(1);
 const late=acquisitions.filter(a=>(f(a,3n) as {value:bigint}).value>=40n);expect(late).toHaveLength(recipe==='credit-age-only'?2:0);
 expect(Math.max(...work)).toBeLessThanOrEqual(89);expect(snapshot.clock).toBe(100n);model.validateQuiescent(snapshot.state,snapshot.clock,snapshot.allocators.nextRuntimeId);
},90000);
