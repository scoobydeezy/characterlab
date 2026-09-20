import {beforeAll,it,expect} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalContentId as c,generalBindingContext} from '../campaign3/generalBindingProfile';
import {generalDeliveredConcern,generalConcernModulation} from '../campaign3/generalConcernProduction';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {AuthoritativeState,type StatePath} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {unsigned as u,typedIdentifier,set,list,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
const who=generalSubject(),context=generalBindingContext();
const path=(root:bigint,key:CanonicalValue):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key}]});
let model:Awaited<ReturnType<typeof compileGeneralDeclarations>>;
beforeAll(async()=>{model=await compileGeneralDeclarations(buildGeneralDeclarationPacket('feedback-both'));});
// Supplied state controls for the terminal adapter, not public probe qualification.
function prepare(mean:bigint|undefined,task=true){
 let ordinal=0n;const tx=model.outputSlots.beginInstant(()=>ordinal++),taskKey=r(371,[who.character,semanticReferentFromAuthoredContent(c('task'))]);
 const state=new AuthoritativeState([{path:path(268n,who.observer),value:r(267,[who.character])},...(task?[{path:path(373n,taskKey),value:r(372,[u(1)])}]:[]),...(mean===undefined?[]:[{path:path(362n,r(360,[who.character,d('prediction')])),value:r(361,[q(mean,1),set([r(237,[u(1),typedIdentifier(1115,u(999))])])])}])]);
 const workspace=tx.beginStage('prior-concern-workspace'),w=model.workspace.construct(state,r(377,[who.observer,d('workspace')]),workspace.allocate(1128n),2n),wr=workspace.admit([decode(w.outputBytes(),context)]);
 const appraisal=tx.beginStage('prior-concern-appraisal'),a=appraisal.admit([model.concern.appraisal(tx,wr,appraisal.allocate(1129n))]);
 const producer=tx.beginStage('prior-concern-producer'),p=producer.admit([model.concern.concern(tx,a,producer.allocate(1130n))]);
 const delivery=model.concern.prepareDelivery(tx,p,2n);tx.commit();return delivery;
}
it.each([[0n,'KnownIntensity','EnabledKnown'],[5n,'KnownIntensity','EnabledKnown'],[undefined,'Unavailable','BaselineWithoutAvailableFeedback']] as const)('preserves concern status from actual terminal outputs for %s',(mean,status,branch)=>{
 const source=prepare(mean),delivery=source.delivery(u(3),3n),carry=generalDeliveredConcern(delivery,3n),feedback=generalConcernModulation(carry,3n,true);
 expect(feedback.result.sourceStatus).toBe(status);expect(feedback.result.branch).toBe(branch);
 expect(generalConcernModulation(carry,3n,false).result.branch).toBe('DisabledFeedback');
 if(mean===5n)expect([feedback.result.residualPool.numerator,feedback.result.residualPool.denominator]).toEqual([1n,1n]);
 expect(()=>source.delivery(u(2),2n)).toThrow(/strictly later/);expect(()=>generalDeliveredConcern(delivery,4n)).toThrow(/delivery time/);
});
it('keeps no selected task distinct and admits its unavailable recall wrapper',()=>{
 const source=prepare(undefined,false),delivery=source.delivery(u(3),3n),carry=generalDeliveredConcern(delivery,3n);expect(carry.kind).toBe('NoSelectedTask');
 const cue=r(623,new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,typedIdentifier(1115,u(3))],[3n,{kind:'signed',value:3n}],[5n,u(2)]]));
 const state=new AuthoritativeState([{path:path(268n,who.observer),value:r(267,[who.character])}]),rank=model.recall.event(state,cue,3n,'current',delivery);
 const result=rec(rank.result(),643n);expect(uint(f(rec(f(result,3n),639n),1n))).toBe(3n);expect(rank.publish(()=>{throw Error('allocation');})).toEqual([]);
});
it('rejects arbitrary objects as producer receipts',()=>{
 const tx=model.outputSlots.beginInstant(()=>0n);expect(()=>model.concern.prepareDelivery(tx,{} as never,2n)).toThrow();tx.abort();
});
