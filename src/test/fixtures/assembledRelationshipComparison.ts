/** M151 diagnostic correspondence over actual receipts, never admitted model inputs. */
import {expect} from 'vitest';
import {relationshipSummary} from '../../campaign3/relationshipMath';
import {relationshipRecord as rr} from '../../campaign3/relationshipCodecs';
import {relationshipHistory,relationshipFold} from '../../assembled/relationship';
import {compileDescribedReasons} from '../../assembled/reasons';
import {readQ,qValue,ZERO} from '../../campaign2/cognitiveMath';
import {ExactRational as Q} from '../../substrate/exactMath';
import {typedIdentifier} from '../../substrate/canonicalEncoding';
import {rec,f,uint,items,key,list,text,u,type CanonicalValue} from './assembledRelationshipCompletion';
import {replace,withDescriptions,definition,analyze} from './assembledMultiComparison';
import type {RelationshipSettings} from '../../campaign3/relationshipModel';
export function correspondence(history:CanonicalValue|undefined,settings:RelationshipSettings){
 const observations=relationshipHistory(history),mapped=observations.map(v=>{const o=items(v,'list'),id=o[0];if(typeof id==='boolean'||id.kind!=='typedIdentifier')throw Error('receipt');return rr(846,[typedIdentifier(1156,id.payload),o[3],o[6]]);}),old=rr(847,[list(mapped)]),fold=relationshipFold(history),legacy=rec(relationshipSummary(settings,old),851n);
 expect([u(fold.count),fold.rupture]).toEqual([f(legacy,1n),f(legacy,2n)]);
 // Incremental cached representation retains the same journal for provenance.
 let count=0n,rupture=false;for(const v of observations){const kind=uint(items(v,'list')[6]);if(kind===1n){count++;rupture=false;}else if(kind===2n)rupture=true;}
 const cached={count,rupture,comfort:count>=2n&&!rupture};expect(cached).toEqual(fold);
 return {cached,old,sticky:rec(relationshipSummary({...settings,law:1},old),851n)};
}
export function alternatives(raw:CanonicalValue,report:readonly CanonicalValue[],cached:ReturnType<typeof relationshipFold>,source:{registry:Uint8Array}){
 const joins=items(report[9],'list').map(v=>items(v,'list')),descriptions=items(f(rec(raw,403n),6n),'list'),amount=Q.of(cached.rupture?-1n:cached.comfort?1n:0n);
 const before=(row:readonly CanonicalValue[])=>typeof row[1]!=='boolean'&&row[1].kind==='record'?rec(row[1],402n):undefined;
 for(const row of joins)expect(row[4]).toEqual(qValue((before(row)?readQ(f(before(row)!,2n)):ZERO).add(amount)));
 const changed=(personOnly:boolean)=>descriptions.flatMap(v=>{const d=items(v,'list'),signal=rec(d[2],402n),join=joins.find(j=>key(j[0])===key(f(signal,1n)));if(!join)return [v];const old=before(join);if(personOnly)return old?[list([d[0],d[1],old])]:[];return [list([d[0],d[1],replace(signal,2n,qValue((old?readQ(f(old,2n)):ZERO).add(amount)))])];});
 const stored=withDescriptions(raw,changed(false));expect(stored).toEqual(raw);const personOnly=withDescriptions(raw,changed(true));
 const evaluate=(v:CanonicalValue)=>{const c=compileDescribedReasons(v,definition(source),3,'SourceCoverage',true,true);return {...c,analysis:analyze(v,c.nuclei,source)};};
 return {stored:evaluate(stored),personOnly:evaluate(personOnly)};
}
