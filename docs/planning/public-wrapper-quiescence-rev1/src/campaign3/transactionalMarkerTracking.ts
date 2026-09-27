/** marker-tracking-transaction/0.1-candidate. Component transaction handling, not public restore. */
import {createMarkerTracker,createNineSweepMarkerTracker,createTenSweepMarkerTracker,applyMarkerSweep,markerTrackingSnapshot,type MarkerSweep,type MarkerTracker} from './observedMarkerTracking';
declare const managerBrand:unique symbol,proposalBrand:unique symbol;
export interface MarkerTransactionManager {readonly [managerBrand]:true;}
export interface MarkerProposal {readonly [proposalBrand]:true;}
type Facts={observer:string;history:MarkerSweep[];tracker:MarkerTracker;pending?:MarkerProposal;horizon:8|9|10};
type Candidate={manager:MarkerTransactionManager;history:MarkerSweep[];tracker:MarkerTracker;transitions:ReturnType<typeof applyMarkerSweep>};
const managers=new WeakMap<object,Facts>(),proposals=new WeakMap<object,Candidate>();
function fail(message:string):never {throw new Error('marker transaction: '+message);}
function facts(manager:MarkerTransactionManager){return managers.get(manager)??fail('actual manager required');}
function replay(observer:string,prefix:readonly MarkerSweep[],horizon:8|9|10){
 if(!Array.isArray(prefix)||Object.getPrototypeOf(prefix)!==Array.prototype||prefix.length>horizon)fail('bounded prefix');
 const descriptors=Object.getOwnPropertyDescriptors(prefix);
 if(Reflect.ownKeys(descriptors).some(k=>k!=='length'&&(typeof k!=='string'||!/^(0|[1-9][0-9]*)$/.test(k)))||Object.values(descriptors).some(d=>!('value'in d))||Object.keys(descriptors).length!==prefix.length+1)fail('dense data prefix');
 const tracker=horizon===8?createMarkerTracker(observer):horizon===9?createNineSweepMarkerTracker(observer):createTenSweepMarkerTracker(observer),history:MarkerSweep[]=[];
 for(const sweep of prefix){applyMarkerSweep(tracker,sweep);history.push(structuredClone(sweep));}
 return {tracker,history};
}
export function createMarkerTransactionManager(observer:string,prefix:readonly MarkerSweep[]=[]):MarkerTransactionManager {
 return createManager(observer,prefix,8);
}
export function createNineSweepMarkerTransactionManager(observer:string,prefix:readonly MarkerSweep[]=[]):MarkerTransactionManager {return createManager(observer,prefix,9);}
export function createTenSweepMarkerTransactionManager(observer:string,prefix:readonly MarkerSweep[]=[]):MarkerTransactionManager {return createManager(observer,prefix,10);}
function createManager(observer:string,prefix:readonly MarkerSweep[],horizon:8|9|10){const reconstructed=replay(observer,prefix,horizon),manager=Object.freeze({}) as MarkerTransactionManager;managers.set(manager,{observer,...reconstructed,horizon});return manager;}
export function committedMarkerSnapshot(manager:MarkerTransactionManager){return markerTrackingSnapshot(facts(manager).tracker);}
export function beginMarkerTransaction(manager:MarkerTransactionManager,input:MarkerSweep):MarkerProposal {
 const f=facts(manager);if(f.pending)fail('proposal already pending');
 const candidate=replay(f.observer,f.history,f.horizon),transitions=applyMarkerSweep(candidate.tracker,input);
 candidate.history.push(structuredClone(input));
 const proposal=Object.freeze({}) as MarkerProposal;
 proposals.set(proposal,{manager,...candidate,transitions});f.pending=proposal;return proposal;
}
function candidate(manager:MarkerTransactionManager,proposal:MarkerProposal){
 const f=facts(manager),p=proposals.get(proposal);
 if(!p||p.manager!==manager||f.pending!==proposal)fail('actual pending proposal for this manager required');
 return {f,p};
}
export function previewMarkerTransaction(manager:MarkerTransactionManager,proposal:MarkerProposal){
 const {p}=candidate(manager,proposal);return {transitions:structuredClone(p.transitions),snapshot:markerTrackingSnapshot(p.tracker)};
}
export function commitMarkerTransaction(manager:MarkerTransactionManager,proposal:MarkerProposal):void {
 const {f,p}=candidate(manager,proposal);f.history=p.history;f.tracker=p.tracker;f.pending=undefined;proposals.delete(proposal);
}
export function abortMarkerTransaction(manager:MarkerTransactionManager,proposal:MarkerProposal):void {
 const {f}=candidate(manager,proposal);f.pending=undefined;proposals.delete(proposal);
}
