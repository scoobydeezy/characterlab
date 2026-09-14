/** panel-window-transaction/0.1-candidate. Trusted component owners; not public restore. */
import {advancePanelWindow,type PanelWindow,type PanelWindowInput} from './panelWindowPerception';
import {emptyPerceptualEventFileState,clonePerceptualEventFileState,type PerceptualEventFileState} from '../semanticBinding/perceptualEventFiles';
import type {VisualEventDetection} from './trialPanelPerception';
declare const brand:unique symbol;
export interface WindowPanelManager {readonly [brand]:true}
type Owner={observer:string;files:PerceptualEventFileState;window:PanelWindow;pending?:object};
const owners=new WeakMap<object,Owner>();
function fail():never{throw Error('WINDOW_PANEL_TRANSACTION');}
export function isWindowPanelManager(token:object):token is WindowPanelManager{return owners.has(token);}
export function createWindowPanelManager(observer:string,files=emptyPerceptualEventFileState(),window:PanelWindow={at:0n}):WindowPanelManager{const token=Object.freeze({}) as WindowPanelManager;owners.set(token,{observer,files:clonePerceptualEventFileState(files),window:structuredClone(window)});return token;}
export function windowPanelSnapshot(token:WindowPanelManager){const o=owners.get(token)??fail();return {observer:o.observer,files:clonePerceptualEventFileState(o.files),window:structuredClone(o.window)};}
export function prepareWindowPanel(token:WindowPanelManager,panel?:PanelWindowInput,visual?:VisualEventDetection){
 const o=owners.get(token)??fail();if(o.pending)fail();const r=advancePanelWindow(o.observer,o.files,o.window,panel,visual),pending=Object.freeze({});o.pending=pending;let closed=false;
 const validate=()=>{if(closed||owners.get(token)!==o||o.pending!==pending)fail();};
 const result=panel?r.result:{transition:r.result.visualEventTransition!,end:r.result.ends[0]};
 return Object.freeze({result:structuredClone(result),validate,commit(){validate();owners.set(token,{observer:o.observer,files:r.files,window:r.window});closed=true;},close(){if(!closed){validate();o.pending=undefined;closed=true;}}});
}
