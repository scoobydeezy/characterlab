import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {personPath,personMean} from '../assembled/social';
import {relationshipPath,relationshipHistory,relationshipFold,REL_APPRAISAL} from '../assembled/relationship';
import {fixture,rec,f,uint,items,key,decode,list,text,signed,q,outputs,C,target,type Mode,type CanonicalValue} from './fixtures/assembledRelationshipCompletion';
import {capture,through} from './assembledMultiReceipts.test';
export async function start(mode:Mode='history'){const b=fixture(mode),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
export const state=(x:Awaited<ReturnType<typeof start>>)=>restoreAuthoritativeState(decode(x.r.snapshot().state));
export const history=(x:Awaited<ReturnType<typeof start>>)=>state(x).read(relationshipPath(C,target)).value;
export function reports(x:Awaited<ReturnType<typeof start>>){return items(decode(x.r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text('assembled-relationship-people/0.1/appraisal'))).flatMap(v=>items(v,'list').slice(1).map(v=>items(v,'list'))).filter(v=>key(v[2])===key(target));}
export const at=(x:Awaited<ReturnType<typeof start>>,n:number)=>reports(x).find(v=>key(v[1])===key(signed(n)))!;
export const effective=(p:ReturnType<typeof capture>)=>p.analytical.mode==='Auto'?p.analytical.probabilities.map(v=>key(v.key)===key(f(p.data,1n))?q(1,1):q(0,1)):p.probabilities;
it('primary151: own history with exactly matched person belief changes the live decision; rupture/explanation/repair/absence retain their distinctions',async()=>{
 const a=await start(),b=await start('witness');for(const x of[a,b])await through(x.r,4n);
 expect(state(b).read(personPath(C,target))).toEqual(state(a).read(personPath(C,target)));expect(personMean(state(a).read(personPath(C,target)).value)).toEqual(Q.of(2n,3n));
 expect(at(a,4).slice(4,9)).toEqual([{kind:'unsigned',value:2n},false,true,true,false]);expect(at(b,4)[4]).toEqual({kind:'unsigned',value:0n});
 const yes=capture(a.r,a.b,4n),no=capture(b.r,b.b,4n);expect(effective(yes)).not.toEqual(effective(no));
 console.info('M151 matched4',yes.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),no.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),'modes',yes.analytical.mode,no.analytical.mode);
 await through(a.r,7n);expect(at(a,7)[5]).toBe(true);expect(personMean(state(a).read(personPath(C,target)).value)).toEqual(Q.of(3n,4n));expect(relationshipHistory(history(a))).toHaveLength(3);capture(a.r,a.b,7n);
 await through(a.r,9n);expect(relationshipFold(history(a))).toEqual({count:3n,rupture:false,comfort:true});expect(at(a,9)[5]).toBe(false);capture(a.r,a.b,9n);
 await through(a.r,11n);expect(at(a,11).slice(4,9)).toEqual([{kind:'unsigned',value:3n},false,true,false,true]);expect(relationshipHistory(history(a))).toHaveLength(4);
 const d=outputs(a.r.snapshot().outputs,409n).find(v=>key(f(v,2n))===key(signed(11)))!;expect(uint(f(rec(f(d,4n),419n),1n))).toBe(3n);
 console.info('M151 PRIMARY PASS exact person2/3 with own history2 vs0; effective response differs; explanation3/4 does not repair breach; later cooperation clears; absence preserves4 receipts and selects alternative');
},590000);
