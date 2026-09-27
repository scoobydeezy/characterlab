import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {encodingBudget,residualAttention,boundedEncodingResponse,presentationAccessibility,associationCandidate,spreadingActivation,rankAccessibleEpisodes} from '../campaign3/encodingAccessMath';
import {encodeSelectedEvidence} from '../campaign3/selectedEncoding';
import {prepareAttentionPool,selectAttention} from '../campaign3/attentionSelection';
import {attentionFixture} from './attentionFixtures';

it('EAM isolation: exposed exact zero/one values cannot corrupt subsequent arithmetic',()=>{
 const one=encodingBudget(['a'],[Q.of(1n)],'retired-flat')[0],zero=residualAttention(Q.of(1n),0);
 Reflect.set(one,'numerator',99n);Reflect.set(zero,'numerator',99n);
 expect(boundedEncodingResponse(Q.of(1n))).toEqual(Q.of(1n,2n));
 expect(presentationAccessibility([],0n,Q.of(1n),1)).toEqual(Q.of(0n));
 expect(encodingBudget(['a'],[Q.of(1n)],'retired-flat')[0]).toEqual(Q.of(1n));
});
it('EAM structure: sparse raw, graph, cue, history and candidate lists reject',()=>{
 const hole=new Array(1),params={scale:10n,eta:Q.of(1n),lambda:Q.of(0n),elapsed:Q.of(0n)};
 for(const action of [()=>encodingBudget(['a'],hole,'independent'),()=>associationCandidate(['a'],hole,[Q.of(1n)],params),()=>associationCandidate(['a'],[hole],[Q.of(1n)],params),()=>associationCandidate(['a'],[[Q.of(0n)]],hole,params),()=>spreadingActivation(['a'],[[Q.of(0n)]],hole,Q.of(1n,2n),10n),()=>presentationAccessibility(hole,0n,Q.of(1n),1),()=>rankAccessibleEpisodes(hole,new Map(),0n,{lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:Q.of(1n),k:1})])expect(action).toThrow('plain dense array');
});
it('SEC isolation: returned role factors cannot alter the next encoding calibration',()=>{
 const f=attentionFixture(),pool=prepareAttentionPool(f.experience,f.claims),run=()=>encodeSelectedEvidence(selectAttention(pool,2).view,'independent','role-calibrated');
 const a=run();Reflect.set(a.rows[1].role,'numerator',0n);const b=run();
 expect(b.rows[1].role).toEqual(Q.of(9n,10n));expect(b.rows[1].strength).toEqual(Q.of(243n,1243n));
});
