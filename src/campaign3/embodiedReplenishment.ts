/** Pure writer proposal under embodied-replenishment/0.1-candidate. Authentication,
 * bound reading and authoritative patch application remain separate host stages. */
import {signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import type {StatePath,StatePatch} from '../substrate/state';
import type {ExactRational} from '../substrate/exactMath';
import {embodiedRecord as r} from './embodiedCodecs';
import {atom,replenishReserve} from './embodiedMath';
export function proposeEmbodiedReplenishment(anchor:CanonicalValue,before:ExactRational,capacity:ExactRational,delivered:ExactRational,time:bigint,path:StatePath){
 const result=replenishReserve(before,capacity,delivered);
 const patch:StatePatch={operations:[{kind:'set',path,expected:{presence:true,value:anchor},newValue:r(454,[atom(result.after),signed(time)])}]};
 return {patch,output:r(479,[result.before,result.potential,result.applied,result.overflow,result.after].map(atom))};
}
