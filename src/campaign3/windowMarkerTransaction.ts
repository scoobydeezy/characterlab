/** marker-window-transaction/0.1-candidate. Local candidate publication, not runtime restore. */
import {advanceMarkerWindow,type TrackingWindow} from './markerWindowTracking';
import {emptyPerceptualContinuantFileState,clonePerceptualContinuantFileState,type PerceptualContinuantFileState} from '../semanticBinding/perceptualContinuantFiles';
import type {MarkerSweep} from './observedMarkerTracking';
declare const brand:unique symbol;
export interface WindowMarkerManager {readonly [brand]:true}
type Owner={observer:string;files:PerceptualContinuantFileState;window:TrackingWindow;pending?:object};
const owners=new WeakMap<object,Owner>();
const fail=():never=>{throw Error('WINDOW_MARKER_TRANSACTION');};
export function isWindowMarkerManager(value:object):value is WindowMarkerManager{return owners.has(value);}
export function createWindowMarkerManager(observer:string,files=emptyPerceptualContinuantFileState(),window:TrackingWindow={at:0n,observation:null,items:[]}):WindowMarkerManager{
 const token=Object.freeze({}) as WindowMarkerManager;
 owners.set(token,{observer,files:clonePerceptualContinuantFileState(files),window:structuredClone(window)});return token;
}
export function windowMarkerSnapshot(token:WindowMarkerManager){const o=owners.get(token)??fail();return {observer:o.observer,files:clonePerceptualContinuantFileState(o.files),window:structuredClone(o.window)};}
export function prepareWindowMarkerSweep(token:WindowMarkerManager,input:MarkerSweep){
 const o=owners.get(token)??fail();if(o.pending)fail();
 const r=advanceMarkerWindow(o.observer,o.files,o.window,input),pending=Object.freeze({});o.pending=pending;let closed=false;
 const validate=()=>{if(closed||owners.get(token)!==o||o.pending!==pending)fail();};
 return Object.freeze({result:structuredClone(r),validate,commit(){validate();owners.set(token,{observer:o.observer,files:r.files,window:r.window});closed=true;},close(){if(!closed){validate();o.pending=undefined;closed=true;}}});
}
