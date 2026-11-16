/** Shared position/context perception0.1; no private allocator or observation archive. */
import {list,text,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {StateAuthorityRegistry,type StatePath,type StatePatch, type AuthoritativeState} from '../substrate/state';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {observerIdValue,perceptualReferentIdValue as trackValue,restorePerceptualReferentId as trackId,perceptualEventReferentIdValue as eventValue,restorePerceptualEventReferentId as eventId} from '../semanticBinding/semanticCodecs';
import {SemanticMutationAuthority as OWNER} from '../semanticBinding/semanticStateAuthority';
import {createPositionDisplaySource,observePositionDisplay} from '../campaign3/positionDisplaySource';
import {createTrialPanelSource,observeTrialPanel,type TrialPanelStage} from '../campaign3/trialPanelSource';
import {sid} from './skill';
export const POSITION='assembled-position-perception/0.1',POSITION_VERSION='assembled-character-position-perception/0.1-candidate';
export const POSITION_SOURCE=sid(1001,'event/assembled-position-source');
export const POSITION_STAGES=[11,12,14].map(p=>sid(1001,'event/assembled-position-'+p));
export const POSITION_AUTHORITY=list([text(POSITION_VERSION),OWNER.Perception,u(241),u(3),text('observer/channel'),list([text('position'),text('social')]),text('current-window-only')]);
const require=(b:boolean,s:string)=>{if(!b)invalidModel('position perception '+s);};
const time=(v:CanonicalValue)=>{require(typeof v!=='boolean'&&v.kind==='signed'&&v.value>=0n,'time');return (v as {value:bigint}).value;};
const cell=(v:CanonicalValue)=>{const n=uint(v);require(n<=7n,'coordinate/glyph0..7');return n;};
export function compilePosition(v:CanonicalValue){const a=items(v,'list');require(a.length===2&&key(a[0])===key(text(POSITION))&&key(a[1])===key(POSITION_AUTHORITY),'declaration/authority');return true;}
export function positionSource(v:CanonicalValue,at:bigint,roles=false,mitigation=false){
 const a=items(v,'list');require((mitigation?[3,4]:[3]).includes(a.length)&&key(a[0])===key(text(POSITION)),'source');
 const pos=items(a[1],'list'),panel=items(a[2],'list');require((roles?[0,5,6]:[0,5]).includes(pos.length)&&[0,4].includes(panel.length)&&!!(pos.length||panel.length),'sample grammar');
 if(pos.length)require(pos.slice(3,5).every(v=>typeof v==='boolean'),'position permission');
 if(panel.length)require(panel.slice(2).every(v=>typeof v==='boolean')&&['Before','Motion','After'].includes(txt(panel[1])),'panel permission/stage');
 const annex=a.length===4?items(a[3],'list'):undefined;
 if(annex)require(panel.length===4&&annex.length===8&&uint(annex[0])<=2n&&uint(annex[2])<=2n&&[1,3,4,5,6,7].every(i=>typeof annex[i]==='boolean'),'mitigation annex');
 const role=pos.length===6?uint(pos[5]):0n;require(role<=4n,'observed role0..4');
 return {annex,role,position:pos.length?{at,x:cell(pos[0]),y:cell(pos[1]),glyph:cell(pos[2]),visible:pos[3]===true,permitted:pos[4]===true}:undefined,panel:panel.length?{at,glyph:Number(cell(panel[0])),stage:txt(panel[1]) as TrialPanelStage,visible:panel[2]===true,permitted:panel[3]===true}:undefined};
}
export function samplePosition(v:CanonicalValue,at:bigint,roles=false,mitigation=false){const s=positionSource(v,at,roles,mitigation);const allowed=s.panel?.visible&&s.panel.permitted,trial=s.annex&&allowed?list([s.annex[3]?s.annex[2]:u(0),list(s.annex[4]?s.annex.slice(5):[])]):undefined;return {trial,role:s.position?.visible&&s.position.permitted?s.role:0n,position:s.position?observePositionDisplay(createPositionDisplaySource([s.position]),at):undefined,panel:s.panel?observeTrialPanel(createTrialPanelSource([s.panel]),at):undefined};}
export const windowPath=(observer:string,channel:'position'|'social'):StatePath=>({rootStateTypeId:241n,fieldId:3n,selectors:[{kind:'mapKey',key:list([observerIdValue(observer),text(channel)])}]});
export const isWindow=(p:StatePath)=>p.rootStateTypeId===241n&&p.fieldId===3n;
export function readWindow(v:CanonicalValue|undefined,observer:string){
 if(v===undefined)return {visualAt:0n,marker:undefined as {observation:bigint;glyph:bigint;file:ReturnType<typeof trackId>}|undefined,panelAt:0n,panel:undefined as {glyph:bigint;file:ReturnType<typeof eventId>}|undefined};
 const a=items(v,'list');require(a.length===5&&key(a[0])===key(text(POSITION)),'window');
 const marker=items(a[2],'list'),panel=items(a[4],'list');require([0,3].includes(marker.length)&&[0,2].includes(panel.length),'window shape');
 const result={visualAt:time(a[1]),marker:marker.length?{observation:uint(marker[0]),glyph:cell(marker[1]),file:trackId(marker[2])}:undefined,panelAt:time(a[3]),panel:panel.length?{glyph:cell(panel[0]),file:eventId(panel[1])}:undefined};
 require((!result.marker||result.visualAt>0n&&result.marker.file.observerId===observer)&&(!result.panel||result.panelAt>0n&&result.panel.file.observerId===observer),'window observer/clock');return result;
}
export function windowValue(w:ReturnType<typeof readWindow>){return list([text(POSITION),signed(w.visualAt),list(w.marker?[u(w.marker.observation),u(w.marker.glyph),trackValue(w.marker.file)]:[]),signed(w.panelAt),list(w.panel?[u(w.panel.glyph),eventValue(w.panel.file)]:[])]);}
export function socialWindow(v:CanonicalValue|undefined,observer:string,lifecycle=false,lanes=false){if(v===undefined)return undefined;const a=items(v,'list');require(a.length===(lanes?5:lifecycle?4:3)&&key(a[0])===key(text(POSITION))&&time(a[1])>0n,'social window');const file=trackId(a[2]);require(file.observerId===observer,'social observer');const ev=lifecycle?items(a[3],'list'):[];require(ev.length<=1,'social event shape');const event=ev.length?eventId(ev[0]):undefined;require(!event||event.observerId===observer,'social event observer');const generation=lanes?uint(a[4]):0n;require(!lanes||[11n,121n].includes(generation),'social generation');return {at:time(a[1]),file,event,generation};}
export const socialWindowValue=(at:bigint,file:ReturnType<typeof trackId>,lifecycle=false,event?:ReturnType<typeof eventId>,generation?:bigint)=>list([text(POSITION),signed(at),trackValue(file),...(lifecycle?[list(event?[eventValue(event)]:[])]:[]),...(generation!==undefined?[u(generation)]:[])]);
export function windowAuthority(observer:string,lifecycle=false,lanes=false){
 const paths=[windowPath(observer,'position'),windowPath(observer,'social')],check=(p:StatePath)=>{const i=paths.findIndex(x=>key(list([x.selectors[0].kind==='mapKey'?x.selectors[0].key:false]))===key(list([p.selectors[0]?.kind==='mapKey'?p.selectors[0].key:false])));require(isWindow(p)&&p.selectors.length===1&&i>=0,'window path');return i;};
 const registry=new StateAuthorityRegistry(paths.map((p,i)=>({pattern:{...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))},validateValue:(v:CanonicalValue)=>{if(i)socialWindow(v,observer,lifecycle,lanes);else readWindow(v,observer);},removalAllowed:false})),[{mutationAuthorityId:OWNER.Perception,patterns:paths.map(p=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))}))}]);
 return {registry,check,validate(p:StatePath,v:CanonicalValue){if(check(p))socialWindow(v,observer,lifecycle,lanes);else readWindow(v,observer);}};
}
export function replacement(state:AuthoritativeState,path:StatePath,newValue:CanonicalValue):StatePatch['operations'][number]{const prior=state.read(path);return {kind:'set',path,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue};}
