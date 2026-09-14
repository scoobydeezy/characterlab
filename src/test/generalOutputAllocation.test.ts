import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {text,typedIdentifier} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {EventRoleId} from '../semanticBinding/eventBindings';
import {createLocalReserveSource} from '../campaign3/localReserveSource';
import {createTrialPanelSource} from '../campaign3/trialPanelSource';
import {createPositionSceneSource} from '../campaign3/positionSceneSource';
import {createWindowPanelManager} from '../campaign3/windowPanelTransaction';
import {createWindowMarkerManager} from '../campaign3/windowMarkerTransaction';
import {observeGeneralSourceOpportunity} from '../campaign3/generalSourceOpportunity';
import {deriveGeneralSourceRoles} from '../campaign3/generalSourceRoles';
import {selectContextualBody} from '../campaign3/contextualBodySelection';
import {produceBodyFormationEvidence} from '../campaign3/bodyFormationEvidence';
import {prepareVisualFormationUnlimitedControl,encodeVisualFormation,produceVisualFormationEvidence} from '../campaign3/visualFormationEvidence';
import {selectCanonicalVisualUnlimitedControl} from '../campaign3/canonicalVisualSelection';
import {consumeSelected} from '../campaign3/attentionSelection';
const q=(n:bigint)=>Q.of(n),observer=typedIdentifier(1000,text('observer/a'));
function run(present:boolean){
 const reserves=['a','b','c'].map(k=>({key:'local-reserve/'+k,capacity:q(100n),rate:q(0n),amount:q(0n),anchoredAt:0n}));
 const channels=reserves.flatMap((r,i)=>[0,1,2].map(j=>({channel:'channel/'+i+'/'+j,physical:r.key,signal:'interoceptive-signal/'+i,width:q(1n),available:present,permitted:true})));
 const body=createLocalReserveSource(reserves,channels),panel=createTrialPanelSource([{at:1n,glyph:0,stage:'Before',visible:present,permitted:true}]),scene=createPositionSceneSource([{at:1n,items:[EventRoleId.Actor,EventRoleId.Target,EventRoleId.Participant].map((role,i)=>({marker:semanticReferentFromAuthoredContent(governedContentDefinitionId('object/'+i)),role,x:BigInt(i),y:0n,glyph:BigInt(i),visible:present,permitted:true,roleMode:'Preserve' as const}))}]);let n=0n;const allocate=()=>n++;
 const source=observeGeneralSourceOpportunity(body,panel,scene,createWindowPanelManager('observer/a'),createWindowMarkerManager('observer/a'),observer,1n,'Current',{bodyChannels:channels.map(c=>c.channel),panel:true,visual:true},allocate),sourceCount=n;
 const claims=source.staged?deriveGeneralSourceRoles(source.staged.experience,allocate):[];
 const b=selectContextualBody({...source.body!,context:source.context},{maxSignals:3,maxViewsPerSignal:3,maxBytesPerSignal:65536,capacity:3},allocate);
 if(!source.staged){const {observerId,observationId,occurredAt,detections}=source.visual!,v=selectCanonicalVisualUnlimitedControl({kind:'NoDetection',observation:{observerId,observationId,occurredAt,detections}},0,allocate);expect(consumeSelected(v.view,[])).toEqual([]);const formed=produceBodyFormationEvidence(b.view,allocate);return {source,sourceCount,total:n,body:formed,visual:null};}
 const v=prepareVisualFormationUnlimitedControl({observation:{...source.visual!,eventDetectionId:source.visual!.eventDetectionId!},tracks:source.tracks,event:source.event!,experience:source.staged.experience},claims,0,{minX:0n,maxX:7n,minY:0n,maxY:7n,focalWeight:q(1n),residualPool:q(0n)},source.context,allocate);
 const bodyFormation=produceBodyFormationEvidence(b.view,allocate),visualFormation=produceVisualFormationEvidence(encodeVisualFormation(v.view,'independent').view,allocate);
 return {source,sourceCount,total:n,body:bodyFormation,visual:visualFormation};
}
it('GOA-A: maximal actual nine-channel/three-item source shares one experience and exactly two acquisitions',()=>{const r=run(true);expect(r.sourceCount).toBe(23n);expect(r.total).toBe(30n);expect(r.source.staged!.experience.supportingObservationIds).toHaveLength(11);expect(r.source.body!.samples).toHaveLength(9);if(r.body.kind!=='Formation'||r.visual?.kind!=='Formation')throw Error('positive');expect(r.body.evidence.content.children.map(c=>c.views.length)).toEqual([3,3,3]);expect(r.visual.evidence.content.children).toHaveLength(3);expect(r.body.evidence.acquisitionId).toBe(28n);expect(r.visual.evidence.acquisitionId).toBe(29n);expect(r.body.evidence.sourceSelectionId).toBe(26n);expect(r.visual.evidence.sourceSelectionId).toBe(27n);for(const c of r.body.evidence.content.children)for(const v of c.views)expect(v.context!.experience).toBe(r.source.opportunityId);});
it('GOA-B: maximal unavailable source still allocates observations and both empty selectors, but no experience/acquisition',()=>{const r=run(false);expect(r.sourceCount).toBe(15n);expect(r.total).toBe(17n);expect(r.source.staged).toBeNull();expect(r.source.opportunityId).toBeNull();expect(r.body.kind).toBe('NoFormation');expect(r.visual).toBeNull();});
