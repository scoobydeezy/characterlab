import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {list,text,typedIdentifier,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {practiceSetting,skillValue,interferedPractice,practiced,SKILL,INTERFERENCE,PROCEDURES,sid} from '../assembled/skill';
import {evolveSkill} from '../campaign3/longitudinalMath';
import {DEFAULT_SETTINGS} from '../campaign3/longitudinalModel';
import {longitudinalRecord} from '../campaign3/longitudinalCodecs';
import {skillRecord} from '../campaign3/skillCodecs';
import {dataField as f,dataRecord as rec} from '../campaign2/canonicalData';
it('kernel152: quarter loss, floor, ordering and counts match original; D3 practice remains distinct',()=>{
 let cases=0;for(const numerator of[0,1,2,3,4,8])for(const loss of[false,true])for(const practice of[false,true]){
 const K=Q.of(BigInt(numerator),8n),source=longitudinalRecord(878,[typedIdentifier(1157,u(1)),{kind:'signed',value:30n},u(2),false,false,false,false,loss,u(20)]),prior=skillRecord(784,[q(K.numerator,K.denominator),u(2)]),old=evolveSkill(prior,source,DEFAULT_SETTINGS),next=interferedPractice(K,2n,2,practice,loss);
 expect(q(next.afterLoss.numerator,next.afterLoss.denominator)).toEqual(f(rec(old,784n),1n));const expected=practice?practiced(next.afterLoss,2n,2).after:next.afterLoss;expect(next.after).toEqual(expected);expect(skillValue(next.value,undefined,true).count).toBe(2n+(practice?1n:0n));cases++;
 }
 expect(interferedPractice(Q.of(0n),0n,0,false,true).changed).toBe(false);
 expect(interferedPractice(Q.of(1n,2n),1n,0,true,true).after).toEqual(Q.of(3n,4n));
 expect(interferedPractice(Q.of(1n,4n),1n,4,true,false).after).toEqual(Q.of(3n,8n));
 expect(()=>interferedPractice(Q.of(1n),100n,0,true,false)).toThrow('count');
 console.info('M152 KERNEL PASS',cases,'original loss correspondence plus adopted D3 composition; D3 early/late differences retained');
});
it('grammar152: old six-field behavior remains; new source and retained zero require successor',()=>{
 const old=list([text(SKILL),u(0),q(0,1),q(1,2),true,false]),next=list([text(INTERFERENCE),u(0),q(0,1),q(1,2),true,false,true]);
 expect(practiceSetting(old,true)).toEqual(practiceSetting(old));expect(()=>practiceSetting(next)).toThrow();expect(practiceSetting(next,true).interference).toBe(true);
 for(const bad of[list([text(INTERFERENCE),u(0),q(0,1),q(1,2),true,false,u(1)]),list([text(INTERFERENCE),u(5),q(0,1),q(1,2),true,false,true])])expect(()=>practiceSetting(bad,true)).toThrow();
 const p=sid(1027,'definition/procedure/test'),zero=list([text(PROCEDURES),q(0,1),u(1),p]);expect(()=>skillValue(zero,p)).toThrow();expect(skillValue(zero,p,true)).toEqual({K:Q.of(0n),count:1n});
 expect(()=>skillValue(list([text(PROCEDURES),q(0,1),u(0),p]),p,true)).toThrow();
});
